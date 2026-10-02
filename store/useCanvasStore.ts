import { create } from "zustand";
import { SlidesSlice, createSlidesSlice } from "./slices/slidesSlice";
import { ViewportSlice, createViewportSlice } from "./slices/viewportSlice";
import { SettingsSlice, createSettingsSlice } from "./slices/settingsSlice";
import { createEditorSlice, EditorSlice } from "./slices/editorSlice";
import { createProjectSlice, ProjectSlice } from "./slices/projectSlice";

export type CanvasStoreState = SlidesSlice &
  ViewportSlice &
  SettingsSlice &
  EditorSlice &
  ProjectSlice;

export const useCanvasStore = create<CanvasStoreState>()((...a) => ({
  ...createSlidesSlice(...a),
  ...createViewportSlice(...a),
  ...createSettingsSlice(...a),
  ...createEditorSlice(...a),
  ...createProjectSlice(...a),
}));
