"use client";

import React from "react";
import type { ToolType } from "@/lib/canvas/types";
import {
  MousePointer,
  Square,
  Circle,
  Triangle,
  Minus,
  Pencil,
  Type,
  Image as ImageIcon,
  Download,
  ArrowUp,
} from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";

const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
  { id: "select", label: "Выделение", icon: <MousePointer className="w-4 h-4" /> },
  { id: "rectangle", label: "Прямоугольник", icon: <Square className="w-4 h-4" /> },
  { id: "circle", label: "Круг", icon: <Circle className="w-4 h-4" /> },
  { id: "triangle", label: "Треугольник", icon: <Triangle className="w-4 h-4" /> },
  { id: "line", label: "Линия", icon: <Minus className="w-4 h-4" /> },
  { id: "arrow", label: "Стрелка", icon: <ArrowUp className="w-4 h-4" /> },
  { id: "pen", label: "Ручка", icon: <Pencil className="w-4 h-4" /> },
  { id: "text", label: "Текст", icon: <Type className="w-4 h-4" /> },
];

export function Toolbar() {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);

  return (
    <div className="flex flex-col w-full gap-2 bg-muted/50 backdrop-blur-md h-min p-1.5 rounded-4xl shadow-sm border border-border/40">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm scale-105"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={tool.label}
            aria-label={tool.label}
          >
            {tool.icon}
          </button>
        );
      })}

      <div className="h-px bg-border my-1 mx-1" />
      <label
        className="w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer transition-all"
        title="Загрузить фото"
      >
        <ImageIcon className="w-4 h-4" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>
      <button
        className="w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-all"
        title="Скачать текущий слайд"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
