import {
  resolvePaletteFromSet,
  snapToSolidPreset,
  suggestedSetById,
} from "./carousel-style";
import {
  isHexColor,
  type CarouselPaletteEvent,
  type CarouselSlideEvent,
  type CarouselSlideLayout,
  type CarouselSlideRole,
  type CarouselStreamEvent,
} from "./carousel-types";

const ROLES = new Set<CarouselSlideRole>(["cover", "point", "cta"]);
const LAYOUTS = new Set<CarouselSlideLayout>(["editorial", "center", "top", "split"]);

/** Pull complete JSON objects from a growing JSONL buffer. */
export class JsonlParser {
  private buffer = "";

  push(chunk: string): unknown[] {
    this.buffer += chunk;
    const items: unknown[] = [];
    while (true) {
      const nl = this.buffer.indexOf("\n");
      if (nl === -1) break;
      const line = this.buffer.slice(0, nl).trim();
      this.buffer = this.buffer.slice(nl + 1);
      if (!line || line.startsWith("```")) continue;
      try {
        items.push(JSON.parse(line));
      } catch {
        // Incomplete or noisy line — skip.
      }
    }
    return items;
  }

  flush(): unknown[] {
    const line = this.buffer.trim();
    this.buffer = "";
    if (!line || line.startsWith("```")) return [];
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  }
}

function asRole(value: unknown): CarouselSlideRole {
  return typeof value === "string" && ROLES.has(value as CarouselSlideRole)
    ? (value as CarouselSlideRole)
    : "point";
}

function asLayout(value: unknown): CarouselSlideLayout {
  return typeof value === "string" && LAYOUTS.has(value as CarouselSlideLayout)
    ? (value as CarouselSlideLayout)
    : "editorial";
}

export function parseCarouselEvent(raw: unknown): CarouselStreamEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const type = obj.type;

  if (type === "meta") {
    const slides = Number(obj.slides);
    const theme = typeof obj.theme === "string" ? obj.theme : "";
    if (!Number.isFinite(slides)) return null;
    return { type: "meta", slides: Math.max(1, Math.min(20, Math.round(slides))), theme };
  }

  if (type === "palette") {
    const setId = typeof obj.setId === "string" ? obj.setId.trim().toLowerCase() : undefined;
    const fromSet = suggestedSetById(setId);
    const resolved = fromSet
      ? resolvePaletteFromSet(fromSet)
      : {
          background: isHexColor(obj.background) ? snapToSolidPreset(obj.background) : null,
          text: isHexColor(obj.text) ? snapToSolidPreset(obj.text) : null,
          accent: isHexColor(obj.accent) ? snapToSolidPreset(obj.accent) : null,
          card: isHexColor(obj.card) ? snapToSolidPreset(obj.card) : null,
        };
    if (!resolved.background || !resolved.text || !resolved.accent || !resolved.card) {
      // Fallback so a bad model line doesn't kill the stream.
      const fallback = resolvePaletteFromSet(suggestedSetById("night")!);
      return {
        type: "palette",
        setId: setId || "night",
        ...fallback,
        tagline: typeof obj.tagline === "string" ? obj.tagline.trim() : undefined,
        handle: typeof obj.handle === "string" ? obj.handle.trim() : undefined,
      } satisfies CarouselPaletteEvent;
    }
    return {
      type: "palette",
      setId: fromSet?.id ?? setId,
      background: resolved.background,
      text: resolved.text,
      accent: resolved.accent,
      card: resolved.card,
      tagline: typeof obj.tagline === "string" ? obj.tagline.trim() : undefined,
      handle: typeof obj.handle === "string" ? obj.handle.trim() : undefined,
    } satisfies CarouselPaletteEvent;
  }

  if (type === "slide") {
    const heading = typeof obj.heading === "string" ? obj.heading.trim() : "";
    if (!heading) return null;
    const index = Number(obj.index);
    const body = typeof obj.body === "string" ? obj.body.trim() : undefined;
    const background = isHexColor(obj.background)
      ? snapToSolidPreset(obj.background)
      : undefined;
    return {
      type: "slide",
      index: Number.isFinite(index) ? Math.max(0, Math.round(index)) : 0,
      role: asRole(obj.role),
      heading,
      body: body || undefined,
      background,
      layout: asLayout(obj.layout),
    } satisfies CarouselSlideEvent;
  }

  if (type === "done") {
    const title = typeof obj.title === "string" ? obj.title.trim() : "Carousel";
    return { type: "done", title: title || "Carousel" };
  }

  if (type === "error") {
    const message = typeof obj.message === "string" ? obj.message : "Generation failed";
    return { type: "error", message };
  }

  return null;
}

/** Incremental OpenAI-style SSE reader — keeps a trailing partial line across chunks. */
export class SseParser {
  private buffer = "";

  push(chunk: string): string[] {
    this.buffer += chunk;
    const deltas: string[] = [];
    while (true) {
      const nl = this.buffer.search(/\r?\n/);
      if (nl === -1) break;
      const line = this.buffer.slice(0, nl).trim();
      this.buffer = this.buffer.slice(nl).replace(/^\r?\n/, "");
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          choices?: { delta?: { content?: string | null } }[];
        };
        const content = json.choices?.[0]?.delta?.content;
        if (typeof content === "string" && content) deltas.push(content);
      } catch {
        // ignore malformed chunks
      }
    }
    return deltas;
  }
}
