"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Globe, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publishTemplate } from "@/actions/templates";
import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

interface PublishTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthRequired?: () => void;
}

const CATEGORIES = ["Cover", "Tips", "Promo", "Education", "Community"] as const;

export function PublishTemplateDialog({
  open,
  onOpenChange,
  onAuthRequired,
}: PublishTemplateDialogProps) {
  const { status } = useSession();
  const slidesController = useSlidesController();

  const projectTitle = useCanvasStore((s) => s.projectTitle);
  const currentRatio = useCanvasStore((s) => s.currentRatio);
  const slides = useCanvasStore((s) => s.slides);

  const [title, setTitle] = useState(projectTitle);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Community");
  const [badge, setBadge] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slideCount = slides.length;

  const previewHint = useMemo(
    () => `${slideCount} сл. · ${currentRatio}`,
    [slideCount, currentRatio],
  );

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setTitle(useCanvasStore.getState().projectTitle);
      setBadge("");
      setDoneId(null);
      setError(null);
    }
    onOpenChange(next);
  };

  const handlePublish = async () => {
    if (status !== "authenticated") {
      onAuthRequired?.();
      return;
    }

    setLoading(true);
    setError(null);
    slidesController?.saveCurrent();

    const state = useCanvasStore.getState();
    const res = await publishTemplate({
      title: title.trim() || state.projectTitle,
      category,
      badge: badge.trim() || undefined,
      aspectRatio: state.currentRatio,
      canvasJSON: {
        slides: state.slides.map((s) => s.canvasJSON),
      },
      previewUrl: state.slides[0]?.thumbnail ?? null,
    });

    setLoading(false);

    if (res.success === false) {
      setError(res.error);
      return;
    }

    setDoneId(res.templateId);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("swibp:templates-changed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl border-border/70 p-4 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40 text-left space-y-1">
          <DialogTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Publish as template
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Опубликуйте карусель в библиотеку шаблонов ({previewHint}).
          </DialogDescription>
        </DialogHeader>

        {doneId ? (
          <div className="px-5 py-8 text-center space-y-3">
            <p className="text-sm font-medium text-foreground">Шаблон опубликован</p>
            <p className="text-[11px] text-muted-foreground font-mono break-all">{doneId}</p>
            <Button
              size="sm"
              className="h-8 rounded-full px-4 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Готово
            </Button>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Название</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: AI Tools Carousel"
                  className="h-9 rounded-xl text-xs bg-muted/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Категория</Label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        "h-7 px-2.5 rounded-full text-[11px] border transition-colors",
                        category === c
                          ? "bg-foreground text-background border-foreground"
                          : "bg-muted/30 text-muted-foreground border-border/50 hover:text-foreground",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Badge (опционально)</Label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Cover • 01"
                  className="h-9 rounded-xl text-xs bg-muted/30"
                />
              </div>

              {error && (
                <p className="text-[11px] text-destructive">{error}</p>
              )}
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 border-t border-border/40 bg-muted/15 px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 rounded-full px-4 text-xs gap-1.5"
                disabled={!title.trim() || loading}
                onClick={() => void handlePublish()}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span className="hidden sm:inline">Опубликовать</span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
