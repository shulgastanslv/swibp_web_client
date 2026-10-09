"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  HelpCircle,
  Sparkles,
  Send,
  AtSign,
  ChevronRight,
  LogOut,
  ArrowUp,
  Copy,
  SlidersHorizontal,
  Share,
  GalleryHorizontalEndIcon,
  Bell,
  Globe,
  GalleryHorizontal,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
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
import { ThemeSwitcherMenu } from "@/components/theme-switcher";
import { ShareModal } from "./share-modal";
import { ExportModal } from "./export-modal";
import { useCanvasStore } from "@/store/useCanvasStore";

interface HeaderProps {
  projectName?: string;
  onProjectNameChange?: (name: string) => void;
  onPublishTemplate?: () => void;
}

export function Header({
  projectName = "Untitled Carousel",
  onProjectNameChange,
  onPublishTemplate,
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

  const userEmail = session?.user?.email ?? "";
  const userName = session?.user?.name ?? userEmail;
  const userInitial = userName ? userName[0].toUpperCase() : "?";

  return (
    <>
      <header className="h-14 w-full flex items-center justify-between px-4 bg-background border-b border-border text-xs z-20 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link href="/" aria-label="Swibp" className="shrink-0">
            <Logo width={25} height={25} />
          </Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-muted font-medium text-foreground text-xs px-2 py-1 rounded-full border-transparent hover:border-border/50 focus:border-border focus:bg-muted/30 focus:outline-none transition-colors w-32 sm:w-44 truncate"
            placeholder="Project name..."
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground shrink-0"
            title="Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-0.5">
          <CommandsKbd />
          <div className="h-3.5 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsWhatsNewOpen(true)}
            className="h-7 px-2 rounded-full text-muted-foreground hover:text-foreground text-[11px] gap-1.5 shrink-0 hidden sm:inline-flex"
            title="What's new"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {/* Индикатор новых уведомлений */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 text-xs">
              <DropdownMenuLabel className="font-semibold text-xs">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-4 text-center text-muted-foreground text-[11px]">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            onClick={() => setShowShare(true)}
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground relative"
            title="Share"
          >
            <Share className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onPublishTemplate}
            className="h-8 px-2.5 rounded-full text-xs font-medium gap-1.5 hidden md:inline-flex"
            title="Publish as Template"
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Publish</span>
          </Button>

          {/* Меню профиля / Вход */}
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
                    <AvatarFallback className="border border-transparent">
                      {userInitial}
                    </AvatarFallback>
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
                  <GalleryHorizontalEndIcon className="w-3.5 h-3.5 mr-2" />
                  <span>New project</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-xs md:hidden"
                  onClick={onPublishTemplate}
                >
                  <Globe className="w-3.5 h-3.5 mr-2" />
                  <span>Publish template</span>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-xs text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
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
                  <User className="w-3.5 h-3.5 mr-2" />
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
              className="flex items-center gap-1.5 text-xs font-normal hover:opacity-90 transition-opacity"
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
