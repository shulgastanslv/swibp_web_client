"use client";

import React, { useRef } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import {
  SOLID_PRESETS,
  GRADIENT_PRESETS,
  RADIAL_PRESETS,
} from "@/lib/presets/backgrounds";
import { ImagePlus } from "lucide-react";

export function SidebarBackground() {
  const { handleBackgroundChange } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    handleBackgroundChange({
      type: "image",
      url,
    });

    // Сбрасываем значение input, чтобы можно было загрузить тот же файл повторно при необходимости
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-5 text-xs">
      {/* ── Image Background ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Image
        </p>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" />
            <span className="text-[11px] font-medium">Загрузить изображение</span>
          </button>
        </div>
      </section>

      {/* ── Solid Colors ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Solid
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SOLID_PRESETS.map((p) => (
            <button
              key={p.color}
              onClick={() =>
                handleBackgroundChange({ type: "solid", color: p.color })
              }
              style={{ backgroundColor: p.color }}
              className="w-7 h-7 rounded-lg border border-white/10 hover:scale-110 hover:ring-2 hover:ring-primary/50 transition-all shrink-0 cursor-pointer"
            />
          ))}
          <label className="w-7 h-7 rounded-lg border border-dashed border-border/60 hover:scale-110 transition-all shrink-0 cursor-pointer flex items-center justify-center bg-muted/30">
            <input
              type="color"
              className="opacity-0 absolute w-0 h-0"
              onChange={(e) =>
                handleBackgroundChange({ type: "solid", color: e.target.value })
              }
            />
            <span className="text-[11px] text-muted-foreground leading-none select-none">
              +
            </span>
          </label>
        </div>
      </section>

      {/* ── Linear Gradients ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Gradients
        </p>
        <div className="grid grid-cols-8 gap-1.5">
          {GRADIENT_PRESETS.map((g, i) => (
            <button
              key={i}
              onClick={() =>
                handleBackgroundChange({
                  type: "gradient",
                  colors: g.colors as [string, string],
                })
              }
              className="rounded-lg border border-white/10 hover:scale-[1.06] hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                aspectRatio: "1 / 1",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Radial Gradients ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Radial
        </p>
        <div className="grid grid-cols-8 gap-1.5">
          {RADIAL_PRESETS.map((r, i) => (
            <button
              key={i}
              onClick={() =>
                handleBackgroundChange({
                  type: "gradient",
                  colors: r.colors as [string, string],
                })
              }
              className="rounded-lg border border-white/10 hover:scale-[1.06] hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              style={{
                background: `radial-gradient(circle at center, ${r.colors[0]}, ${r.colors[1]})`,
                aspectRatio: "1 / 1",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
