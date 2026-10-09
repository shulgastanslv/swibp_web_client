import { useEffect, useMemo, useState } from "react";
import type { FabricObject } from "fabric";
import { useCanvasManager } from "@/context/canvas-manager";

/** User-visible objects of the current slide, re-read on every document change. */
export function useCanvasObjects(): FabricObject[] {
  const manager = useCanvasManager();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!manager) return;
    const bump = () => setVersion((v) => v + 1);
    const unsubscribers = [manager.on("change", bump), manager.on("load", bump)];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [manager]);

  return useMemo(() => {
    if (!manager) return [];
    return manager.canvas
      .getObjects()
      .filter((o) => o.selectable !== false && !o.excludeFromExport);
    // `version` invalidates the memo: Fabric mutates its objects array in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, version]);
}
