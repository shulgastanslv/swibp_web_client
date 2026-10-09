const PREVIEW_KEYS = ["png_256", "png_128", "png_512", "png_64", "thumb", "svg"] as const;

export interface IconScoutHit {
  id: string;
  name: string;
  previewUrl: string;
}

export interface IconScoutPage {
  items: IconScoutHit[];
  page: number;
  lastPage: number;
  total: number;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isIconScoutUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "iconscout.com" || url.hostname.endsWith(".iconscout.com"));
  } catch {
    return false;
  }
}

function previewOf(item: Record<string, unknown>): string | null {
  const urls = item.urls && typeof item.urls === "object" ? (item.urls as Record<string, unknown>) : {};
  const candidates = [...PREVIEW_KEYS.map((key) => urls[key]), item.image];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && isIconScoutUrl(candidate)) return candidate;
  }
  return null;
}

export function readIconScoutHits(payload: unknown): IconScoutHit[] {
  const response =
    payload && typeof payload === "object" ? (payload as { response?: unknown }).response : null;
  const items =
    response && typeof response === "object" ? (response as { items?: unknown }).items : null;
  const rows = Array.isArray(items)
    ? items
    : items && typeof items === "object" && Array.isArray((items as { data?: unknown }).data)
      ? (items as { data: unknown[] }).data
      : [];

  const hits: IconScoutHit[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const previewUrl = previewOf(item);
    const id =
      typeof item.uuid === "string"
        ? item.uuid
        : typeof item.id === "string"
          ? item.id
          : typeof item.id === "number"
            ? String(item.id)
            : "";
    if (!id || !previewUrl) continue;
    const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : "Asset";
    hits.push({ id, name, previewUrl });
  }
  return hits;
}

function pageNumber(value: unknown, fallback: number): number {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(number) && number >= 1 ? Math.floor(number) : fallback;
}

export function readIconScoutPage(payload: unknown): IconScoutPage {
  const items = readIconScoutHits(payload);
  const response =
    payload && typeof payload === "object" ? (payload as { response?: unknown }).response : null;
  const node =
    response && typeof response === "object" ? (response as { items?: unknown }).items : null;
  const meta = node && typeof node === "object" ? (node as Record<string, unknown>) : {};
  const page = pageNumber(meta.current_page, 1);
  return {
    items,
    page,
    lastPage: pageNumber(meta.last_page, page),
    total: pageNumber(meta.total, items.length),
  };
}

export function isIconScoutUuid(value: string): boolean {
  return UUID.test(value);
}

export function readIconScoutDownloadUrl(payload: unknown): string | null {
  const response =
    payload && typeof payload === "object" ? (payload as { response?: unknown }).response : null;
  const download =
    response && typeof response === "object" ? (response as { download?: unknown }).download : null;
  const url =
    download && typeof download === "object" ? (download as { download_url?: unknown }).download_url : null;
  return typeof url === "string" && isIconScoutUrl(url) ? url : null;
}

/** Drop active content from an IconScout SVG before it reaches the canvas. */
export function sanitizeIconSvg(source: string): string | null {
  const text = source.trim();
  if (!text.includes("<svg") || text.length > 2_000_000) return null;
  const cleaned = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "");
  return cleaned.includes("<svg") ? cleaned : null;
}
