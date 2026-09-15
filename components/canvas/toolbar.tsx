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
  TypeIcon,
} from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { ArrowUpIcon, CircleIcon, DownloadIcon, DownloadSimpleIcon, HandIcon, ImagesIcon, MinusIcon, PencilIcon, SquareIcon, TriangleIcon } from "@phosphor-icons/react";
import { OpenSelectHandGesture, Text,  EditPencil} from 'iconoir-react';

interface ToolbarProps {
  handleImageUpload: (file: File) => void;
}

export function Toolbar({ handleImageUpload }: ToolbarProps) {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const selectTool = useCanvasStore((state) => state.selectTool);
  const addRectangle = useCanvasStore((state) => state.addRectangle);
  const addCircle = useCanvasStore((state) => state.addCircle);
  const addTriangle = useCanvasStore((state) => state.addTriangle);
  const addLine = useCanvasStore((state) => state.addLine);
  const addArrow = useCanvasStore((state) => state.addArrow);
  const addText = useCanvasStore((state) => state.addText);
  const enablePen = useCanvasStore((state) => state.enablePen);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleToolClick = (toolId: ToolType) => {
    switch (toolId) {
      case "select":
        selectTool();
        break;
      case "rectangle":
        addRectangle();
        break;
      case "circle":
        addCircle();
        break;
      case "triangle":
        addTriangle();
        break;
      case "line":
        addLine();
        break;
      case "arrow":
        addArrow();
        break;
      case "pen":
        enablePen();
        break;
      case "text":
        addText();
        break;
    }
  };

  const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
    {
      id: "select",
      label: "Выделение",
      icon: <OpenSelectHandGesture className="w-4.5 h-4.5" />,
    },
    {
      id: "rectangle",
      label: "Прямоугольник",
      icon: <SquareIcon className="w-4.5 h-4.5" />,
    },
    { id: "circle", label: "Круг", icon: <CircleIcon className="w-4.5 h-4.5" /> },
    {
      id: "triangle",
      label: "Треугольник",
      icon: <TriangleIcon className="w-4.5 h-4.5" />,
    },
    { id: "line", label: "Линия", icon: <MinusIcon className="w-4.5 h-4.5" /> },
    { id: "arrow", label: "Стрелка", icon: <ArrowUpIcon className="w-4.5 h-4.5" /> },
    { id: "pen", label: "Ручка", icon: <EditPencil className="w-4.5 h-4.5" /> },
    { id: "text", label: "Текст", icon: <Text className="w-4.5 h-4.5" /> },
  ];

  return (
    <div className="flex flex-col w-full gap-1 bg-muted/50 backdrop-blur-md h-min p-1.5 rounded-4xl shadow-sm border border-border/40">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
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
        <ImagesIcon className="w-4.5 h-4.5" />
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>
      <button
        className="w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-all"
        title="Скачать текущий слайд"
      >
        <DownloadSimpleIcon className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}
