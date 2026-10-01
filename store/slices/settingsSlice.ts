import { StateCreator } from "zustand";

export interface SettingsSlice {
  isGridVisible: boolean;
  gridColumns: number;
  gridRows: number;
  gridMargin: number;
  gridColor: string;
  gridOpacity: number;
  snapToGrid: boolean;
  vignette: number;
  noise: number;
  blur: number;
  toggleGrid: () => void;
  setGridVisible: (visible: boolean) => void;
  setGridColumns: (columns: number) => void;
  setGridRows: (rows: number) => void;
  setGridMargin: (margin: number) => void;
  setGridColor: (color: string) => void;
  setGridOpacity: (opacity: number) => void;
  setSnapToGrid: (enabled: boolean) => void;
  setVignette: (vignette: number) => void;
  setNoise: (noise: number) => void;
  setBlur: (blur: number) => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  isGridVisible: false,
  gridColumns: 4,
  gridRows: 4,
  gridMargin: 64,
  gridColor: "#9747FF",
  gridOpacity: 0.16,
  snapToGrid: true,
  vignette: 0,
  noise: 0,
  blur: 0,

  toggleGrid: () => set((s) => ({ isGridVisible: !s.isGridVisible })),
  setGridVisible: (isGridVisible) => set({ isGridVisible }),
  setGridColumns: (gridColumns) =>
    set({ gridColumns: Math.max(0, Math.min(24, Math.round(gridColumns))) }),
  setGridRows: (gridRows) =>
    set({ gridRows: Math.max(0, Math.min(24, Math.round(gridRows))) }),
  setGridMargin: (gridMargin) =>
    set({ gridMargin: Math.max(0, Math.round(gridMargin)) }),
  setGridColor: (gridColor) => set({ gridColor }),
  setGridOpacity: (gridOpacity) =>
    set({ gridOpacity: Math.min(1, Math.max(0, gridOpacity)) }),
  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
  setVignette: (vignette) => set({ vignette }),
  setNoise: (noise) => set({ noise }),
  setBlur: (blur) => set({ blur }),
});
