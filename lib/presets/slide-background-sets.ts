import { hexToHsl, hslToHex } from "@/lib/color/palette";

export type SlideSetMode = "fade" | "analog" | "pulse" | "story";

export interface SlideBackgroundSet {
  id: string;
  label: string;
  /** Anchor color the sequence is built from. */
  seed: string;
  mode: SlideSetMode;
  /** Optional story stops; used when mode is "story". */
  stops?: string[];
}

const MIN_SLIDES = 1;
const MAX_SLIDES = 12;

function clampCount(count: number) {
  return Math.min(MAX_SLIDES, Math.max(MIN_SLIDES, Math.round(count)));
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function at(h: number, s: number, l: number): string {
  return hslToHex(h, clamp(s, 4, 96), clamp(l, 6, 96));
}

/** Evenly sample `stops` into exactly `count` colors (inclusive ends). */
function resample(stops: string[], count: number): string[] {
  if (count <= 1) return [stops[0] ?? "#ffffff"];
  if (stops.length === 0) return Array.from({ length: count }, () => "#ffffff");
  if (stops.length === 1) return Array.from({ length: count }, () => stops[0]!);
  if (count === stops.length) return [...stops];

  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const pos = t * (stops.length - 1);
    const lo = Math.floor(pos);
    const hi = Math.min(stops.length - 1, lo + 1);
    const k = pos - lo;
    if (lo === hi || k < 1e-6) return stops[lo]!;
    if (k > 1 - 1e-6) return stops[hi]!;
    const [h1, s1, l1] = hexToHsl(stops[lo]!);
    const [h2, s2, l2] = hexToHsl(stops[hi]!);
    // Shortest hue path for smooth blends.
    let dh = h2 - h1;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    return at(h1 + dh * k, s1 + (s2 - s1) * k, l1 + (l2 - l1) * k);
  });
}

function fadeSequence(seed: string, count: number): string[] {
  const [h, s, l] = hexToHsl(seed);
  const from = clamp(l + 22, 12, 94);
  const to = clamp(l - 26, 6, 88);
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return at(h, s - 4 * t, from + (to - from) * t);
  });
}

function analogSequence(seed: string, count: number): string[] {
  const [h, s, l] = hexToHsl(seed);
  const span = Math.min(72, 18 + count * 6);
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const hue = h - span / 2 + span * t;
    const light = l + (t - 0.5) * 10;
    return at(hue, s, light);
  });
}

function pulseSequence(seed: string, count: number): string[] {
  const [h, s, l] = hexToHsl(seed);
  const light = clamp(Math.max(l, 62), 54, 92);
  const dark = clamp(Math.min(l, 28), 8, 40);
  return Array.from({ length: count }, (_, i) => {
    const hue = h + (i % 2 === 0 ? -6 : 10) + i * 3;
    return i % 2 === 0 ? at(hue, s - 6, light) : at(hue, s + 4, dark);
  });
}

/** Curated carousel background families. Count is chosen in the UI. */
export const SLIDE_BACKGROUND_SETS: SlideBackgroundSet[] = [
  { id: "paper-fade", label: "Paper fade", seed: "#F6F1E8", mode: "fade" },
  { id: "ink-fade", label: "Ink fade", seed: "#1a1a1a", mode: "fade" },
  { id: "butter", label: "Butter", seed: "#F6E27A", mode: "analog" },
  { id: "clay", label: "Clay", seed: "#C46B4A", mode: "analog" },
  { id: "teal", label: "Teal drift", seed: "#1F7A6B", mode: "analog" },
  { id: "cobalt", label: "Cobalt", seed: "#2F5DFF", mode: "analog" },
  { id: "lilac", label: "Lilac", seed: "#6C4AB6", mode: "analog" },
  { id: "night-pulse", label: "Night pulse", seed: "#1C2B4A", mode: "pulse" },
  { id: "coral-pulse", label: "Coral pulse", seed: "#FF6B4A", mode: "pulse" },
  {
    id: "dawn",
    label: "Dawn",
    seed: "#F3D1C8",
    mode: "story",
    stops: ["#FFF8F4", "#F3D1C8", "#F4A261", "#C46B4A", "#1C2B4A"],
  },
  {
    id: "forest",
    label: "Forest path",
    seed: "#5C6B3A",
    mode: "story",
    stops: ["#F3F5EF", "#E7F0E4", "#7D9B76", "#5C6B3A", "#142018"],
  },
  {
    id: "mono",
    label: "Mono steps",
    seed: "#808080",
    mode: "story",
    stops: ["#ffffff", "#f1f1f1", "#d4d4d4", "#6b6b6b", "#252525", "#000000"],
  },
  {
    id: "electric",
    label: "Electric",
    seed: "#6D4AFF",
    mode: "story",
    stops: ["#F3F0FF", "#CDB4DB", "#6D4AFF", "#2F5DFF", "#1A1230"],
  },
];

export const SLIDE_SET_COUNT = { min: MIN_SLIDES, max: MAX_SLIDES } as const;

/** Build one solid background color per slide for the chosen set. */
export function generateSlideBackgrounds(set: SlideBackgroundSet, count: number): string[] {
  const n = clampCount(count);
  switch (set.mode) {
    case "fade":
      return fadeSequence(set.seed, n);
    case "analog":
      return analogSequence(set.seed, n);
    case "pulse":
      return pulseSequence(set.seed, n);
    case "story":
      return resample(set.stops?.length ? set.stops : [set.seed], n);
  }
}
