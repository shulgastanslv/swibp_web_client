"use client";

import { useState, type CSSProperties } from "react";
import { useCanvasManager } from "@/context/canvas-manager";
import { cn } from "@/lib/utils";
import { CANVAS_SPLITS, type CanvasSplit } from "@/lib/canvas/splits";
import { useCanvasStore } from "@/store/useCanvasStore";

function imagePreviewStyle(split: CanvasSplit): CSSProperties {
  const span = (100 / split.count) * split.imageTracks;
  if (split.axis === "rows") {
    return split.imageFrom === "start"
      ? { top: 0, left: 0, right: 0, height: `${span}%` }
      : { bottom: 0, left: 0, right: 0, height: `${span}%` };
  }
  return split.imageFrom === "start"
    ? { left: 0, top: 0, bottom: 0, width: `${span}%` }
    : { right: 0, top: 0, bottom: 0, width: `${span}%` };
}

export function ScreenSplit() {
  const manager = useCanvasManager();
  const [splitId, setSplitId] = useState<string | null>(null);

  const applySplit = (split: CanvasSplit) => {
    if (!manager) return;
    const store = useCanvasStore.getState();
    const columns = split.axis === "columns" ? split.count : store.gridColumns;
    const rows = split.axis === "rows" ? split.count : store.gridRows;
    store.setGridColumns(columns);
    store.setGridRows(rows);
    store.setGridVisible(true);
    manager.grid.applySettings({
      columns,
      rows,
      margin: store.gridMargin,
      snapToGrid: store.snapToGrid,
    });
    manager.grid.setVisible(true);
    manager.objects.placeSplitImage(manager.grid.splitBounds(split));
    manager.grid.redraw();
    setSplitId(split.id);
  };

  return (
    <section className="space-y-1.5">
      <h3 className="px-1 text-xs font-medium text-muted-foreground">Screen split</h3>
      <div className="grid grid-cols-6 gap-1">
        {CANVAS_SPLITS.map((split) => (
          <button
            key={split.id}
            type="button"
            disabled={!manager}
            title={split.name}
            onClick={() => applySplit(split)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-1 transition-colors",
              splitId === split.id ? "bg-foreground/10" : "hover:bg-muted/50",
            )}
          >
            <span className="relative block size-8 overflow-hidden rounded-md bg-muted/40">
              <span className="absolute bg-foreground/70" style={imagePreviewStyle(split)} />
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!manager || !splitId}
        onClick={() => manager?.objects.pickSplitImage()}
        className="h-8 w-full rounded-full bg-muted px-3 text-[11px] text-foreground/80 transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40"
      >
        Add image
      </button>
    </section>
  );
}
