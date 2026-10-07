import type { FabricCanvasJSON, SlideItem } from "@/lib/types";
import { applyChrome, type ChromeTemplate } from "@/lib/canvas/chrome";
import {
  defaultDocument,
  type ProjectPalette,
  type TextStyleDef,
  type TextStyleId,
} from "@/lib/canvas/document";

export interface GeneratedSlideCopy {
  kicker: string;
  title: string;
  body: string;
}

export interface GeneratedCarousel {
  palette: ProjectPalette;
  slides: GeneratedSlideCopy[];
}

const HEX = /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i;
const CHROME_ROLES = new Set(["number", "handle", "swipe", "cue"]);
const TEXT_TYPES = new Set(["text", "i-text", "textbox", "itext"]);
const SVG_TAGS = new Set(["svg", "g", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse"]);

const ASPECTS: readonly { id: string; ratio: number }[] = [
  { id: "1:1", ratio: 1 },
  { id: "4:3", ratio: 4 / 3 },
  { id: "3:4", ratio: 3 / 4 },
  { id: "3:2", ratio: 3 / 2 },
  { id: "2:3", ratio: 2 / 3 },
  { id: "16:9", ratio: 16 / 9 },
  { id: "9:16", ratio: 9 / 16 },
];

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function clipWords(value: unknown, max: number): string {
  const text = clip(value, max + 48);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 8 ? cut.slice(0, lastSpace) : cut).trim();
}

export function normalizeHex(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !HEX.test(value.trim())) return fallback;
  let hex = value.trim().replace(/^#/, "").toLowerCase();
  if (hex.length === 3) hex = hex.split("").map((char) => char + char).join("");
  return `#${hex}`;
}

export function parseGeneratedCarousel(value: unknown): GeneratedCarousel | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as { palette?: unknown; slides?: unknown };
  const fallback = defaultDocument().palette;
  const source = raw.palette && typeof raw.palette === "object" ? (raw.palette as Record<string, unknown>) : {};
  const palette: ProjectPalette = {
    background: normalizeHex(source.background, fallback.background),
    text: normalizeHex(source.text, fallback.text),
    accent: normalizeHex(source.accent, fallback.accent),
    card: normalizeHex(source.card, fallback.card),
  };
  if (!Array.isArray(raw.slides)) return null;

  const slides: GeneratedSlideCopy[] = [];
  for (const item of raw.slides) {
    if (!item || typeof item !== "object") continue;
    const slide = item as Record<string, unknown>;
    const title = clipWords(slide.title, 48);
    if (!title) continue;
    slides.push({
      kicker: clipWords(slide.kicker, 18),
      title,
      body: clipWords(slide.body, 72),
    });
    if (slides.length >= 8) break;
  }
  if (slides.length === 0) return null;
  return { palette, slides };
}

export function parseGeneratedLines(value: unknown): string[] | null {
  if (!value || typeof value !== "object") return null;
  const lines = (value as { lines?: unknown }).lines;
  if (!Array.isArray(lines)) return null;
  const next = lines
    .map((line) => clip(line, 180))
    .filter((line) => line.length > 0)
    .slice(0, 6);
  return next.length > 0 ? next : null;
}

export function parseGeneratedPalette(value: unknown): ProjectPalette | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const fallback = defaultDocument().palette;
  const palette: ProjectPalette = {
    background: normalizeHex(raw.background, ""),
    text: normalizeHex(raw.text, ""),
    accent: normalizeHex(raw.accent, ""),
    card: normalizeHex(raw.card, ""),
  };
  if (!palette.background || !palette.text || !palette.accent || !palette.card) {
    return {
      background: palette.background || fallback.background,
      text: palette.text || fallback.text,
      accent: palette.accent || fallback.accent,
      card: palette.card || fallback.card,
    };
  }
  return palette;
}

/** Closest Gemini image aspect. 4:5 is not supported, so it lands on 3:4. */
export function imageAspectRatio(width: number, height: number): string {
  const ratio = width > 0 && height > 0 ? width / height : 1;
  let best = ASPECTS[0]!;
  let distance = Math.abs(Math.log(ratio / best.ratio));
  for (const aspect of ASPECTS) {
    const next = Math.abs(Math.log(ratio / aspect.ratio));
    if (next < distance) {
      best = aspect;
      distance = next;
    }
  }
  return best.id;
}

export function collectSlideText(objects: readonly Record<string, unknown>[]): string[] {
  const lines: string[] = [];
  const walk = (object: Record<string, unknown>) => {
    if (typeof object.swibpRole === "string" && CHROME_ROLES.has(object.swibpRole)) return;
    const type = typeof object.type === "string" ? object.type.toLowerCase() : "";
    if (TEXT_TYPES.has(type) && typeof object.text === "string") {
      const text = object.text.trim();
      if (text) lines.push(text);
    }
    if (!Array.isArray(object.objects)) return;
    for (const child of object.objects) {
      if (child && typeof child === "object") walk(child as Record<string, unknown>);
    }
  };
  for (const object of objects) walk(object);
  return lines;
}

