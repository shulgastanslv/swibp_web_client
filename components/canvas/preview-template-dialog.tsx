"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Check, ChevronLeft, ChevronRight, Loader2, Maximize2, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { withRemoteImageCors } from "@/lib/canvas/image-cors";
import { loadGoogleFont, normalizeFontFamily } from "@/lib/fonts/google-fonts";
import { cn } from "@/lib/utils";
import { CANVAS_RATIOS, type FabricCanvasJSON, type RatioKey } from "@/lib/types";

const TEXT_TYPES = new Set(["text", "i-text", "textbox", "itext"]);
const THUMB_H = 72;

function excerpt(json: FabricCanvasJSON): string {
  const walk = (objects: Record<string, unknown>[]): string => {
    for (const object of objects) {
      const type = typeof object.type === "string" ? object.type.toLowerCase() : "";
      if (TEXT_TYPES.has(type) && typeof object.text === "string" && object.text.trim()) {
        return object.text.replace(/\s+/g, " ").trim();
      }
      if (Array.isArray(object.objects)) {
        const nested = walk(object.objects as Record<string, unknown>[]);
        if (nested) return nested;
      }
    }
    return "";
  };
  const text = walk((json.objects ?? []) as Record<string, unknown>[]);
  return text.length > 72 ? `${text.slice(0, 71)}…` : text;
}

function collectFontFamilies(slides: FabricCanvasJSON[]): string[] {
  const families = new Set<string>();
  const walk = (objects: unknown[]) => {
    for (const object of objects) {
      if (!object || typeof object !== "object") continue;
      const record = object as Record<string, unknown>;
      if (typeof record.fontFamily === "string") {
        families.add(normalizeFontFamily(record.fontFamily));
      }
      if (Array.isArray(record.objects)) walk(record.objects);
    }
  };
  for (const slide of slides) walk((slide.objects ?? []) as unknown[]);
  return [...families];
}

