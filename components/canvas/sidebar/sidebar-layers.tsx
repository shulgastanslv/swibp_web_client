"use client";

import React, { useState } from "react";
import { Eye, X, GripVertical } from "lucide-react";
import { Object as FabricObject } from "fabric";

interface SidebarLayersProps {
  canvasObjects: FabricObject[];
  selectObject: (obj: FabricObject) => void;
  deleteObject: (obj: FabricObject) => void;
  getObjectLabel: (obj: FabricObject) => string;
  reorderObjects: (fromIndex: number, toIndex: number) => void;
}

export function SidebarLayers({
  canvasObjects,
  selectObject,
  deleteObject,
  getObjectLabel,
  reorderObjects,
}: SidebarLayersProps) {
  // Display order: reversed (top of canvas = top of list, like Figma)
  // displayItems[0] = canvasObjects[last], displayItems[n] = canvasObjects[0]
  const displayItems = [...canvasObjects].reverse();
  const total = displayItems.length;

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, displayIdx: number) => {
    setDragIndex(displayIdx);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, displayIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // Show indicator above or below based on mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    setDropIndicator(e.clientY < mid ? displayIdx : displayIdx + 1);
  };

  const handleDragLeave = () => {
    // keep indicator while dragging through list
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex === null || dropIndicator === null) return;

    // Convert display indices back to canvas indices
    // displayIdx 0 → canvasIdx (total-1), displayIdx n → canvasIdx (total-1-n)
    const fromCanvasIdx = total - 1 - dragIndex;
    const toDisplayIdx = dropIndicator > dragIndex ? dropIndicator - 1 : dropIndicator;
    const toCanvasIdx = total - 1 - toDisplayIdx;

    if (fromCanvasIdx !== toCanvasIdx) {
      reorderObjects(fromCanvasIdx, toCanvasIdx);
    }

    setDragIndex(null);
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndicator(null);
  };

  return (
    <div className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground text-[11px] font-medium mb-1">
        Objects on canvas ({canvasObjects.length})
      </span>

      {canvasObjects.length === 0 && (
        <p className="text-muted-foreground text-[11px] py-6 text-center">
          No objects yet. Add elements from the Elements tab.
        </p>
      )}

      <div onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {displayItems.map((obj, displayIdx) => (
          <div key={displayIdx}>
            {/* Drop indicator line above this item */}
            {dropIndicator === displayIdx && (
              <div className="h-0.5 bg-primary rounded-full mx-1 my-0.5" />
            )}

            <div
              draggable
              onDragStart={(e) => handleDragStart(e, displayIdx)}
              onDragOver={(e) => handleDragOver(e, displayIdx)}
              onDragEnd={handleDragEnd}
              className={`p-2 rounded-xl border flex items-center justify-between group cursor-pointer transition-all ${
                dragIndex === displayIdx
                  ? "opacity-40 bg-muted/30 border-border/30"
                  : "bg-background hover:bg-muted/50 border-border/50"
              }`}
              onClick={() => selectObject(obj)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <GripVertical className="w-3 h-3 text-muted-foreground/40 shrink-0 cursor-grab active:cursor-grabbing" />
                <Eye className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate font-mono text-[11px] text-wrap max-w-52 line-clamp-1">{getObjectLabel(obj)}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteObject(obj);
                }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity ml-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Drop indicator at the very bottom */}
        {dropIndicator === total && (
          <div className="h-0.5 bg-primary rounded-full mx-1 my-0.5" />
        )}
      </div>
    </div>
  );
}
