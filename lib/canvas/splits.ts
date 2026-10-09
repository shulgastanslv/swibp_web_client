export interface CanvasSplit {
  id: string;
  name: string;
  label: string;
  axis: "rows" | "columns";
  /** Grid tracks on the split axis. The cut lands on a grid line. */
  count: number;
  /** How many of those tracks the image occupies. */
  imageTracks: number;
  imageFrom: "start" | "end";
}

export const CANVAS_SPLITS: readonly CanvasSplit[] = [
  { id: "image-top", name: "Image on top", label: "Top", axis: "rows", count: 2, imageTracks: 1, imageFrom: "start" },
  { id: "image-bottom", name: "Image below", label: "Bottom", axis: "rows", count: 2, imageTracks: 1, imageFrom: "end" },
  { id: "image-left", name: "Image left", label: "Left", axis: "columns", count: 2, imageTracks: 1, imageFrom: "start" },
  { id: "image-right", name: "Image right", label: "Right", axis: "columns", count: 2, imageTracks: 1, imageFrom: "end" },
  { id: "image-short", name: "Short image", label: "Short", axis: "rows", count: 3, imageTracks: 1, imageFrom: "start" },
  { id: "image-tall", name: "Tall image", label: "Tall", axis: "rows", count: 3, imageTracks: 2, imageFrom: "start" },
];

export interface SplitFrame {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Image rectangle inside the layout margin, edged on the same lines as the grid. */
export function splitFrame(
  split: CanvasSplit,
  size: { width: number; height: number },
  requestedMargin: number,
): SplitFrame {
  const margin = Math.min(
    Math.max(0, requestedMargin),
    Math.floor(size.width / 2),
    Math.floor(size.height / 2),
  );
  const innerW = Math.max(0, size.width - margin * 2);
  const innerH = Math.max(0, size.height - margin * 2);
  const count = Math.max(1, split.count);
  const tracks = Math.min(Math.max(1, split.imageTracks), count);
  const start = split.imageFrom === "start" ? 0 : count - tracks;

  if (split.axis === "rows") {
    const top = margin + (innerH * start) / count;
    const bottom = margin + (innerH * (start + tracks)) / count;
    return { left: margin, top, width: innerW, height: bottom - top };
  }

  const left = margin + (innerW * start) / count;
  const right = margin + (innerW * (start + tracks)) / count;
  return { left, top: margin, width: right - left, height: innerH };
}
