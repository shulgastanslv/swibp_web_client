export const BACKGROUND_PATTERNS = [
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "lines", label: "Lines" },
  { id: "diagonal", label: "Diagonal" },
  { id: "hatch", label: "Hatch" },
  { id: "plus", label: "Plus" },
  { id: "diamond", label: "Diamond" },
  { id: "rings", label: "Rings" },
] as const;

export type BackgroundPatternId = (typeof BACKGROUND_PATTERNS)[number]["id"];

const TILE_SIZE: Record<BackgroundPatternId, number> = {
  dots: 32,
  grid: 28,
  lines: 16,
  diagonal: 24,
  hatch: 24,
  plus: 32,
  diamond: 32,
  rings: 36,
};

function luminance(color: string): number | null {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let value = hex[1]!;
    if (value.length === 3) value = value.split("").map((char) => char + char).join("");
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  const rgb = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!rgb) return null;
  const r = Number(rgb[1]);
  const g = Number(rgb[2]);
  const b = Number(rgb[3]);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function hexToRgba(color: string, opacity: number): string | null {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hex) return null;
  let value = hex[1]!;
  if (value.length === 3) value = value.split("").map((char) => char + char).join("");
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function inkFor(base: string, opacity: number, color?: string | null): string {
  const custom = color ? hexToRgba(color, opacity) : null;
  if (custom) return custom;
  const light = luminance(base);
  const rgb = light == null || light > 0.62 ? "18,18,18" : "255,255,255";
  return `rgba(${rgb},${opacity})`;
}

function strokeDiagonal(ctx: CanvasRenderingContext2D, size: number, down: boolean) {
  ctx.beginPath();
  if (down) {
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, size / 2);
  } else {
    ctx.moveTo(0, size);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size / 2, 0);
    ctx.moveTo(size / 2, size);
    ctx.lineTo(size, size / 2);
  }
  ctx.stroke();
}

function drawMark(ctx: CanvasRenderingContext2D, id: BackgroundPatternId, size: number) {
  switch (id) {
    case "dots": {
      const radius = Math.max(1, size * 0.047);
      const step = size / 2;
      ctx.beginPath();
      for (let y = step / 2; y < size; y += step) {
        for (let x = step / 2; x < size; x += step) {
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      return;
    }
    case "grid":
      ctx.beginPath();
      ctx.moveTo(0, 0.5);
      ctx.lineTo(size, 0.5);
      ctx.moveTo(0.5, 0);
      ctx.lineTo(0.5, size);
      ctx.stroke();
      return;
    case "lines":
      ctx.beginPath();
      ctx.moveTo(0, size / 2 + 0.5);
      ctx.lineTo(size, size / 2 + 0.5);
      ctx.stroke();
      return;
    case "diagonal":
      strokeDiagonal(ctx, size, false);
      return;
    case "hatch":
      strokeDiagonal(ctx, size, false);
      strokeDiagonal(ctx, size, true);
      return;
    case "plus": {
      const arm = size * 0.125;
      const x = size / 2;
      const y = size / 2;
      ctx.beginPath();
      ctx.moveTo(x - arm, y);
      ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm);
      ctx.lineTo(x, y + arm);
      ctx.stroke();
      return;
    }
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size, size / 2);
      ctx.lineTo(size / 2, size);
      ctx.lineTo(0, size / 2);
      ctx.closePath();
      ctx.stroke();
      return;
    case "rings":
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      return;
  }
}

export interface PatternLook {
  scale?: number;
  opacity?: number;
  color?: string | null;
}

/** Repeating tile. The base color is painted in, so the pattern stays readable on the slide. */
export function drawPatternTile(
  id: BackgroundPatternId,
  base: string,
  look: PatternLook = {},
): HTMLCanvasElement {
  const scale = Math.min(2.2, Math.max(0.7, look.scale ?? 1));
  const opacity = Math.min(0.8, Math.max(0.08, look.opacity ?? 0.28));
  const size = Math.round(TILE_SIZE[id] * scale);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const ink = inkFor(base, opacity, look.color);
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 1;
  ctx.lineCap = "square";
  drawMark(ctx, id, size);
  return canvas;
}
