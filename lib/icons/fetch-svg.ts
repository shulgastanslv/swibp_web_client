"use client";

/**
 * Search Iconify (client). SVG bodies are loaded via `icon-cache` in batches.
 */

export async function searchIconifyIcons(options: {
  query: string;
  prefixes: string;
  limit?: number;
}): Promise<Array<{ id: string; name: string }>> {
  const { query, prefixes, limit = 72 } = options;
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `https://api.iconify.design/search?query=${encodeURIComponent(
    trimmed,
  )}&prefixes=${encodeURIComponent(prefixes)}&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Iconify search HTTP ${res.status}`);

  const data = (await res.json()) as { icons?: string[] };
  return (data.icons ?? []).map((fullId) => {
    const rawName = fullId.split(":")[1] || fullId;
    return {
      id: fullId,
      name: rawName.replace(/-/g, " "),
    };
  });
}

export { fetchIconSvg } from "@/lib/icons/icon-cache";
