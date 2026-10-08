import { SOLID_PRESETS, SUGGESTED_SETS, type SuggestedSet } from "@/lib/presets/backgrounds";
import { generateSlideBackgrounds, type SlideBackgroundSet } from "@/lib/presets/slide-background-sets";
import type { ProjectPalette } from "@/lib/canvas/document";
import { normalizeHex } from "./carousel-types";

const SET_BY_ID = new Map(SUGGESTED_SETS.map((set) => [set.id, set]));

/** Allowed solid fills the model may name for per-slide backgrounds. */
export const CAROUSEL_SOLID_COLORS = SOLID_PRESETS.map((p) => normalizeHex(p.color));

const SOLID_SET = new Set(CAROUSEL_SOLID_COLORS);

export function suggestedSetById(id: string | undefined | null): SuggestedSet | null {
  if (!id) return null;
  return SET_BY_ID.get(id.trim().toLowerCase()) ?? null;
}

export function resolvePaletteFromSet(set: SuggestedSet): ProjectPalette {
  return {
    background: normalizeHex(set.background),
    text: normalizeHex(set.text),
    accent: normalizeHex(set.accent),
    card: normalizeHex(set.card),
  };
}

/** Snap any hex onto the nearest solid preset (keeps generated fills on-brand). */
export function snapToSolidPreset(hex: string): string {
  const target = normalizeHex(hex);
  if (SOLID_SET.has(target)) return target;

  const [tr, tg, tb] = hexToRgb(target);
  let best = CAROUSEL_SOLID_COLORS[0]!;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const candidate of CAROUSEL_SOLID_COLORS) {
    const [r, g, b] = hexToRgb(candidate);
    const dist = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex).slice(1);
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

/** Soft per-slide background story from a suggested set seed. */
export function backgroundsForSet(set: SuggestedSet, count: number): string[] {
  const recipe: SlideBackgroundSet = {
    id: set.id,
    label: set.label,
    seed: set.background,
    mode: "story",
    stops: [set.background, set.card, set.accent, set.background].map(normalizeHex),
  };
  return generateSlideBackgrounds(recipe, count).map(snapToSolidPreset);
}

export function catalogForPrompt(): string {
  return SUGGESTED_SETS.map(
    (set) =>
      `- ${set.id}: bg ${set.background}, text ${set.text}, accent ${set.accent}, card ${set.card}`,
  ).join("\n");
}

/**
 * Editorial rules distilled from templates/refs + Swibp template JSON:
 * left margin, big Montserrat headlines, numbered points, corner chrome, footer.
 */
export function refStyleGuide(): string {
  return [
    "Visual language (match templates/refs + Swibp editorial carousels):",
    "- Instagram 4:5 lifestyle/editorial slides — not corporate decks.",
    "- Big bold sans headlines (Montserrat energy), tight line-height, often 1–3 short lines.",
    "- Cover: oversized title mid-frame; optional soft subtitle in parentheses or brackets.",
    "- Point slides: numbered like \"1 / topic\" or \"[1] topic\", body under it, left-aligned, lower two-thirds.",
    "- CTA last: short invite + optional body; keep airy.",
    "- Corner chrome feel: handle [@…], // section label, footer tagline + @handle, slide [i/n].",
    "- Prefer lowercase or sentence case; punchy RU/EN matching the theme; no hashtag spam.",
    "- Color: pick ONE setId from the catalog. Do not invent hex codes outside that set.",
    "- Per-slide background: omit (we vary from the set) OR use only catalog hex values.",
  ].join("\n");
}
