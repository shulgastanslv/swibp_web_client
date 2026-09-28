import { StateCreator } from "zustand";

export interface SettingsSlice {
  isGridVisible: boolean;
  gridSize: number;
  gridColor: string;
  vignette: number;
  noise: number;
  blur: number;
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  setGridColor: (color: string) => void;
  setVignette: (vignette: number) => void;
  setNoise: (noise: number) => void;
  setBlur: (blur: number) => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  isGridVisible: false,
  gridSize: 20,
  gridColor: "#00000020",
  vignette: 0,
  noise: 0,
  blur: 0,

  toggleGrid: () => set((s) => ({ isGridVisible: !s.isGridVisible })),
  setGridSize: (gridSize) => set({ gridSize }),
  setGridColor: (gridColor) => set({ gridColor }),
  setVignette: (vignette) => set({ vignette }),
  setNoise: (noise) => set({ noise }),
  setBlur: (blur) => set({ blur }),
});
