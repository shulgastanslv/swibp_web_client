"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { SlideData } from "@/components/canvas/types";

interface SlideNavigatorProps {
  slides: SlideData[];
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  addSlide: () => void;
  moveSlide: (direction: "up" | "down") => void;
}

export function SlideNavigator({
  slides,
  currentIdx,
  setCurrentIdx,
  addSlide,
  moveSlide,
}: SlideNavigatorProps) {
  return (
    <footer className="h-14 flex items-center justify-between px-6 bg-background border-t border-border text-xs z-10">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-xl border-border/60"
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1 max-w-[360px] overflow-x-auto py-1 px-1">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                currentIdx === idx
                  ? "bg-primary text-primary-foreground font-semibold border-primary shadow-2xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted border-border/40"
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-xl border-border/60"
          onClick={() =>
            setCurrentIdx((prev) => Math.min(slides.length - 1, prev + 1))
          }
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
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveSlide("up")}
          className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Move Left
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveSlide("down")}
          className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1"
        >
          Move Right <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </footer>
  );
}
