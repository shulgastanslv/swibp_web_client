import { applyFontToSlide, TEXT_STYLES } from "@/lib/canvas/document";
import { applyFontOnCanvas } from "@/lib/canvas/paint-live";
import { chromeTemplatesFrom } from "@/lib/canvas/chrome";
import type { CanvasManager } from "@/lib/canvas/manager";
import { normalizeFontFamily } from "@/lib/fonts/google-fonts";
import { useCanvasStore } from "@/store/useCanvasStore";

/** Sets one typeface on every text object of every slide, and on new text styles. */
export function applyCarouselFont(family: string, manager: CanvasManager | null) {
  const fontFamily = normalizeFontFamily(family);

  for (const style of TEXT_STYLES) {
    const current = useCanvasStore.getState().textStyles[style.id];
    useCanvasStore.getState().setTextStyle(style.id, { ...current, fontFamily });
  }

  const store = useCanvasStore.getState();
  store.setSlides(
    store.slides.map((slide) => ({
      ...slide,
      canvasJSON: applyFontToSlide(slide.canvasJSON, fontFamily),
    })),
  );

  if (manager) {
    applyFontOnCanvas(manager.canvas, fontFamily);
    useCanvasStore.getState().setChrome(chromeTemplatesFrom(manager.getState()));
    manager.commit();
  }

  useCanvasStore.getState().setDirty(true);
}
