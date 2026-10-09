"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SplitSquareVertical,
  Workflow,
  Check,
  FileCode2,
} from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { CANVAS_RATIOS, type RatioKey } from "@/lib/types";
import { useCanvasManager } from "@/context/canvas-manager";
import { GridControls } from "@/components/canvas/grid-controls";
import { ClearCanvasButton } from "@/components/canvas/clear-canvas-button";
import { ZoomControls } from "@/components/canvas/zoom-controls";

const QUICK_RATIOS: { ratio: RatioKey; iconClass: string }[] = [
  { ratio: "4:5", iconClass: "w-2.5 h-3" },
  { ratio: "1:1", iconClass: "w-2.5 h-2.5" },
  { ratio: "9:16", iconClass: "w-2 h-3.5" },
  { ratio: "16:9", iconClass: "w-3.5 h-2" },
];

export function CanvasToolbar() {
  const manager = useCanvasManager();

  const currentRatio = useCanvasStore((s) => s.currentRatio);
  const setCurrentRatio = useCanvasStore((s) => s.setCurrentRatio);
  const setCanvasDimensions = useCanvasStore((s) => s.setCanvasDimensions);
  const isReferenceOpen = useCanvasStore((s) => s.isReferenceOpen);
  const toggleReferenceOpen = useCanvasStore((s) => s.toggleReferenceOpen);
  const autoFlowEnabled = useCanvasStore((s) => s.autoFlowEnabled);
  const toggleAutoFlow = useCanvasStore((s) => s.toggleAutoFlow);
  const [copied, setCopied] = useState(false);

  const handleRatioChange = (ratio: RatioKey) => {
    const dimensions = CANVAS_RATIOS[ratio];
    if (!dimensions) return;

    setCanvasDimensions(dimensions);
    setCurrentRatio(ratio);
  };

  const handleCopyJSON = async () => {
    if (!manager) return;
    try {
      const json = manager.io.exportAsJSON();
      const jsonString =
        typeof json === "string" ? json : JSON.stringify(json, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="h-11 w-full flex items-center justify-between px-4 bg-background/60 backdrop-blur-md border-b border-border/40 z-10 select-none shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">
          Aspect Ratio
        </span>

        <div className="flex items-center bg-muted/60 p-0.5 rounded-full shadow-2xs">
          {QUICK_RATIOS.map(({ ratio, iconClass }) => {
            const isActive = currentRatio === ratio;
            return (
              <button
                key={ratio}
                type="button"
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

        <GridControls />

        <div className="flex items-center bg-muted/50 p-0.5 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleReferenceOpen}
            className={`h-8 w-8 rounded-full transition-colors ${
              isReferenceOpen
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
            title="Split: reference panel"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoFlow}
            className={`h-8 px-2 text-xs gap-1 rounded-full transition-colors ${
              autoFlowEnabled
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
            title={
              autoFlowEnabled
                ? "Auto Flow: on — offers a new slide when content runs past the edge"
                : "Auto Flow: off"
            }
          >
            <Workflow className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs font-medium">
              Auto Flow
            </span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
              <span className="text-green-600 dark:text-green-400 font-medium hidden sm:inline">
                Copied
              </span>
            </>
          ) : (
            <>
              <FileCode2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </>
          )}
        </Button>
        <ClearCanvasButton />
        <ZoomControls />
      </div>
    </div>
  );
}
