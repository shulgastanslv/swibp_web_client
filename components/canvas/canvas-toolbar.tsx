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
} from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { CANVAS_RATIOS, type RatioKey } from "@/lib/canvas/types";

// Only the four quick-pick ratios shown in the pill switcher
const QUICK_RATIOS: { ratio: RatioKey; iconClass: string }[] = [
  { ratio: "4:5",  iconClass: "w-2.5 h-3"   },
  { ratio: "1:1",  iconClass: "w-2.5 h-2.5" },
  { ratio: "9:16", iconClass: "w-2 h-3.5"   },
  { ratio: "16:9", iconClass: "w-3.5 h-2"   },
];

interface CanvasToolbarProps {
  duplicateSlide: () => void;
  removeSlide: () => void;
  slidesCount: number;
  onPreview: () => void;
}

export function CanvasToolbar({
  duplicateSlide,
  removeSlide,
  slidesCount,
  onPreview,
}: CanvasToolbarProps) {
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
      const jsonString = typeof json === "string" ? json : JSON.stringify(json, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <header className="h-12 w-full flex items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-border/60 z-10 select-none shrink-0">

      {/* ── Left: Ratio picker + view toggles ── */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider pl-1">
          Ratio
        </span>

        {/* Ratio pill switcher */}
        <div className="flex items-center bg-muted/60 p-0.5 rounded-full border border-border/50 shadow-2xs">
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
        <div className="flex items-center bg-muted/50 p-0.5 rounded-full border border-border/40">
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
      </div>

      {/* ── Center: Zoom controls ── */}
      <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-full border border-border/40">
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

      {/* ── Right: History, slide actions, export & preview ── */}
      <div className="flex items-center gap-2">

        {/* Undo / Redo */}
        <div className="flex items-center bg-muted/40 p-0.5 rounded-full border border-border/40">
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

        {/* Duplicate & delete slide */}
        <div className="flex items-center bg-muted/40 p-0.5 rounded-full border border-border/40">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors"
            onClick={duplicateSlide}
            title="Duplicate slide"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={slidesCount <= 1}
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
            onClick={removeSlide}
            title="Delete slide"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Copy JSON Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyJSON}
          className="h-8 px-2.5 text-xs font-medium gap-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all border border-border/40"
          title="Copy current slide as JSON"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">Copied</span>
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
          className="h-8 px-3.5 text-xs font-medium gap-1.5 rounded-full border border-border/50 shadow-2xs hover:shadow-xs transition-all"
        >
          <Layers2 className="w-3 h-3 fill-current text-muted-foreground" />
          Preview Slides
        </Button>
      </div>
    </header>
  );
}
