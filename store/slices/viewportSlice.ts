import { StateCreator } from "zustand";
import { RatioKey, CANVAS_RATIOS } from "@/lib/types";

export interface ViewportSlice {
  zoom: number;
  /** Drag the view instead of objects. */
  handActive: boolean;
  currentRatio: RatioKey;
  canvasDimensions: { width: number; height: number };
  /** Split view: show reference image panel beside the canvas */
  isReferenceOpen: boolean;
  referenceImageUrl: string | null;
  /** When on, overflow past slide bounds prompts a new slide */
  autoFlowEnabled: boolean;
  setZoom: (zoom: number) => void;
  setHandActive: (active: boolean) => void;
  toggleHand: () => void;
  setCurrentRatio: (ratio: RatioKey) => void;
  setCanvasDimensions: (dim: { width: number; height: number }) => void;
  setReferenceOpen: (open: boolean) => void;
  toggleReferenceOpen: () => void;
  setReferenceImageUrl: (url: string | null) => void;
  setAutoFlowEnabled: (enabled: boolean) => void;
  toggleAutoFlow: () => void;
}

export const createViewportSlice: StateCreator<ViewportSlice, [], [], ViewportSlice> = (set) => ({
  zoom: 100,
  handActive: false,
  currentRatio: "4:5",
  canvasDimensions: CANVAS_RATIOS["4:5"] || { width: 1080, height: 1350 },
  isReferenceOpen: false,
  referenceImageUrl: null,
  autoFlowEnabled: true,

  setZoom: (zoom) => set({ zoom }),
  setHandActive: (handActive) => set({ handActive }),
  toggleHand: () => set((s) => ({ handActive: !s.handActive })),
  setCurrentRatio: (currentRatio) =>
    set({
      currentRatio,
      canvasDimensions: CANVAS_RATIOS[currentRatio] || { width: 1080, height: 1350 },
    }),
  setCanvasDimensions: (canvasDimensions) => set({ canvasDimensions }),
  setReferenceOpen: (isReferenceOpen) => set({ isReferenceOpen }),
  toggleReferenceOpen: () => set((s) => ({ isReferenceOpen: !s.isReferenceOpen })),
  setReferenceImageUrl: (referenceImageUrl) => set({ referenceImageUrl }),
  setAutoFlowEnabled: (autoFlowEnabled) => set({ autoFlowEnabled }),
  toggleAutoFlow: () => set((s) => ({ autoFlowEnabled: !s.autoFlowEnabled })),
});
