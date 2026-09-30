import { FabricCanvasJSON, SlideItem } from "@/lib/types";
import { StateCreator } from "zustand";

export interface SlidesSlice {
  slides: SlideItem[];
  currentSlideId: number;
  setSlides: (slides: SlideItem[]) => void;
  setCurrentSlideId: (id: number) => void;
  /** Inserts an empty slide after `afterId` (or at the end) and returns its id. */
  addSlide: (afterId?: number) => number;
  removeSlide: (id: number) => void;
  moveSlide: (direction: "left" | "right") => void;
  updateSlideJSONById: (id: number, json: FabricCanvasJSON) => void;
  updateSlideThumbnail: (id: number, thumbnail: string) => void;
}

const createEmptyCanvasJSON = (): FabricCanvasJSON => ({
  version: "6.0.0",
  objects: [],
  background: "#ffffff",
});

export const createSlidesSlice: StateCreator<SlidesSlice, [], [], SlidesSlice> = (set, get) => ({
  slides: [{ id: 1, canvasJSON: createEmptyCanvasJSON(), thumbnail: null }],
  currentSlideId: 1,

  setSlides: (slides) => set({ slides }),
  setCurrentSlideId: (id: number) => set({ currentSlideId: id }),

  addSlide: (afterId) => {
    const { slides } = get();
    const newId = Math.max(0, ...slides.map((s) => s.id)) + 1;
    const newSlide: SlideItem = { id: newId, canvasJSON: createEmptyCanvasJSON(), thumbnail: null };

    const afterIndex = slides.findIndex((s) => s.id === afterId);
    const insertAt = afterIndex === -1 ? slides.length : afterIndex + 1;
    set({ slides: [...slides.slice(0, insertAt), newSlide, ...slides.slice(insertAt)] });
    return newId;
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

  updateSlideJSONById: (id: number, json: FabricCanvasJSON) => {
    set({
      slides: get().slides.map((s) =>
        s.id === id ? { ...s, canvasJSON: json, thumbnail: null } : s,
      ),
    });
  },

  updateSlideThumbnail: (id: number, thumbnail: string) => {
    set({
      slides: get().slides.map((s) => (s.id === id ? { ...s, thumbnail } : s)),
    });
  },
});
