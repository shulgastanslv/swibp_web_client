  import { create } from "zustand";
  import type { CanvasManager } from "@/lib/canvas/manager";
  import type { RatioKey, ToolType, BackgroundConfig } from "@/lib/canvas/types";
  import type { Object as FabricObject } from "fabric";
  import { LayoutTemplate } from "@/lib/canvas/layouts";

  interface SlideData {
    id: number;
    canvasJSON: string | null;
    thumbnail?: string;
  }

  interface CanvasState {
    managerRef: CanvasManager | null;
    setManager: (manager: CanvasManager) => void;

    slides: SlideData[];
    currentSlideId: number;

    addSlide: () => void;
    removeSlide: (id: number) => void;
    switchToSlide: (id: number) => Promise<void>;
    updateCurrentSlideJSON: (json: string, thumbnail?: string) => void;

    activeTool: ToolType;
    setActiveTool: (tool: ToolType) => void;

    currentRatio: RatioKey;
    setCurrentRatio: (ratio: RatioKey) => void;

    canvasDimensions: { width: number; height: number };
    setCanvasDimensions: (dims: { width: number; height: number }) => void;

    selectedObject: FabricObject | null;
    objectRevision: number;
    incrementObjectRevision: () => void;
    setSelectedObject: (obj: FabricObject | null) => void;

    isGridVisible: boolean;
    gridSize: number;
    gridColor: string;
    toggleGrid: () => void;
    setGridSize: (size: number) => void;
    setGridColor: (color: string) => void;

    isLayoutActive: boolean;
    snapThreshold: number;
    setSnapThreshold: (threshold: number) => void;
    applyLayout: (template: LayoutTemplate) => void;
    clearLayout: () => void;

    setBackground: (config: BackgroundConfig) => void;
    addImage: (url: string) => Promise<void>;
    exportToJSON: () => string;
    clearCanvas: () => void;
    vignette: number;
    noise: number;
    blur: number;
    setVignette: (value: number) => void;
    setNoise: (value: number) => void;
    setBlur: (value: number) => void;
    clearEffects: () => void;

    addRectangle: () => void;
    addCircle: () => void;
    addTriangle: () => void;
    addLine: () => void;
    addArrow: () => void;
    addText: () => void;
    enablePen: () => void;
    selectTool: () => void;
  }

export const useCanvasStore = create<CanvasState>((set, get) => ({
  managerRef: null,
  setManager: (manager) => set({ managerRef: manager }),

  addRectangle: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addRectangle();
      set({ activeTool: "select" });
    }
  },

  addCircle: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCircle();
      set({ activeTool: "select" });
    }
  },

  addTriangle: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addTriangle();
      set({ activeTool: "select" });
    }
  },

  addLine: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addLine();
      set({ activeTool: "select" });
    }
  },

  addArrow: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addArrow();
      set({ activeTool: "select" });
    }
  },

  addText: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addText("New Text");
      set({ activeTool: "select" });
    }
  },

  enablePen: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.enableDrawingMode();
      set({ activeTool: "pen" });
    }
  },

  selectTool: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.disableDrawingMode();
      set({ activeTool: "select" });
    }
  },

  slides: [{ id: 1, canvasJSON: null }],
  currentSlideId: 1,
  isLayoutActive: false,
  snapThreshold: 5,
  setSnapThreshold: (threshold) => {
    const { managerRef } = get();
    if (managerRef) {
      // Можно добавить метод в GridManager для изменения порога
      // managerRef.setSnapThreshold(threshold);
    }
    set({ snapThreshold: threshold });
  },
  applyLayout: (template) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.applyLayout(template);
      set({ isLayoutActive: true });
    }
  },

  clearLayout: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.clearLayout();
      set({ isLayoutActive: false });
    }
  },
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
  gridSize: 50,
  gridColor: "rgba(128,128,128,0.15)",

  toggleGrid: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.toggleGrid();
      set({ isGridVisible: !!managerRef.isGridEnabled() });
    }
  },

  setGridSize: (size) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.setGridSize(size);
    }
    set({ gridSize: size });
  },

  setGridColor: (color) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.setGridColor(color);
    }
    set({ gridColor: color });
  },

  setBackground: (config: BackgroundConfig) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.setBackground(config);
    }
  },

  addImage: async (url) => {
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
  vignette: 0,
  noise: 0,
  blur: 0,

  setVignette: (value) => {
    const { managerRef } = get();
    if (managerRef) managerRef.setVignette(value);
    set({ vignette: value });
  },

  setNoise: (value) => {
    const { managerRef } = get();
    if (managerRef) managerRef.setNoise(value);
    set({ noise: value });
  },

  setBlur: (value) => {
    const { managerRef } = get();
    if (managerRef) managerRef.setBlur(value);
    set({ blur: value });
  },

  clearEffects: () => {
    const { managerRef } = get();
    if (managerRef) managerRef.clearEffects();
    set({ vignette: 0, noise: 0, blur: 0 });
  },
  objectRevision: 0,
  incrementObjectRevision: () => set((state) => ({ objectRevision: state.objectRevision + 1 })),
  }));
