"use client";

import * as React from "react";
import { FileJson, Grid3x3, PanelRightClose } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BackgroundConfig, RatioKey } from "@/lib/canvas/types";
import { BackgroundPanel } from "./bg-panel";
import { PixabaySearch } from "@/components/pixabay/search";
import { AspectRatioPanel } from "./aspect-ratio-panel";
import { FabricObject } from "fabric";
import { StylePanel } from "./style-panel";

interface RightToolbarProps {
  selectedObject: FabricObject | null;
  currentRatio: RatioKey;
  onBackgroundChange: (config: BackgroundConfig) => void;
  onRatioChange: (ratio: RatioKey) => void;
  exportToJSON: () => string;
  handlePixabaySelect: (imageUrl: string) => void;
  onDeleteObject: () => void;
  onDuplicateObject: () => void;
  onUpdateObject: (updates: Partial<FabricObject>) => void;
  onToggleGrid: () => void;
  isGridVisible: boolean;
}

export function RightToolbar({
  currentRatio,
  onRatioChange,
  exportToJSON,
  onBackgroundChange,
  handlePixabaySelect,
  onToggleGrid,
  isGridVisible,
}: RightToolbarProps) {
  const [selectedStyle, setSelectedStyle] = React.useState("default");

  const handleExportToJSON = () => {
    alert(exportToJSON());
  };

  return (
    <aside className="w-72 shrink-0 mx-4 h-full rounded-4xl overflow-y-auto bg-muted/50 backdrop-blur flex flex-col">
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
            onRatioChange={onRatioChange}
          />
          <Separator className="bg-border/40" />
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-medium text-muted-foreground">
              ELEMENTS
            </span>
            <PixabaySearch onSelect={handlePixabaySelect} />
          </div>
          <Separator className="bg-border/40" />
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-medium text-muted-foreground">
              BACKGROUND
            </span>
            <BackgroundPanel onBackgroundChange={onBackgroundChange} />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
