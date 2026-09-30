"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Plus } from "lucide-react";
import {
  SOLID_PRESETS,
  GRADIENT_PRESETS,
  RADIAL_PRESETS,
} from "@/lib/presets/backgrounds";
import { cn } from "@/lib/utils";
import { useCanvasManager } from "@/context/canvas-manager";

export function SidebarBackground() {
  const manager = useCanvasManager();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    void manager?.setBackground({
      type: "image",
      url,
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      applyImageFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      applyImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-5 p-2 text-xs">

      <section>
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">
          Изображение
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all",
            isDragging
              ? "border-primary bg-primary/10 ring-2 ring-primary/20"
              : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-xs border border-border/50 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-foreground">
              Загрузить фон
            </span>
            <span className="text-[10px] text-muted-foreground">
              Перетащите файл или нажмите для выбора
            </span>
          </div>
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">
          Сплошные цвета
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SOLID_PRESETS.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => void manager?.setBackground({ type: "solid", color: p.color })}
              style={{ backgroundColor: p.color }}
              className="h-7 w-7 rounded-full border border-border/40 shadow-xs hover:scale-110 hover:ring-2 hover:ring-primary/40 transition-all shrink-0 cursor-pointer focus-visible:outline-hidden"
              aria-label={`Выбрать цвет ${p.color}`}
            />
          ))}

          <label className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/30 shadow-xs hover:scale-110 hover:border-border transition-all shrink-0 cursor-pointer">
            <input
              type="color"
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              onChange={(e) =>
                void manager?.setBackground({ type: "solid", color: e.target.value })
              }
            />
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="sr-only">Выбрать произвольный цвет</span>
          </label>
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">
          Линейные градиенты
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {GRADIENT_PRESETS.map((g, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                void manager?.setBackground({
                  type: "gradient",
                  colors: g.colors as [string, string],
                })
              }
              className="aspect-square rounded-full border border-border/30 shadow-xs hover:scale-105 hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus-visible:outline-hidden"
              style={{
                background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
              }}
              aria-label={`Градиент ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">
          Радиальные градиенты
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {RADIAL_PRESETS.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                void manager?.setBackground({
                  type: "gradient",
                  colors: r.colors as [string, string],
                })
              }
              className="aspect-square rounded-full border border-border/30 shadow-xs hover:scale-105 hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus-visible:outline-hidden"
              style={{
                background: `radial-gradient(circle at center, ${r.colors[0]}, ${r.colors[1]})`,
              }}
              aria-label={`Радиальный градиент ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
