"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Preset {
  id: string;
  name: string;
  thumbnail: string;
  settings: {
    background?: string;
    ratio?: string;
    effects?: string[];
  };
}

const presets: Preset[] = [
  {
    id: "social-media",
    name: "Social Media",
    thumbnail: "/presets/social.png",
    settings: { ratio: "1:1", background: "#ffffff" }
  },
  {
    id: "story",
    name: "Story",
    thumbnail: "/presets/story.png",
    settings: { ratio: "9:16", background: "#f5f5f5" }
  },
  {
    id: "banner",
    name: "Banner",
    thumbnail: "/presets/banner.png",
    settings: { ratio: "16:9", background: "#000000" }
  },
  {
    id: "poster",
    name: "Poster",
    thumbnail: "/presets/poster.png",
    settings: { ratio: "2:3", background: "#ffffff" }
  },
];

export function PresetsPanel() {
  const applyPreset = (preset: Preset) => {
    console.log("Applying preset:", preset);
  };

  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="grid grid-cols-2 gap-2 p-1">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto p-3 hover:bg-accent"
            onClick={() => applyPreset(preset)}
          >
            <div className="w-full aspect-square bg-muted rounded-md overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
            </div>
            <span className="text-xs font-medium">{preset.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
