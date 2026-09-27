"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Trash2,
  Grid3X3,
  SplitSquareVertical,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Layers2,
  FileCode2,
  Check,
  GalleryHorizontal,
} from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { CANVAS_RATIOS, type RatioKey } from "@/lib/canvas/types";

const QUICK_RATIOS: { ratio: RatioKey; iconClass: string }[] = [
  { ratio: "4:5", iconClass: "w-2.5 h-3" },
  { ratio: "1:1", iconClass: "w-2.5 h-2.5" },
  { ratio: "9:16", iconClass: "w-2 h-3.5" },
  { ratio: "16:9", iconClass: "w-3.5 h-2" },
];

interface CanvasToolbarProps {
  onPreview: () => void;
}

export function CanvasToolbar({ onPreview }: CanvasToolbarProps) {
  const {
    managerRef,
    currentRatio,
    setCurrentRatio,
    setCanvasDimensions,
    isGridVisible,
    toggleGrid,
    zoom,
    setZoom,
  } = useCanvasStore();

  const [copied, setCopied] = useState(false);

  const handleRatioChange = (ratio: RatioKey) => {
    if (!managerRef) return;
    const { width, height } = CANVAS_RATIOS[ratio];
    managerRef.setRatio(width, height);
    setCanvasDimensions({ width, height });
    setCurrentRatio(ratio);
  };

  const handleCopyJSON = async () => {
    if (!managerRef) return;
    try {
      const json = managerRef.exportAsJSON();
      const jsonString =
        typeof json === "string" ? json : JSON.stringify(json, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  const slides = useCanvasStore((s) => s.slides);
  const currentSlideId = useCanvasStore((s) => s.currentSlideId);

  // Расчет индекса и общего количества
  const currentIdx = slides.findIndex((s) => s.id === currentSlideId);
  const currentNum = currentIdx >= 0 ? currentIdx + 1 : 1;
  const totalNum = slides.length || 1;

  return (
    <header className="h-12 w-full flex items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-border/60 z-10 select-none shrink-0">
      {/* ── Left: Ratio picker + view toggles ── */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider pl-1">
          Ratio
        </span>

        {/* Ratio pill switcher */}
        <div className="flex items-center bg-muted/60 p-0.5 rounded-full shadow-2xs">
          {QUICK_RATIOS.map(({ ratio, iconClass }) => {
            const isActive = currentRatio === ratio;
            return (
              <button
                key={ratio}
                onClick={() => handleRatioChange(ratio)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-all duration-150 ${
                  isActive
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium"
                }`}
              >
                <span
                  className={`rounded-[2px] border ${iconClass} transition-colors ${
                    isActive
                      ? "border-foreground bg-foreground/20"
                      : "border-muted-foreground/60"
                  }`}
                />
                {ratio}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-border/60 mx-1" />

        {/* Grid & split-screen toggles */}
        <div className="flex items-center bg-muted/50 p-0.5 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleGrid}
            className={`h-7 w-7 rounded-full transition-colors ${
              isGridVisible
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
            title={isGridVisible ? "Hide grid" : "Show grid"}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors"
            title="Split screen"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center font-mono text-xs px-3 py-2 rounded-full bg-muted/40 select-none">
          <span className="font-semibold text-foreground">
            {String(currentNum).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground mx-1">/</span>
          <span className="text-muted-foreground">
            {String(totalNum).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground ml-1.5 text-[11px] font-sans hidden sm:inline">
            <GalleryHorizontal className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted/40 p-0.5 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setZoom(Math.max(25, zoom - 10))}
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>

          <button
            className="text-xs font-mono w-10 text-center text-foreground hover:text-primary transition-colors"
            onClick={() => setZoom(100)}
            title="Reset zoom"
          >
            {zoom}%
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyJSON}
          className="h-8 px-2.5 text-xs font-medium gap-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
          title="Copy current slide as JSON"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                Copied
              </span>
            </>
          ) : (
            <>
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON</span>
            </>
          )}
        </Button>

        <div className="h-4 w-px bg-border/60 mx-0.5" />

        {/* Preview */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onPreview}
          className="h-8 px-3.5 text-xs font-medium gap-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all"
        >
          <Layers2 className="w-3 h-3 fill-current text-muted-foreground" />
          Preview Slides
        </Button>
      </div>
    </header>
  );
}
