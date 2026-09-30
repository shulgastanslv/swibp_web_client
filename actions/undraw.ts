"use server";

export interface UndrawIllustration {
  id: string;
  title: string;
  slug: string;
  media: string;
}

type ActionResult<T extends object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

const UNDRAW_PRIMARY = /#6c63ff/gi;

/**
 * Search unDraw illustrations (server-side — the public API has no CORS).
 * Free for commercial use, no attribution required: https://undraw.co/license
 */
export async function searchUndraw(
  query: string,
): Promise<ActionResult<{ items: UndrawIllustration[] }>> {
  const q = query.trim() || "team";
  try {
    const res = await fetch(
      `https://undraw.co/api/search?q=${encodeURIComponent(q)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) {
      return { ok: false, error: `unDraw search HTTP ${res.status}` };
    }

    const data = (await res.json()) as {
      results?: Array<{
        _id?: string;
        title?: string;
        newSlug?: string;
        media?: string;
      }>;
    };

    const items: UndrawIllustration[] = (data.results ?? [])
      .filter((r) => r.media && r.title)
      .map((r) => ({
        id: r._id || r.newSlug || r.media!,
        title: r.title!,
        slug: r.newSlug || r.title!,
        media: r.media!,
      }));

    return { ok: true, items };
  } catch (err) {
    console.error("searchUndraw:", err);
    return { ok: false, error: "Не удалось найти иллюстрации" };
  }
}

/**
 * Fetch an unDraw SVG and optionally recolor the default purple accent.
 */
export async function fetchUndrawSvg(
  mediaUrl: string,
  color?: string,
): Promise<ActionResult<{ svg: string }>> {
  try {
    let parsed: URL;
    try {
      parsed = new URL(mediaUrl);
    } catch {
      return { ok: false, error: "Некорректный URL" };
    }
    if (parsed.hostname !== "cdn.undraw.co") {
      return { ok: false, error: "Разрешён только CDN unDraw" };
    }

    const res = await fetch(parsed.toString(), {
      headers: { Accept: "image/svg+xml,*/*" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return { ok: false, error: `unDraw SVG HTTP ${res.status}` };
    }

    let svg = await res.text();
    if (!svg.includes("<svg")) {
      return { ok: false, error: "Ответ не SVG" };
    }

    if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
      svg = svg.replace(UNDRAW_PRIMARY, color);
    }

    if (!svg.includes("xmlns=")) {
      svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    return { ok: true, svg };
  } catch (err) {
    console.error("fetchUndrawSvg:", err);
    return { ok: false, error: "Не удалось загрузить SVG" };
  }
}
