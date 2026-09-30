"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  HelpCircle,
  Send,
  AtSign,
  ChevronRight,
  LogOut,
  ArrowUp,
  Copy,
  Check,
  SlidersHorizontal,
  Share,
  GalleryHorizontalEndIcon,
  Bell,
  Globe,
  BookOpen,
  Undo2,
  Redo2,
  Layers2,
  Loader2,
  Save,
} from "lucide-react";
import Logo from "@/components/logo";
import { useSession, signOut } from "next-auth/react";
import { AuthModal } from "@/components/auth";
import { NewProjectModal } from "@/components/new-project-modal";
import { WhatsNewModal } from "@/components/whats-new-modal";
import { HelpDialog } from "@/components/help-dialog";
import { PublishTemplateDialog } from "@/components/publish-template-dialog";
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
import { useCanvasManager } from "@/context/canvas-manager";
import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useProject } from "@/hooks/use-project";
import {
  copyImageToClipboard,
  renderSlidesToImages,
} from "@/lib/export/carousel";

interface HeaderProps {
  onPreview?: () => void;
  onPhonePreview?: () => void;
}

export function Header({ onPreview }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const { data: session, status } = useSession();
  const [showShare, setShowShare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const slides = useCanvasStore((s) => s.slides);
  const projectTitle = useCanvasStore((s) => s.projectTitle);
  const { persist, rename, isDirty, isSaving } = useProject();
  const [name, setName] = useState(projectTitle);

  useEffect(() => {
    setName(projectTitle);
  }, [projectTitle]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    const next = name.trim() || "Untitled Carousel";
    setName(next);
    if (next !== projectTitle) void rename(next);
  };

  const handleSave = async () => {
    if (status !== "authenticated") {
      setIsAuthModalOpen(true);
      return;
    }
    const res = await persist();
    if (!res.success) alert("Ошибка при сохранении");
  };

  const handleUndo = () => {
    void manager?.undo();
  };

  const handleRedo = () => {
    void manager?.redo();
  };

  const handleCopySlide = async () => {
    if (copying) return;
    setCopying(true);
    try {
      slidesController?.saveCurrent();
      const state = useCanvasStore.getState();
      const current = state.slides.find((s) => s.id === state.currentSlideId);
      if (!current) throw new Error("Нет активного слайда");

      const [rendered] = await renderSlidesToImages(
        [{ id: current.id, canvasJSON: current.canvasJSON }],
        state.canvasDimensions,
        { format: "png", multiplier: 1 },
      );

      await copyImageToClipboard(rendered.blob);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Не удалось скопировать");
    } finally {
      setCopying(false);
    }
  };

  const openPublish = () => {
    if (status !== "authenticated") {
      setIsAuthModalOpen(true);
      return;
    }
    setIsPublishOpen(true);
  };

  const userEmail = session?.user?.email ?? "";
  const userName = session?.user?.name ?? userEmail;
  const userInitial = userName ? userName[0].toUpperCase() : "?";
  const slideCount = slides.length || 1;

  return (
    <>
      <header className="h-12 w-full flex items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-border/60 text-xs z-20 shrink-0 gap-3 select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <Logo width={25} height={25} />
          <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="bg-muted/60 font-medium text-foreground text-xs px-2.5 py-1 rounded-full border border-transparent hover:border-border/50 focus:border-border/60 focus:bg-muted/40 focus:outline-none transition-colors w-28 sm:w-40 truncate"
            placeholder="Project name..."
          />
          {isDirty && (
            <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">
              не сохранено
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0"
            title="Help"
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center p-0.5 rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 hidden sm:inline-flex"
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 hidden sm:inline-flex"
              onClick={handleRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <CommandsKbd />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsWhatsNewOpen(true)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 hidden sm:inline-flex"
            title="What's new"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </Button>
          <div className="h-4 w-px bg-border/60 mx-0.5 hidden sm:block" />

          <Button
            variant={isDirty ? "default" : "secondary"}
            size="sm"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="h-8 px-3 text-xs font-medium gap-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all"
            title="Save project (Ctrl+S)"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onPreview}
            className="h-8 px-3 text-xs font-medium gap-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all"
          >
            <Layers2 className="w-3 h-3 fill-current text-muted-foreground" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
         
          <Button
            variant="ghost"
            onClick={() => setShowShare(true)}
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50"
            title="Share"
          >
            <Share className="w-3.5 h-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 relative"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
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
            variant="secondary"
            size="sm"
            onClick={openPublish}
            className="h-8 px-3 text-xs font-medium gap-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all"
            title="Publish as Template"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publish</span>
          </Button>


          <div className="flex items-center h-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full pl-2.5 pr-0.5 shadow-2xs transition-all gap-1">
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Export</span>
              <span className="text-[11px] font-normal text-primary-foreground/70">
                [{slideCount}] · PNG
              </span>
            </button>
            <button
              type="button"
              title="Copy current slide"
              onClick={() => void handleCopySlide()}
              disabled={copying}
              className="h-6 w-6 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground flex items-center justify-center transition-colors active:scale-95 disabled:opacity-60"
            >
              {copying ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
            <button
              type="button"
              title="Export settings"
              onClick={() => setShowExport(true)}
              className="h-6 w-6 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground flex items-center justify-center transition-colors active:scale-95"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </button>
          </div>

          <div className="h-4 w-px bg-border/60 mx-0.5" />


          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full p-0"
                  title="Account"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image ?? undefined}
                      alt={userName}
                    />
                    <AvatarFallback className="text-[14px]">
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
                  onClick={openPublish}
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
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  title="Menu"
                >
                  <User className="w-3.5 h-3.5" />
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


        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <NewProjectModal
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
      />
      <ShareModal
        open={showShare}
        onOpenChange={setShowShare}
        onNeedAuth={() => {
          setShowShare(false);
          setIsAuthModalOpen(true);
        }}
      />
      <ExportModal open={showExport} onOpenChange={setShowExport} />
      <WhatsNewModal open={isWhatsNewOpen} onOpenChange={setIsWhatsNewOpen} />
      <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
      <PublishTemplateDialog
        open={isPublishOpen}
        onOpenChange={setIsPublishOpen}
        onAuthRequired={() => setIsAuthModalOpen(true)}
      />
    </>
  );
}
