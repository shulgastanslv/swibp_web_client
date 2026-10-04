/** Largest source window that keeps `ratio` (width / height) and still covers the frame. */
export function largestWindow(naturalW: number, naturalH: number, ratio: number) {
  const safeRatio = ratio > 0 ? ratio : 1;
  if (naturalW <= 0 || naturalH <= 0) return { width: 1, height: 1 };
  if (naturalW / naturalH >= safeRatio) {
    const height = naturalH;
    return { width: height * safeRatio, height };
  }
  const width = naturalW;
  return { width, height: width / safeRatio };
}

export function windowAtZoom(cover: { width: number; height: number }, zoom: number) {
  const z = Math.max(zoom, 1);
  return { width: cover.width / z, height: cover.height / z };
}

/** Keeps the source window inside the photo. */
export function placeWindow(
  centerX: number,
  centerY: number,
  windowW: number,
  windowH: number,
  naturalW: number,
  naturalH: number,
) {
  const width = Math.min(Math.max(windowW, 1), naturalW);
  const height = Math.min(Math.max(windowH, 1), naturalH);
  const cropX = clamp(centerX - width / 2, 0, Math.max(0, naturalW - width));
  const cropY = clamp(centerY - height / 2, 0, Math.max(0, naturalH - height));
  return { cropX, cropY, width, height };
}

/**
 * Scene drag, in source pixels. Dragging the picture right reveals what was on its left,
 * so the caller subtracts this from the crop center.
 */
export function sourceDelta(
  dx: number,
  dy: number,
  angleDeg: number,
  scaleX: number,
  scaleY: number,
  flipX: boolean,
  flipY: boolean,
) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  let localX = dx * cos + dy * sin;
  let localY = -dx * sin + dy * cos;
  if (flipX) localX = -localX;
  if (flipY) localY = -localY;
  return {
    x: localX / (scaleX || 1),
    y: localY / (scaleY || 1),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
