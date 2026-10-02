"use server";

export interface PixabayIcon {
  id: string;
  name: string;
  previewUrl: string;
  imageUrl: string;
}

type ActionResult<T extends object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

type PixabayHit = {
  id: number;
  tags?: string;
  previewURL?: string;
  webformatURL?: string;
  largeImageURL?: string;
};

/** Prefer CDN (_640) — avoids pixabay.com/get rate limits and CORS. */
function resolveImageUrl(hit: PixabayHit): string | null {
  if (hit.previewURL) {
    const cdnLarger = hit.previewURL.replace(/_150(\.\w+)(?:\?.*)?$/, "_640$1");
    if (cdnLarger !== hit.previewURL) return cdnLarger;
  }
  return hit.webformatURL || hit.largeImageURL || hit.previewURL || null;
}

/**
 * Search Pixabay vectors for the icons sidebar.
 * https://pixabay.com/api/docs/
 */
export async function searchPixabayIcons(
  query: string,
  options?: { perPage?: number },
): Promise<ActionResult<{ items: PixabayIcon[] }>> {
  const key =
    process.env.PIXABAY_API_KEY ?? process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
  if (!key) {
    return { ok: false, error: "PIXABAY_API_KEY is not set" };
  }

  const q = query.trim() || "icon";
  const perPage = Math.min(Math.max(options?.perPage ?? 100, 3), 200);

  try {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", key);
    url.searchParams.set("q", q);
    url.searchParams.set("image_type", "vector");
    url.searchParams.set("safesearch", "true");
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("order", "popular");

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { ok: false, error: `Pixabay HTTP ${res.status}` };
    }

    const data = (await res.json()) as { hits?: PixabayHit[] };
    const items: PixabayIcon[] = (data.hits ?? [])
      .map((hit) => {
        const imageUrl = resolveImageUrl(hit);
        const previewUrl = hit.previewURL || hit.webformatURL;
        if (!imageUrl || !previewUrl) return null;
        const name = (hit.tags ?? "icon").split(",")[0]?.trim() || "icon";
        return {
          id: String(hit.id),
          name,
          previewUrl,
          imageUrl,
        };
      })
      .filter((item): item is PixabayIcon => item != null);

    return { ok: true, items };
  } catch (err) {
    console.error("searchPixabayIcons:", err);
    return { ok: false, error: "Couldn't load icons" };
  }
}
