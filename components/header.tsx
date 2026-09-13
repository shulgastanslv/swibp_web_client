"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Undo2,
  Redo2,
  Settings2,
  Maximize2,
  Trash2,
  ArrowUp,
} from "lucide-react";
import { MenuNav } from "./menu";
import { Separator } from "./ui/separator";
import { CommandsKbd } from "./commands_kbd";

interface HeaderProps {
  onExportPNG: () => void;
  clearCanvas: () => void;
}

export function Header({
  onExportPNG,
  clearCanvas,
}: HeaderProps) {
  const [isMenuOpen, setMenuIsOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MenuNav isOpen={isMenuOpen} onOpenChange={setMenuIsOpen} />
        <ChevronRight className="h-4 w-4 opacity-40" />
        <span className="px-2 font-medium text-foreground">
          Untitled Design
        </span>
      </div>

      <div className="hidden items-center gap-2 px-4 py-1.5 lg:flex text-muted-foreground">
        <div className="flex items-center gap-2 bg-muted/50 rounded-4xl">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 className="h-5 w-5" />
          </Button>
        </div>

        <CommandsKbd />

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            title="Очистить холст"
            className="h-8 w-8 rounded-xl text-primary hover:text-muted-foreground"
            onClick={clearCanvas}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="hidden h-9 px-3 text-muted-foreground hover:text-foreground sm:flex rounded-full font-medium"
        >
          Save Draft
        </Button>

        <div className="flex items-center rounded-full border border-input shadow-sm overflow-hidden bg-background">
          <Button
            size="sm"
            className="h-9 rounded-none px-4 font-medium text-sm"
            onClick={onExportPNG}
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 w-9 rounded-none px-0 hover:bg-muted"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
