import { useEffect, useRef, useState } from "react";
import { CanvasManager } from "@/lib/canvas/manager";
import {
  BackgroundConfig,
  CANVAS_RATIOS,
  type RatioKey,
  type ToolType,
} from "@/lib/canvas/types";
import type { Object as FabricObject } from "fabric";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<CanvasManager | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRatio, setCurrentRatio] = useState<RatioKey>("1:1");
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 1080,
    height: 1080,
  });
  const [isPixabayOpen, setIsPixabayOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || managerRef.current) return;

    const manager = new CanvasManager(canvasRef.current);
    managerRef.current = manager;

    const canvas = manager.getCanvas();

    const handleSelection = (e: { selected?: FabricObject[] }) => {
      setSelectedObject(e.selected?.[0] || null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }
        manager.deleteSelected();
      }

      if (isCtrlOrCmd && e.key === "d") {
        e.preventDefault();
        manager.duplicateSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedObject(null));

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;

    manager.disableDrawingMode();

    switch (activeTool) {
      case "pen":
        manager.enableDrawingMode();
        break;
      case "rectangle":
        manager.addRectangle();
        break;
      case "circle":
        manager.addCircle();
        break;
      case "triangle":
        manager.addTriangle();
        break;
      case "line":
        manager.addLine();
        break;
      case "text":
        manager.addText("Новый текст");
        break;
    }
  }, [activeTool]);

  const handleRatioChange = (ratio: RatioKey) => {
    const manager = managerRef.current;
    if (!manager) return;

    const { width, height } = CANVAS_RATIOS[ratio];
    manager.setRatio(width, height);
    setCanvasDimensions({ width, height });
    setCurrentRatio(ratio);
  };

  const handlePixabaySelect = async (imageUrl: string) => {
    const manager = managerRef.current;
    if (!manager) return;

    await manager.addImageFromUrl(imageUrl);
    setIsPixabayOpen(false); // Закрываем модалку после добавления
  };

  const handleBackgroundChange = (config: BackgroundConfig) => {
    const manager = managerRef.current;
    if (!manager) return;
    manager.setBackground(config);
  };

  const handleImageUpload = async (file: File) => {
    const manager = managerRef.current;
    if (!manager) return;
    const url = URL.createObjectURL(file);
    await manager.addImage(url);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    const manager = managerRef.current;
    if (!manager) return;
    manager.deleteSelected();
  };

  const handleDuplicate = async () => {
    const manager = managerRef.current;
    if (!manager) return;
    await manager.duplicateSelected();
  };

  return {
    canvasRef,
    containerRef,
    managerRef,
    activeTool,
    setActiveTool,
    selectedObject,
    handleDelete,
    handleDuplicate,
    handleImageUpload,
    currentRatio,
    canvasDimensions,
    isPixabayOpen, // ✅ Экспортируем состояние
    setIsPixabayOpen, // ✅ Экспортируем сеттер
    handlePixabaySelect, // ✅ Экспортируем обработчик
    handleRatioChange,
    handleBackgroundChange,
  };
}
