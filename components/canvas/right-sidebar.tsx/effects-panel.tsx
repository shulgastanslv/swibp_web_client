"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas";

export function EffectsPanel() {
  const { vignette, setVignette, noise, setNoise, blur, setBlur, clearEffects } = useCanvas();

  return (
    <div className="flex flex-col space-y-5 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground/50 uppercase flex items-center gap-1.5">
          Effects
        </span>
        <button
          onClick={clearEffects}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          title="Сбросить все эффекты"
        >
          <RotateCcw className="w-3 h-3" />
          Сброс
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            Виньетка
          </label>
          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
            {Math.round(vignette * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={vignette}
          onChange={(e) => setVignette(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
        />
      </div>

      {/* Noise Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            Шум (Зерно)
          </label>
          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
            {Math.round(noise * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={noise}
          onChange={(e) => setNoise(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
        />
      </div>

      {/* Blur Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground flex items-center gap-1.5">
            Размытие
          </label>
          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
            {Math.round(blur * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={blur}
          onChange={(e) => setBlur(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
        />
        <p className="text-xs text-muted-foreground/70">
          * Применяется к выбранному изображению или фону
        </p>
      </div>
    </div>
  );
}
