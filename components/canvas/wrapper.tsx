"use client";

import { RefObject, useEffect, useRef, useState } from "react";

interface CanvasWrapperProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  canvasWidth: number;
  canvasHeight: number;
}

export default function CanvasWrapper({
  canvasRef,
  containerRef,
  canvasWidth,
  canvasHeight,
}: CanvasWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;

      const wrapper = wrapperRef.current;
      const availableWidth = wrapper.clientWidth - 80; // отступы
      const availableHeight = wrapper.clientHeight - 80;

      // Масштаб = минимум из соотношений ширины и высоты
      const scaleX = availableWidth / canvasWidth;
      const scaleY = availableHeight / canvasHeight;
      const newScale = Math.min(scaleX, scaleY, 1); // не увеличиваем больше 1

      setScale(newScale);
    };

    updateScale();

    // Следим за изменением размера окна
    const observer = new ResizeObserver(updateScale);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [canvasWidth, canvasHeight]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center p-10 overflow-hidden"
    >
      <div
        ref={containerRef}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="shadow-2xl shadow-black/10 rounded-lg overflow-hidden bg-white flex-shrink-0"
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
