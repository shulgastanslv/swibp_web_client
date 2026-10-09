import type { CharStyle, TextStyles } from "./text-flow";

export type ListKind = "bullet" | "number";

const BULLET = /^•\s/;
const NUMBER = /^\d+\.\s/;

type StyleTarget = {
  isEditing?: boolean;
  selectionStart?: number;
  selectionEnd?: number;
  setSelectionStyles?: (style: Record<string, unknown>, start?: number, end?: number) => void;
  initDimensions?: () => void;
  dirty?: boolean;
  setCoords?: () => void;
};

/** Apply a style to the active text selection. Returns false when the whole object should change. */
export function applySelectionStyle(text: StyleTarget, style: Record<string, unknown>): boolean {
  if (!text.isEditing || !text.setSelectionStyles) return false;
  if (text.selectionStart == null || text.selectionEnd == null) return false;
  if (text.selectionStart === text.selectionEnd) return false;
  text.setSelectionStyles(style, text.selectionStart, text.selectionEnd);
  text.dirty = true;
  text.initDimensions?.();
  text.setCoords?.();
  return true;
}

function stripPrefix(line: string): { text: string; removed: number } {
  const bullet = line.match(BULLET);
  if (bullet) return { text: line.slice(bullet[0].length), removed: bullet[0].length };
  const numbered = line.match(NUMBER);
  if (numbered) return { text: line.slice(numbered[0].length), removed: numbered[0].length };
  return { text: line, removed: 0 };
}

function prefixFor(kind: ListKind, number: number): string {
  return kind === "bullet" ? "• " : `${number}. `;
}

function lineIsKind(line: string, kind: ListKind): boolean {
  return kind === "bullet" ? BULLET.test(line) : NUMBER.test(line);
}

function shiftLine(
  line: Record<string, CharStyle> | undefined,
  removed: number,
  added: number,
): Record<string, CharStyle> | undefined {
  if (!line) return undefined;
  const next: Record<string, CharStyle> = {};
  for (const [key, style] of Object.entries(line)) {
    const index = Number(key);
    if (!Number.isFinite(index) || index < removed) continue;
    if (!style || typeof style !== "object") continue;
    next[String(index - removed + added)] = { ...style };
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

/**
 * Toggle a bullet or numbered list on every non-empty line.
 * Character styles move with the text when a prefix is added or removed.
 */
export function applyList(
  text: string,
  styles: TextStyles | undefined,
  kind: ListKind,
): { text: string; styles: TextStyles } {
  const lines = text.split("\n");
  const content = lines.filter((line) => stripPrefix(line).text.trim());
  const remove = content.length > 0 && content.every((line) => lineIsKind(line, kind));
  const nextLines: string[] = [];
  const nextStyles: TextStyles = {};
  let number = 1;

  lines.forEach((line, lineIndex) => {
    const stripped = stripPrefix(line);
    const source = styles?.[lineIndex] ?? styles?.[String(lineIndex)];
    if (!stripped.text.trim()) {
      nextLines.push(stripped.text);
      const shifted = shiftLine(source, stripped.removed, 0);
      if (shifted) nextStyles[lineIndex] = shifted;
      return;
    }
    const prefix = remove ? "" : prefixFor(kind, number);
    if (!remove) number += 1;
    nextLines.push(`${prefix}${stripped.text}`);
    const shifted = shiftLine(source, stripped.removed, prefix.length);
    if (shifted) nextStyles[lineIndex] = shifted;
  });

  return { text: nextLines.join("\n"), styles: nextStyles };
}

export function writeFormattedText(
  obj: {
    set: (props: Record<string, unknown>) => void;
    initDimensions?: () => void;
    dirty?: boolean;
    setCoords?: () => void;
  },
  text: string,
  styles: TextStyles,
): void {
  obj.set({ text, styles });
  obj.initDimensions?.();
  obj.dirty = true;
  obj.setCoords?.();
}
