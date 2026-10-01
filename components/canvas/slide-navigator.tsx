"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Copy, Plus, Trash2 } from "lucide-react";
import { useSlides } from "@/hooks/use-slides";
import { useCanvasManager } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import type { CanvasManager } from "@/lib/canvas/manager";

const THUMB_HEIGHT = 52;
const THUMB_TARGET_WIDTH = 96;

function captureLiveThumbnail(
  manager: CanvasManager,
  nativeWidth: number,
): string | null {
  try {
    const canvas = manager.canvas;
    if (manager.isDisposed || !canvas.lowerCanvasEl) return null;
    const zoom = canvas.getZoom() || 1;
    const multiplier = THUMB_TARGET_WIDTH / Math.max(1, nativeWidth * zoom);
    return canvas.toDataURL({
      format: "jpeg",
      quality: 0.72,
      multiplier: Math.min(1, Math.max(0.05, multiplier)),
    });
  } catch {
    return null;
  }
}

export function SlideNavigator() {
  const manager = useCanvasManager();
  const {
    slides,
    currentSlideId,
    currentIndex,
    canGoPrev,
    canGoNext,
    canRemove,
    switchTo,
    next,
    prev,
    add,
    duplicate,
    remove,
    move,
  } = useSlides();

  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);
  const updateSlideThumbnail = useCanvasStore((s) => s.updateSlideThumbnail);

  const activeRef = useRef<HTMLButtonElement>(null);
  const [liveThumb, setLiveThumb] = useState<string | null>(null);

  const aspect = canvasDimensions.width / canvasDimensions.height;
  const thumbW = Math.round(THUMB_HEIGHT * aspect);

  useEffect(() => {
    setLiveThumb(null);
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentSlideId]);

  useEffect(() => {
    if (!manager) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const dataUrl = captureLiveThumbnail(manager, canvasDimensions.width);
        if (!dataUrl) return;
        const id = useCanvasStore.getState().currentSlideId;
        setLiveThumb(dataUrl);
        updateSlideThumbnail(id, dataUrl);
      }, 280);
    };

    refresh();
    const unsubs = [
      manager.on("change", refresh),
      manager.on("load", refresh),
    ];

    return () => {
      if (timer) clearTimeout(timer);
      unsubs.forEach((off) => off());
    };
  }, [manager, canvasDimensions.width, updateSlideThumbnail]);

  return (
    <footer className="h-[76px] shrink-0 flex items-center gap-3 px-4 bg-background border-t border-border z-10 select-none">
      <div className="w-[72px] shrink-0 leading-tight">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Slide
        </div>
        <div className="text-xs tabular-nums text-foreground">
          {currentIndex + 1}
          <span className="text-muted-foreground/40"> / </span>
          {slides.length}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground"
        onClick={prev}
        disabled={!canGoPrev}
        title="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((slide, idx) => {
          const isActive = currentSlideId === slide.id;
          const thumbSrc =
            isActive && liveThumb ? liveThumb : (slide.thumbnail ?? null);

          return (
            <button
              key={slide.id}
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => switchTo(slide.id)}
              title={`Slide ${idx + 1}`}
              className={`relative shrink-0 overflow-hidden rounded-lg border bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-foreground/70"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ width: thumbW, height: THUMB_HEIGHT }}
            >
              {thumbSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbSrc}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[10px] tabular-nums text-muted-foreground">
                  {idx + 1}
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={add}
          title="Add slide"
          className="flex h-[52px] shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-border/70 px-2.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="text-[11px]">Add</span>
        </button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground"
        onClick={next}
        disabled={!canGoNext}
        title="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex shrink-0 items-center gap-0.5 border-l border-border/50 pl-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-[11px] text-muted-foreground"
          onClick={() => move("left")}
          disabled={!canGoPrev}
          title="Move left"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Left
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-[11px] text-muted-foreground"
          onClick={() => move("right")}
          disabled={!canGoNext}
          title="Move right"
        >
          Right
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-[11px] text-muted-foreground"
          onClick={() => duplicate()}
          title="Duplicate slide"
        >
          <Copy className="h-3.5 w-3.5" />
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg px-2 text-[11px] text-muted-foreground hover:text-destructive"
          onClick={() => remove(currentSlideId)}
          disabled={!canRemove}
          title="Delete slide"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </footer>
  );
}
