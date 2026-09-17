"use client";

import { Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackgroundPanel } from "./bg-panel";
import { PixabaySearch } from "@/components/pixabay/search";
import { AspectRatioPanel } from "./aspect-ratio-panel";
import { EffectsPanel } from "./effects-panel";
import { LayoutsPanel } from "./layouts-panel";
import { useCanvas } from "@/hooks/useCanvas";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";

export function CanvasPropertiesPanel() {
  const {
    isGridVisible,
    toggleGrid,
    gridSize,
    setGridSize,
    gridColor,
    setGridColor,
    snapThreshold,
    setSnapThreshold,
  } = useCanvas();

  const {
    currentRatio,
    setCurrentRatio,
    setBackground,
    addImage,
  } = useCanvas();

  return (
    <div className="w-full bg-sidebar h-full overflow-y-auto">
      <div className="flex flex-col">

        <CollapsibleGroup id="aspect-ratio" title="Aspect Ratio">
          <AspectRatioPanel currentRatio={currentRatio} onRatioChange={setCurrentRatio} />
        </CollapsibleGroup>

        <CollapsibleGroup id="background" title="Background">
          <BackgroundPanel onBackgroundChange={setBackground} />
        </CollapsibleGroup>

        <CollapsibleGroup id="layouts" title="Layouts">
          <LayoutsPanel />
        </CollapsibleGroup>

        <CollapsibleGroup id="elements" title="Elements">
          <PixabaySearch onSelect={addImage} />
        </CollapsibleGroup>

        <CollapsibleGroup id="grid-settings" title="Grid Settings">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Grid Visibility</span>
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
              <div className="space-y-3 pl-2 border-l-2 border-muted-foreground/20 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground">Size (px)</label>
                  <Input
                    type="number"
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="h-7 text-xs"
                    min="10"
                    max="200"
                    step="10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gridColor.startsWith("#") ? gridColor : "#808080"}
                      onChange={(e) => setGridColor(e.target.value)}
                      className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      {gridColor}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup id="snap-settings" title="Snap Settings">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Threshold</label>
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
        </CollapsibleGroup>

        <CollapsibleGroup id="effects" title="Effects">
          <EffectsPanel />
        </CollapsibleGroup>

      </div>
    </div>
  );
}
