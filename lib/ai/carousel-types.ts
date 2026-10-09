import type { ProjectPalette } from "@/lib/canvas/document";

export type CarouselSlideRole = "cover" | "point" | "cta";
/** editorial = left-aligned numbered (refs); center/top/split kept for variety */
export type CarouselSlideLayout = "editorial" | "center" | "top" | "split";

export interface CarouselSlideSpec {
  index: number;
  role: CarouselSlideRole;
  heading: string;
  body?: string;
  background?: string;
  layout?: CarouselSlideLayout;
}

export interface CarouselPaletteEvent {
  type: "palette";
  /** Preferred: id from SUGGESTED_SETS */
  setId?: string;
  background: string;
  text: string;
  accent: string;
  card: string;
  tagline?: string;
  handle?: string;
}

export interface CarouselSlideEvent {
  type: "slide";
  index: number;
  role: CarouselSlideRole;
  heading: string;
  body?: string;
  background?: string;
  layout?: CarouselSlideLayout;
}

export interface CarouselDoneEvent {
  type: "done";
  title: string;
}

export interface CarouselErrorEvent {
  type: "error";
  message: string;
}

export interface CarouselMetaEvent {
  type: "meta";
  slides: number;
  theme: string;
}

export type CarouselStreamEvent =
  | CarouselMetaEvent
  | CarouselPaletteEvent
  | CarouselSlideEvent
  | CarouselDoneEvent
  | CarouselErrorEvent;

export type CarouselPalette = ProjectPalette;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function normalizeHex(value: string): string {
  const raw = value.trim();
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    const [, r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return raw.toLowerCase();
}
