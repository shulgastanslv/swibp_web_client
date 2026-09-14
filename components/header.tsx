// src/components/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  Undo2,
  Redo2,
  Settings2,
  Trash2,
  ArrowUp,
  Eye,
  Columns2,
} from "lucide-react";
import { MenuNav } from "./menu";
import { CommandsKbd } from "./commands_kbd";
import { useCanvasStore } from "@/store/useCanvasStore";

export function Header() {
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);
  const isSplitActive = false;
  const isPreviewActive = false;
  const onToggleSplit = () => console.log("Toggle split");
  const onPreview = () => console.log("Toggle preview");

  const unifiedItemClass =
    "h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors";

  return (
    <TooltipProvider delayDuration={300}>
      <header className="flex h-16 w-full items-center justify-between px-8 bg-background border-b border-border/40">
        {/* Левая часть: Меню + Название */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MenuNav />
          <ChevronRight className="h-4 w-4 opacity-40" />
          <span className="px-1.5 font-medium text-foreground truncate max-w-[200px]">
            Untitled Design
          </span>
        </div>

        {/* Центральная часть: Инструменты */}
        <div className="hidden items-center gap-1 lg:flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={true} // Пока история не реализована в сторе
                // onClick={undo}
                className={`${unifiedItemClass} disabled:opacity-30`}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={true} // Пока история не реализована в сторе
                // onClick={redo}
                className={`${unifiedItemClass} disabled:opacity-30`}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <div className="mx-0.5">
            <CommandsKbd />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isSplitActive ? "secondary" : "ghost"}
                size="icon"
                onClick={onToggleSplit}
                className={`${unifiedItemClass} ${
                  isSplitActive ? "bg-muted text-foreground" : ""
                }`}
              >
                <Columns2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Split View</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isPreviewActive ? "secondary" : "ghost"}
                size="icon"
                onClick={onPreview}
                className={`${unifiedItemClass} ${
                  isPreviewActive ? "bg-muted text-foreground" : ""
                }`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview Mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearCanvas}
                className="h-9 w-9 rounded-full text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-destructive text-destructive-foreground border-destructive">
              Очистить холст
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Правая часть: Экспорт и настройки */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Save draft
              </Button>
            </TooltipTrigger>
            <TooltipContent>Сохранить черновик</TooltipContent>
          </Tooltip>

          <Button
            variant="default"
            size="sm"
            className="h-9 rounded-full px-4 font-medium text-xs shadow-none bg-primary hover:bg-primary/90"
          >
            <ArrowUp className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export Settings</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
