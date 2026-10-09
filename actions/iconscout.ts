"use server";

import {
  isIconScoutUrl,
  isIconScoutUuid,
  readIconScoutDownloadUrl,
  readIconScoutPage,
  sanitizeIconSvg,
  type IconScoutHit,
} from "@/lib/iconscout";

const SEARCH_URL = "https://api.iconscout.com/v3/search";
const ASSETS = new Set(["icon", "illustration", "3d"]);
const PER_PAGE = 200;

type SearchResult =
  | { ok: true; items: IconScoutHit[]; page: number; lastPage: number; total: number }
  | { ok: false; error: string };
type ImageResult = { ok: true; dataUrl: string } | { ok: false; error: string };
type SvgResult = { ok: true; svg: string } | { ok: false; error: string };

function clientId(): string | null {
  const value = process.env.ICONSCOUT_CLIENT_ID?.trim();
  return value || null;
}

function clientSecret(): string | null {
  const value = process.env.ICONSCOUT_API_KEY?.trim();
  return value || null;
}

function failureMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as { message?: unknown; data?: { reason?: unknown } };
  const reason = record.data?.reason;
  if (reason === "subscription_required" || reason === "asset_not_covered") {
    return "This IconScout app can't download SVGs (subscription_required)";
  }
  if (reason === "credit_limit_reached" || reason === "quota_exhausted") {
    return "IconScout download limit reached";
  }
  return typeof record.message === "string" && record.message.trim() ? record.message : fallback;
}

export async function searchIconScout(input: {
  query: string;
  asset?: string;
  page?: number;
}): Promise<SearchResult> {
  const query = input.query.trim();
  if (query.length < 2) return { ok: true, items: [], page: 1, lastPage: 1, total: 0 };

  const id = clientId();
  if (!id) return { ok: false, error: "Add ICONSCOUT_CLIENT_ID to the server environment" };

  const asset = ASSETS.has(input.asset ?? "") ? input.asset! : "icon";
  const page = Number.isFinite(input.page) ? Math.max(1, Math.floor(input.page!)) : 1;
  const url = new URL(SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("asset", asset);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));

  try {
    const res = await fetch(url, {
      headers: { "Client-ID": id, Accept: "application/json" },
      cache: "no-store",
    });
    const payload: unknown = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: failureMessage(payload, "IconScout search failed") };
    const found = readIconScoutPage(payload);
    return { ok: true, ...found, page };
  } catch (err) {
    console.error("searchIconScout:", err);
    return { ok: false, error: "Couldn't reach IconScout" };
  }
}

export async function loadIconScoutSvg(uuid: string): Promise<SvgResult> {
  if (!isIconScoutUuid(uuid)) return { ok: false, error: "That icon id isn't valid" };
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return { ok: false, error: "Add ICONSCOUT_API_KEY to the server environment" };

  try {
    const res = await fetch(`https://api.iconscout.com/v3/items/${uuid}/api-download`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Client-ID": id,
        "Client-Secret": secret,
      },
      body: JSON.stringify({ format: "svg", width: 0, height: 0 }),
      cache: "no-store",
    });
    const payload: unknown = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: failureMessage(payload, "Couldn't download the SVG") };
    const downloadUrl = readIconScoutDownloadUrl(payload);
    if (!downloadUrl) return { ok: false, error: "IconScout didn't return an SVG" };

    const file = await fetch(downloadUrl, { cache: "no-store" });
    if (!file.ok || !isIconScoutUrl(file.url)) return { ok: false, error: "Couldn't download the SVG" };
    const svg = sanitizeIconSvg(await file.text());
    if (!svg) return { ok: false, error: "IconScout didn't return an SVG" };
    return { ok: true, svg };
  } catch (err) {
    console.error("loadIconScoutSvg:", err);
    return { ok: false, error: "Couldn't download the SVG" };
  }
}

export async function loadIconScoutImage(previewUrl: string): Promise<ImageResult> {
  if (!isIconScoutUrl(previewUrl)) return { ok: false, error: "That preview isn't from IconScout" };

  try {
    const res = await fetch(previewUrl, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: "Couldn't download the preview" };
    const type = (res.headers.get("content-type") || "image/png").split(";")[0]?.trim() || "image/png";
    if (!type.startsWith("image/")) return { ok: false, error: "IconScout didn't return an image" };
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > 8_000_000) {
      return { ok: false, error: "That preview is too large" };
    }
    return { ok: true, dataUrl: `data:${type};base64,${bytes.toString("base64")}` };
  } catch (err) {
    console.error("loadIconScoutImage:", err);
    return { ok: false, error: "Couldn't download the preview" };
  }
}
