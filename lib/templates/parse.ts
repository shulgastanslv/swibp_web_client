import type { FabricCanvasJSON, RatioKey, SlideItem } from "@/lib/types";
import { CANVAS_RATIOS } from "@/lib/types";

export interface TemplateCarouselPayload {
  slides: FabricCanvasJSON[];
  aspectRatio?: RatioKey;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isFabricJSON(value: unknown): value is FabricCanvasJSON {
  return isRecord(value) && Array.isArray(value.objects);
}

export function isRatioKey(value: string): value is RatioKey {
  return value in CANVAS_RATIOS;
}

/** Supports published `{ slides: [...] }` and legacy single-canvas Fabric JSON. */
export function parseTemplateCanvasJSON(raw: unknown): TemplateCarouselPayload {
  if (isRecord(raw) && Array.isArray(raw.slides)) {
    const slides = raw.slides.filter(isFabricJSON);
    const aspectRatio =
      typeof raw.aspectRatio === "string" && isRatioKey(raw.aspectRatio)
        ? raw.aspectRatio
        : undefined;
    return {
      slides:
        slides.length > 0
          ? slides
          : [{ version: "6.0.0", objects: [], background: "#ffffff" }],
      aspectRatio,
    };
  }

  if (typeof raw === "string") {
    try {
      return parseTemplateCanvasJSON(JSON.parse(raw));
    } catch {
      return { slides: [{ version: "6.0.0", objects: [], background: "#ffffff" }] };
    }
  }

  if (isFabricJSON(raw)) {
    return { slides: [raw] };
  }

  return { slides: [{ version: "6.0.0", objects: [], background: "#ffffff" }] };
}

export function templateSlidesToItems(slides: FabricCanvasJSON[]): SlideItem[] {
  return slides.map((canvasJSON, index) => ({
    id: index + 1,
    canvasJSON,
    thumbnail: null,
  }));
}
