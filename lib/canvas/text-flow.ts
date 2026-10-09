/** Per-character styles keyed by paragraph line, then character index. */
export type CharStyle = Record<string, unknown>;
export type TextStyles = Record<string, Record<string, CharStyle>>;

function cloneLine(line: Record<string, CharStyle> | undefined): Record<string, CharStyle> | undefined {
  if (!line) return undefined;
  const next: Record<string, CharStyle> = {};
  for (const [index, style] of Object.entries(line)) {
    if (style && typeof style === "object") next[index] = { ...style };
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

/**
 * How many lines fit in `room` pixels, top to bottom.
 * Returns 0 when the first line itself is taller than the room.
 */
export function linesThatFit(lineHeights: number[], room: number): number {
  if (room <= 0 || lineHeights.length === 0) return 0;
  let used = 0;
  let fit = 0;
  for (const height of lineHeights) {
    const next = used + Math.max(height, 0);
    if (next > room + 0.5) return fit;
    used = next;
    fit += 1;
  }
  return fit;
}

/** Lines to keep on the current slide, or null when the text should move as a whole. */
export function continuationKeepCount(lineHeights: number[], room: number): number | null {
  const keep = linesThatFit(lineHeights, room);
  if (keep < 1 || keep >= lineHeights.length) return null;
  return keep;
}

/**
 * Split `text` at a string index. A cut on a newline drops that break
 * so neither side gains an empty line. Styles stay tied to paragraph lines.
 */
export function splitStyledText(
  text: string,
  styles: TextStyles | undefined,
  cut: number,
): { keptText: string; restText: string; keptStyles: TextStyles; restStyles: TextStyles } | null {
  if (cut <= 0 || cut >= text.length) return null;

  const onNewline = text[cut] === "\n";
  let keptText = text.slice(0, cut);
  let restText = text.slice(onNewline ? cut + 1 : cut);
  if (keptText.endsWith("\n")) keptText = keptText.slice(0, -1);
  if (restText.startsWith("\n")) restText = restText.slice(1);
  if (!keptText || !restText) return null;

  const keptStyles: TextStyles = {};
  const restStyles: TextStyles = {};
  const lines = text.split("\n");
  let index = 0;
  let restLine = 0;

  for (let line = 0; line < lines.length; line++) {
    const lineText = lines[line] ?? "";
    const start = index;
    const end = start + lineText.length;
    const chars = cloneLine(styles?.[line] ?? styles?.[String(line)]);

    const fullyKept = end < cut || (onNewline && end === cut);
    if (fullyKept) {
      if (chars) keptStyles[line] = chars;
    } else if (start >= cut) {
      if (chars) restStyles[restLine] = chars;
      restLine += 1;
    } else {
      const local = cut - start;
      const keptChars: Record<string, CharStyle> = {};
      const restChars: Record<string, CharStyle> = {};
      for (const [key, style] of Object.entries(chars ?? {})) {
        const charIndex = Number(key);
        if (!Number.isFinite(charIndex)) continue;
        if (charIndex < local) keptChars[key] = style;
        else restChars[String(charIndex - local)] = style;
      }
      if (Object.keys(keptChars).length > 0) keptStyles[line] = keptChars;
      if (Object.keys(restChars).length > 0) restStyles[0] = restChars;
      restLine = 1;
    }

    index = end + 1;
  }

  return { keptText, restText, keptStyles, restStyles };
}

/** String index of a paragraph line + character offset, counting newlines. */
export function paragraphIndex(text: string, line: number, offset: number): number {
  const paragraphs = text.split("\n");
  let index = 0;
  for (let i = 0; i < line && i < paragraphs.length; i++) {
    index += (paragraphs[i]?.length ?? 0) + 1;
  }
  return index + Math.max(0, offset);
}
