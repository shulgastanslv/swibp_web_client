import type { FabricObject } from "fabric";
import { CanvasManager } from "./manager";
import { SlidesController, type SlidesState } from "./slides";
import { bindKeyboardShortcuts } from "./shortcuts";

export interface EditorStore {
  getState(): SlidesState & { setSelectedObject: (obj: FabricObject | null) => void };
}

export interface Editor {
  manager: CanvasManager;
  slides: SlidesController;
  dispose: () => void;
}

/** Creates the canvas editor for a `<canvas>` element and wires it to the store. */
export function createEditor(element: HTMLCanvasElement, store: EditorStore): Editor {
  const manager = new CanvasManager(element);
  const slides = new SlidesController(manager, store);

  const unsubscribers = [
    manager.on("change", (state) => {
      const { currentSlideId, updateSlideJSONById } = store.getState();
      updateSlideJSONById(currentSlideId, state);
    }),
    manager.on("selection", (obj) => store.getState().setSelectedObject(obj)),
    bindKeyboardShortcuts(manager),
  ];

  void slides.loadCurrent();

  return {
    manager,
    slides,
    dispose: () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      store.getState().setSelectedObject(null);
      manager.dispose();
    },
  };
}
