import type { Canvas, FabricObject } from "fabric";
import type { PaletteSlot, TextStyleDef, TextStyleId } from "@/lib/canvas/document";

type Tagged = FabricObject & {
  swibpSlot?: string;
  swibpStyle?: string;
  initDimensions?: () => void;
  dirty?: boolean;
};

function visit(obj: FabricObject, fn: (node: Tagged) => void): void {
  const node = obj as Tagged & { getObjects?: () => FabricObject[] };
  fn(node);
  if (typeof node.getObjects === "function") {
    for (const child of node.getObjects()) visit(child, fn);
  }
}

export function paintSlotOnCanvas(canvas: Canvas, slot: PaletteSlot, color: string): void {
  for (const obj of canvas.getObjects()) {
    visit(obj, (node) => {
      if (node.swibpSlot === slot) node.set({ fill: color });
    });
  }
  canvas.requestRenderAll();
}

const TEXT_TYPES = new Set(["text", "i-text", "textbox"]);

/** Repaints every text object on the open slide with one typeface. */
export function applyFontOnCanvas(canvas: Canvas, fontFamily: string): void {
  for (const obj of canvas.getObjects()) {
    visit(obj, (node) => {
      const type = (node.type || "").toLowerCase();
      if (!TEXT_TYPES.has(type)) return;
      node.set({ fontFamily });
      node.initDimensions?.();
      node.dirty = true;
      node.setCoords();
    });
  }
  canvas.requestRenderAll();
}

export function applyStyleOnCanvas(
  canvas: Canvas,
  styleId: TextStyleId,
  style: TextStyleDef,
): void {
  for (const obj of canvas.getObjects()) {
    visit(obj, (node) => {
      if (node.swibpStyle !== styleId) return;
      node.set({
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
      });
      node.initDimensions?.();
      node.dirty = true;
      node.setCoords();
    });
  }
  canvas.requestRenderAll();
}
