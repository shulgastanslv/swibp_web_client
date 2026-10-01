export type PaletteMode =
  | "mono"
  | "analogous"
  | "complementary"
  | "split"
  | "triadic"
  | "tetradic";

export const PALETTE_MODES: { id: PaletteMode; label: string }[] = [
  { id: "mono", label: "Mono" },
  { id: "analogous", label: "Analog" },
  { id: "complementary", label: "Comp" },
  { id: "split", label: "Split" },
  { id: "triadic", label: "Triad" },
  { id: "tetradic", label: "Tetra" },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function wrapHue(h: number) {
  return ((h % 360) + 360) % 360;
}

export function hexToHsl(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = Number.parseInt(h, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue = 0;
  switch (max) {
    case r:
      hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      hue = ((b - r) / d + 2) / 6;
      break;
    default:
      hue = ((r - g) / d + 4) / 6;
  }
  return [hue * 360, s * 100, l * 100];
}

export function hslToHex(h: number, s: number, l: number): string {
  const hh = wrapHue(h) / 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;

  if (ss === 0) {
    const v = Math.round(ll * 255);
    return `#${v.toString(16).padStart(2, "0").repeat(3)}`;
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const r = Math.round(hue2rgb(p, q, hh + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hh) * 255);
  const b = Math.round(hue2rgb(p, q, hh - 1 / 3) * 255);

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function colorAt(
  h: number,
  s: number,
  l: number,
  dh = 0,
  ds = 0,
  dl = 0,
): string {
  return hslToHex(h + dh, clamp(s + ds, 8, 96), clamp(l + dl, 8, 94));
}

/** Generate 5–6 swatches from a seed hex + harmony mode. */
export function generatePalette(seed: string, mode: PaletteMode): string[] {
  const [h, s, l] = hexToHsl(seed);

  switch (mode) {
    case "mono":
      return [
        colorAt(h, s, l, 0, -10, -28),
        colorAt(h, s, l, 0, -4, -14),
        colorAt(h, s, l),
        colorAt(h, s, l, 0, -4, 14),
        colorAt(h, s, l, 0, -10, 28),
      ];
    case "analogous":
      return [
        colorAt(h, s, l, -40, 0, -6),
        colorAt(h, s, l, -20, 0, -2),
        colorAt(h, s, l),
        colorAt(h, s, l, 20, 0, 2),
        colorAt(h, s, l, 40, 0, 6),
      ];
    case "complementary":
      return [
        colorAt(h, s, l, 0, 0, -18),
        colorAt(h, s, l),
        colorAt(h, s, l, 0, -8, 18),
        colorAt(h, s, l, 180, 0, -8),
        colorAt(h, s, l, 180, -4, 12),
      ];
    case "split":
      return [
        colorAt(h, s, l),
        colorAt(h, s, l, 0, -6, 16),
        colorAt(h, s, l, 150, 0, -4),
        colorAt(h, s, l, 210, 0, -4),
        colorAt(h, s, l, 180, -10, 10),
      ];
    case "triadic":
      return [
        colorAt(h, s, l),
        colorAt(h, s, l, 0, -8, 16),
        colorAt(h, s, l, 120, 0, -2),
        colorAt(h, s, l, 240, 0, -2),
        colorAt(h, s, l, 120, -10, 14),
      ];
    case "tetradic":
      return [
        colorAt(h, s, l),
        colorAt(h, s, l, 90, 0, -2),
        colorAt(h, s, l, 180, 0, -2),
        colorAt(h, s, l, 270, 0, -2),
        colorAt(h, s, l, 0, -8, 18),
        colorAt(h, s, l, 180, -8, 18),
      ];
  }
}

export function randomSeedHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 45 + Math.floor(Math.random() * 40);
  const l = 38 + Math.floor(Math.random() * 28);
  return hslToHex(h, s, l);
}
