import { ActiveSelection, Group, type Canvas, type FabricObject } from "fabric";

/**
 * Fabric 6: take the selection out of its temporary group (that restores
 * canvas coordinates), remove the objects, then build a real group.
 * Returns false when fewer than two objects are selected.
 */
export function groupSelection(canvas: Canvas): boolean {
  const active = canvas.getActiveObject();
  if (!active || active.type !== "activeselection") return false;

  const members = (active as ActiveSelection).getObjects().filter((obj) => !obj.excludeFromExport);
  if (members.length < 2) return false;

  const restored = (active as ActiveSelection).removeAll().filter((obj) => !obj.excludeFromExport);
  canvas.discardActiveObject();
  for (const obj of restored) canvas.remove(obj);

  const group = new Group(restored);
  canvas.add(group);
  canvas.setActiveObject(group);
  return true;
}

/** Break the selected group back into its objects and select them. */
export function ungroupSelection(canvas: Canvas): boolean {
  const active = canvas.getActiveObject();
  if (!active || active.type !== "group") return false;

  const group = active as Group;
  if (group.getObjects().length === 0) return false;

  const restored = group.removeAll();
  canvas.remove(group);
  for (const obj of restored) canvas.add(obj);

  if (restored.length >= 2) {
    canvas.setActiveObject(new ActiveSelection(restored, { canvas }));
  } else if (restored[0]) {
    canvas.setActiveObject(restored[0]);
  }
  return true;
}

export function canUngroup(obj: FabricObject | null | undefined): boolean {
  return obj?.type === "group";
}
