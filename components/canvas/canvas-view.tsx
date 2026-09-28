"use client";

import React, { useRef, useEffect } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvasManager } from "@/context/canvas-manager";

const PADDING = 48;

export function CanvasView() {
  const { canvasRef } = useCanvas();
  const containerRef = useRef<HTMLDivElement>(null);
  const { manager } = useCanvasManager();

  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);
  const zoom = useCanvasStore((s) => s.zoom);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !manager) return;

    const applyZoom = (containerW: number, containerH: number) => {
      const { width: nativeW, height: nativeH } = canvasDimensions;
      const scaleX = (containerW - PADDING * 2) / nativeW;
      const scaleY = (containerH - PADDING * 2) / nativeH;
      const baseScale = Math.min(scaleX, scaleY);
      const scale = Math.max(0.05, baseScale * (zoom / 100));
      manager.core.setZoom(scale, nativeW, nativeH);
    };

    applyZoom(container.clientWidth, container.clientHeight);

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      applyZoom(rect.width, rect.height);
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [manager, canvasDimensions, zoom]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-auto"
    >
      <div className="shadow-2xl ring-1 ring-border/20">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
