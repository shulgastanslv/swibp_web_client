"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvasManager } from "@/context/canvas-manager";

const SIZE_PRESETS = [8, 10, 16, 20, 32, 40, 64] as const;

export function GridControls() {
  const manager = useCanvasManager();

  const isGridVisible = useCanvasStore((s) => s.isGridVisible);
  const gridSize = useCanvasStore((s) => s.gridSize);
  const gridColor = useCanvasStore((s) => s.gridColor);
  const gridOpacity = useCanvasStore((s) => s.gridOpacity);
  const gridStyle = useCanvasStore((s) => s.gridStyle);
  const snapToGrid = useCanvasStore((s) => s.snapToGrid);

  const setGridVisible = useCanvasStore((s) => s.setGridVisible);
  const setGridSize = useCanvasStore((s) => s.setGridSize);
  const setGridColor = useCanvasStore((s) => s.setGridColor);
  const setGridOpacity = useCanvasStore((s) => s.setGridOpacity);
  const setGridStyle = useCanvasStore((s) => s.setGridStyle);
  const setSnapToGrid = useCanvasStore((s) => s.setSnapToGrid);

  useEffect(() => {
    if (!manager) return;
    manager.grid.applySettings({
      size: gridSize,
      color: gridColor,
      opacity: gridOpacity,
      style: gridStyle,
      snapToGrid,
    });
    manager.grid.setVisible(isGridVisible);
  }, [
    manager,
    isGridVisible,
    gridSize,
    gridColor,
    gridOpacity,
    gridStyle,
    snapToGrid,
  ]);

  return (
    <div className="flex items-center bg-muted/50 p-0.5 rounded-full ">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setGridVisible(!isGridVisible)}
        className={cn(
          "h-8 w-8 rounded-full transition-colors",
          isGridVisible
            ? "bg-background text-foreground shadow-2xs"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50",
        )}
        title={isGridVisible ? "Hide grid" : "Show grid"}
      >
        <Grid3X3 className="w-3.5 h-3.5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-6 rounded-full transition-colors",
              isGridVisible
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Grid settings"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-72 rounded-2xl p-0 overflow-hidden border border-none backdrop-blur-md"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="px-3.5 py-3 border-b border-border/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Layout grid
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Размер, стиль и snap
                </p>
              </div>
              <Switch
                checked={isGridVisible}
                onCheckedChange={(v) => setGridVisible(v)}
              />
            </div>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3.5 p-3.5 transition-opacity",
              !isGridVisible && "opacity-50 pointer-events-none",
            )}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </span>
              <div className="flex rounded-full bg-muted/50 p-0.5">
                {(["lines", "dots"] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setGridStyle(style)}
                    className={cn(
                      "flex-1 h-7 rounded-full text-[11px] font-medium transition-colors",
                      gridStyle === style
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {style === "lines" ? "Lines" : "Dots"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Size
                </span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={4}
                    max={256}
                    value={gridSize}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n)) setGridSize(n);
                    }}
                    className="h-7 w-14 rounded-full text-xs text-center px-2 bg-muted/40 border-0 shadow-none"
                  />
                  <span className="text-[10px] text-muted-foreground">px</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {SIZE_PRESETS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setGridSize(size)}
                    className={cn(
                      "h-6 min-w-8 px-2 rounded-full text-[10px] font-mono transition-colors",
                      gridSize === size
                        ? "bg-foreground text-background"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Color
              </span>
              <div className="flex items-center gap-2">
                <label className="relative flex h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-full bg-muted/40">
                  <input
                    type="color"
                    value={gridColor.slice(0, 7)}
                    onChange={(e) => setGridColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <span
                    className="m-auto h-5 w-5 rounded-full ring-1 ring-border/60"
                    style={{ backgroundColor: gridColor }}
                  />
                </label>
                <Input
                  value={gridColor.slice(0, 7).toUpperCase()}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
                      setGridColor(v.startsWith("#") ? v : `#${v}`);
                    }
                  }}
                  className="h-8 flex-1 rounded-full text-xs font-mono bg-muted/40 border-0 shadow-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">Opacity</span>
                <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                  {Math.round(gridOpacity * 100)}%
                </span>
              </div>
              <Slider
                value={[Math.round(gridOpacity * 100)]}
                min={5}
                max={80}
                step={1}
                onValueChange={([v]) => setGridOpacity((v ?? 16) / 100)}
                className="py-1"
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/30 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">
                  Snap to grid
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Привязка при перетаскивании
                </p>
              </div>
              <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
