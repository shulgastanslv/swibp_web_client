// src/components/canvas/slide-navigator.tsx
"use client";

import * as React from "react";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideData {
  id: number;
  thumbnail?: string;
}

interface SliderNavigatorProps {
  currentSlide: number;
  slides: SlideData[];
  onSelect: (index: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function SliderNavigator({
  currentSlide,
  slides,
  onSelect,
  onAdd,
  onRemove,
  onPrev,
  onNext,
  className = "",
}: SliderNavigatorProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Стрелки навигации */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[600px] p-1.5 rounded-xl bg-muted/30 backdrop-blur-sm">
        {slides.map((slide, i) => {
          const slideNumber = i + 1;
          const isActive = slideNumber === currentSlide;

          return (
            <div
              key={slide.id}
              onClick={() => onSelect(slideNumber)}
              className={cn(
                "group relative flex flex-col items-center gap-1 cursor-pointer shrink-0 transition-all",
                isActive ? "scale-105" : "hover:scale-105 opacity-70 hover:opacity-100"
              )}
            >
              {/* Превью слайда */}
              <div
                className={cn(
                  "relative w-14 h-16 rounded-md border-2 overflow-hidden bg-background transition-all",
                  isActive
                    ? "border-primary shadow-md shadow-primary/20"
                    : "border-border/50 hover:border-muted-foreground/50"
                )}
              >
                {slide.thumbnail ? (
                  <img
                    src={slide.thumbnail}
                    alt={`Slide ${slideNumber}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <span className="text-[8px] text-muted-foreground">
                      {slideNumber}
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </div>

              {/* Номер и кнопка удаления */}
              <div className="flex items-center gap-0.5">
                <span className={cn(
                  "text-[9px] font-medium leading-none",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {slideNumber}
                </span>

                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(slideNumber);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0 hover:bg-destructive/10 rounded"
                  >
                    <X className="w-2.5 h-2.5 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Кнопка добавления */}
        <button
          onClick={onAdd}
          className="flex flex-col items-center gap-1 shrink-0"
        >
          <div className="w-14 h-16 rounded-md border-2 border-dashed border-border/50 hover:border-primary/50 bg-transparent hover:bg-primary/5 flex items-center justify-center transition-all">
            <Plus className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground leading-none">
            Add
          </span>
        </button>
      </div>
    </div>
  );
}
