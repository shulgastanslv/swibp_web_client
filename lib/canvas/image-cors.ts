function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function visit(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(visit);
  if (!isRecord(value)) return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) next[key] = visit(child);

  if (typeof next.src === "string" && /^https?:\/\//i.test(next.src)) {
    next.crossOrigin = "anonymous";
  }
  return next;
}

/** Remote images need CORS or `canvas.toDataURL` throws SecurityError. */
export function withRemoteImageCors<T>(value: T): T {
  return visit(value) as T;
}
