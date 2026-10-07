import {
  ActiveSelection,
  classRegistry,
  FitContentLayout,
  Group,
  LayoutManager,
  type Canvas,
  type FabricObject,
  type StrictLayoutContext,
} from "fabric";

/**
 * Fit-content still refits when members are added, removed, or released.
 * It stays quiet while a member is mid-drag: Fabric's default strategy shifts
 * every child on each `moving` frame and the dragged object jumps.
 */
class QuietGroupLayout extends FitContentLayout {
  override shouldPerformLayout(context: StrictLayoutContext) {
    return context.type !== "object_modifying";
  }
}

Object.assign(QuietGroupLayout, { type: "swibp-quiet-group" });
classRegistry.setClass(QuietGroupLayout);

function quietLayout() {
  return new LayoutManager(new QuietGroupLayout());
}

function strategyType(group: Group) {
  return (group.layoutManager?.strategy?.constructor as { type?: string } | undefined)?.type;
}

/** Let members of a user group be dragged. Preset graphics stay one piece. */
export function stabilizeGroup(group: Group) {
  const node = group as FabricObject & { swibpRole?: string; swibpIcon?: boolean };
  if (!node.swibpRole && !node.swibpIcon) {
    group.interactive = true;
    group.subTargetCheck = true;
  }
  const manager = group.layoutManager;
  if (!manager) return;
  const type = strategyType(group);
  if (!type || type === "fit-content") manager.strategy = new QuietGroupLayout();
}

export function stabilizeGroups(objects: FabricObject[]) {
  for (const obj of objects) {
    if (obj.type !== "group") continue;
    const group = obj as Group;
    stabilizeGroup(group);
    stabilizeGroups(group.getObjects());
  }
}

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

  const group = new Group(restored, {
    interactive: true,
    subTargetCheck: true,
    layoutManager: quietLayout(),
  });
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
