"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas"; // путь к вашему хуку useCanvas

export function SidebarFilters() {
  const {
    vignette,
    noise,
    blur,
    setVignette,
    setNoise,
    setBlur,
    clearEffects,
  } = useCanvas();

  const hasActiveEffects = vignette > 0 || noise > 0 || blur > 0;

  return (
    <div className="flex flex-col gap-4 p-1 text-xs">
        {hasActiveEffects && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearEffects}
            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground gap-1"
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
        onValueChange={([val]) => setVignette((val ?? 0) / 100)}
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
        onValueChange={([val]) => setNoise((val ?? 0) / 100)}
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
        onValueChange={([val]) => setBlur(val ?? 0)}
        className="py-1"
      />

      <span>Эффекты накладываются поверх всех слоев текущего слайда.</span>
    </div>
  );
}
