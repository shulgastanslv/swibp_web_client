"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";
import { useCanvasManager } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";

export function SidebarFilters() {
  const manager = useCanvasManager();
  const vignette = useCanvasStore((s) => s.vignette);
  const noise = useCanvasStore((s) => s.noise);
  const blur = useCanvasStore((s) => s.blur);
  const setVignette = useCanvasStore((s) => s.setVignette);
  const setNoise = useCanvasStore((s) => s.setNoise);
  const setBlur = useCanvasStore((s) => s.setBlur);

  const hasActiveEffects = vignette > 0 || noise > 0 || blur > 0;

  const handleVignette = (value: number) => {
    setVignette(value);
    manager?.effects.setVignette(value);
  };

  const handleNoise = (value: number) => {
    setNoise(value);
    void manager?.effects.setNoise(value);
  };

  const handleBlur = (value: number) => {
    setBlur(value);
    manager?.effects.setBlur(value);
  };

  const handleReset = () => {
    setVignette(0);
    setNoise(0);
    setBlur(0);
    manager?.effects.clearAll();
  };

  return (
    <div className="flex flex-col gap-4 p-2 text-xs">
      {hasActiveEffects && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-6 p-4 text-[10px] text-muted-foreground hover:text-foreground gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset all
        </Button>
      )}

      {/* ── Vignette ── */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Виньетка</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {Math.round(vignette * 100)}%
        </span>
      </div>
      <Slider
        value={[vignette * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={([val]) => handleVignette((val ?? 0) / 100)}
        className="py-1"
      />

      {/* ── Noise ── */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Зернистость (Noise)</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {Math.round(noise * 100)}%
        </span>
      </div>
      <Slider
        value={[noise * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={([val]) => handleNoise((val ?? 0) / 100)}
        className="py-1"
      />

      {/* ── Blur ── */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Размытие (Blur)</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {blur}px
        </span>
      </div>
      <Slider
        value={[blur]}
        min={0}
        max={40}
        step={1}
        onValueChange={([val]) => handleBlur(val ?? 0)}
        className="py-1"
      />

      <span>Эффекты накладываются поверх всех слоев текущего слайда.</span>
    </div>
  );
}
