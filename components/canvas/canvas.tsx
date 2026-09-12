"use client";

import { RefObject } from "react";

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function Canvas({ canvasRef, containerRef }: CanvasProps) {
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-10"
    >
      <div className="shadow-2xl shadow-black/10 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1080}
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
