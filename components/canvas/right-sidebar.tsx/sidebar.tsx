"use client";

import * as React from "react";
import { FileJson, Grid3X3, PanelRightClose } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BackgroundPanel } from "./bg-panel";
import { PixabaySearch } from "@/components/pixabay/search";
import { AspectRatioPanel } from "./aspect-ratio-panel";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvas } from "@/hooks/useCanvas";
import { EffectsPanel } from "./effects-panel";
import { LayoutsPanel } from "./layouts-panel";

export function RightToolbar({}) {
  const currentRatio = useCanvasStore((state) => state.currentRatio);
  const setCurrentRatio = useCanvasStore((state) => state.setCurrentRatio);
  const setBackground = useCanvasStore((state) => state.setBackground);
  const addImage = useCanvasStore((state) => state.addImage);
  const exportToJSON = useCanvasStore((state) => state.exportToJSON);

  const {
    isGridVisible,
    toggleGrid,
    gridSize,
    setGridSize,
    gridColor,
    snapThreshold,
    setSnapThreshold,
    setGridColor,
  } = useCanvas();

  const handleExportToJSON = () => {
    const json = exportToJSON();
    alert(json);
    navigator.clipboard.writeText(json);
  };

  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto bg-background border-l flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0 bg-muted/50">
        <span className="text-xs font-semibold text-foreground tracking-wide">
          CANVAS
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToJSON}
            className="h-7 text-xs gap-1.5 px-2.5"
          >
            <FileJson className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Copy JSON</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <PanelRightClose className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="flex flex-col space-y-4">
          <span className="text-xs font-medium text-muted-foreground">
            ASPECT RATIO
          </span>
          <AspectRatioPanel
            currentRatio={currentRatio}
            onRatioChange={setCurrentRatio}
          />
          <Separator className="bg-border/40" />

          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                GRID SETTINGS
              </span>
              <Button
                variant={isGridVisible ? "default" : "outline"}
                size="sm"
                onClick={toggleGrid}
                className="h-6 text-[10px] px-2 gap-1"
              >
                <Grid3X3 className="w-3 h-3" />
                {isGridVisible ? "On" : "Off"}
              </Button>
            </div>

            {isGridVisible && (
              <div className="space-y-3 pl-2 border-l-2 border-muted-foreground/20">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-muted-foreground">
                    Size (px)
                  </label>
                  <input
                    type="number"
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="w-full h-7 px-2 text-xs bg-background border border-input rounded-md"
                    min="10"
                    max="200"
                    step="10"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-muted-foreground">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gridColor.startsWith("#") ? gridColor : "#808080"}
                      onChange={(e) => {
                        // Convert hex to rgba roughly for consistency or just use hex
                        // For simplicity, we'll update the store with hex,
                        // but your GridManager might need to handle hex vs rgba
                        setGridColor(e.target.value);
                      }}
                      className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {gridColor}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-border/40" />

          <div className="flex flex-col space-y-2">
            <EffectsPanel />
          </div>

          <Separator className="bg-border/40" />

          <div className="flex flex-col space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              LAYOUTS
            </span>
            <LayoutsPanel />
          </div>
          <Separator className="bg-border/40" />
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              SNAP SETTINGS
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Threshold
                </label>
                <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                  {snapThreshold}px
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={snapThreshold}
                onChange={(e) => setSnapThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-medium text-muted-foreground">
              ELEMENTS
            </span>
            <PixabaySearch onSelect={addImage} />
          </div>
          <Separator className="bg-border/40" />
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-medium text-muted-foreground">
              BACKGROUND
            </span>
            <BackgroundPanel onBackgroundChange={setBackground} />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
