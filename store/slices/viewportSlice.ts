import { StateCreator } from "zustand";
import { RatioKey, CANVAS_RATIOS } from "@/lib/types";

export interface ViewportSlice {
  zoom: number;
  currentRatio: RatioKey;
  canvasDimensions: { width: number; height: number };
  setZoom: (zoom: number) => void;
  setCurrentRatio: (ratio: RatioKey) => void;
  setCanvasDimensions: (dim: { width: number; height: number }) => void;
}

export const createViewportSlice: StateCreator<ViewportSlice, [], [], ViewportSlice> = (set) => ({
  zoom: 100,
  currentRatio: "4:5",
  canvasDimensions: CANVAS_RATIOS["4:5"] || { width: 1080, height: 1350 },

  setZoom: (zoom) => set({ zoom }),
  setCurrentRatio: (currentRatio) =>
    set({
      currentRatio,
      canvasDimensions: CANVAS_RATIOS[currentRatio] || { width: 1080, height: 1350 },
    }),
  setCanvasDimensions: (canvasDimensions) => set({ canvasDimensions }),
});
