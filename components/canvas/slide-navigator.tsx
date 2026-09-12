"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

interface SliderNavigatorProps {
  currentSlide: number;
  totalSlides: number;
  onSelect: (index: number) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  className?: string;
}

export function SliderNavigator({
  currentSlide,
  totalSlides,
  onSelect,
  onAdd,
  onRemove,
  className = "",
}: SliderNavigatorProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto bg-muted backdrop-blur-md p-2 rounded-2xl shadow-xl shadow-black/5 select-none scrollbar-thin ${className}`}>

      {/* Список слайдов */}
      {Array.from({ length: totalSlides }).map((_, i) => {
        const slideNumber = i + 1;
        const isActive = slideNumber === currentSlide;

        return (
          <div
            key={i}
            onClick={() => onSelect(slideNumber)}
            className={`group relative flex flex-col justify-between w-14 h-12 p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isActive
                ? "border-primary bg-muted text-primary shadow-sm ring-1 ring-primary/30"
                  : "border-border/60 bg-muted/50 hover:border-muted-foreground/40 text-muted-foreground hover:text-foreground"
            }`}
            title={`Перейти к слайду ${slideNumber}`}
          >
            {/* Номер слайда */}
            <span className="text-xs font-mono font-medium">{slideNumber}</span>

            {/* Кнопка удаления (появляется при наведении) */}
            {onRemove && totalSlides > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(slideNumber);
                }}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                title="Удалить слайд"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {/* Кнопка добавления */}

        <button
          onClick={onAdd}
          className="flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl border border-dashed border-border/80 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all cursor-pointer shrink-0 text-[10px] font-medium"
          title="Добавить слайд"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Slide</span>
        </button>

    </div>
  );
}
