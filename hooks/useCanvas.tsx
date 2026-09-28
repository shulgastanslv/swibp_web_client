import { useEffect, useRef } from "react";
import { CanvasManager } from "@/lib/canvas/manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvasManager } from "@/context/canvas-manager";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setManager, manager } = useCanvasManager();

  const updateCurrentSlideJSON = useCanvasStore(
    (s) => s.updateCurrentSlideJSON,
  );
  const slides = useCanvasStore((s) => s.slides);
  const setCurrentSlideId = useCanvasStore((s) => s.setCurrentSlideId);

  useEffect(() => {
    if (!canvasRef.current) return;

    const manager = new CanvasManager(canvasRef.current);
    setManager(manager);

    const canvas = manager.canvas;

    const handleAutoSave = () => {
      const json = manager.io.exportAsJSON();
      updateCurrentSlideJSON(json);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const target = document.activeElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        manager.factory.deleteSelected();
      }

      if (isCtrlOrCmd && e.key === "d") {
        e.preventDefault();
        manager.factory.duplicateSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.on("object:modified", handleAutoSave);
    canvas.on("object:added", handleAutoSave);
    canvas.on("object:removed", handleAutoSave);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.off("object:modified", handleAutoSave);
      canvas.off("object:added", handleAutoSave);
      canvas.off("object:removed", handleAutoSave);
      manager.dispose();
      setManager(null);
    };
  }, [setManager, updateCurrentSlideJSON]);

  const switchToSlide = async (targetId: number) => {
    if (!manager) return;

    // 1. Сохраняем актуальное состояние ТЕКУЩЕГО слайда
    const currentJson = manager.io.exportAsJSON();
    console.log("current: ", currentJson)
    updateCurrentSlideJSON(currentJson);

    // 2. Ищем целевой слайд
    const targetSlide = slides.find((s) => s.id === targetId);
    console.log("targetSlide: ", targetSlide.canvasJSON)

    // 3. Загружаем или очищаем
    if (targetSlide?.canvasJSON) {
      await manager.loadFromJSON(targetSlide.canvasJSON);
    } else {
      manager.clear(); // Внутри должен стоять backgroundColor = "#ffffff"
    }

    setCurrentSlideId(targetId);
  };

  return {
    canvasRef,
    switchToSlide,
  };
}
