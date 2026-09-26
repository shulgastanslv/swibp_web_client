"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  User,
  HelpCircle,
  ChevronRight,
  LogOut,
  Plus,
  FolderOpen,
  Bell,
  GalleryHorizontal,
} from "lucide-react";
import Logo from "@/components/logo";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth";
import { NewProjectModal } from "@/components/new-project-modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandsKbd } from "@/components/commands_kbd";

interface HeaderProps {
  projectName?: string;
  onProjectNameChange?: (name: string) => void;
  onShare?: () => void;
  onExport?: () => void;
}

export function Header({
  projectName = "Untitled Carousel",
  onProjectNameChange,
  onShare,
  onExport,
}: HeaderProps) {
  const [name, setName] = useState(projectName);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const { data: session, status } = useSession();

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

        {/* ── Left: Logo + breadcrumb + project name ── */}
        <div className="flex items-center gap-2 min-w-0">
          <Logo width={30} height={30} />

          <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />

          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-transparent font-medium text-foreground text-xs px-2 py-1 rounded-md border border-transparent hover:border-border/50 focus:border-border focus:bg-muted/30 focus:outline-none transition-colors w-36 sm:w-44 truncate"
            placeholder="Project name..."
          />
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNewProjectOpen(true)}
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          >
            <GalleryHorizontal className="w-3.5 h-3.5" />
          </Button>

          <div className="h-3.5 w-px bg-border mx-1" />

          {/* Keyboard shortcuts */}
          <CommandsKbd />

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            title="Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* ── Right: share / export / user ── */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="h-7 text-xs font-normal gap-1.5 rounded-full border-border/60 hover:bg-muted/50 px-3"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          {/* User avatar / sign-in */}
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl p-0"
                  title="Account"
                >
                  <Avatar size="default">
                    <AvatarImage src={session.user?.image ?? undefined} alt={userName} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
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
                  <Plus className="w-3.5 h-3.5" />
                  <span>New project</span>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
              title="Sign in"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <User className="w-4 h-4" />
            </Button>
          )}

          <div className="h-4 w-px bg-border mx-0.5" />

          <Button
            variant="default"
            size="sm"
            onClick={onExport}
            className="h-7 text-xs font-medium gap-1.5 rounded-full shadow-2xs px-3"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <NewProjectModal open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen} />
    </>
  );
}
