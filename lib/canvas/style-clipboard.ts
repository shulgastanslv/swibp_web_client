import { Shadow, type FabricObject } from "fabric";
import {
  applyMask,
  gradientStops,
  linearGradient,
  maskKind,
  refreshMask,
  type MaskKind,
} from "./object-appearance";

const TEXT_TYPES = new Set(["text", "i-text", "textbox"]);

type ShadowSnapshot = {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
};

type StyleSnapshot = {
  fill?: string | { from: string; to: string };
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadow: ShadowSnapshot | null;
  globalCompositeOperation?: string;
  mask: MaskKind;
  rx?: number;
  ry?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  underline?: boolean;
  linethrough?: boolean;
  lineHeight?: number;
  charSpacing?: number;
  textAlign?: string;
  backgroundColor?: string;
};

let snapshot: StyleSnapshot | null = null;
const listeners = new Set<() => void>();

export function subscribeCopiedStyle(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hasCopiedStyle(): boolean {
  return snapshot != null;
}

function notify(): void {
  for (const listener of listeners) listener();
}

function readShadow(shadow: FabricObject["shadow"]): ShadowSnapshot | null {
  if (!shadow || typeof shadow !== "object") return null;
  const value = shadow as { color?: string; blur?: number; offsetX?: number; offsetY?: number };
  return {
    color: typeof value.color === "string" ? value.color : "#000000",
    blur: value.blur ?? 0,
    offsetX: value.offsetX ?? 0,
    offsetY: value.offsetY ?? 0,
  };
}

export function copyObjectStyle(obj: FabricObject): void {
  const fillStops = gradientStops(obj.fill);
  const next: StyleSnapshot = {
    opacity: obj.opacity ?? 1,
    shadow: readShadow(obj.shadow),
    globalCompositeOperation: obj.globalCompositeOperation,
    mask: maskKind(obj as FabricObject & { swibpMask?: unknown }),
  };

  if (fillStops) next.fill = { from: fillStops[0], to: fillStops[1] };
  else if (typeof obj.fill === "string") next.fill = obj.fill;
  if (typeof obj.stroke === "string") next.stroke = obj.stroke;
  if (typeof obj.strokeWidth === "number") next.strokeWidth = obj.strokeWidth;

  const rounded = obj as FabricObject & { rx?: number; ry?: number };
  if (typeof rounded.rx === "number") {
    next.rx = rounded.rx;
    next.ry = typeof rounded.ry === "number" ? rounded.ry : rounded.rx;
  }

  if (TEXT_TYPES.has(obj.type ?? "")) {
    const text = obj as FabricObject & {
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: string | number;
      fontStyle?: string;
      underline?: boolean;
      linethrough?: boolean;
      lineHeight?: number;
      charSpacing?: number;
      textAlign?: string;
      backgroundColor?: string;
    };
    if (typeof text.fontFamily === "string") next.fontFamily = text.fontFamily;
    if (typeof text.fontSize === "number") next.fontSize = text.fontSize;
    if (text.fontWeight != null) next.fontWeight = text.fontWeight;
    if (typeof text.fontStyle === "string") next.fontStyle = text.fontStyle;
    if (typeof text.underline === "boolean") next.underline = text.underline;
    if (typeof text.linethrough === "boolean") next.linethrough = text.linethrough;
    if (typeof text.lineHeight === "number") next.lineHeight = text.lineHeight;
    if (typeof text.charSpacing === "number") next.charSpacing = text.charSpacing;
    if (typeof text.textAlign === "string") next.textAlign = text.textAlign;
    if (typeof text.backgroundColor === "string") next.backgroundColor = text.backgroundColor;
  }

  snapshot = next;
  notify();
}

export function copyStyleFromSelection(canvas: { getActiveObject: () => FabricObject | null | undefined }): boolean {
  const active = canvas.getActiveObject();
  if (!active) return false;
  const source =
    active.type === "activeselection"
      ? (active as FabricObject & { getObjects: () => FabricObject[] }).getObjects()[0]
      : active;
  if (!source) return false;
  copyObjectStyle(source);
  return true;
}

function applySnapshot(target: FabricObject, saved: StyleSnapshot): void {
  const props: Record<string, unknown> = {};
  if (saved.opacity != null) props.opacity = saved.opacity;
  if (saved.globalCompositeOperation) props.globalCompositeOperation = saved.globalCompositeOperation;
  if (typeof saved.stroke === "string") props.stroke = saved.stroke;
  if (saved.strokeWidth != null) props.strokeWidth = saved.strokeWidth;
  if (typeof saved.fill === "string") props.fill = saved.fill;
  else if (saved.fill) props.fill = linearGradient(saved.fill.from, saved.fill.to);
  props.shadow = saved.shadow ? new Shadow(saved.shadow) : null;

  const isText = TEXT_TYPES.has(target.type ?? "");
  if (isText) {
    if (saved.fontFamily) props.fontFamily = saved.fontFamily;
    if (saved.fontSize != null) props.fontSize = saved.fontSize;
    if (saved.fontWeight != null) props.fontWeight = saved.fontWeight;
    if (saved.fontStyle) props.fontStyle = saved.fontStyle;
    if (saved.underline != null) props.underline = saved.underline;
    if (saved.linethrough != null) props.linethrough = saved.linethrough;
    if (saved.lineHeight != null) props.lineHeight = saved.lineHeight;
    if (saved.charSpacing != null) props.charSpacing = saved.charSpacing;
    if (saved.textAlign) props.textAlign = saved.textAlign;
    if (saved.backgroundColor) props.backgroundColor = saved.backgroundColor;
  }

  if ((target.type === "rect" || target.type === "image") && saved.rx != null) {
    props.rx = saved.rx;
    props.ry = saved.ry ?? saved.rx;
  }

  target.set(props as Partial<FabricObject>);
  applyMask(target, saved.mask);
  if (isText) {
    const text = target as FabricObject & { initDimensions?: () => void };
    text.initDimensions?.();
  }
  refreshMask(target);
  target.setCoords();
}

export function pasteObjectStyle(canvas: {
  getActiveObjects: () => FabricObject[];
}): boolean {
  if (!snapshot) return false;
  const targets = canvas.getActiveObjects().filter((obj) => !obj.excludeFromExport);
  if (targets.length === 0) return false;
  for (const target of targets) applySnapshot(target, snapshot);
  return true;
}
