import type { CanvasState } from "./types";
import type { SlideItem } from "../types";

/** The part of `CanvasManager` the slide logic depends on. */
export interface SlideCanvas {
  getState(): CanvasState;
  loadState(state: CanvasState | null): Promise<void>;
}

export interface SlidesState {
  slides: SlideItem[];
  currentSlideId: number;
  setCurrentSlideId: (id: number) => void;
  updateSlideJSONById: (id: number, json: CanvasState) => void;
  addSlide: (afterId?: number) => number;
  removeSlide: (id: number) => void;
}

export interface SlidesStore {
  getState(): SlidesState;
}

/**
 * Keeps the single Fabric canvas and the list of slides in the store consistent.
 *
 * Every operation is queued: `loadFromJSON` is async, and two overlapping switches
 * would otherwise save one slide's content into another.
 */
export class SlidesController {
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly canvas: SlideCanvas,
    private readonly store: SlidesStore,
  ) {}

  saveCurrent(): void {
    const { currentSlideId, updateSlideJSONById } = this.store.getState();
    updateSlideJSONById(currentSlideId, this.canvas.getState());
  }

  loadCurrent(): Promise<void> {
    return this.enqueue(() => this.load(this.store.getState().currentSlideId));
  }

  switchTo(id: number): Promise<void> {
    return this.enqueue(() => this.saveAndLoad(id));
  }

  next(): Promise<void> {
    return this.enqueue(() => this.saveAndLoad(this.neighbourId(1)));
  }

  prev(): Promise<void> {
    return this.enqueue(() => this.saveAndLoad(this.neighbourId(-1)));
  }

  add(): Promise<void> {
    return this.enqueue(async () => {
      this.saveCurrent();
      const state = this.store.getState();
      const newId = state.addSlide(state.currentSlideId);
      await this.load(newId);
    });
  }

  remove(id: number): Promise<void> {
    return this.enqueue(async () => {
      const { slides, currentSlideId } = this.store.getState();
      if (slides.length <= 1) return;

      if (id === currentSlideId) {
        const index = slides.findIndex((s) => s.id === id);
        const fallback = slides[index - 1] ?? slides[index + 1];
        // The removed slide's content is intentionally not saved.
        await this.load(fallback.id);
      }
      this.store.getState().removeSlide(id);
    });
  }

  private neighbourId(offset: 1 | -1): number | undefined {
    const { slides, currentSlideId } = this.store.getState();
    const index = slides.findIndex((s) => s.id === currentSlideId);
    return slides[index + offset]?.id;
  }

  private async saveAndLoad(id: number | undefined): Promise<void> {
    const { slides, currentSlideId } = this.store.getState();
    if (id === undefined || id === currentSlideId) return;
    if (!slides.some((s) => s.id === id)) return;

    this.saveCurrent();
    await this.load(id);
  }

  private async load(id: number): Promise<void> {
    const slide = this.store.getState().slides.find((s) => s.id === id);
    if (!slide) return;
    await this.canvas.loadState(slide.canvasJSON ?? null);
    this.store.getState().setCurrentSlideId(id);
  }

  private enqueue(task: () => Promise<void>): Promise<void> {
    const run = this.queue.then(task);
    this.queue = run.catch((error) => {
      console.error("Slide operation failed:", error);
    });
    return run;
  }
}
