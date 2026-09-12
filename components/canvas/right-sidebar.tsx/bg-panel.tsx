"use client";

import React, { useState } from "react";
import type { BackgroundConfig } from "@/lib/canvas/types";
import { SOLID_PRESETS, GRADIENT_PRESETS } from "@/lib/canvas/presets";

interface BackgroundPanelProps {
  onBackgroundChange: (config: BackgroundConfig) => void;
}

type TabType = "solid" | "gradient" | "image";

export function BackgroundPanel({ onBackgroundChange }: BackgroundPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("gradient");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onBackgroundChange({ type: "image", url });
    }
  };

  return (
    <div className="w-full overflow-y-auto font-sans">
      {/* Переключатель вкладок (Tabs) */}
      <div className="flex p-1 rounded-xl mb-4 gap-1">
        <button
          onClick={() => setActiveTab("solid")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === "solid"
              ? "bg-muted/50 text-white shadow-sm"
              : "bg-muted text-white/50 hover:text-primary"
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setActiveTab("gradient")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === "gradient"
            ? "bg-muted/50 text-white shadow-sm"
            : "bg-muted text-white/50 hover:text-primary"
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            activeTab === "image"
            ? "bg-muted/50 text-white shadow-sm"
            : "bg-muted text-white/50 hover:text-primary"
          }`}
        >
          Image
        </button>
      </div>

      {/* Вкладка: Сплошной цвет (Solid) */}
      {activeTab === "solid" && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Presets</div>
          <div className="grid grid-cols-6 gap-2">
            {SOLID_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onBackgroundChange(preset)}
                className="w-full aspect-square rounded-lg border border-border hover:border-primary transition-all active:scale-95"
                style={{ backgroundColor: preset.color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Вкладка: Градиент (Gradient) — сделан тоже маленьким (grid-cols-6) */}
      {activeTab === "gradient" && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Presets</div>
          <div className="grid grid-cols-6 gap-2">
            {GRADIENT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onBackgroundChange(preset)}
                className="w-full aspect-square rounded-lg border border-border hover:border-primary transition-all active:scale-95 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${preset.colors?.[0]}, ${preset.colors?.[1]})`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Вкладка: Картинка (Image) */}
      {activeTab === "image" && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Upload Image</div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 cursor-pointer bg-muted/30 transition-colors">
            <span className="text-xs text-primary mb-1">Выберите файл или перетащите</span>
            <span className="text-[10px] text-muted-foreground">PNG, JPG, WEBP</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
