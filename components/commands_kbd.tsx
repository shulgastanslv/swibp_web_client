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
          title="Команды"
          className="h-8 w-8 rounded-xl text-primary hover:text-muted-foreground"
        >
          <Command className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5 bg-background/50 backdrop-blur-3xl  text-zinc-200 rounded-4xl shadow-2xl">
        <DropdownMenuLabel>Команды</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem  className="cursor-pointer">
            <span>Отменить</span>
            <Kbd className="ml-auto">{cmdKey}Z</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem  className="cursor-pointer">
            <span>Повторить</span>
            <Kbd className="ml-auto">{cmdKey}⇧Z</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem  className="cursor-pointer">
            <span>Копировать</span>
            <Kbd className="ml-auto">{cmdKey}C</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem  className="cursor-pointer">
            <span>Вставить</span>
            <Kbd className="ml-auto">{cmdKey}V</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem  className="cursor-pointer">
            <span>Дублировать</span>
            <Kbd className="ml-auto">{cmdKey}D</Kbd>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
          >
            <span>Удалить</span>
            <Kbd className="ml-auto">Del</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
