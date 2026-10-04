import { ActiveSelection, type Canvas, type FabricObject } from "fabric";
import { getSceneBoundingRect, moveObjectBoundingRectTo, type SceneRect } from "@/lib/canvas/auto-flow";

export type ObjectAlign =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom"
  | "distribute-x"
  | "distribute-y";

/**
 * Aligns the active objects to their shared bounding box.
 * Equal gaps spread them across the slide, including a pair of objects.
 */
export function alignSelected(canvas: Canvas, mode: ObjectAlign): void {
  const objects = canvas.getActiveObjects().slice();
  if (objects.length < 2) return;

  canvas.discardActiveObject();
  const rects = objects.map((obj) => getSceneBoundingRect(obj));

  if (mode === "distribute-x" || mode === "distribute-y") {
    const zoom = canvas.getZoom() || 1;
    const span =
      mode === "distribute-x"
        ? (canvas.getWidth() || 1080) / zoom
        : (canvas.getHeight() || 1080) / zoom;
    distribute(objects, rects, mode === "distribute-x", span);
  } else {
    alignToUnion(objects, rects, mode);
  }

  const selection = new ActiveSelection(objects, { canvas });
  canvas.setActiveObject(selection);
  canvas.requestRenderAll();
}

function alignToUnion(objects: FabricObject[], rects: SceneRect[], mode: ObjectAlign): void {
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));
  const right = Math.max(...rects.map((rect) => rect.left + rect.width));
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height));
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;

  objects.forEach((obj, index) => {
    const rect = rects[index]!;
    if (mode === "left") moveObjectBoundingRectTo(obj, left, rect.top);
    if (mode === "center") moveObjectBoundingRectTo(obj, centerX - rect.width / 2, rect.top);
    if (mode === "right") moveObjectBoundingRectTo(obj, right - rect.width, rect.top);
    if (mode === "top") moveObjectBoundingRectTo(obj, rect.left, top);
    if (mode === "middle") moveObjectBoundingRectTo(obj, rect.left, centerY - rect.height / 2);
    if (mode === "bottom") moveObjectBoundingRectTo(obj, rect.left, bottom - rect.height);
  });
}

function distribute(
  objects: FabricObject[],
  rects: SceneRect[],
  horizontal: boolean,
  span: number,
): void {
  const indexed = objects
    .map((obj, index) => ({ obj, rect: rects[index]! }))
    .sort((a, b) => (horizontal ? a.rect.left - b.rect.left : a.rect.top - b.rect.top));
  const total = indexed.reduce(
    (sum, item) => sum + (horizontal ? item.rect.width : item.rect.height),
    0,
  );
  const gap = (span - total) / (indexed.length + 1);
  const step = Number.isFinite(gap) ? Math.max(gap, 0) : 0;
  let cursor = step;

  for (const item of indexed) {
    const size = horizontal ? item.rect.width : item.rect.height;
    if (horizontal) moveObjectBoundingRectTo(item.obj, cursor, item.rect.top);
    else moveObjectBoundingRectTo(item.obj, item.rect.left, cursor);
    cursor += size + step;
  }
}
