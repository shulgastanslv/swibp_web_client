"use client";

import React, { useState } from "react";
import {
  User,
  Palette,
  FolderKanban,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { LoginModal } from "@/components/login_modal"; // Укажите правильный путь к вашему файлу с модалкой

interface MenuProps {
  isOpen?: boolean;
  onOpenChange?: (flag: boolean) => void;
}

export function MenuNav({ isOpen, onOpenChange }: MenuProps) {
  // Состояние для управления видимостью модального окна логина
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-accent cursor-pointer rounded-xl"
          >
            <Image height={26} width={26} src={"/Logo.svg"} alt={"Logo"} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-64 p-1.5 bg-background border text-zinc-200 rounded-4xl shadow-2xl"
        >
          {/* Компактный бейдж-анонс вместо баннера */}
          <div className="px-3 py-2 mb-1 flex items-center justify-between bg-zinc-900/60 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-[11px] font-medium text-zinc-300">Swibp Pro</span>
            </div>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">EU 🇪🇺</span>
          </div>

          <DropdownMenuGroup className="space-y-0.5">
            <DropdownMenuItem
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer"
            >
              <User className="h-4 w-4 text-zinc-400" />
              <span>Login</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer">
              <FolderKanban className="h-4 w-4 text-zinc-400" />
              <span>My Projects</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer">
              <Palette className="h-4 w-4 text-zinc-400" />
              <span>Appearance <span className="ml-auto text-[10px] text-zinc-500">System</span></span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5 bg-zinc-900" />

          <div className="grid grid-cols-2 gap-1 px-0.5">
            <DropdownMenuItem asChild className="p-2 rounded-xl hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900">
              <Link href="#" className="flex items-center justify-between text-zinc-400 hover:text-white w-full">
                <span className="text-[11px]">Channel</span>
                <ArrowUpRight className="h-3 w-3 text-zinc-600" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-2 rounded-xl hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900">
              <Link href="#" className="flex items-center justify-between text-zinc-400 hover:text-white w-full">
                <span className="text-[11px]">Updates</span>
                <ArrowUpRight className="h-3 w-3 text-zinc-600" />
              </Link>
            </DropdownMenuItem>
          </div>

          {/* Минималистичный футер */}
          <DropdownMenuSeparator className="my-1.5 bg-zinc-900" />
          <div className="px-3 py-1 flex items-center justify-between text-[10px] text-zinc-500">
            <span>v1.5.93</span>
            <div className="flex items-center gap-2">
              <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
              <span>•</span>
              <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
