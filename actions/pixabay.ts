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
    return { ok: false, error: "PIXABAY_API_KEY не задан" };
  }

  const q = query.trim() || "icon";
  const perPage = Math.min(Math.max(options?.perPage ?? 40, 3), 200);

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
        const imageUrl = hit.largeImageURL || hit.webformatURL;
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
    return { ok: false, error: "Не удалось загрузить иконки" };
  }
}
