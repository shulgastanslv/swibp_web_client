"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Share2,
  User,
  HelpCircle,
  Sparkles,
  Send,
  AtSign,
  ChevronRight,
  LogOut,
  NewspaperIcon,
  GalleryHorizontal,
  ArrowUp,
  Copy,
  SlidersHorizontal,
  Share,
  GalleryHorizontalEndIcon,
} from "lucide-react";
import Logo from "@/components/logo";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth";
import { NewProjectModal } from "@/components/new-project-modal";
import { WhatsNewModal } from "@/components/whats-new-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandsKbd } from "@/components/commands_kbd";
import { ThemeSwitcherMenu } from "@/components/theme-switcher"; // <-- Импорт переключателя
import { ShareModal } from "./share-modal";
import { ExportModal } from "./export-modal";
import { useCanvasStore } from "@/store/useCanvasStore";

interface HeaderProps {
  projectName?: string;
  onProjectNameChange?: (name: string) => void;
}

export function Header({
  projectName = "Untitled Carousel",
  onProjectNameChange,
}: HeaderProps) {
  const [name, setName] = useState(projectName);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const { data: session, status } = useSession();
  const [showShare, setShowShare] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onProjectNameChange?.(e.target.value);
  };

  const slides = useCanvasStore((s) => s.slides);
  const currentSlideId = useCanvasStore((s) => s.currentSlideId);

  // Расчет индекса и общего количества
  const currentIdx = slides.findIndex((s) => s.id === currentSlideId);
  const currentNum = currentIdx >= 0 ? currentIdx + 1 : 1;
  const totalNum = slides.length || 1;
  const userEmail = session?.user?.email ?? "";
  const userName = session?.user?.name ?? userEmail;
  const userInitial = userName ? userName[0].toUpperCase() : "?";

  return (
    <>
      <header className="h-14 w-full flex items-center justify-between px-4 bg-background border-b border-border text-xs z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Logo width={25} height={25} />
          <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-transparent font-medium text-foreground text-xs px-2 py-1 rounded-full border hover:border-border/50 focus:border-border focus:bg-muted/30 focus:outline-none transition-colors w-36 sm:w-44 truncate"
            placeholder="Project name..."
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            title="Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-0.5">
          <CommandsKbd />
          <div className="h-3.5 w-px bg-border mx-1" />

          <div className="flex items-center font-mono text-xs px-4 py-2 rounded-full bg-muted select-none">
            <span className="font-semibold text-foreground">
              {String(currentNum).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="text-muted-foreground">
              {String(totalNum).padStart(2, "0")}
            </span>
            <p className="flex flex-row gap-2 px-2">
              Slides
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl p-0 border border-transparent"
                  title="Account"
                >
                  <Avatar className="h-8 w-8 border border-transparent">
                    <AvatarImage
                      src={session.user?.image ?? undefined}
                      alt={userName}
                    />
                    <AvatarFallback className="border border-transparent">{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs">
                  {userEmail}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() => setIsNewProjectOpen(true)}
                >
                  <GalleryHorizontalEndIcon className="w-3.5 h-3.5" fill="primary"/>
                  <span>New project</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() => setIsWhatsNewOpen(true)}
                >
                  <NewspaperIcon className="w-3.5 h-3.5" />
                  <span>What`s new</span>
                </DropdownMenuItem>



                <ThemeSwitcherMenu />
                <DropdownMenuItem asChild className="cursor-pointer text-xs">
                  <a
                    href="https://t.me/your_channel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-500" />
                    <span>Telegram</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-xs">
                  <a
                    href="https://threads.net/@your_account"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full"
                  >
                    <AtSign className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Threads</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() => setShowShare(true)}
                >
                  <Share className="w-3.5 h-3.5" />
                  <span>Share</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-xs text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl border-none text-muted-foreground hover:text-foreground"
                  title="Menu"
                >
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  className="cursor-pointer text-xs font-medium"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign in</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ThemeSwitcherMenu />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="h-4 w-px bg-border mx-0.5" />
          <div className="flex items-center h-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full pl-3 pr-1 py-1 shadow-sm transition-all select-none gap-1.5">
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 text-xs font-normal font-normalhover:opacity-90 transition-opacity"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Export</span>
              <span className="text-[12px] font-normal text-primary-foreground/70 ml-0.5">
                [1] · PNG
              </span>
            </button>

            <button
              type="button"
              title="Copy to clipboard"
              className="h-6 w-6 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground flex items-center justify-center transition-colors active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              title="Export settings"
              className="h-6 w-6 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground flex items-center justify-center transition-colors active:scale-95"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <NewProjectModal
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
      />
      <ShareModal open={showShare} onOpenChange={setShowShare} />
      <ExportModal open={showExport} onOpenChange={setShowExport} />
      <WhatsNewModal open={isWhatsNewOpen} onOpenChange={setIsWhatsNewOpen} />
    </>
  );
}
