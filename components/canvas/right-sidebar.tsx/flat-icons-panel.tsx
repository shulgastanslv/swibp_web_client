"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const flatIconCategories = ["Interface", "Communication", "Media", "Shopping", "Travel"];

export function FlatIconsPanel({ onSelect }: { onSelect: (icon: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <Input
          placeholder="Search flat icons..."
          className="pl-7 h-7 text-xs"
        />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {flatIconCategories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2 whitespace-nowrap"
          >
            {cat}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[250px] w-full">
        <div className="grid grid-cols-4 gap-2 p-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <Button
              key={i}
              variant="outline"
              className="aspect-square p-2 hover:bg-accent"
              onClick={() => onSelect(`flat-icon-${i}`)}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-sm" />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
