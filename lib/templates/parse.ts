import type { FabricCanvasJSON, RatioKey, SlideItem } from "@/lib/types";
import { CANVAS_RATIOS } from "@/lib/types";

export interface TemplateCarouselPayload {
  slides: FabricCanvasJSON[];
  thumbnails: Array<string | null>;
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

function emptySlide(): FabricCanvasJSON {
  return { version: "6.0.0", objects: [], background: "#ffffff" };
}

function thumbnailAt(raw: unknown, index: number): string | null {
  if (!Array.isArray(raw)) return null;
  const value = raw[index];
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** Supports published `{ slides, thumbnails }` and legacy single-canvas Fabric JSON. */
export function parseTemplateCanvasJSON(raw: unknown): TemplateCarouselPayload {
  if (isRecord(raw) && Array.isArray(raw.slides)) {
    const slides: FabricCanvasJSON[] = [];
    const thumbnails: Array<string | null> = [];
    raw.slides.forEach((slide, index) => {
      if (!isFabricJSON(slide)) return;
      slides.push(slide);
      thumbnails.push(thumbnailAt(raw.thumbnails, index));
    });
    const aspectRatio =
      typeof raw.aspectRatio === "string" && isRatioKey(raw.aspectRatio)
        ? raw.aspectRatio
        : undefined;
    if (slides.length === 0) {
      return { slides: [emptySlide()], thumbnails: [null], aspectRatio };
    }
    return { slides, thumbnails, aspectRatio };
  }

  if (typeof raw === "string") {
    try {
      return parseTemplateCanvasJSON(JSON.parse(raw));
    } catch {
      return { slides: [emptySlide()], thumbnails: [null] };
    }
  }

  if (isFabricJSON(raw)) {
    return { slides: [raw], thumbnails: [null] };
  }

  return { slides: [emptySlide()], thumbnails: [null] };
}

export function templateSlidesToItems(
  slides: FabricCanvasJSON[],
  thumbnails?: Array<string | null> | null,
  previewUrl?: string | null,
): SlideItem[] {
  return slides.map((canvasJSON, index) => {
    const stored = thumbnails?.[index];
    const thumbnail =
      typeof stored === "string" && stored.length > 0
        ? stored
        : index === 0 && previewUrl
          ? previewUrl
          : null;
    return { id: index + 1, canvasJSON, thumbnail };
  });
}
