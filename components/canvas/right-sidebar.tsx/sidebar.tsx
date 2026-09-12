"use client";

import * as React from "react";
import {
  FileJson,
  PanelRightClose} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BackgroundConfig, CANVAS_RATIOS, RatioKey } from "@/lib/canvas/types";
import { BackgroundPanel } from "./bg-panel";

interface RightToolbarProps {
  currentRatio: RatioKey;
  onBackgroundChange: (config: BackgroundConfig) => void;
  onRatioChange: (ratio: RatioKey) => void;
}

export function RightToolbar({ currentRatio, onRatioChange, onBackgroundChange }: RightToolbarProps) {
  const [bgType, setBgType] = React.useState<"solid" | "gradient" | "color" | "image">("solid");
  const [opacity, setOpacity] = React.useState<number>(70);
  const [blur, setBlur] = React.useState<number>(0);
  const [scale, setScale] = React.useState<number>(100);

  return (
    <aside className="w-72 shrink-0 m-4 rounded-4xl overflow-y-auto bg-muted/50 backdrop-blur flex flex-col overflow-hidden text-sm select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0 bg-muted/50">
        <span className="text-xs font-semibold text-foreground tracking-wide">Parameters</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 px-2.5">
            <FileJson className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Copy JSON</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <PanelRightClose className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-6 pb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Aspect Ratio</span>
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground/70">{currentRatio}</span>
            </div>
            <div className="flex gap-2">
                 {Object.entries(CANVAS_RATIOS).map(([key, config]) => (
                   <button
                     key={key}
                     onClick={() => onRatioChange(key as RatioKey)}
                     className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                       currentRatio === key
                         ? "bg-muted text-white"
                         : "bg-muted/50 text-white/50 hover:bg-muted"
                     }`}
                     title={config.label}
                   >
                     {key}
                   </button>
                 ))}
               </div>
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground tracking-wide">Effects</span>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between bg-muted/30 px-3.5 py-2 rounded-xl">
                <span className="text-xs text-zinc-400">Opacity</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-200 w-6 text-right">{opacity}</span>
                  <Slider
                    value={[opacity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setOpacity(val[0])}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/30 px-3.5 py-2 rounded-xl">
                <span className="text-xs text-zinc-400">Blur</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-200 w-6 text-right">{blur}px</span>
                  <Slider
                    value={[blur]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(val) => setBlur(val[0])}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/30 px-3.5 py-2 rounded-xl">
                <span className="text-xs text-zinc-400">Scale</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-200 w-6 text-right">{scale}%</span>
                  <Slider
                    value={[scale]}
                    min={50}
                    max={150}
                    step={1}
                    onValueChange={(val) => setScale(val[0])}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-medium text-foreground">Background</span>
            <BackgroundPanel onBackgroundChange={onBackgroundChange} />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
