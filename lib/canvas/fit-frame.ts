import type { FabricCanvasJSON } from "@/lib/types";

export type FrameSize = { width: number; height: number };

type OriginX = "left" | "center" | "right";
type OriginY = "top" | "center" | "bottom";

/** Share of the old frame an edge must touch to count as pinned. */
const EDGE = 0.08;
/** Share of the old frame a box must cover to be treated as a backdrop. */
const BLEED = 0.9;

export type FittedGeometry = {
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
  width?: number;
  strokeWidth?: number;
  /** Multiply shadow blur and offset by this. */
  shadowScale: number;
};

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function originX(value: unknown): OriginX {
  return value === "center" || value === "right" ? value : "left";
}

function originY(value: unknown): OriginY {
  return value === "center" || value === "bottom" ? value : "top";
}

function originFactorX(origin: OriginX): number {
  if (origin === "center") return 0.5;
  if (origin === "right") return 1;
  return 0;
}

function originFactorY(origin: OriginY): number {
  if (origin === "center") return 0.5;
  if (origin === "bottom") return 1;
  return 0;
}

function objectCenter(object: Record<string, unknown>): { x: number; y: number } {
  const left = num(object.left);
  const top = num(object.top);
  const w = num(object.width) * num(object.scaleX, 1);
  const h = num(object.height) * num(object.scaleY, 1);
  const dx = (0.5 - originFactorX(originX(object.originX))) * w;
  const dy = (0.5 - originFactorY(originY(object.originY))) * h;
  const rad = (num(object.angle) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: left + dx * cos - dy * sin, y: top + dx * sin + dy * cos };
}

function place(
  object: Record<string, unknown>,
  center: { x: number; y: number },
  scaleX: number,
  scaleY: number,
  width = num(object.width),
  height = num(object.height),
): { left: number; top: number } {
  const w = width * scaleX;
  const h = height * scaleY;
  const dx = (0.5 - originFactorX(originX(object.originX))) * w;
  const dy = (0.5 - originFactorY(originY(object.originY))) * h;
  const rad = (num(object.angle) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    left: center.x - (dx * cos - dy * sin),
    top: center.y - (dx * sin + dy * cos),
  };
}

