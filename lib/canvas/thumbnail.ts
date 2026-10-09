import { renderSlidesToImages } from "@/lib/export/carousel";
import type { FabricCanvasJSON } from "@/lib/types";

/** Wide enough for a retina sidebar card; the slide strip downscales this cleanly. */
export const THUMB_TARGET_WIDTH = 480;
const THUMB_QUALITY = 0.92;

interface ThumbnailCanvas {
  getZoom(): number;
  width?: number;
  lowerCanvasEl?: unknown;
  toDataURL(options: { format: "jpeg"; quality: number; multiplier: number }): string;
}

/** JPEG preview of the live canvas. Does not change zoom or dimensions. */
export function captureCanvasThumbnail(
  canvas: ThumbnailCanvas,
  disposed = false,
): string | null {
  try {
    if (disposed || !canvas.lowerCanvasEl) return null;
    const displayWidth = canvas.width || 1;
    const multiplier = Math.min(
      2,
      Math.max(0.05, THUMB_TARGET_WIDTH / Math.max(1, displayWidth)),
    );
    const url = canvas.toDataURL({
      format: "jpeg",
      quality: THUMB_QUALITY,
      multiplier,
    });
    return url || null;
  } catch {
    return null;
  }
}

export async function renderMissingThumbnails(
  slides: Array<{ id: number; canvasJSON: FabricCanvasJSON; thumbnail?: string | null }>,
  size: { width: number; height: number },
): Promise<Array<{ id: number; dataUrl: string }>> {
  const missing = slides.filter((slide) => !slide.thumbnail);
  if (missing.length === 0) return [];

  const rendered = await renderSlidesToImages(
    missing.map((slide) => ({ id: slide.id, canvasJSON: slide.canvasJSON })),
    size,
    {
      format: "jpeg",
      quality: THUMB_QUALITY,
      multiplier: Math.min(2, Math.max(0.05, THUMB_TARGET_WIDTH / Math.max(1, size.width))),
    },
  );

  return rendered.map((shot) => ({ id: shot.id, dataUrl: shot.dataUrl }));
}
