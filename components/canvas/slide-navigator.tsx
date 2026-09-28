"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvas } from "@/hooks/useCanvas";

export function SlideNavigator() {
  const { switchToSlide } = useCanvas();

  const slides = useCanvasStore((s) => s.slides);
  const currentSlideId = useCanvasStore((s) => s.currentSlideId);
  const addSlide = useCanvasStore((s) => s.addSlide);
  const removeSlide = useCanvasStore((s) => s.removeSlide);
  const moveSlide = useCanvasStore((s) => s.moveSlide);

  const currentIdx = slides.findIndex((s) => s.id === currentSlideId);

  const handlePrev = () => {
    if (currentIdx > 0) switchToSlide(slides[currentIdx - 1].id);
  };

  const handleNext = () => {
    if (currentIdx < slides.length - 1) switchToSlide(slides[currentIdx + 1].id);
  };

  return (
    <footer className="h-14 flex items-center justify-between px-6 bg-background border-t border-border text-xs z-10 select-none">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-xl border-border/60"
          onClick={handlePrev}
          disabled={currentIdx <= 0}
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1.5 max-w-[420px] overflow-x-auto py-1 px-1 no-scrollbar">
          {slides.map((s, idx) => {
            const isActive = currentSlideId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => switchToSlide(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted border-border/40 hover:text-foreground"
                }`}
              >
                {String(idx + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-xl border-border/60"
          onClick={handleNext}
          disabled={currentIdx >= slides.length - 1}
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={addSlide}
          className="h-8 text-xs font-normal gap-1.5 rounded-xl border-border/60 ml-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Slide</span>
        </Button>

        {slides.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeSlide(currentSlideId)}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
            title="Удалить текущий слайд"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveSlide("left")}
          disabled={Boolean(currentIdx <= 0)}
          className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Move Left
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveSlide("right")}
          disabled={currentIdx >= slides.length - 1}
          className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1"
        >
          Move Right <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </footer>
  );
}
