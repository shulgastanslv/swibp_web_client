import { FabricCanvasJSON, SlideItem } from "@/lib/types";
import { StateCreator } from "zustand";

export interface SlidesSlice {
  slides: SlideItem[];
  currentSlideId: number;
  setSlides: (slides: SlideItem[]) => void;
  setCurrentSlideId: (id: number) => void;
  addSlide: () => void;
  removeSlide: (id: number) => void;
  moveSlide: (direction: "left" | "right") => void;
  updateCurrentSlideJSON: (json: FabricCanvasJSON) => void;
  updateSlideJSONById: (id: number, json: FabricCanvasJSON) => void;
  updateSlideThumbnail: (id: number, thumbnail: string) => void;
}

const DEFAULT_CANVAS_JSON: FabricCanvasJSON = {
  version: "6.0.0",
  objects: [],
  background: "#ffffff",
};

export const createSlidesSlice: StateCreator<SlidesSlice, [], [], SlidesSlice> = (set, get) => ({
  slides: [{ id: 1, canvasJSON: DEFAULT_CANVAS_JSON, thumbnail: null }],
  currentSlideId: 1,

  setSlides: (slides) => set({ slides }),
  setCurrentSlideId: (id: number) => set({ currentSlideId: id }),

  addSlide: () => {
    const { slides } = get();
    const newId = (slides[slides.length - 1]?.id ?? 0) + 1;
    const newSlide: SlideItem = {
      id: newId,
      canvasJSON: { ...DEFAULT_CANVAS_JSON, objects: [] },
      thumbnail: null,
    };
    set({ slides: [...slides, newSlide] });
  },

  removeSlide: (id: number) => {
    const { slides, currentSlideId } = get();
    if (slides.length <= 1) return;

    const nextSlides = slides.filter((s) => s.id !== id);
    const nextCurrentId = currentSlideId === id ? nextSlides[0].id : currentSlideId;
    set({ slides: nextSlides, currentSlideId: nextCurrentId });
  },

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

  updateCurrentSlideJSON: (json: FabricCanvasJSON) => {
    const { slides, currentSlideId } = get();
    set({
      slides: slides.map((s) => (s.id === currentSlideId ? { ...s, canvasJSON: json } : s)),
    });
  },

  // Точечное сохранение по ID предотвращает перезапись чужих слайдов
  updateSlideJSONById: (id: number, json: FabricCanvasJSON) => {
    const { slides } = get();
    set({
      slides: slides.map((s) => (s.id === id ? { ...s, canvasJSON: json } : s)),
    });
  },

  updateSlideThumbnail: (id: number, thumbnail: string) => {
    const { slides } = get();
    set({
      slides: slides.map((s) => (s.id === id ? { ...s, thumbnail } : s)),
    });
  },
});