/** Keeps a single flat icon SVG. Drops scripts, handlers, and foreign markup. */
export function sanitizeIconSvg(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value
    .trim()
    .replace(/^```(?:svg|xml)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  if (!/^<svg[\s>]/i.test(text) || !/<\/svg>\s*$/i.test(text)) return null;
  if (text.length > 20_000) return null;
  const stripped = text.replace(/<!--[\s\S]*?-->/g, "");
  if (/<script|foreignObject|iframe|javascript:|data:|@import|url\s*\(/i.test(stripped)) return null;
  if (/\son[a-z]+\s*=/i.test(stripped)) return null;
  const tags = [...stripped.matchAll(/<\/?([a-zA-Z0-9:-]+)/g)].map((match) => match[1]!.toLowerCase());
  if (tags.length === 0 || tags.some((tag) => !SVG_TAGS.has(tag))) return null;
  return stripped;
}

function textbox(input: {
  text: string;
  left: number;
  top: number;
  width: number;
  fill: string;
  styleId: TextStyleId;
  style: TextStyleDef;
  slot: "text" | "accent";
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  charSpacing?: number;
}): Record<string, unknown> {
  return {
    type: "Textbox",
    originX: "left",
    originY: "top",
    left: input.left,
    top: input.top,
    width: input.width,
    text: input.text,
    fill: input.fill,
    fontSize: input.fontSize,
    fontFamily: input.style.fontFamily,
    fontWeight: input.fontWeight,
    lineHeight: input.lineHeight,
    textAlign: "left",
    ...(input.charSpacing ? { charSpacing: input.charSpacing } : {}),
    swibpStyle: input.styleId,
    swibpSlot: input.slot,
  };
}

export function slidesFromGenerated(input: {
  carousel: GeneratedCarousel;
  textStyles: Record<TextStyleId, TextStyleDef>;
  chrome: ChromeTemplate[];
  width: number;
  height: number;
}): SlideItem[] {
  const { carousel, textStyles, width, height } = input;
  const inset = Math.round(width * 0.12);
  const contentWidth = width - inset * 2;
  const total = carousel.slides.length;
  const titleSize = Math.round(Math.min(width, height) * 0.064);
  const bodySize = Math.max(22, Math.round(titleSize * 0.4));
  const kickerSize = Math.max(16, Math.round(titleSize * 0.28));
  const gap = Math.round(height * 0.03);
  const bottom = Math.round(height * 0.14);

  return carousel.slides.map((slide, index) => {
    const bodyBlock = slide.body ? Math.round(bodySize * 1.35 * 2) : 0;
    const titleBlock = Math.round(titleSize * 1.05 * 2);
    let cursor = height - bottom;
    const bodyTop = slide.body ? cursor - bodyBlock : 0;
    if (slide.body) cursor = bodyTop - gap;
    const titleTop = Math.max(inset, cursor - titleBlock);
    const kickerTop = Math.max(Math.round(inset * 0.65), titleTop - gap - kickerSize);
    const kicker = (slide.kicker || String(index + 1).padStart(2, "0")).toUpperCase();

    const objects: Record<string, unknown>[] = [
      {
        type: "Rect",
        left: inset,
        top: Math.max(inset * 0.4, kickerTop - Math.round(height * 0.028)),
        width: Math.round(width * 0.042),
        height: 2,
        fill: carousel.palette.accent,
        selectable: false,
        evented: false,
        swibpSlot: "accent",
      },
      textbox({
        text: kicker,
        left: inset,
        top: kickerTop,
        width: contentWidth,
        fill: carousel.palette.accent,
        styleId: "subtitle",
        style: textStyles.subtitle,
        slot: "accent",
        fontSize: kickerSize,
        fontWeight: "500",
        lineHeight: 1,
        charSpacing: 280,
      }),
      textbox({
        text: slide.title,
        left: inset,
        top: titleTop,
        width: contentWidth,
        fill: carousel.palette.text,
        styleId: "heading",
        style: textStyles.heading,
        slot: "text",
        fontSize: titleSize,
        fontWeight: "500",
        lineHeight: 0.98,
      }),
    ];
    if (slide.body) {
      objects.push(
        textbox({
          text: slide.body,
          left: inset,
          top: bodyTop,
          width: Math.round(contentWidth * 0.84),
          fill: carousel.palette.text,
          styleId: "body",
          style: textStyles.body,
          slot: "text",
          fontSize: bodySize,
          fontWeight: "400",
          lineHeight: 1.25,
        }),
      );
    }

    const canvasJSON: FabricCanvasJSON = {
      version: "6.0.0",
      background: carousel.palette.background,
      objects,
    };
    return {
      id: index + 1,
      thumbnail: null,
      canvasJSON: applyChrome(canvasJSON, input.chrome, index, total),
    };
  });
}
