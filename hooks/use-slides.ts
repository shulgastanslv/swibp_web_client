import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";

export function useSlides() {
  const controller = useSlidesController();
  const slides = useCanvasStore((s) => s.slides);
  const currentSlideId = useCanvasStore((s) => s.currentSlideId);
  const move = useCanvasStore((s) => s.moveSlide);
  const reorder = useCanvasStore((s) => s.reorderSlides);

  const currentIndex = slides.findIndex((s) => s.id === currentSlideId);

  return {
    slides,
    currentSlideId,
    currentIndex,
    canGoPrev: currentIndex > 0,
    canGoNext: currentIndex < slides.length - 1,
    canRemove: slides.length > 1,
    switchTo: (id: number) => controller?.switchTo(id),
    next: () => controller?.next(),
    prev: () => controller?.prev(),
    add: () => controller?.add(),
    duplicate: (id?: number) => controller?.duplicate(id),
    remove: (id: number) => controller?.remove(id),
    move,
    reorder,
  };
}
