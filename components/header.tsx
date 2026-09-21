"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  User,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Command,
  Redo2,
  Undo2,
  HelpCircle,
} from "lucide-react";
import Logo from "@/components/logo";

interface HeaderProps {
  projectName?: string;
  onProjectNameChange?: (name: string) => void;
  currentSlideNum?: number;
  totalSlides?: number;
  onShare?: () => void;
  onExport?: () => void;
}

export function Header({
  projectName = "Untitled Carousel",
  onProjectNameChange,
  currentSlideNum = 1,
  totalSlides = 4,
  onShare,
  onExport,
}: HeaderProps) {
  const [name, setName] = useState(projectName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onProjectNameChange?.(e.target.value);
  };

  return (
    <header className="h-14 w-full flex items-center justify-between px-4 bg-background border-b border-border text-xs z-20 shrink-0">
      {/* 1. Logo */}
      <div className="flex items-center gap-3">
        <Logo width={30} height={30} />
        <div className="h-4 w-[1px] bg-border hidden sm:block" />

        {/* 2. Project Name Input */}
        <div className="flex items-center gap-1.5 group">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-transparent font-medium text-foreground text-xs px-2 py-1 rounded-lg border border-transparent hover:border-border/50 focus:border-border focus:bg-muted/30 focus:outline-none transition-colors w-40 sm:w-48 truncate"
            placeholder="Project name..."
          />
        </div>
      </div>

      <div className="flex items-center gap-1 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Command className="w-3.5 h-3.5" />
          </Button>

          <div className="h-3.5 w-[1px] bg-border mx-0.5" />

          <Button variant="secondary" className="px-3 py-1 rounded-full font-medium text-xs hover:opacity-90 transition-opacity shadow-2xs">
            Publish
          </Button>

          <div className="h-3.5 w-[1px] bg-border mx-0.5" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>
      </div>

      {/* 4. Actions: Share -> Account -> Export */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="h-8 text-xs font-normal gap-1.5 rounded-xl border-border/60 hover:bg-muted/50"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
          title="Account / Profile"
        >
          <User className="w-4 h-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-0.5" />

        <Button
          variant="default"
          size="sm"
          onClick={onExport}
          className="h-8 text-xs font-medium gap-1.5 rounded-xl shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </Button>
      </div>
    </header>
  );
}
