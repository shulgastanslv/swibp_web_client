"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StylePreset {
  id: string;
  label: string;
  className: string;
}

const stylePresets: StylePreset[] = [
  {
    id: "default",
    label: "Default",
    className: "bg-gradient-to-br from-muted/40 to-muted/60 border border-border/50",
  },
  {
    id: "glass-light",
    label: "Glass Light",
    className: "bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg",
  },
  {
    id: "glass-dark",
    label: "Glass Dark",
    className: "bg-black/60 backdrop-blur-sm border border-white/10 shadow-lg",
  },
  {
    id: "liquid",
    label: "Liquid",
    className: "bg-gradient-to-br from-amber-500 via-orange-400 to-yellow-300 border border-orange-300/50 shadow-lg shadow-orange-500/20",
  },
  {
    id: "inset-light",
    label: "Inset Light",
    className: "bg-gradient-to-br from-white to-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-border/30",
  },
  {
    id: "inset-dark",
    label: "Inset Dark",
    className: "bg-gradient-to-br from-muted/80 to-muted shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] border border-border/50",
  },
  {
    id: "outline",
    label: "Outline",
    className: "bg-background border-2 border-border shadow-sm",
  },
  {
    id: "border",
    label: "Border",
    className: "bg-background border-4 border-foreground/10",
  },
];

interface StylePanelProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export function StylePanel({ selectedStyle, onSelectStyle }: StylePanelProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Style
      </span>

      <div className="grid grid-cols-3 gap-1.5">
        {stylePresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectStyle(preset.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all bg-transparent hover:bg-muted/30",
              selectedStyle === preset.id && "ring-1 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            <div
              className={cn(
                "w-full h-12 rounded-lg transition-all",
                preset.className
              )}
            />
            <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center">
              {preset.label}
            </span>
          </button>
        ))}

        <button className="flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all bg-transparent hover:bg-muted/30">
          <div className="w-full h-12 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-lg">•••</span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
