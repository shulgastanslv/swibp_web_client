"use client";

import { useState } from "react";
import { ChevronDown, Check, Monitor, Smartphone, Film, Image } from "lucide-react";
import { CANVAS_RATIOS, type RatioKey } from "@/lib/canvas/types";
import { cn } from "@/lib/utils";

interface AspectRatioPanelProps {
  currentRatio: RatioKey;
  onRatioChange: (ratio: RatioKey) => void;
}

const RATIO_GROUPS = {
  instagram: {
    label: "Instagram",
    icon: Smartphone,
    ratios: ["1:1", "4:5", "9:16", "21:9"] as RatioKey[],
  },
  tiktok: {
    label: "TikTok",
    icon: Film,
    ratios: ["9:16-tiktok"] as RatioKey[],
  },
  youtube: {
    label: "YouTube",
    icon: Monitor,
    ratios: ["16:9-yt", "16:9-thumb", "21:9-yt"] as RatioKey[],
  },
  facebook: {
    label: "Facebook",
    icon: Image,
    ratios: ["1.91:1-fb", "1:1-fb", "4:5-fb", "820:312"] as RatioKey[],
  },
  x_twitter: {
    label: "X (Twitter)",
    icon: Monitor,
    ratios: ["16:9-x", "1:1-x", "16:9-x-post"] as RatioKey[],
  },
  linkedin: {
    label: "LinkedIn",
    icon: Monitor,
    ratios: ["1.91:1-li", "4:5-li", "1584:396"] as RatioKey[],
  },
  pinterest: {
    label: "Pinterest",
    icon: Image,
    ratios: ["2:3-pin", "1:1-pin", "16:9-pin"] as RatioKey[],
  },
  telegram: {
    label: "Telegram",
    icon: Smartphone,
    ratios: ["1:1-tg", "4:5-tg"] as RatioKey[],
  },
  standard: {
    label: "Standard & Print",
    icon: Monitor,
    ratios: ["16:9", "4:3", "3:2"] as RatioKey[],
  },
};

function AspectRatioIcon({ ratio }: { ratio: RatioKey }) {
  const [w, h] = ratio.split(":").map(Number);
  const aspectRatio = w / h;

  let width = 16;
  let height = 16;

  if (aspectRatio > 1.5) {
    // Широкий формат (16:9, 21:9)
    width = 20;
    height = 12;
  } else if (aspectRatio < 0.7) {
    // Портретный (9:16)
    width = 12;
    height = 20;
  } else if (aspectRatio > 1) {
    // Альбомный (4:3, 3:2)
    width = 18;
    height = 14;
  } else if (aspectRatio < 1) {
    // Портретный (4:5, 2:3)
    width = 14;
    height = 18;
  }

  return (
    <div
      className="border border-current rounded-xs"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export function AspectRatioPanel({
  currentRatio,
  onRatioChange,
}: AspectRatioPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = CANVAS_RATIOS[currentRatio];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-muted/50 hover:bg-muted rounded-2xl border border-border/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <AspectRatioIcon ratio={currentRatio} />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-foreground">
              {currentRatio}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {currentConfig.width} × {currentConfig.height}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-background border border-border/50 rounded-xl shadow-xl z-50 max-h-[400px] overflow-y-auto">
            {Object.entries(RATIO_GROUPS).map(([groupKey, group]) => {
              const GroupIcon = group.icon;
              const availableRatios = group.ratios.filter(
                (r) => CANVAS_RATIOS[r]
              );

              if (availableRatios.length === 0) return null;

              return (
                <div key={groupKey} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2">
                    <GroupIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {availableRatios.map((ratio) => {
                      const isSelected = currentRatio === ratio;

                      return (
                        <button
                          key={ratio}
                          onClick={() => {
                            onRatioChange(ratio);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all",
                            isSelected
                              ? "bg-primary/10 border-primary/50 text-primary"
                              : "bg-muted/30 border-border/50 hover:bg-muted hover:border-border"
                          )}
                        >
                          <AspectRatioIcon ratio={ratio} />
                          <span className="text-[10px] font-medium">
                            {ratio}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
