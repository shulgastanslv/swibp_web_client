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
  updateSlideThumbnail: (id: number, thumbnail: string) => void;
}

export const createSlidesSlice: StateCreator<SlidesSlice, [], [], SlidesSlice> = (set, get) => ({
  slides: [{ id: 1, canvasJSON: null, thumbnail: null }],
  currentSlideId: 1,

  setSlides: (slides) => set({ slides }),
  setCurrentSlideId: (id) => set({ currentSlideId: id }),

  addSlide: () => {
    const { slides } = get();
    const newId = (slides[slides.length - 1]?.id ?? 0) + 1;
    const newSlide: SlideItem = { id: newId, canvasJSON: null, thumbnail: null };
    set({ slides: [...slides, newSlide], currentSlideId: newId });
  },

  removeSlide: (id) => {
    const { slides, currentSlideId } = get();
    if (slides.length <= 1) return;

    const nextSlides = slides.filter((s) => s.id !== id);
    const nextCurrentId = currentSlideId === id ? nextSlides[0].id : currentSlideId;
    set({ slides: nextSlides, currentSlideId: nextCurrentId });
  },

  moveSlide: (direction) => {
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

  updateCurrentSlideJSON: (json) => {
    const { slides, currentSlideId } = get();
    set({
      slides: slides.map((s) => (s.id === currentSlideId ? { ...s, canvasJSON: json } : s)),
    });
  },

  updateSlideThumbnail: (id, thumbnail) => {
    const { slides } = get();
    set({
      slides: slides.map((s) => (s.id === id ? { ...s, thumbnail } : s)),
    });
  },
});
