import { useEffect, useRef } from "react";
import { CanvasManager } from "@/lib/canvas/manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import {
  BackgroundConfig,
  CANVAS_RATIOS,
  type RatioKey,
} from "@/lib/canvas/types";
import type { FabricObject } from "fabric";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    managerRef,
    setManager,
    setSelectedObject,
    setCanvasDimensions,
    setCurrentRatio,
    currentRatio,
    slides,
    currentSlideId,
    switchToSlide,
    addSlide,
    removeSlide,
    updateCurrentSlideJSON,
    toggleGrid,
    isGridVisible,
    gridSize,
    gridColor,
    setGridSize,
    setGridColor,
    vignette,
    noise,
    blur,
    setVignette,
    setNoise,
    setBlur,
    clearEffects,
    isLayoutActive,
    moveSlide,
    applyLayout,
    clearLayout,
    setBackground,
    addImage,
  } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new CanvasManager(canvasRef.current);
    setManager(manager);

    const canvas = manager.getCanvas();

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      setSelectedObject(activeObj || null);
    };

    const handleAutoSave = () => {
      const json = manager.exportAsJSON();
      updateCurrentSlideJSON(json);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (e.key === "Delete" || e.key === "Backspace") {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== "INPUT" &&
          activeElement?.tagName !== "TEXTAREA"
        ) {
          manager.deleteSelected();
        }
      }

      if (isCtrlOrCmd && e.key === "d") {
        e.preventDefault();
        manager.duplicateSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelection);

    canvas.on("object:modified", handleAutoSave);
    canvas.on("object:added", handleAutoSave);
    canvas.on("object:removed", handleAutoSave);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleSelection);
      canvas.off("object:modified", handleAutoSave);
      canvas.off("object:added", handleAutoSave);
      canvas.off("object:removed", handleAutoSave);
      manager.dispose();
    };
  }, []);

  const handleRatioChange = (ratio: RatioKey) => {
    if (!managerRef) return;
    const { width, height } = CANVAS_RATIOS[ratio];
    managerRef.setRatio(width, height);
    setCanvasDimensions({ width, height });
    setCurrentRatio(ratio);
  };

  const handleUpdateObject = (updates: Partial<FabricObject>) => {
    if (!managerRef) return;
    const canvas = managerRef.getCanvas();
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set(updates);
      canvas.renderAll();
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!managerRef) return;
    const url = URL.createObjectURL(file);
    await managerRef.addImage(url);
    URL.revokeObjectURL(url);
  };

  const handleBackgroundChange = (config: BackgroundConfig) => {
    if (!managerRef) return;
    managerRef.setBackground(config);
  };

  const exportAllSlides = async () => {
    if (!managerRef) return;

    const currentJson = managerRef.exportAsJSON();
    updateCurrentSlideJSON(currentJson);

    const currentSlides = useCanvasStore.getState().slides;

    for (const slide of currentSlides) {
      if (slide.canvasJSON) {
        await managerRef.loadFromJSON(slide.canvasJSON);
        const dataURL = await managerRef.exportAsImage({
          format: "png",
          multiplier: 2,
        });
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `carousel-slide-${slide.id}.png`;
        a.click();
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    await managerRef.loadFromJSON(currentJson);
  };

  const currentIdx = slides.findIndex((s) => s.id === currentSlideId);

  const handlePrev = () => {
    if (currentIdx > 0) {
      switchToSlide(slides[currentIdx - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIdx < slides.length - 1) {
      switchToSlide(slides[currentIdx + 1].id);
    }
  };

  return {
    canvasRef,
    managerRef,
    handleNext,
    handlePrev,
    currentSlideId,
    selectedObject: useCanvasStore((state) => state.selectedObject),
    handleDelete: () => managerRef?.deleteSelected(),
    handleDuplicate: () => managerRef?.duplicateSelected(),
    handleImageUpload,
    currentRatio,
    handleUpdateObject,
    canvasDimensions: useCanvasStore((state) => state.canvasDimensions),
    clearCanvas: () => managerRef?.clear(),
    exportToJSON: () => managerRef?.exportAsJSON() || "",
    handleRatioChange,
    handleBackgroundChange,
    slides,
    currentIdx,
    switchToSlide,
    addSlide,
    removeSlide,
    exportAllSlides,
    isGridVisible,
    toggleGrid,
    gridSize,
    setGridSize,
    gridColor,
    setGridColor,
    vignette,
    setVignette,
    noise,
    setNoise,
    blur,
    setBlur,
    clearEffects,
    isLayoutActive,
    applyLayout,
    clearLayout,
    setCurrentRatio,
    setBackground,
    addImage,
    moveSlide,
  };
}