function axisBounds(object: Record<string, unknown>, from: FrameSize) {
  const center = objectCenter(object);
  const w = num(object.width) * num(object.scaleX, 1);
  const h = num(object.height) * num(object.scaleY, 1);
  const rad = (num(object.angle) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const width = w * cos + h * sin;
  const height = w * sin + h * cos;
  const left = center.x - width / 2;
  const top = center.y - height / 2;
  return {
    center,
    left,
    top,
    width,
    height,
    pinL: left <= from.width * EDGE,
    pinR: left + width >= from.width * (1 - EDGE),
    pinT: top <= from.height * EDGE,
    pinB: top + height >= from.height * (1 - EDGE),
  };
}

function typeOf(object: Record<string, unknown>): string {
  return typeof object.type === "string" ? object.type.toLowerCase() : "";
}

function isText(object: Record<string, unknown>): boolean {
  const type = typeOf(object);
  return type === "text" || type === "i-text" || type === "itext" || type === "textbox";
}

/**
 * Moves one object from `from` into `to`.
 * Shapes keep their proportions. Size uses the geometric mean of the two
 * axis ratios, so a round trip (4:5 → 1:1 → 4:5) restores the original scale
 * instead of shrinking on every switch. A panel that filled the old frame
 * stretches to the new one. A photo that filled it covers the new frame.
 * A wide text box keeps its side margins and reflows.
 */
export function fitGeometry(
  object: Record<string, unknown>,
  from: FrameSize,
  to: FrameSize,
): FittedGeometry {
  const scaleX = num(object.scaleX, 1);
  const scaleY = num(object.scaleY, 1);
  const sx = to.width / from.width;
  const sy = to.height / from.height;
  const uniform = Math.sqrt(sx * sy);
  const box = axisBounds(object, from);
  const bleed = box.width >= from.width * BLEED && box.height >= from.height * BLEED;
  const type = typeOf(object);
  const strokeWidth =
    typeof object.strokeWidth === "number" ? object.strokeWidth * uniform : undefined;

  if (bleed && type === "rect" && Math.abs(num(object.angle)) < 1) {
    const nextScaleX = to.width / Math.max(num(object.width), 1);
    const nextScaleY = to.height / Math.max(num(object.height), 1);
    const at = place(object, { x: to.width / 2, y: to.height / 2 }, nextScaleX, nextScaleY);
    return { ...at, scaleX: nextScaleX, scaleY: nextScaleY, strokeWidth, shadowScale: uniform };
  }

  if (bleed && type === "image") {
    const cover = Math.max(to.width / Math.max(num(object.width), 1), to.height / Math.max(num(object.height), 1));
    const nextScaleX = cover;
    const nextScaleY = cover;
    const at = place(
      object,
      { x: (box.center.x / from.width) * to.width, y: (box.center.y / from.height) * to.height },
      nextScaleX,
      nextScaleY,
    );
    return { ...at, scaleX: nextScaleX, scaleY: nextScaleY, strokeWidth, shadowScale: cover };
  }

  const nextScaleX = scaleX * uniform;
  const nextScaleY = scaleY * uniform;
  let width: number | undefined;
  let center = {
    x: (box.center.x / from.width) * to.width,
    y: (box.center.y / from.height) * to.height,
  };

  if (type === "textbox" && box.pinL && box.pinR) {
    const marginL = Math.max(0, box.left) * sx;
    const marginR = Math.max(0, from.width - (box.left + box.width)) * sx;
    const target = Math.max(1, to.width - marginL - marginR);
    width = target / Math.max(nextScaleX, 1e-6);
    center = {
      x: marginL + target / 2,
      y: center.y,
    };
  }

  const at = place(object, center, nextScaleX, nextScaleY, width ?? num(object.width), num(object.height));
  return {
    ...at,
    scaleX: nextScaleX,
    scaleY: nextScaleY,
    ...(width != null ? { width } : {}),
    strokeWidth,
    shadowScale: uniform,
  };
}

function fitStoredObject(
  object: Record<string, unknown>,
  from: FrameSize,
  to: FrameSize,
): Record<string, unknown> {
  const next = structuredClone(object);
  const fitted = fitGeometry(next, from, to);
  next.left = fitted.left;
  next.top = fitted.top;
  next.scaleX = fitted.scaleX;
  next.scaleY = fitted.scaleY;
  if (fitted.width != null) next.width = fitted.width;
  if (fitted.strokeWidth != null) next.strokeWidth = fitted.strokeWidth;
  const shadow = next.shadow;
  if (shadow && typeof shadow === "object" && !Array.isArray(shadow)) {
    const shade = shadow as Record<string, unknown>;
    for (const key of ["blur", "offsetX", "offsetY"] as const) {
      if (typeof shade[key] === "number") shade[key] = (shade[key] as number) * fitted.shadowScale;
    }
  }
  return next;
}

function fitBackground(value: unknown, to: FrameSize): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const bg = structuredClone(value) as Record<string, unknown>;
  const width = num(bg.width);
  const height = num(bg.height);
  if (width <= 0 || height <= 0) return bg;
  const type = typeOf(bg);
  if (type === "image") {
    const cover = Math.max(to.width / width, to.height / height);
    const drawnW = width * cover;
    const drawnH = height * cover;
    bg.scaleX = cover;
    bg.scaleY = cover;
    bg.left = (to.width - drawnW) / 2;
    bg.top = (to.height - drawnH) / 2;
    return bg;
  }
  bg.scaleX = to.width / width;
  bg.scaleY = to.height / height;
  bg.left = 0;
  bg.top = 0;
  return bg;
}

/** Rewrites a saved slide so its objects sit in `to` the way they sat in `from`. */
export function fitCanvasJSON(
  json: FabricCanvasJSON,
  from: FrameSize,
  to: FrameSize,
): FabricCanvasJSON {
  if (from.width <= 0 || from.height <= 0) return json;
  if (from.width === to.width && from.height === to.height) return json;
  const objects = (json.objects ?? []).map((object) => fitStoredObject(object, from, to));
  if (json.backgroundImage == null) return { ...json, objects };
  return {
    ...json,
    objects,
    backgroundImage: fitBackground(json.backgroundImage, to),
  };
}
