"use client";

import * as React from "react";
import { Plus, Minus, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ScaleToolbarProps {
  scale: number; // например, 100 (для 100%)
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
  onFitToScreen?: () => void;
  minScale?: number;
  maxScale?: number;
  className?: string;
}

export function ScaleToolbar({
  scale = 10,
  onZoomIn,
  onZoomOut,
  onReset,
  onFitToScreen,
  minScale = 25,
  maxScale = 500,
  className,
}: ScaleToolbarProps) {
  const isMin = scale <= minScale;
  const isMax = scale >= maxScale;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5  bg-sidebar rounded-full backdrop-blur-md p-1.5 shadow-sm w-full",
        className,
      )}
    >
      {/* Увеличение */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md shrink-0"
        onClick={onZoomIn}
        disabled={isMax}
        title="Zoom In"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Текстовый индикатор масштаба */}
      <div
        className="text-[10px] font-medium text-muted-foreground select-none text-center w-full leading-none my-0.5"
        title="Current zoom"
      >
        {Math.round(scale)}%
      </div>

      {/* Уменьшение */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md shrink-0"
        onClick={onZoomOut}
        disabled={isMin}
        title="Zoom Out"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {(onReset || onFitToScreen) && <Separator className="w-full my-0.5" />}

      {/* Сброс до 100% (опционально) */}
      {onReset && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md shrink-0"
          onClick={onReset}
          title="Reset zoom (100%)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* Вписать в экран / Fit to screen (опционально) */}
      {onFitToScreen && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md shrink-0"
          onClick={onFitToScreen}
          title="Fit to screen"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
