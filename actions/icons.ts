"use server";

/**
 * @deprecated Prefer client-side `lib/icons/fetch-svg.ts` — Iconify JSON API
 * is more reliable in the browser and avoids Server Action round-trips.
 * Kept for any older callers.
 */
export async function fetchIconifySvg(
  iconName: string,
  color = "#000000",
): Promise<string | null> {
  try {
    const [prefix, name] = iconName.split(":");
    if (!prefix || !name) return null;

    const dataUrl = `https://api.iconify.design/${prefix}.json?icons=${encodeURIComponent(name)}`;
    const response = await fetch(dataUrl, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error(`Iconify HTTP ${response.status} for ${iconName}`);
      return null;
    }

    const data = (await response.json()) as {
      width?: number;
      height?: number;
      icons?: Record<string, { body?: string; width?: number; height?: number }>;
    };

    const icon = data.icons?.[name];
    const body = icon?.body?.trim();
    if (!body) {
      console.error("Пустой SVG для", iconName);
      return null;
    }

    const width = icon?.width ?? data.width ?? 24;
    const height = icon?.height ?? data.height ?? 24;
    const painted = body.replace(/currentColor/gi, color);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="${color}">${painted}</svg>`;
  } catch (error) {
    console.error("Ошибка загрузки SVG из Iconify:", error);
    return null;
  }
}
