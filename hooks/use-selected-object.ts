import { useCallback } from "react";
import type { FabricObject } from "fabric";
import { useCanvasManager } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";

export function useSelectedObject() {
  const manager = useCanvasManager();
  const selectedObject = useCanvasStore((s) => s.selectedObject);

  const updateSelected = useCallback(
    (updates: Partial<FabricObject>) => manager?.updateActiveObject(updates),
    [manager],
  );

  return { selectedObject, updateSelected };
}
