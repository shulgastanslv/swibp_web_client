import { Circle, Gradient, Rect, type FabricObject } from "fabric";

export const BLEND_MODES = [
  { id: "source-over", label: "Normal" },
  { id: "multiply", label: "Multiply" },
  { id: "screen", label: "Screen" },
  { id: "overlay", label: "Overlay" },
  { id: "darken", label: "Darken" },
  { id: "lighten", label: "Lighten" },
] as const;

export type BlendMode = (typeof BLEND_MODES)[number]["id"];
export type MaskKind = "none" | "circle" | "rounded";

export function linearGradient(from: string, to: string) {
  return new Gradient({
    type: "linear",
    gradientUnits: "percentage",
    coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  });
}

export function gradientStops(fill: unknown): [string, string] | null {
  if (!(fill instanceof Gradient)) return null;
  const stops = fill.colorStops ?? [];
  const from = stops[0]?.color;
  const to = stops[stops.length - 1]?.color;
  if (typeof from !== "string" || typeof to !== "string") return null;
  return [from, to];
}

export function maskKind(obj: { swibpMask?: unknown }): MaskKind {
  return obj.swibpMask === "circle" || obj.swibpMask === "rounded" ? obj.swibpMask : "none";
}

export function maskClip(kind: Exclude<MaskKind, "none">, width: number, height: number) {
  if (kind === "circle") {
    return new Circle({
      radius: Math.max(1, Math.min(width, height) / 2),
      originX: "center",
      originY: "center",
      left: 0,
      top: 0,
    });
  }
  const radius = Math.min(width, height) * 0.18;
  return new Rect({
    width: Math.max(1, width),
    height: Math.max(1, height),
    rx: radius,
    ry: radius,
    originX: "center",
    originY: "center",
    left: 0,
    top: 0,
  });
}

/** Keep a circle or rounded mask fitted to the object's current box. */
export function refreshMask(obj: FabricObject): void {
  const kind = maskKind(obj as FabricObject & { swibpMask?: unknown });
  if (kind === "none") return;
  const width = obj.width ?? 0;
  const height = obj.height ?? 0;
  if (width <= 0 || height <= 0) return;
  obj.clipPath = maskClip(kind, width, height);
  obj.dirty = true;
}

export function applyMask(obj: FabricObject, kind: MaskKind): void {
  const target = obj as FabricObject & { swibpMask?: string };
  if (kind === "none") {
    obj.clipPath = undefined;
    target.swibpMask = "";
  } else {
    const width = obj.width ?? 0;
    const height = obj.height ?? 0;
    obj.clipPath = maskClip(kind, width, height);
    target.swibpMask = kind;
  }
  obj.dirty = true;
  obj.setCoords();
}
