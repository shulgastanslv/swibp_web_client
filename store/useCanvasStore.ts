import { create } from "zustand";
import type { CanvasManager } from "@/lib/canvas/manager";
import {
  type RatioKey,
  type BackgroundConfig,
} from "@/lib/canvas/types";
import type { FabricObject, FabricObjectProps } from "fabric";
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
  [key: string]: unknown;
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

  addSlide: () => void;
  removeSlide: (id: number) => void;
  switchToSlide: (id: number) => Promise<void>;
  updateCurrentSlideJSON: (json: string) => void;
  moveSlide: (direction: "left" | "right") => void;

  currentRatio: RatioKey;
  setCurrentRatio: (ratio: RatioKey) => void;

  canvasDimensions: { width: number; height: number };
  setCanvasDimensions: (dims: { width: number; height: number }) => void;

  selectedObject: FabricObject | null;
  setSelectedObject: (obj: FabricObject | null) => void;

  zoom: number;
  setZoom: (zoom: number) => void;

  isGridVisible: boolean;
  gridSize: number;
  gridColor: string;
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  setGridColor: (color: string) => void;

  connectSelected: () => void;

  isLayoutActive: boolean;
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

  addRectangle: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addRectangle(x, y);
    }
  },

  addCircle: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCircle(x, y);
    }
  },

  addTriangle: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addTriangle(x, y);
    }
  },

  addLine: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addLine(x, y);
    }
  },

  addArrow: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addArrow(x, y);
    }
  },

  addText: (x?: number, y?: number) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addText("New Text", x, y);
    }
  },

  enablePen: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.enableDrawingMode();
    }
  },

  selectTool: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.disableDrawingMode();
    }
  },

  addHeading: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addHeading(undefined, x, y);
    }
  },
  addSubtitle: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addSubtitle(undefined, x, y);
    }
  },
  addParagraph: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addParagraph(undefined, x, y);
    }
  },
  addQuote: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addQuote(undefined, x, y);
    }
  },
  addCodeBlock: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCodeBlock(undefined, x, y);
    }
  },
  addTag: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addTag(undefined, x, y);
    }
  },
  addStarRating: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addStarRating(undefined, x, y);
    }
  },
  addSwipeTag: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addSwipeTag(undefined, x, y);
    }
  },
  addCTAButton: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addCTAButton(undefined, x, y);
    }
  },
  addBadge: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addBadge(undefined, x, y);
    }
  },
  addHandle: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addHandle(undefined, x, y);
    }
  },
  addDividerLine: (x?, y?) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.addDividerLine(x, y);
    }
  },

  slides: [{ id: 1, canvasJSON: null }],
  currentSlideId: 1,
  isLayoutActive: false,

  moveSlide: (direction: "left" | "right") => {
    const { slides, currentSlideId } = get();
    const index = slides.findIndex((s) => s.id === currentSlideId);
    if (index === -1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);

    set({ slides: newSlides });
  },


  applyLayout: (template) => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.applyLayout(template);
      set({ isLayoutActive: true });
    }
  },

  connectSelected: () => {
    const { managerRef } = get();
    if (managerRef) {
      const conn = managerRef.connectSelectedObjects();
      if (!conn) {
        alert(
          "Выберите 2 объекта на холсте с зажатым Shift, чтобы соединить их стрелкой",
        );
      }
    }
  },

  clearLayout: () => {
    const { managerRef } = get();
    if (managerRef) {
      managerRef.clearLayout();
      set({ isLayoutActive: false });
    }
  },

  addSlide: async () => {
    const { managerRef, currentSlideId } = get();

    if (managerRef) {
      const currentJson = managerRef.exportAsJSON();
      let thumb = "";
      try {
        thumb = managerRef
          .getCanvas()
          .toDataURL({ format: "png", multiplier: 0.1 });
      } catch {}

      set((state) => ({
        slides: state.slides.map((s) =>
          s.id === currentSlideId
            ? { ...s, canvasJSON: currentJson, thumbnail: thumb || s.thumbnail }
            : s,
        ),
      }));
    }

    const currentSlides = get().slides;
    const newId =
      currentSlides.length > 0
        ? Math.max(...currentSlides.map((s) => s.id)) + 1
        : 1;

    const newSlide: SlideData = { id: newId, canvasJSON: null };

    set({
      slides: [...currentSlides, newSlide],
      currentSlideId: newId,
      selectedObject: null,
    });

    if (managerRef) {
      managerRef.clear();
      managerRef.setBackground({ type: "solid", color: "#ffffff" });
      managerRef.getCanvas().requestRenderAll();
    }
  },

  removeSlide: async (id: number) => {
    const { slides, currentSlideId } = get();
    if (slides.length <= 1) return; // Не удаляем единственный слайд

    const newSlides = slides.filter((s) => s.id !== id);
    let nextActiveId = currentSlideId;

    if (currentSlideId === id) {
      const deletedIndex = slides.findIndex((s) => s.id === id);
      const nextSlide = newSlides[deletedIndex] || newSlides[deletedIndex - 1];
      nextActiveId = nextSlide.id;
    }

    set({ slides: newSlides });

    if (currentSlideId === id) {
      await get().switchToSlide(nextActiveId);
    }
  },

  switchToSlide: async (id: number) => {
    const { managerRef, slides, currentSlideId } = get();
    if (!managerRef || id === currentSlideId) return;

    // Сохраняем текущий слайд
    const currentJson = managerRef.exportAsJSON();
    let currentThumb = "";
    try {
      currentThumb = managerRef
        .getCanvas()
        .toDataURL({ format: "png", multiplier: 0.1 });
    } catch {}

    const updatedSlides = slides.map((s) =>
      s.id === currentSlideId
        ? {
            ...s,
            canvasJSON: currentJson,
            thumbnail: currentThumb || s.thumbnail,
          }
        : s,
    );

    set({
      slides: updatedSlides,
      currentSlideId: id,
      selectedObject: null,
    });

    const target = updatedSlides.find((s) => s.id === id);
    if (target?.canvasJSON) {
      await managerRef.loadFromJSON(target.canvasJSON);
    } else {
      managerRef.clear();
      managerRef.setBackground({ type: "solid", color: "#ffffff" });
    }
    managerRef.getCanvas().requestRenderAll();
  },

  updateCurrentSlideJSON: (json) => {
    const { currentSlideId } = get();
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === currentSlideId ? { ...s, canvasJSON: json } : s,
      ),
    }));
  },

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
      managerRef.clear();
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
}));
