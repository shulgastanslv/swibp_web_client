// src/components/header/commands-dropdown.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Command,
  Undo2,
  Redo2,
  Copy,
  ClipboardPaste,
  Layers,
  Trash2,
  Download,
  FileJson,
} from "lucide-react";

export function CommandsKbd() {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const cmdKey = isMac ? "⌘" : "Ctrl";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Commands"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50"
        >
          <Command className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5 bg-background/80 backdrop-blur-md rounded-4xl shadow-2xl">
        <DropdownMenuLabel>Commands</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem  className="cursor-pointer">
            <span>Undo</span>
            <Kbd className="ml-auto">{cmdKey}Z</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem  className="cursor-pointer">
            <span>Redo</span>
            <Kbd className="ml-auto">{cmdKey}⇧Z</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <span>Copy</span>
            <Kbd className="ml-auto">{cmdKey}C</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <span>Paste</span>
            <Kbd className="ml-auto">{cmdKey}V</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <span>Duplicate</span>
            <Kbd className="ml-auto">{cmdKey}D</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <span>Delete</span>
            <Kbd className="ml-auto">Del</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <span>Center</span>
            <Kbd className="ml-auto">{cmdKey}Alt C</Kbd>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <span>Center H / V</span>
            <Kbd className="ml-auto">{cmdKey}Alt H/V</Kbd>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <span>Snap while dragging</span>
            <Kbd className="ml-auto">{cmdKey}+drag</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
