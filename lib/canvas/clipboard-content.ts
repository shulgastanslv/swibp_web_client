export const CANVAS_CLIPBOARD_MIME = "application/x-core-canvas";
export const CANVAS_CLIPBOARD_MARKER = "core:canvas-objects";

export type ClipboardPayload =
  | { kind: "objects" }
  | { kind: "image-url"; url: string }
  | { kind: "text"; text: string }
  | { kind: "empty" };

type ClipboardFileItem = {
  kind: string;
  type: string;
  getAsFile: () => File | null;
};

/** Image files from a paste event. Item entries win over `files` so we don't add the same image twice. */
export function imageFilesFromClipboard(
  files: ArrayLike<File> | null | undefined,
  items: ArrayLike<ClipboardFileItem> | null | undefined,
): File[] {
  const fromItems: File[] = [];
  if (items) {
    for (const item of Array.from(items)) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) fromItems.push(file);
      }
    }
  }
  if (fromItems.length > 0) return fromItems;
  if (!files) return [];
  return Array.from(files).filter((file) => file.type.startsWith("image/"));
}

export function classifyClipboardText(text: string, hasObjectMarker: boolean): ClipboardPayload {
  if (hasObjectMarker || text === CANVAS_CLIPBOARD_MARKER) return { kind: "objects" };

  const trimmed = text.trim();
  if (!trimmed) return { kind: "empty" };
  if (isImageDataUrl(trimmed) || isHttpUrl(trimmed)) return { kind: "image-url", url: trimmed };
  return { kind: "text", text: trimmed };
}

/** First `<img src>` when the clipboard has HTML but no plain text (common for copied pictures). */
export function imageUrlFromHtml(html: string): string | null {
  const match = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  if (!match) return null;
  const src = match[1];
  if (!src) return null;
  if (isImageDataUrl(src) || isHttpUrl(src)) return src;
  return null;
}

function isImageDataUrl(value: string): boolean {
  return /^data:image\/[a-z0-9.+-]+;base64,/i.test(value);
}

function isHttpUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
