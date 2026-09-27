import { create } from "zustand";
import type { CanvasManager } from "@/lib/canvas/manager";
import { type RatioKey, type ToolType, type BackgroundConfig, CANVAS_RATIOS } from "@/lib/canvas/types";
import type { Object as FabricObject, FabricObjectProps } from "fabric";
import { LayoutTemplate } from "@/lib/canvas/layouts";

interface SlideData {
  id: number;
  canvasJSON: string | null;
  thumbnail?: string;
}

export interface SerializedCanvasData {
  version?: string;
  objects: FabricObjectProps[];
  background?: string;
  clipPath?: FabricObjectProps;
  [key: string]: unknown; // строгий безопасный fallback вместо any
}

export interface SlideEntity {
  id: string;
  order: number;
  canvasJSON: unknown;
  thumbnail?: string | null;
  projectId?: string;
}

export interface Project {
  id: string;
  title: string;
  aspectRatio: string;
  width: number;
  height: number;
  isPublic?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  userId: string;
  slides?: SlideEntity[];
}

interface CanvasState {
  managerRef: CanvasManager | null;
  setManager: (manager: CanvasManager) => void;

  slides: SlideData[];
  currentSlideId: number;

  currentProjectId: string | null;
  projectName: string;
  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  loadProjectState: (project: Project) => Promise<void>;

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

  zoom: number;
  setZoom: (zoom: number) => void;

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
  applyTemplatePreset: (json: string) => Promise<void>;
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

  addRectangle: (x?: number, y?: number) => void;
  addCircle: (x?: number, y?: number) => void;
  addTriangle: (x?: number, y?: number) => void;
  addLine: (x?: number, y?: number) => void;
  addArrow: (x?: number, y?: number) => void;
  addText: (x?: number, y?: number) => void;
  enablePen: () => void;
  selectTool: () => void;

  addHeading: (x?: number, y?: number) => void;
  addSubtitle: (x?: number, y?: number) => void;
  addParagraph: (x?: number, y?: number) => void;
  addQuote: (x?: number, y?: number) => void;
  addCodeBlock: (x?: number, y?: number) => void;
  addTag: (x?: number, y?: number) => void;
  addStarRating: (x?: number, y?: number) => void;
  addSwipeTag: (x?: number, y?: number) => void;
  addCTAButton: (x?: number, y?: number) => void;
  addBadge: (x?: number, y?: number) => void;
  addHandle: (x?: number, y?: number) => void;
  addDividerLine: (x?: number, y?: number) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  managerRef: null,
  setManager: (manager) => set({ managerRef: manager }),
  currentProjectId: null,
  projectName: "Untitled Carousel",
  setProjectId: (id) => set({ currentProjectId: id }),
  setProjectName: (name) => set({ projectName: name }),

  loadProjectState: async (project: Project) => {
    const { managerRef, incrementObjectRevision } = get();
    if (!project) return;

    const rawSlides = Array.isArray(project.slides) ? project.slides : [];
    const mappedSlides: SlideData[] = rawSlides.map((s, idx) => {
      let jsonString: string | null = null;
      if (typeof s.canvasJSON === "string") {
        jsonString = s.canvasJSON;
      } else if (s.canvasJSON !== null && s.canvasJSON !== undefined) {
        jsonString = JSON.stringify(s.canvasJSON);
      }

      return {
        id: idx + 1,
        dbId: s.id,
        canvasJSON: jsonString,
        thumbnail: s.thumbnail ?? undefined,
      };
    });

    const finalSlides: SlideData[] =
      mappedSlides.length > 0 ? mappedSlides : [{ id: 1, canvasJSON: null }];

    const targetRatio = (project.aspectRatio as RatioKey) || "1:1";
    const dims = CANVAS_RATIOS[targetRatio] || {
      width: project.width || 1080,
      height: project.height || 1080,
    };

    set({
      currentProjectId: project.id,
      projectName: project.title || "Untitled Carousel",
      currentRatio: targetRatio,
      canvasDimensions: dims,
      slides: finalSlides,
      currentSlideId: 1,
    });

    if (managerRef) {
      managerRef.setRatio(dims.width, dims.height);
      if (finalSlides[0]?.canvasJSON) {
        await managerRef.loadFromJSON(finalSlides[0].canvasJSON);
      } else {
        managerRef.clear();
        managerRef.setBackground({ type: "solid", color: "#ffffff" });
      }
    }

    incrementObjectRevision();
  },

  applyTemplatePreset: async (json) => {
    const { managerRef, updateCurrentSlideJSON, incrementObjectRevision } =
      get();
    if (!managerRef) return;

    await managerRef.loadFromJSON(json);

    const canvas = managerRef.getCanvas();
    const thumb = canvas.toDataURL({ format: "png", multiplier: 0.2 });

    updateCurrentSlideJSON(json, thumb);
    incrementObjectRevision();
  },

  addRectangle: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addRectangle(x, y);
      set({ activeTool: "select" });
    }
  },

  addCircle: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCircle(x, y);
      set({ activeTool: "select" });
    }
  },

  addTriangle: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addTriangle(x, y);
      set({ activeTool: "select" });
    }
  },

  addLine: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addLine(x, y);
      set({ activeTool: "select" });
    }
  },

  addArrow: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addArrow(x, y);
      set({ activeTool: "select" });
    }
  },

  addText: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addText("New Text", x, y);
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

  addHeading: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addHeading(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addSubtitle: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addSubtitle(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addParagraph: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addParagraph(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addQuote: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addQuote(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addCodeBlock: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCodeBlock(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addTag: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addTag(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addStarRating: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addStarRating(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addSwipeTag: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addSwipeTag(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addCTAButton: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCTAButton(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addBadge: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addBadge(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addHandle: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addHandle(undefined, x, y);
      set({ activeTool: "select" });
    }
  },
  addDividerLine: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addDividerLine(x, y);
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

  zoom: 100,
  setZoom: (zoom) => set({ zoom }),

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
  incrementObjectRevision: () =>
    set((state) => ({ objectRevision: state.objectRevision + 1 })),
}));
