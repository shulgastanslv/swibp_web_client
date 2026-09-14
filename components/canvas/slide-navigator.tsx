// src/components/canvas/slide-navigator.tsx
"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/store/useCanvasStore";

export function SliderNavigator({ className = "" }: { className?: string }) {
  // Получаем данные и действия из стора
  const slides = useCanvasStore((state) => state.slides);
  const currentSlideId = useCanvasStore((state) => state.currentSlideId);

  const switchToSlide = useCanvasStore((state) => state.switchToSlide);
  const addSlide = useCanvasStore((state) => state.addSlide);
  const removeSlide = useCanvasStore((state) => state.removeSlide);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Контейнер слайдов */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[600px] p-1.5 rounded-xl bg-muted/30 backdrop-blur-sm scrollbar-hide">
        {slides.map((slide, i) => {
          const isActive = slide.id === currentSlideId;

          return (
            <div
              key={slide.id}
              onClick={() => switchToSlide(slide.id)}
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
                    alt={`Slide ${slide.id}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <span className="text-[8px] text-muted-foreground font-medium">
                      {i + 1}
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                )}
              </div>

              {/* Номер и кнопка удаления */}
              <div className="flex items-center gap-0.5 h-4">
                <span className={cn(
                  "text-[9px] font-medium leading-none select-none",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {i + 1}
                </span>

                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(slide.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/10 rounded flex items-center justify-center"
                    aria-label="Remove slide"
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
          onClick={addSlide}
          className="flex flex-col items-center gap-1 shrink-0 ml-1"
        >
          <div className="w-14 h-16 rounded-md border-2 border-dashed border-border/50 hover:border-primary/50 bg-transparent hover:bg-primary/5 flex items-center justify-center transition-all">
            <Plus className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground leading-none select-none">
            Add
          </span>
        </button>
      </div>
    </div>
  );
}
