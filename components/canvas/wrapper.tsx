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
  const canvasDemensions = useCanvasStore((state) => state.canvasDimensions);

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;

      const wrapper = wrapperRef.current;
      const availableWidth = wrapper.clientWidth - 80;
      const availableHeight = wrapper.clientHeight - 80;

      const scaleX = availableWidth / canvasDemensions.width;
      const scaleY = availableHeight / canvasDemensions.height;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [canvasDemensions.width, canvasDemensions.height]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center p-10 overflow-hidden"
    >
      <div
        ref={containerRef}
        style={{
          width: canvasDemensions.width,
          height: canvasDemensions.height,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="shadow-2xl shadow-black/10 rounded-none overflow-hidden bg-white flex-shrink-0"
      >
        <canvas
          ref={canvasRef}
          width={canvasDemensions.width}
          height={canvasDemensions.height}
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
