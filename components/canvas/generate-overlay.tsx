"use client";

import { Loader2, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cancelGenerateSession } from "@/lib/ai/generate-session";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

export function GenerateOverlay() {
  const status = useCanvasStore((s) => s.genStatus);
  const phase = useCanvasStore((s) => s.genPhase);
  const progress = useCanvasStore((s) => s.genProgress);
  const built = useCanvasStore((s) => s.genBuiltCount);
  const expected = useCanvasStore((s) => s.genExpectedSlides);
  const preview = useCanvasStore((s) => s.genPreview);
  const error = useCanvasStore((s) => s.genError);
  const resetGenerate = useCanvasStore((s) => s.resetGenerate);

  const active = status === "streaming" || status === "building";
  const show = active || status === "error" || (status === "done" && built > 0);

  const cancel = () => {
    cancelGenerateSession();
    useCanvasStore.getState().setGenerate({ genStatus: "idle", genPhase: "", genFx: "idle" });
  };

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex flex-col items-center gap-3 px-4 pt-3">
      <div
        className={cn(
          "pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border/60",
          "bg-background/90 shadow-xl backdrop-blur-md",
        )}
      >
        <div className="relative h-1 overflow-hidden bg-muted">
          <div
            className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-500 ease-out"
            style={{ width: `${Math.round(Math.min(1, progress) * 100)}%` }}
          />
          {active ? (
            <div className="absolute inset-0 animate-[stitch-shimmer_1.4s_ease_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          ) : null}
        </div>

        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              status === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground",
            )}
          >
            {active ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              {status === "error"
                ? "Generation failed"
                : status === "done"
                  ? "Carousel ready"
                  : "Kimi is stitching your carousel"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {status === "error"
                ? error || "Something went wrong"
                : phase || "Starting…"}
              {expected > 0 && status !== "error"
                ? ` · ${built}/${expected}`
                : null}
            </p>
          </div>
          {active ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 rounded-full px-2.5 text-xs"
              onClick={cancel}
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7 rounded-full"
              onClick={() => resetGenerate()}
              title="Dismiss"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        {preview.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto px-3.5 pb-3 pt-0.5">
            {preview.map((slide, index) => (
              <div
                key={slide.id}
                className="stitch-card-in w-14 shrink-0"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div
                  className="aspect-4/5 overflow-hidden rounded-lg border border-border/50 shadow-sm"
                  style={{ backgroundColor: slide.background }}
                >
                  {slide.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end p-1.5">
                      <span className="line-clamp-3 text-[8px] font-semibold leading-tight text-foreground/80">
                        {slide.heading}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-center text-[9px] text-muted-foreground">{index + 1}</p>
              </div>
            ))}
            {active && built < expected ? (
              <div className="flex w-14 shrink-0 flex-col items-center">
                <div className="aspect-4/5 w-full animate-pulse rounded-lg border border-dashed border-border/60 bg-muted/40" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
