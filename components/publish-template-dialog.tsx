"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Check, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publishTemplate } from "@/actions/templates";
import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

interface PublishTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthRequired?: () => void;
}

const CATEGORIES = [
  "Threads",
  "Insta",
  "LinkedIn",
  "TikTok",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

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
  const [category, setCategory] = useState<Category>("Other");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setTitle(useCanvasStore.getState().projectTitle);
      setCategory("Other");
      setDone(false);
      setError(null);
      setLoading(false);
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

    setDone(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("swibp:templates-changed"));
    }
    setTimeout(() => onOpenChange(false), 700);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl border-none p-5 gap-5 shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-base font-semibold tracking-tight">
            Publish
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {slides.length} slide{slides.length === 1 ? "" : "s"} · {currentRatio}
          </p>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Check className="size-4" />
            </div>
            <p className="text-sm font-medium">Published</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Template name"
                disabled={loading}
                className="h-8 rounded-full border-0 bg-muted/50 px-4 text-sm shadow-none"
              />

              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    disabled={loading}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "h-8 rounded-full px-3 text-xs transition-colors",
                      category === c
                        ? "bg-foreground text-background"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button
              type="button"
              className="h-8 w-full rounded-full gap-2"
              disabled={!title.trim() || loading}
              onClick={() => void handlePublish()}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Publish template"
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
