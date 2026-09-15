import { useEffect, useRef } from "react";
import { CanvasManager } from "@/lib/canvas/manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import {
  BackgroundConfig,
  CANVAS_RATIOS,
  type RatioKey,
} from "@/lib/canvas/types";
import type { Object as FabricObject } from "fabric";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    managerRef,
    setManager,
    setActiveTool,
    setSelectedObject,
    setCanvasDimensions,
    setCurrentRatio,
    currentRatio,
    activeTool,
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
    applyLayout,
    clearLayout,
    snapThreshold,
    setSnapThreshold,
  } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current || managerRef) return;

    const manager = new CanvasManager(canvasRef.current);
    setManager(manager);

    const canvas = manager.getCanvas();

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      setSelectedObject(activeObj || null);
    };

    const handleAutoSave = () => {
      const json = manager.exportAsJSON();
      const thumbnail = canvas.toDataURL({
        format: "png",
        multiplier: 0.1,
        quality: 0.8,
      });
      updateCurrentSlideJSON(json, thumbnail);
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

  useEffect(() => {
    if (!managerRef) return;
    managerRef.disableDrawingMode();

    switch (activeTool) {
      case "pen":
        managerRef.enableDrawingMode();
        break;
      case "rectangle":
        managerRef.addRectangle();
        break;
      case "circle":
        managerRef.addCircle();
        setActiveTool("select");
        break;
      case "triangle":
        managerRef.addTriangle();
        setActiveTool("select");
        break;
      case "line":
        managerRef.addLine();
        setActiveTool("select");
        break;
      case "arrow":
        managerRef.addArrow();
        setActiveTool("select");
        break;
      case "text":
        managerRef.addText("New Text");
        setActiveTool("select");
        break;
    }
  }, [activeTool, managerRef]);

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
    const currentThumb = managerRef
      .getCanvas()
      .toDataURL({ format: "png", multiplier: 0.1 });
    updateCurrentSlideJSON(currentJson, currentThumb);

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

  return {
    canvasRef,
    managerRef,
    activeTool,
    setActiveTool,
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
    currentSlideId,
    switchToSlide,
    addSlide,
    removeSlide,
    handlePrev: () => {
      const ids = slides.map((s) => s.id);
      const idx = ids.indexOf(currentSlideId);
      if (idx > 0) switchToSlide(ids[idx - 1]);
    },
    handleNext: () => {
      const ids = slides.map((s) => s.id);
      const idx = ids.indexOf(currentSlideId);
      if (idx < ids.length - 1) switchToSlide(ids[idx + 1]);
    },
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
    snapThreshold,
    setSnapThreshold,
  };
}
