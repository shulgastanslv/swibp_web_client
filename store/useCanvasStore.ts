import { create } from "zustand";
import { SlidesSlice, createSlidesSlice } from "./slices/slidesSlice";
import { ViewportSlice, createViewportSlice } from "./slices/viewportSlice";
import { SettingsSlice, createSettingsSlice } from "./slices/settingsSlice";

export type CanvasStoreState = SlidesSlice & ViewportSlice & SettingsSlice;

export const useCanvasStore = create<CanvasStoreState>()((...a) => ({
  ...createSlidesSlice(...a),
  ...createViewportSlice(...a),
  ...createSettingsSlice(...a),
}));
