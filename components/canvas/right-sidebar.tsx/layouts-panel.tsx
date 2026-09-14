"use client";

import { useState } from "react";
import { X, LayoutGrid } from "lucide-react";
import { GRID_TEMPLATES } from "@/lib/canvas/grid-templates";
import { useCanvas } from "@/hooks/useCanvas";
import { Button } from "@/components/ui/button";


export function LayoutsPanel() {
  const { applyLayout, clearLayout, isLayoutActive } = useCanvas();

  const handleApplyTemplate = (template: typeof GRID_TEMPLATES[0]) => {
    applyLayout(template);
  };

  const handleClear = () => {
    clearLayout();
  };

  return (
    <section>
      <div className="space-y-4 py-4">
        {isLayoutActive && (
          <Button
            variant={"secondary"}
            onClick={handleClear}

          >
            Clear Layout
          </Button>
        )}

        <div className="grid grid-cols-3 gap-3">
          {GRID_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleApplyTemplate(template)}
              className="group relative aspect-square bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all p-2"
            >
              <GridPreview layout={template.cells} />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs py-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {template.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function GridPreview({ layout }: { layout: { x: number; y: number; width: number; height: number }[] }) {
  return (
    <div className="w-full h-full relative border border-border rounded">
      {layout.map((cell, index) => (
        <div
          key={index}
          className="absolute border-2 border-dashed border-muted-foreground/40 bg-primary/5"
          style={{
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            width: `${cell.width}%`,
            height: `${cell.height}%`,
          }}
        />
      ))}
    </div>
  );
}
