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
  Command,
  Maximize2,
  MessageSquare,
  Clock,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import { CommandsKbd } from "./commands_kbd";
import { useCanvasStore } from "@/store/useCanvasStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "./logo";

export function Header() {
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);
  const isSplitActive = false;
  const isPreviewActive = false;
  const onToggleSplit = () => console.log("Toggle split");
  const onPreview = () => console.log("Toggle preview");
  const router = useRouter();
  const unifiedItemClass =
    "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors";

  return (
    <TooltipProvider delayDuration={300}>
      <header className="flex h-16 w-full items-center justify-between px-4 bg-muted/50 border-b border-border/40">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Button variant="ghost" size="default" className="text-primary" onClick={() => { router.push("/") }}>
            <Logo width={25} height={25}/>
          </Button>
          <ChevronRight className="h-4 w-4 opacity-40" />
          <span className="px-1.5 font-medium text-foreground truncate max-w-[200px]">
            Untitled Design
          </span>
        </div>

        {/* Left toolbar - redesigned */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={true}
                className={`${unifiedItemClass} disabled:opacity-30`}
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={true}
                className={`${unifiedItemClass} disabled:opacity-30`}
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <Command className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Commands</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={clearCanvas}
                className="h-8 rounded-full px-3 text-xs font-medium bg-muted hover:bg-muted/80"
              >
                Start Over
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear canvas and start fresh</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Expand view</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <Clock className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>History</TooltipContent>
          </Tooltip>
        </div>

        {/* Right section - Export and settings */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 rounded-full px-3 text-xs font-medium bg-muted hover:bg-muted/80"
          >
            <ArrowUp className="mr-1.5 h-3.5 w-3.5" />
            Export
            <span className="ml-2 text-muted-foreground">1x • PNG</span>
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={unifiedItemClass}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