function toggleMember(set: Set<number>, value: number): Set<number> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function PreviewTemplateDialog({
  open,
  onOpenChange,
  title,
  aspectRatio,
  currentRatio,
  slides,
  thumbnails,
  busy,
  onInsert,
  onReplace,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  aspectRatio?: RatioKey;
  currentRatio?: RatioKey;
  slides: FabricCanvasJSON[];
  thumbnails: Array<string | null>;
  busy?: boolean;
  onInsert: (indices: number[]) => void;
  onReplace: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const [shots, setShots] = useState<Array<string | null>>([]);
  const [failed, setFailed] = useState<boolean[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setExpanded(false);
    setPicked(slides.length === 1 ? new Set([0]) : new Set());
  }, [open, slides]);

  useEffect(() => {
    if (!open || slides.length === 0) {
      setShots([]);
      setFailed([]);
      return;
    }

    let cancelled = false;
    setShots(slides.map(() => null));
    setFailed(slides.map(() => false));

    const size = CANVAS_RATIOS[aspectRatio ?? "4:5"];
    const el = document.createElement("canvas");
    el.width = size.width;
    el.height = size.height;
    const canvas = new FabricCanvas(el, {
      width: size.width,
      height: size.height,
      renderOnAddRemove: false,
      enableRetinaScaling: false,
    });
    const pending = new Set(slides.map((_, slideIndex) => slideIndex));

    const run = async () => {
      try {
        await Promise.all(collectFontFamilies(slides).map((family) => loadGoogleFont(family)));
        await document.fonts.ready;
      } catch (err) {
        console.error(err);
      }

      while (!cancelled && pending.size > 0) {
        const preferred = priorityRef.current;
        const next = pending.has(preferred) ? preferred : pending.values().next().value;
        if (next === undefined) break;
        pending.delete(next);

        try {
          await canvas.loadFromJSON(withRemoteImageCors(slides[next]!));
          if (cancelled) break;
          if (!canvas.backgroundColor) canvas.backgroundColor = "#ffffff";
          canvas.requestRenderAll();
          const longEdge = Math.max(size.width, size.height);
          const multiplier = Math.min(2, Math.max(1, 2000 / longEdge));
          const url = canvas.toDataURL({ format: "png", multiplier });
          if (cancelled) break;
          setShots((current) => {
            const copy = current.length === slides.length ? [...current] : slides.map(() => null);
            copy[next] = url;
            return copy;
          });
        } catch (err) {
          console.error(err);
          if (!cancelled) {
            setFailed((current) => {
              const copy = current.length === slides.length ? [...current] : slides.map(() => false);
              copy[next] = true;
              return copy;
            });
          }
        }
      }
    };

    void run().finally(() => {
      canvas.dispose();
    });

    return () => {
      cancelled = true;
    };
  }, [open, slides, aspectRatio]);

  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>("[data-active='true']");
    if (!strip || !active) return;
    const left = active.offsetLeft - (strip.clientWidth - active.clientWidth) / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [index, expanded]);

  const view = slides.length === 0 ? 0 : Math.min(index, slides.length - 1);
  priorityRef.current = view;
  const frame = CANVAS_RATIOS[aspectRatio ?? "4:5"];
  const thumbW = Math.max(40, Math.round(THUMB_H * (frame.width / frame.height)));
  const currentPicked = picked.has(view);
  const allSelected = slides.length > 0 && picked.size === slides.length;
  const selectedIndices = [...picked].sort((a, b) => a - b);
  const ratioNote =
    aspectRatio && currentRatio && aspectRatio !== currentRatio
      ? `${aspectRatio} in a ${currentRatio} carousel`
      : null;

  const go = (delta: number) => {
    if (slides.length < 2 || busy) return;
    setIndex((current) => (current + delta + slides.length) % slides.length);
  };

  const toggle = (slideIndex: number) => {
    if (busy) return;
    setPicked((current) => toggleMember(current, slideIndex));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      go(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    if (event.key === " " && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      toggle(view);
    }
  };

  const previewAt = (slideIndex: number) =>
    shots[slideIndex] ?? (failed[slideIndex] ? thumbnails[slideIndex] ?? null : null);
  const previews = slides.map((_, slideIndex) => previewAt(slideIndex));
  const pending = slides.map((_, slideIndex) => !shots[slideIndex] && !failed[slideIndex]);

  const insertLabel =
    allSelected && slides.length > 1
      ? "Insert all"
      : selectedIndices.length > 1
        ? `Insert ${selectedIndices.length}`
        : "Insert";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!expanded}
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          expanded
            ? "top-0 right-0 bottom-0 left-0 h-auto w-auto max-w-none translate-x-0 translate-y-0 rounded-none border-none bg-black text-white ring-0 sm:max-w-none"
            : "h-[calc(100dvh-2rem)] w-[min(1080px,calc(100%-2rem))] rounded-2xl border-border/70 sm:max-w-[1080px]",
        )}
        onEscapeKeyDown={(event) => {
          if (!expanded) return;
          event.preventDefault();
          setExpanded(false);
        }}
        onKeyDown={onKeyDown}
      >
        {expanded ? (
          <FullscreenPreview
            title={title}
            view={view}
            total={slides.length}
            thumb={previews[view] ?? null}
            loading={pending[view]}
            label={slides[view] ? excerpt(slides[view]) : ""}
            frame={frame}
            picked={currentPicked}
            busy={busy}
            ratioNote={ratioNote}
            onClose={() => setExpanded(false)}
            onToggle={() => toggle(view)}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
          >
            <ThumbStrip
              stripRef={stripRef}
              slides={slides}
              thumbnails={previews}
              pending={pending}
              view={view}
              picked={picked}
              thumbW={thumbW}
              busy={busy}
              inverted
              onView={setIndex}
              onToggle={(slideIndex) => {
                setIndex(slideIndex);
                toggle(slideIndex);
              }}
            />
          </FullscreenPreview>
        ) : (
          <>
            <DialogHeader className="shrink-0 space-y-0 px-4 py-3 pr-14 text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <DialogTitle className="truncate text-sm font-medium tracking-tight">
                    {title}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-xs text-muted-foreground">
                    <span className="tabular-nums">
                      {slides.length === 0 ? "No slides" : `${view + 1} / ${slides.length}`}
                    </span>
                    {ratioNote ? ` · ${ratioNote}` : ""}
                  </DialogDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={currentPicked ? "default" : "outline"}
                  className="shrink-0 rounded-full"
                  disabled={busy || slides.length === 0}
                  onClick={() => toggle(view)}
                >
                  {currentPicked && <Check />}
                  {currentPicked ? "Selected" : "Select"}
                </Button>
              </div>
            </DialogHeader>

            <div className="relative min-h-0 flex-1 bg-muted/30">
              <div
                className="absolute inset-2 flex cursor-zoom-in items-center justify-center [container-type:size]"
                onClick={() => {
                  if (slides.length > 0) setExpanded(true);
                }}
              >
                <SlideImage
                  thumb={previews[view] ?? null}
                  loading={pending[view]}
                  label={slides[view] ? excerpt(slides[view]) : ""}
                  frame={frame}
                  title={title}
                  index={view}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 rounded-full bg-background/80"
                disabled={slides.length === 0}
                aria-label="Full screen"
                onClick={() => setExpanded(true)}
              >
                <Maximize2 />
              </Button>
              {slides.length > 1 && (
                <>
                  <BrowseButton direction="prev" className="absolute top-1/2 left-2 -translate-y-1/2" disabled={busy} onClick={() => go(-1)} />
                  <BrowseButton direction="next" className="absolute top-1/2 right-2 -translate-y-1/2" disabled={busy} onClick={() => go(1)} />
                </>
              )}
            </div>

            <ThumbStrip
              stripRef={stripRef}
              slides={slides}
              thumbnails={previews}
              pending={pending}
              view={view}
              picked={picked}
              thumbW={thumbW}
              busy={busy}
              onView={setIndex}
              onToggle={(slideIndex) => {
                setIndex(slideIndex);
                toggle(slideIndex);
              }}
              onExpand={(slideIndex) => {
                setIndex(slideIndex);
                setExpanded(true);
              }}
            />

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/40 px-4 py-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="tabular-nums">{picked.size} selected</span>
                <button
                  type="button"
                  disabled={busy || slides.length === 0}
                  onClick={() =>
                    setPicked(allSelected ? new Set() : new Set(slides.map((_, slideIndex) => slideIndex)))
                  }
                  className="hover:text-foreground disabled:opacity-50"
                >
                  {allSelected ? "Clear" : "Select all"}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground"
                  disabled={busy || slides.length === 0}
                  onClick={onReplace}
                >
                  Replace carousel
                </Button>
                {slides.length > 1 && !allSelected && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={busy}
                    onClick={() => onInsert(slides.map((_, slideIndex) => slideIndex))}
                  >
                    Insert all
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full"
                  disabled={busy || selectedIndices.length === 0}
                  onClick={() => onInsert(selectedIndices)}
                >
                  {insertLabel}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SlideImage({
  thumb,
  loading,
  label,
  frame,
  title,
  index,
  inverted,
}: {
  thumb: string | null;
  loading?: boolean;
  label: string;
  frame: { width: number; height: number };
  title: string;
  index: number;
  inverted?: boolean;
}) {
  return (
    <div
      className="overflow-hidden"
      style={{
        width: `min(100cqw, calc(100cqh * ${frame.width} / ${frame.height}))`,
        height: `min(100cqh, calc(100cqw * ${frame.height} / ${frame.width}))`,
      }}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt={`${title}, slide ${index + 1}`}
          draggable={false}
          className="size-full object-contain"
        />
      ) : (
        <div
          className={cn(
            "flex size-full items-center justify-center px-6 text-center text-xs",
            inverted ? "bg-white/5 text-white/60" : "bg-background text-muted-foreground",
          )}
        >
          {loading ? (
            <Loader2 className={cn("size-5 animate-spin", inverted ? "text-white/70" : "text-muted-foreground")} />
          ) : (
            label || `Slide ${index + 1}`
          )}
        </div>
      )}
    </div>
  );
}

function BrowseButton({
  direction,
  disabled,
  inverted,
  className,
  onClick,
}: {
  direction: "prev" | "next";
  disabled?: boolean;
  inverted?: boolean;
  className?: string;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      onClick={onClick}
      className={cn(
        "z-10 rounded-full bg-background/80",
        inverted && "bg-white/10 text-white hover:bg-white/20 hover:text-white",
        className,
      )}
    >
      <Icon />
    </Button>
  );
}

function ThumbStrip({
  stripRef,
  slides,
  thumbnails,
  pending,
  view,
  picked,
  thumbW,
  busy,
  inverted,
  onView,
  onToggle,
  onExpand,
}: {
  stripRef: React.RefObject<HTMLDivElement | null>;
  slides: FabricCanvasJSON[];
  thumbnails: Array<string | null>;
  pending?: boolean[];
  view: number;
  picked: Set<number>;
  thumbW: number;
  busy?: boolean;
  inverted?: boolean;
  onView: (index: number) => void;
  onToggle: (index: number) => void;
  onExpand?: (index: number) => void;
}) {
  return (
    <div
      ref={stripRef}
      className={cn(
        "relative flex shrink-0 gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        inverted && "bg-black",
      )}
    >
      {slides.map((slide, slideIndex) => {
        const active = slideIndex === view;
        const marked = picked.has(slideIndex);
        const thumb = thumbnails[slideIndex];
        const waiting = pending?.[slideIndex] && !thumb;
        return (
          <div
            key={slideIndex}
            data-active={active ? "true" : undefined}
            className="relative shrink-0"
            style={{ width: thumbW, height: THUMB_H }}
          >
            <button
              type="button"
              disabled={busy}
              aria-current={active ? "true" : undefined}
              aria-label={`Slide ${slideIndex + 1}`}
              onClick={() => onView(slideIndex)}
              onDoubleClick={() => onExpand?.(slideIndex)}
              className={cn(
                "size-full overflow-hidden rounded-md bg-muted/40",
                active ? "ring-2 ring-foreground" : "opacity-55 hover:opacity-100",
                inverted && active && "ring-white",
                inverted && !active && "opacity-45 hover:opacity-90",
              )}
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" draggable={false} className="size-full object-cover" />
              ) : waiting ? (
                <span className="flex size-full items-center justify-center">
                  <Loader2 className={cn("size-3.5 animate-spin", inverted ? "text-white/60" : "text-muted-foreground")} />
                </span>
              ) : (
                <span
                  className={cn(
                    "flex size-full items-center justify-center px-1 text-center text-[10px] leading-snug",
                    inverted ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  {excerpt(slide) || slideIndex + 1}
                </span>
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              aria-pressed={marked}
              aria-label={marked ? `Unselect slide ${slideIndex + 1}` : `Select slide ${slideIndex + 1}`}
              onClick={() => onToggle(slideIndex)}
              className={cn(
                "absolute top-1 left-1 flex size-4 items-center justify-center rounded-full border",
                marked
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 bg-background/85 text-transparent hover:text-foreground/50",
                inverted && marked && "border-white bg-white text-black",
                inverted && !marked && "border-white/40 bg-black/50 text-transparent hover:text-white/70",
              )}
            >
              <Check className="size-2.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FullscreenPreview({
  title,
  view,
  total,
  thumb,
  loading,
  label,
  frame,
  picked,
  busy,
  ratioNote,
  onClose,
  onToggle,
  onPrev,
  onNext,
  children,
}: {
  title: string;
  view: number;
  total: number;
  thumb: string | null;
  loading?: boolean;
  label: string;
  frame: { width: number; height: number };
  picked: boolean;
  busy?: boolean;
  ratioNote: string | null;
  onClose: () => void;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <DialogTitle className="truncate text-sm font-medium text-white">{title}</DialogTitle>
          <DialogDescription className="mt-0.5 text-xs text-white/55">
            <span className="tabular-nums">
              {view + 1} / {total}
            </span>
            {ratioNote ? ` · ${ratioNote}` : ""}
          </DialogDescription>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={busy || total === 0}
            onClick={onToggle}
            className={cn(
              "rounded-full",
              picked
                ? "bg-white text-black hover:bg-white/90 hover:text-black"
                : "bg-white/10 text-white hover:bg-white/20 hover:text-white",
            )}
          >
            {picked && <Check />}
            {picked ? "Selected" : "Select"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Exit full screen"
            onClick={onClose}
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <X />
          </Button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-4 flex items-center justify-center px-12 [container-type:size]">
          <SlideImage
            thumb={thumb}
            loading={loading}
            label={label}
            frame={frame}
            title={title}
            index={view}
            inverted
          />
        </div>
        {total > 1 && (
          <>
            <BrowseButton direction="prev" inverted className="absolute top-1/2 left-4 -translate-y-1/2" disabled={busy} onClick={onPrev} />
            <BrowseButton direction="next" inverted className="absolute top-1/2 right-4 -translate-y-1/2" disabled={busy} onClick={onNext} />
          </>
        )}
      </div>
      {children}
    </div>
  );
}
