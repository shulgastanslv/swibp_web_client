"use client";

import { useCanvasStore } from "@/store/useCanvasStore";
import { RefObject, useEffect, useRef, useState } from "react";

interface CanvasWrapperProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function CanvasWrapper({
  canvasRef,
  containerRef,
}: CanvasWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const canvasDimensions = useCanvasStore((state) => state.canvasDimensions);

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;

      const wrapper = wrapperRef.current;
      const availableWidth = wrapper.clientWidth - 80;
      const availableHeight = wrapper.clientHeight - 80;

      const scaleX = availableWidth / canvasDimensions.width;
      const scaleY = availableHeight / canvasDimensions.height;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(prev => Math.abs(prev - newScale) > 0.01 ? newScale : prev);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapperRef.current!);

    return () => observer.disconnect();
  }, [canvasDimensions]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
    >
      <div
        ref={containerRef}
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          transform: `scale(${scale})`,
          transformOrigin: "center center"
        }}
        className="shadow-xl shadow-black/5 rounded-lg overflow-hidden bg-white flex-shrink-0"
      >
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
