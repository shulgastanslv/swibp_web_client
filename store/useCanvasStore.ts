import { create } from "zustand";
import { SlidesSlice, createSlidesSlice } from "./slices/slidesSlice";
import { ViewportSlice, createViewportSlice } from "./slices/viewportSlice";
import { SettingsSlice, createSettingsSlice } from "./slices/settingsSlice";
import { createEditorSlice, EditorSlice } from "./slices/editorSlice";
import { createProjectSlice, ProjectSlice } from "./slices/projectSlice";
import { createDocumentSlice, DocumentSlice } from "./slices/documentSlice";
import { createGenerateSlice, GenerateSlice } from "./slices/generateSlice";

export type CanvasStoreState = SlidesSlice &
  ViewportSlice &
  SettingsSlice &
  EditorSlice &
  ProjectSlice &
  DocumentSlice &
  GenerateSlice;

export const useCanvasStore = create<CanvasStoreState>()((...a) => ({
  ...createSlidesSlice(...a),
  ...createViewportSlice(...a),
  ...createSettingsSlice(...a),
  ...createEditorSlice(...a),
  ...createProjectSlice(...a),
  ...createDocumentSlice(...a),
  ...createGenerateSlice(...a),
}));
