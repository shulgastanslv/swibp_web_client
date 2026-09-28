import { useCallback, useEffect, useRef } from "react";
import { CanvasManager } from "@/lib/canvas/manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvasManager } from "@/context/canvas-manager";
import { FabricObject } from "fabric";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setManager, manager } = useCanvasManager();

  const selectedObject = useCanvasStore((s) => s.selectedObject);
  const setSelectedObject = useCanvasStore((s) => s.setSelectedObject);

  // Флаг для подавления автосохранения во время программной смены слайда
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasManager = new CanvasManager(canvasRef.current);
    setManager(canvasManager);

    const canvas = canvasManager.canvas;

    // Первичная инициализация текущего слайда при монтировании
    const initialSlide = useCanvasStore.getState().slides.find(
      (s) => s.id === useCanvasStore.getState().currentSlideId
    );
    if (initialSlide?.canvasJSON) {
      isTransitioningRef.current = true;
      canvasManager.loadFromJSON(initialSlide.canvasJSON).finally(() => {
        isTransitioningRef.current = false;
      });
    }

    const handleSelection = () => {
      if (isTransitioningRef.current) return;
      const active = canvas.getActiveObject();
      setSelectedObject(active ?? null);
    };

    const handleClearSelection = () => {
      if (isTransitioningRef.current) return;
      setSelectedObject(null);
    };

    const handleAutoSave = () => {
      // Игнорируем события сброса и загрузки объектов при смене слайда
      if (isTransitioningRef.current) return;

      const currentId = useCanvasStore.getState().currentSlideId;
      const json = canvasManager.io.exportAsJSON();
      useCanvasStore.getState().updateSlideJSONById(currentId, json);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const target = document.activeElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        canvasManager.factory.deleteSelected();
      }

      if (isCtrlOrCmd && e.key === "d") {
        e.preventDefault();
        canvasManager.factory.duplicateSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.on("object:modified", handleAutoSave);
    canvas.on("object:added", handleAutoSave);
    canvas.on("object:removed", handleAutoSave);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleClearSelection);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.off("object:modified", handleAutoSave);
      canvas.off("object:added", handleAutoSave);
      canvas.off("object:removed", handleAutoSave);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleClearSelection);
      canvasManager.dispose();
      setManager(null);
      setSelectedObject(null);
    };
  }, [setManager, setSelectedObject]);

  const switchToSlide = async (targetId: number) => {
    if (!manager) return;

    const state = useCanvasStore.getState();
    const currentId = state.currentSlideId;

    if (currentId === targetId) return;

    // 1. Сохраняем состояние текущего слайда строго по его ID
    const currentJson = manager.io.exportAsJSON();
    state.updateSlideJSONById(currentId, currentJson);

    // 2. Блокируем автосейв на время загрузки
    isTransitioningRef.current = true;

    try {
      // Сбрасываем выбор активного объекта
      manager.canvas.discardActiveObject();
      setSelectedObject(null);

      // Ищем данные целевого слайда из свежего стейта
      const freshSlides = useCanvasStore.getState().slides;
      const targetSlide = freshSlides.find((s) => s.id === targetId);

      if (targetSlide?.canvasJSON) {
        await manager.loadFromJSON(targetSlide.canvasJSON);
      } else {
        manager.clear();
        if (!manager.canvas.backgroundColor) {
          manager.canvas.backgroundColor = "#ffffff";
          manager.canvas.renderAll();
        }
      }

      // 3. Переключаем активный ID в сторе
      useCanvasStore.getState().setCurrentSlideId(targetId);
    } finally {
      isTransitioningRef.current = false;
    }
  };

  const handleUpdateObject = useCallback(
    (updates: Partial<FabricObject>) => {
      if (!manager) return;

      const canvas = manager.canvas;
      const activeObject = canvas.getActiveObject();

      if (activeObject) {
        activeObject.set(updates);
        activeObject.setCoords();
        canvas.requestRenderAll();
        canvas.fire("object:modified");
        setSelectedObject(activeObject);
      }
    },
    [manager, setSelectedObject],
  );

  return {
    canvasRef,
    handleUpdateObject,
    selectedObject,
    switchToSlide,
  };
}
