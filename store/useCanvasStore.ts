import { create } from "zustand";
import type { CanvasManager } from "@/lib/canvas/manager";
import type { RatioKey, ToolType, BackgroundConfig } from "@/lib/canvas/types";
import type { Object as FabricObject } from "fabric";

interface SlideData {
  id: number;
  canvasJSON: string | null;
  thumbnail?: string;
}

interface CanvasState {
  managerRef: CanvasManager | null;
  setManager: (manager: CanvasManager) => void;

  // Slides State
  slides: SlideData[];
  currentSlideId: number;

  // Actions: Slides
  addSlide: () => void;
  removeSlide: (id: number) => void;
  switchToSlide: (id: number) => Promise<void>;
  updateCurrentSlideJSON: (json: string, thumbnail?: string) => void;

  // UI State
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;

  currentRatio: RatioKey;
  setCurrentRatio: (ratio: RatioKey) => void;

  canvasDimensions: { width: number; height: number };
  setCanvasDimensions: (dims: { width: number; height: number }) => void;

  selectedObject: FabricObject | null;
  setSelectedObject: (obj: FabricObject | null) => void;

  isGridVisible: boolean;
  toggleGrid: () => void;

  isPixabayOpen: boolean;
  setIsPixabayOpen: (isOpen: boolean) => void;

  setBackground: (config: BackgroundConfig) => void;
  addImageFromUrl: (url: string) => Promise<void>;
  exportToJSON: () => string;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // --- Initialization ---
  managerRef: null,
  setManager: (manager) => set({ managerRef: manager }),

  // --- Slides ---
  slides: [{ id: 1, canvasJSON: null }],
  currentSlideId: 1,

  addSlide: () => {
    const { slides } = get();
    const newId =
      slides.length > 0 ? Math.max(...slides.map((s) => s.id)) + 1 : 1;
    set((state) => ({
      slides: [...state.slides, { id: newId, canvasJSON: null }],
      currentSlideId: newId,
    }));
  },

  removeSlide: (id) => {
    const { slides, currentSlideId } = get();
    if (slides.length <= 1) return;

    const newSlides = slides.filter((s) => s.id !== id);

    // If we removed the active slide, switch to the previous one or the first one
    let nextActiveId = currentSlideId;
    if (currentSlideId === id) {
      const currentIndex = slides.findIndex((s) => s.id === id);
      const prevSlide = newSlides[currentIndex - 1] || newSlides[0];
      nextActiveId = prevSlide.id;
    }

    set({ slides: newSlides, currentSlideId: nextActiveId });
  },

  switchToSlide: async (id) => {
    const { managerRef, slides, currentSlideId } = get();
    if (!managerRef || id === currentSlideId) return;

    // 1. Save current slide before switching
    const currentJson = managerRef.exportAsJSON();

    // Update state immediately to reflect save
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === currentSlideId ? { ...s, canvasJSON: currentJson } : s,
      ),
      currentSlideId: id, // <-- ID переключается СРАЗУ
    }));

    const targetSlide = slides.find((s) => s.id === id);
    if (targetSlide?.canvasJSON) {
      await managerRef.loadFromJSON(targetSlide.canvasJSON);
    } else {
      // New empty slide
      managerRef.clear();
      managerRef.setBackground({ type: "solid", color: "#ffffff" });
    }
  },

  updateCurrentSlideJSON: (json, thumbnail) => {
    const { currentSlideId } = get();
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === currentSlideId ? { ...s, canvasJSON: json, thumbnail } : s,
      ),
    }));
  },

  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),

  currentRatio: "1:1",
  setCurrentRatio: (ratio) => set({ currentRatio: ratio }),

  canvasDimensions: { width: 1080, height: 1080 },
  setCanvasDimensions: (dims) => set({ canvasDimensions: dims }),

  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  isGridVisible: false,
  toggleGrid: () => {
    const { managerRef, isGridVisible } = get();
    if (managerRef) {
      managerRef.toggleGrid();
      set({ isGridVisible: !isGridVisible });
    }
  },

  setBackground: (config: BackgroundConfig) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.setBackground(config);
    }
  },

  isPixabayOpen: false,
  setIsPixabayOpen: (isOpen) => set({ isPixabayOpen: isOpen }),

  addImageFromUrl: async (url) => {
    const { managerRef } = get();
    if (managerRef) {
      await managerRef.addImage(url);
    }
  },

  exportToJSON: () => {
    const { managerRef } = get();
    return managerRef ? managerRef.exportAsJSON() : "";
  },

  clearCanvas: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.clear();
    }
  },
}));
