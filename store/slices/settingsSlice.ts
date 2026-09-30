import { StateCreator } from "zustand";
import type { GridStyle } from "@/lib/canvas/grid";

export interface SettingsSlice {
  isGridVisible: boolean;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  gridStyle: GridStyle;
  snapToGrid: boolean;
  vignette: number;
  noise: number;
  blur: number;
  toggleGrid: () => void;
  setGridVisible: (visible: boolean) => void;
  setGridSize: (size: number) => void;
  setGridColor: (color: string) => void;
  setGridOpacity: (opacity: number) => void;
  setGridStyle: (style: GridStyle) => void;
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
  gridSize: 8,
  gridColor: "#9747FF",
  gridOpacity: 0.16,
  gridStyle: "lines",
  snapToGrid: true,
  vignette: 0,
  noise: 0,
  blur: 0,

  toggleGrid: () => set((s) => ({ isGridVisible: !s.isGridVisible })),
  setGridVisible: (isGridVisible) => set({ isGridVisible }),
  setGridSize: (gridSize) => set({ gridSize: Math.max(4, Math.round(gridSize)) }),
  setGridColor: (gridColor) => set({ gridColor }),
  setGridOpacity: (gridOpacity) =>
    set({ gridOpacity: Math.min(1, Math.max(0, gridOpacity)) }),
  setGridStyle: (gridStyle) => set({ gridStyle }),
  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
  setVignette: (vignette) => set({ vignette }),
  setNoise: (noise) => set({ noise }),
  setBlur: (blur) => set({ blur }),
});
