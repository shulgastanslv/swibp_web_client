"use client";

/**
 * Batch-load Iconify icons via JSON API and cache SVG data-URLs.
 * Direct /{prefix}/{name}.svg hits rate limits (429) when a grid loads many thumbs.
 */

type IconMeta = {
  body: string;
  width: number;
  height: number;
};

const bodyCache = new Map<string, IconMeta | null>();
const inflight = new Map<string, Promise<void>>();

function isColorfulPrefix(prefix: string): boolean {
  return (
    prefix.includes("emoji") ||
    prefix.includes("flat-color") ||
    prefix.includes("vscode") ||
    prefix.includes("skill") ||
    prefix.includes("noto") ||
    prefix.includes("twemoji")
  );
}

function buildSvg(
  meta: IconMeta,
  prefix: string,
  color: string,
): string {
  let body = meta.body;
  if (!isColorfulPrefix(prefix)) {
    body = body
      .replace(/currentColor/gi, color)
      .replace(/fill="(?!none)[^"]*"/gi, (m) =>
        m.includes("url(") ? m : `fill="${color}"`,
      );
    if (!/fill=/i.test(body) && !/<style/i.test(body)) {
      body = `<g fill="${color}">${body}</g>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}">${body}</svg>`;
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function fetchPrefixBatch(
  prefix: string,
  names: string[],
): Promise<void> {
  const missing = names.filter((n) => !bodyCache.has(`${prefix}:${n}`));
  if (missing.length === 0) return;

  // Iconify allows comma-separated icons; keep batches modest.
  const CHUNK = 40;
  for (let i = 0; i < missing.length; i += CHUNK) {
    const chunk = missing.slice(i, i + CHUNK);
    const url = `https://api.iconify.design/${prefix}.json?icons=${chunk
      .map(encodeURIComponent)
      .join(",")}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        chunk.forEach((n) => bodyCache.set(`${prefix}:${n}`, null));
        continue;
      }

      const data = (await res.json()) as {
        width?: number;
        height?: number;
        icons?: Record<
          string,
          { body?: string; width?: number; height?: number }
        >;
        aliases?: Record<string, { parent: string }>;
      };

      for (const name of chunk) {
        const id = `${prefix}:${name}`;
        let icon = data.icons?.[name];
        if (!icon && data.aliases?.[name]) {
          icon = data.icons?.[data.aliases[name].parent];
        }
        const body = icon?.body?.trim();
        if (!body) {
          bodyCache.set(id, null);
          continue;
        }
        bodyCache.set(id, {
          body,
          width: icon?.width ?? data.width ?? 24,
          height: icon?.height ?? data.height ?? 24,
        });
      }
    } catch {
      chunk.forEach((n) => bodyCache.set(`${prefix}:${n}`, null));
    }
  }
}

/** Ensure icon bodies for the given ids are in cache (batched by prefix). */
export async function ensureIconBodies(ids: string[]): Promise<void> {
  const byPrefix = new Map<string, string[]>();

  for (const id of ids) {
    const [prefix, name] = id.split(":");
    if (!prefix || !name) continue;
    if (bodyCache.has(id)) continue;
    const list = byPrefix.get(prefix) ?? [];
    list.push(name);
    byPrefix.set(prefix, list);
  }

  const tasks: Promise<void>[] = [];
  for (const [prefix, names] of byPrefix) {
    const key = `${prefix}:${names.sort().join(",")}`;
    let job = inflight.get(key);
    if (!job) {
      job = fetchPrefixBatch(prefix, names).finally(() => {
        inflight.delete(key);
      });
      inflight.set(key, job);
    }
    tasks.push(job);
  }

  await Promise.all(tasks);
}

export function getCachedIconDataUrl(
  iconId: string,
  color = "#111827",
): string | null {
  const meta = bodyCache.get(iconId);
  if (!meta) return null;
  const [prefix] = iconId.split(":");
  return svgToDataUrl(buildSvg(meta, prefix ?? "", color));
}

export function getCachedIconSvg(
  iconId: string,
  color = "#111827",
): string | null {
  const meta = bodyCache.get(iconId);
  if (!meta) return null;
  const [prefix] = iconId.split(":");
  return buildSvg(meta, prefix ?? "", color);
}

/** Load one icon SVG (uses batch cache). */
export async function fetchIconSvg(
  iconId: string,
  color = "#111827",
): Promise<string | null> {
  await ensureIconBodies([iconId]);
  return getCachedIconSvg(iconId, color);
}
