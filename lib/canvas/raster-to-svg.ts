declare module "imagetracerjs" {
  interface ImageTracer {
    imagedataToSVG(
      image: { width: number; height: number; data: Uint8ClampedArray },
      options?: Record<string, string | number | boolean>,
    ): string;
  }
  const tracer: ImageTracer;
  export default tracer;
}

import ImageTracer from "imagetracerjs";

/** Longest side sent to the tracer. The result is paths, so later scaling stays sharp. */
const TRACE_MAX = 512;

const TRACE_OPTIONS = {
  ltres: 1,
  qtres: 1,
  pathomit: 8,
  rightangleenhance: true,
  colorsampling: 2,
  numberofcolors: 24,
  mincolorratio: 0.02,
  colorquantcycles: 3,
  strokewidth: 0,
  linefilter: true,
  scale: 1,
  roundcoords: 1,
  viewbox: true,
  desc: false,
  blurradius: 0,
  blurdelta: 20,
} as const;

export interface TraceSource {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

const svgCache = new Map<string, Promise<string>>();

/** Turn quantized pixels into an SVG of filled paths. */
export function traceImageData(image: TraceSource): string {
  const svg = ImageTracer.imagedataToSVG(image, TRACE_OPTIONS);
  if (!svg.includes("<svg")) {
    throw new Error("Tracer returned no SVG");
  }
  return svg;
}

/**
 * Load a same-origin bitmap and trace it to SVG.
 * Repeated calls for the same URL reuse the first result.
 */
export function traceImageUrl(url: string): Promise<string> {
  const cached = svgCache.get(url);
  if (cached) return cached;

  const pending = loadAndTrace(url).catch((error: unknown) => {
    svgCache.delete(url);
    throw error;
  });
  svgCache.set(url, pending);
  return pending;
}

async function loadAndTrace(url: string): Promise<string> {
  const image = await loadImage(url);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) throw new Error("Image has no size");

  const scale = Math.min(TRACE_MAX / width, TRACE_MAX / height, 1);
  const fittedWidth = Math.max(1, Math.round(width * scale));
  const fittedHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = fittedWidth;
  canvas.height = fittedHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.drawImage(image, 0, 0, fittedWidth, fittedHeight);
  return traceImageData(ctx.getImageData(0, 0, fittedWidth, fittedHeight));
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Couldn't read image"));
    image.src = url;
  });
}
