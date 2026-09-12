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
} from "lucide-react";

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onImageUpload: (file: File) => void;
  onExportPNG: () => void;
}

const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
  { id: "select", label: "Выделение", icon: <MousePointer className="w-4 h-4" /> },
  { id: "rectangle", label: "Прямоугольник", icon: <Square className="w-4 h-4" /> },
  { id: "circle", label: "Круг", icon: <Circle className="w-4 h-4" /> },
  { id: "triangle", label: "Треугольник", icon: <Triangle className="w-4 h-4" /> },
  { id: "line", label: "Линия", icon: <Minus className="w-4 h-4" /> },
  { id: "pen", label: "Ручка", icon: <Pencil className="w-4 h-4" /> },
  { id: "text", label: "Текст", icon: <Type className="w-4 h-4" /> },
];

export function Toolbar({
  activeTool,
  onToolChange,
  onImageUpload,
  onExportPNG,
}: ToolbarProps) {


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="flex flex-col gap-2 bg-muted/50 backdrop-blur-md h-min p-1.5 rounded-4xl shadow-sm my-4">
      {/* Основные инструменты */}
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        );
      })}

      <div className="h-px bg-border my-1 mx-1" />

      {/* Загрузка изображения */}
      <label
        className="w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center cursor-pointer transition-all"
        title="Загрузить фото"
      >
        <ImageIcon className="w-4 h-4" />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Экспорт */}
      <button
        onClick={onExportPNG}
        className="w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-all"
        title="Экспорт PNG"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
