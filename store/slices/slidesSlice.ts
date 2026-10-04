import { FabricCanvasJSON, SlideItem } from "@/lib/types";
import { applyChrome, type ChromeTemplate } from "@/lib/canvas/chrome";
import { StateCreator } from "zustand";

export interface SlidesSlice {
  slides: SlideItem[];
  currentSlideId: number;
  setSlides: (slides: SlideItem[]) => void;
  setCurrentSlideId: (id: number) => void;
  /** Inserts an empty slide after `afterId` (or at the end) and returns its id. */
  addSlide: (afterId?: number) => number;
  /** Clones `id` (or current) and inserts the copy after it. Returns the new id, or null. */
  duplicateSlide: (id?: number) => number | null;
  removeSlide: (id: number) => void;
  moveSlide: (direction: "left" | "right") => void;
  /** Moves `activeId` to the index currently occupied by `overId`. */
  reorderSlides: (activeId: number, overId: number) => void;
  updateSlideJSONById: (id: number, json: FabricCanvasJSON) => void;
  updateSlideThumbnail: (id: number, thumbnail: string) => void;
}

const createEmptyCanvasJSON = (): FabricCanvasJSON => ({
  version: "6.0.0",
  objects: [],
  background: "#ffffff",
});

type SlidesStore = SlidesSlice & {
  setDirty?: (dirty: boolean) => void;
  chrome?: ChromeTemplate[];
};

function stampChrome(chrome: ChromeTemplate[] | undefined, slides: SlideItem[]): SlideItem[] {
  if (!chrome?.length) return slides;
  return slides.map((slide, index) => ({
    ...slide,
    canvasJSON: applyChrome(slide.canvasJSON, chrome, index, slides.length),
  }));
}

export const createSlidesSlice: StateCreator<SlidesStore, [], [], SlidesSlice> = (set, get) => {
  const markDirty = () => get().setDirty?.(true);

  return {
    slides: [{ id: 1, canvasJSON: createEmptyCanvasJSON(), thumbnail: null }],
    currentSlideId: 1,

    setSlides: (slides) => set({ slides }),
    setCurrentSlideId: (id: number) => set({ currentSlideId: id }),

    addSlide: (afterId) => {
      const { slides } = get();
      const newId = Math.max(0, ...slides.map((s) => s.id)) + 1;
      const newSlide: SlideItem = {
        id: newId,
        canvasJSON: createEmptyCanvasJSON(),
        thumbnail: null,
      };

      const afterIndex = slides.findIndex((s) => s.id === afterId);
      const insertAt = afterIndex === -1 ? slides.length : afterIndex + 1;
      const next = [...slides.slice(0, insertAt), newSlide, ...slides.slice(insertAt)];
      set({ slides: stampChrome(get().chrome, next) });
      markDirty();
      return newId;
    },

    duplicateSlide: (id) => {
      const { slides, currentSlideId } = get();
      const sourceId = id ?? currentSlideId;
      const sourceIndex = slides.findIndex((s) => s.id === sourceId);
      if (sourceIndex === -1) return null;

      const source = slides[sourceIndex]!;
      const newId = Math.max(0, ...slides.map((s) => s.id)) + 1;
      const newSlide: SlideItem = {
        id: newId,
        canvasJSON: structuredClone(source.canvasJSON),
        thumbnail: source.thumbnail ?? null,
      };

      const insertAt = sourceIndex + 1;
      const next = [...slides.slice(0, insertAt), newSlide, ...slides.slice(insertAt)];
      set({ slides: stampChrome(get().chrome, next) });
      markDirty();
      return newId;
    },

    removeSlide: (id: number) => {
      const { slides, currentSlideId } = get();
      if (slides.length <= 1) return;

      const nextSlides = slides.filter((s) => s.id !== id);
      const nextCurrentId = currentSlideId === id ? nextSlides[0].id : currentSlideId;
      set({ slides: stampChrome(get().chrome, nextSlides), currentSlideId: nextCurrentId });
      markDirty();
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

      set({ slides: stampChrome(get().chrome, newSlides) });
      markDirty();
    },

    reorderSlides: (activeId, overId) => {
      const { slides } = get();
      const from = slides.findIndex((s) => s.id === activeId);
      const to = slides.findIndex((s) => s.id === overId);
      if (from < 0 || to < 0 || from === to) return;

      const next = [...slides];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      set({ slides: stampChrome(get().chrome, next) });
      markDirty();
    },

    updateSlideJSONById: (id: number, json: FabricCanvasJSON) => {
      set({
        slides: get().slides.map((s) => (s.id === id ? { ...s, canvasJSON: json } : s)),
      });
      markDirty();
    },

    updateSlideThumbnail: (id: number, thumbnail: string) => {
      set({
        slides: get().slides.map((s) => (s.id === id ? { ...s, thumbnail } : s)),
      });
    },
  };
};
