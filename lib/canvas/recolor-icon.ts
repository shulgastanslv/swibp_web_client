type Paintable = {
  type?: string;
  fill?: unknown;
  stroke?: unknown;
  strokeWidth?: number;
  swibpSlot?: string;
  set?: (props: Record<string, unknown>) => void;
  getObjects?: () => Paintable[];
};

const FILLABLE = new Set([
  "path",
  "polygon",
  "polyline",
  "rect",
  "circle",
  "ellipse",
  "triangle",
  "line",
]);

function write(object: Paintable, props: Record<string, unknown>): void {
  if (object.set) object.set(props);
  else Object.assign(object, props);
}

function applyFill(object: Paintable, fill: string, slot?: string): void {
  const type = (object.type ?? "").toLowerCase();
  if (!FILLABLE.has(type)) return;

  const current = object.fill;
  const hasFill =
    typeof current !== "string" ||
    (current !== "none" && current !== "transparent" && current !== "");
  const patch: Record<string, unknown> = {};
  if (hasFill) patch.fill = fill;
  else if ((object.strokeWidth ?? 0) > 0) patch.stroke = fill;
  else patch.fill = fill;
  if (slot !== undefined) patch.swibpSlot = slot;
  write(object, patch);
}

/** Paint every shape inside an icon. The group itself stays unfilled so it does not become a solid box. */
export function recolorIcon(object: Paintable, fill: string, slot?: string): void {
  const children = object.getObjects?.() ?? [];
  if (children.length > 0) {
    write(object, { swibpSlot: "" });
    for (const child of children) recolorIcon(child, fill, slot);
    return;
  }
  applyFill(object, fill, slot);
}

/** First solid fill in the icon, for the color field. */
export function iconFill(object: Paintable): string | null {
  const children = object.getObjects?.() ?? [];
  if (children.length === 0) {
    return typeof object.fill === "string" ? object.fill : null;
  }
  for (const child of children) {
    const found = iconFill(child);
    if (found && found !== "none" && found !== "transparent") return found;
  }
  return null;
}
