const TEXT_TYPES = new Set(["text", "i-text", "textbox", "itext"]);

type StyleRange = { start: number; end: number; style: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchSpans(text: string, query: string, matchCase: boolean): { start: number; end: number }[] {
  if (!query) return [];
  const expression = new RegExp(escapeRegExp(query), matchCase ? "g" : "gi");
  const spans: { start: number; end: number }[] = [];
  for (const match of text.matchAll(expression)) {
    if (!match[0] || match.index == null) continue;
    spans.push({ start: match.index, end: match.index + match[0].length });
  }
  return spans;
}

/** Fabric stores serialized styles without counting newline characters. */
function styleIndex(text: string, stringIndex: number): number {
  let newlines = 0;
  const end = Math.min(stringIndex, text.length);
  for (let i = 0; i < end; i++) if (text[i] === "\n") newlines += 1;
  return stringIndex - newlines;
}

function shiftRanges(ranges: StyleRange[], at: number, oldLength: number, newLength: number): StyleRange[] {
  const delta = newLength - oldLength;
  const end = at + oldLength;
  const next: StyleRange[] = [];
  for (const range of ranges) {
    if (range.end <= at) {
      next.push(range);
    } else if (range.start >= end) {
      next.push({ ...range, start: range.start + delta, end: range.end + delta });
    } else if (range.start < at && range.end > end) {
      next.push({ ...range, end: range.end + delta });
    } else if (range.start < at) {
      next.push({ ...range, end: at });
    } else if (range.end > end) {
      next.push({ ...range, start: at + newLength, end: range.end + delta });
    }
  }
  return next.filter((range) => range.end > range.start);
}

function lineOf(text: string, stringIndex: number): { line: number; local: number } {
  let index = 0;
  const lines = text.split("\n");
  for (let line = 0; line < lines.length; line++) {
    const length = lines[line]?.length ?? 0;
    if (stringIndex <= index + length) return { line, local: stringIndex - index };
    index += length + 1;
  }
  return { line: Math.max(0, lines.length - 1), local: 0 };
}

function shiftLineMap(
  styles: Record<string, Record<string, unknown>>,
  text: string,
  span: { start: number; end: number },
  newLength: number,
): Record<string, Record<string, unknown>> {
  const { line, local } = lineOf(text, span.start);
  const lineStyles = styles[line] ?? styles[String(line)];
  if (!lineStyles) return styles;
  const oldLength = span.end - span.start;
  const nextLine: Record<string, unknown> = {};
  for (const [key, style] of Object.entries(lineStyles)) {
    const index = Number(key);
    if (!Number.isFinite(index)) continue;
    if (index >= local && index < local + oldLength) continue;
    const shifted = index < local ? index : index + (newLength - oldLength);
    if (style && typeof style === "object") nextLine[String(shifted)] = { ...(style as object) };
  }
  return { ...styles, [line]: nextLine };
}

/**
 * Replace every occurrence. Serialized style ranges and live per-character
 * styles move with the text when the query stays on one line.
 */
export function replaceInText(
  text: string,
  styles: unknown,
  query: string,
  replacement: string,
  matchCase: boolean,
): { text: string; styles: unknown; count: number } {
  const spans = matchSpans(text, query, matchCase);
  if (spans.length === 0) return { text, styles, count: 0 };

  let next = text;
  let nextStyles = styles;
  const crossesLines = query.includes("\n");
  for (const span of [...spans].reverse()) {
    const original = next;
    next = next.slice(0, span.start) + replacement + next.slice(span.end);
    if (crossesLines) continue;
    if (Array.isArray(nextStyles)) {
      nextStyles = shiftRanges(
        nextStyles as StyleRange[],
        styleIndex(original, span.start),
        styleIndex(original, span.end) - styleIndex(original, span.start),
        replacement.length,
      );
    } else if (isRecord(nextStyles)) {
      nextStyles = shiftLineMap(
        nextStyles as Record<string, Record<string, unknown>>,
        original,
        span,
        replacement.length,
      );
    }
  }

  return { text: next, styles: nextStyles, count: spans.length };
}

function textType(value: Record<string, unknown>): boolean {
  return typeof value.type === "string" && TEXT_TYPES.has(value.type.toLowerCase());
}

function childNodes(value: Record<string, unknown>): unknown[] {
  const nested = value as { getObjects?: () => unknown[]; objects?: unknown[] };
  if (typeof nested.getObjects === "function") return nested.getObjects();
  return Array.isArray(nested.objects) ? nested.objects : [];
}

export function countInTree(nodes: unknown[], query: string, matchCase: boolean): number {
  if (!query) return 0;
  let count = 0;
  const walk = (list: unknown[]) => {
    for (const value of list) {
      if (!isRecord(value)) continue;
      if (textType(value) && typeof value.text === "string") {
        count += matchSpans(value.text, query, matchCase).length;
      }
      walk(childNodes(value));
    }
  };
  walk(nodes);
  return count;
}

export function carouselTextHits(input: {
  slides: { id: number; objects: unknown[] }[];
  query: string;
  matchCase: boolean;
}): { count: number; slides: number[] } {
  const slides: number[] = [];
  let count = 0;
  input.slides.forEach((slide, index) => {
    const found = countInTree(slide.objects, input.query, input.matchCase);
    if (found > 0) {
      count += found;
      slides.push(index + 1);
    }
  });
  return { count, slides };
}

function mapObjects(
  objects: Record<string, unknown>[],
  query: string,
  replacement: string,
  matchCase: boolean,
): { objects: Record<string, unknown>[]; count: number } {
  let count = 0;
  const next = objects.map((object) => {
    const copy: Record<string, unknown> = { ...object };
    if (Array.isArray(object.objects)) {
      const children = mapObjects(object.objects as Record<string, unknown>[], query, replacement, matchCase);
      copy.objects = children.objects;
      count += children.count;
    }
    if (textType(object) && typeof object.text === "string") {
      const replaced = replaceInText(object.text, object.styles, query, replacement, matchCase);
      count += replaced.count;
      if (replaced.count > 0) {
        copy.text = replaced.text;
        if (object.styles != null) copy.styles = replaced.styles;
      }
    }
    return copy;
  });
  return { objects: next, count };
}

export function replaceTextInJSON<T extends { objects?: Record<string, unknown>[] }>(
  json: T,
  query: string,
  replacement: string,
  matchCase: boolean,
): { json: T; count: number } {
  if (!query) return { json, count: 0 };
  const mapped = mapObjects(json.objects ?? [], query, replacement, matchCase);
  if (mapped.count === 0) return { json, count: 0 };
  return { json: { ...json, objects: mapped.objects }, count: mapped.count };
}

type LiveText = {
  type?: string;
  text?: string;
  styles?: unknown;
  getObjects?: () => LiveText[];
  set?: (props: Record<string, unknown>) => void;
  initDimensions?: () => void;
  dirty?: boolean;
  setCoords?: () => void;
};

/** Replace on the open canvas so the current slide matches the saved JSON. */
export function replaceTextOnNodes(
  nodes: LiveText[],
  query: string,
  replacement: string,
  matchCase: boolean,
): number {
  if (!query) return 0;
  let count = 0;
  const walk = (list: LiveText[]) => {
    for (const node of list) {
      const type = (node.type ?? "").toLowerCase();
      if (TEXT_TYPES.has(type) && typeof node.text === "string" && node.set) {
        const replaced = replaceInText(node.text, node.styles, query, replacement, matchCase);
        if (replaced.count > 0) {
          node.set({ text: replaced.text, styles: replaced.styles });
          node.initDimensions?.();
          node.dirty = true;
          node.setCoords?.();
          count += replaced.count;
        }
      }
      if (node.getObjects) walk(node.getObjects());
    }
  };
  walk(nodes);
  return count;
}
