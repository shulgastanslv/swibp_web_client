import { FabricObject } from "fabric";
import { StateCreator } from "zustand";

export interface EditorSlice {
  selectedObject: FabricObject | null;
  setSelectedObject: (obj: FabricObject | null) => void;
}

export const createEditorSlice: StateCreator<
  EditorSlice,
  [],
  [],
  EditorSlice
> = (set) => ({
  selectedObject: null,
  setSelectedObject: (selectedObject) => set({ selectedObject }),
});
