"use server";

import { mkdir, readdir } from "fs/promises";
import path from "path";

const IMAGE_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
]);

export interface LibraryIcon {
  id: string;
  name: string;
  /** Top-level folder under public/icons, or "" for files in the root. */
  category: string;
  url: string;
}

type ActionResult<T extends object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

function iconsRoot(): string {
  return path.join(process.cwd(), "public", "icons");
}

/** List image files in public/icons, including one level of category folders. */
export async function listLibraryIcons(): Promise<
  ActionResult<{ items: LibraryIcon[] }>
> {
  const root = iconsRoot();

  try {
    await mkdir(root, { recursive: true });
    const items: LibraryIcon[] = [];
    await walk(root, root, items);
    items.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    return { ok: true, items };
  } catch (err) {
    console.error("listLibraryIcons:", err);
    return { ok: false, error: "Couldn't read public/icons" };
  }
}

async function walk(dir: string, root: string, into: LibraryIcon[]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(abs, root, into);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    const relative = path.relative(root, abs).split(path.sep).join("/");
    const parts = relative.split("/");
    const category = parts.length > 1 ? parts[0] : "";
    const base = path.basename(entry.name, ext);
    into.push({
      id: relative,
      name: base.replace(/[-_]+/g, " "),
      category,
      url: `/icons/${parts.map(encodeURIComponent).join("/")}`,
    });
  }
}
