"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Palette,
  ChevronRight,
  Undo2,
  Redo2,
  MessageSquare,
  Download,
  Settings2,
  Heart,
  User,
  Command,
  Maximize2,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuNav } from "./menu";

export function Header() {
  const [isMenuOpen, setMenuIsOpen] = useState(false);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between px-6">

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <MenuNav isOpen={isMenuOpen} onOpenChange={setMenuIsOpen}/>
        <ChevronRight className="h-4 w-4 opacity-40" />
        <span className="px-2 font-medium text-foreground">Untitled Design</span>
      </div>

      <div className="hidden items-center gap-2 px-4 py-1.5 lg:flex text-muted-foreground">
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" disabled title="Отменить" className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled title="Повторить" className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Команды" className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60">
            <Command className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" title="На весь экран" className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Сообщения" className="h-8 w-8 rounded-xl hover:text-foreground hover:bg-muted/60">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="hidden h-9 px-3 text-muted-foreground hover:text-foreground sm:flex rounded-full font-medium">
          Save Draft
        </Button>

        <div className="flex items-center rounded-full border border-input shadow-sm overflow-hidden bg-background">
          <Button size="sm" className="h-9 rounded-none px-4 font-medium">
            <ArrowUp className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" variant="secondary" className="h-9 w-9 rounded-none px-0 hover:bg-muted">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </header>
  );
}
