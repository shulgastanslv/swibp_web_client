"use client";

import { useEffect, useMemo, useState } from "react";
import { useCanvasManager, useSlidesController } from "@/context/canvas-manager";
import { useSlides } from "@/hooks/use-slides";
import { useCanvasObjects } from "@/hooks/use-canvas-objects";
import { cn } from "@/lib/utils";
import type { Side, SlideNumberStyle } from "@/lib/canvas/objects";
import { formatSlideNumber } from "@/lib/canvas/objects";
import { slidesFromLines, splitSlideLines, TEXT_STYLES, type TextStyleId } from "@/lib/canvas/document";
import { useCanvasStore } from "@/store/useCanvasStore";
import {
  attentionZones,
  scoreEngagement,
  signalsFromSlide,
  type InsightPlatform,
} from "@/lib/canvas/insights";
import { useInsightUi } from "@/lib/canvas/insight-ui";
import { CornerLeftUpIcon, CornerRightDownIcon, MapIcon } from "lucide-react";

const NUMBER_STYLES: readonly SlideNumberStyle[] = ["1", "01", "1 / 8"];

const PLATFORMS: readonly InsightPlatform[] = ["Telegram", "Threads", "Instagram", "X"];

const actionButton =
  "h-8 rounded-full bg-muted px-2.5 text-xs text-foreground/80 transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40 flex items-center justify-center gap-1";
const fieldInput =
  "h-8 w-full rounded-full bg-muted/40 px-3 text-xs outline-none placeholder:text-muted-foreground focus:bg-muted/60";
const sectionTitle = "px-1 text-xs font-medium text-muted-foreground";

export function SidebarTools() {
  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const { currentIndex, currentSlideId, slides } = useSlides();
  const ratio = useCanvasStore((s) => s.currentRatio);
  const [prompt, setPrompt] = useState("");
  const [slideStyle, setSlideStyle] = useState<TextStyleId>("heading");
  const [handle, setHandle] = useState("@username");
  const platform = useInsightUi((s) => s.platform);
  const setPlatform = useInsightUi((s) => s.setPlatform);
  const showAttention = useInsightUi((s) => s.showAttention);
  const setShowAttention = useInsightUi((s) => s.setShowAttention);
  const [info, setInfo] = useState("text");
  const [textTick, setTextTick] = useState(0);
  const objects = useCanvasObjects();

  const slideIndex = Math.max(currentIndex, 0);
  const slideTotal = Math.max(slides.length, 1);

  const addHandle = (side: Side) =>
    manager?.objects.addCornerHandle(handle.trim() || "@username", side, platform ?? undefined);

  const lineCount = splitSlideLines(prompt).length;
  const insightPlatform = platform ?? "Instagram";

  useEffect(() => {
    if (!manager) return;
    const bump = () => setTextTick((tick) => tick + 1);
    manager.canvas.on("text:changed", bump);
    return () => {
      manager.canvas.off("text:changed", bump);
    };
  }, [manager]);

  const reach = useMemo(() => {
    const signals = slides.map((slide) => {
      if (slide.id === currentSlideId && manager) {
        return signalsFromSlide({
          objects: manager.canvas.getObjects(),
          background: manager.canvas.backgroundColor,
          backgroundImage: manager.canvas.backgroundImage,
        });
      }
      return signalsFromSlide({
        objects: slide.canvasJSON.objects ?? [],
        background: slide.canvasJSON.background ?? slide.canvasJSON.backgroundColor,
        backgroundImage: slide.canvasJSON.backgroundImage,
      });
    });
    return scoreEngagement(insightPlatform, signals);
  }, [slides, currentSlideId, manager, insightPlatform, textTick, objects]);

  const attention = attentionZones(insightPlatform, ratio);

  const generateSlides = () => {
    if (!lineCount || !slidesController) return;
    const state = useCanvasStore.getState();
    const next = slidesFromLines({
      text: prompt,
      styleId: slideStyle,
      style: state.textStyles[slideStyle],
      palette: state.palette,
      chrome: state.chrome,
      width: state.canvasDimensions.width,
      height: state.canvasDimensions.height,
    });
    if (next.length === 0) return;
    state.setSlides(next);
    state.setCurrentSlideId(next[0]!.id);
    state.setDirty(true);
    void slidesController.loadCurrent();
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-2 text-foreground">
      <section className="space-y-2">
        <h3 className={cn(sectionTitle, "text-xs")}>Slides from text</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="One line, one slide"
          rows={3}
          className="w-full resize-none rounded-xl bg-muted/30 px-3 py-2 text-xs leading-relaxed outline-none placeholder:text-muted-foreground focus:bg-muted/40"
        />
        <div className="grid grid-cols-3 gap-1">
          {TEXT_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSlideStyle(style.id)}
              className={cn(
                "h-7 rounded-full px-1 text-xs transition-colors",
                slideStyle === style.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!lineCount || !slidesController}
          onClick={generateSlides}
          className={cn(actionButton, "w-full")}
        >
          Generate{lineCount > 0 ? ` · ${lineCount}` : ""}
        </button>
      </section>

      <section className="space-y-1.5">
        <h3 className="px-1 text-xs font-medium text-muted-foreground">Slide numbers</h3>
        <div className="grid grid-cols-4 gap-1">
          {NUMBER_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              disabled={!manager}
              title={`Add "${formatSlideNumber(style, slideIndex, slideTotal)}" to the top-left corner`}
              onClick={() => manager?.objects.addSlideNumber(style, slideIndex, slideTotal)}
              className={actionButton}
            >
              {formatSlideNumber(style, slideIndex, slideTotal)}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="px-1 text-xs font-medium text-muted-foreground">Author handle</h3>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@username"
          className={fieldInput}
        />
        <div className="flex gap-1">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(platform === p ? null : p)}
              className={cn(
                "h-7 min-w-0 flex-1 truncate rounded-full px-1 text-xs transition-colors",
                platform === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {p === "Instagram" ? "Insta" : p === "Telegram" ? "TG" : p}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!manager}
            onClick={() => addHandle("left")}
            className={actionButton}
          >
            <CornerLeftUpIcon className="w-3.5 h-3.5" />
            Top left
          </button>
          <button
            type="button"
            disabled={!manager}
            onClick={() => addHandle("right")}
            className={actionButton}
          >
            <CornerRightDownIcon className="w-3.5 h-3.5" />
            Bottom right
          </button>
        </div>
      </section>

      <section className="space-y-1">
        <div className="flex items-center gap-1.5">
          <h3 className="px-1 text-xs font-medium text-muted-foreground">Look</h3>
          <button
            type="button"
            onClick={() => setShowAttention(!showAttention)}
            className={cn(
              actionButton,
              "px-2",
              showAttention && "bg-foreground text-background hover:bg-foreground",
            )}
          >
            <MapIcon className="w-3.5 h-3.5" />
          </button>
          <span className="ml-auto px-1 text-xs tabular-nums text-muted-foreground">
            <span className="text-foreground">{reach.score}</span> {reach.label}
          </span>
        </div>
        <p className="px-1 text-xs text-muted-foreground">
          {attention.map((zone) => zone.label).join(" · ")}
        </p>
        <p className="px-1 text-xs text-muted-foreground">{reach.notes.join(" · ")}</p>
      </section>

      <section className="space-y-1.5">
        <h3 className="px-1 text-xs font-medium text-muted-foreground">Swipe cues</h3>
        <button
          type="button"
          disabled={!manager}
          onClick={() => manager?.objects.addSwipeArrow()}
          className={cn(actionButton, "flex w-full items-center justify-between px-3 text-xs")}
        >
          <span>Arrow</span>
          <span className="font-mono">-&gt;</span>
        </button>
        <input
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="text"
          className={fieldInput}
        />
        <div className="grid grid-cols-2 gap-1 text-xs">
          {(
            [
              `[${info.trim() || "text"}]`,
              info.trim() || "text",
              `(${info.trim() || "text"})`,
              `- ${info.trim() || "text"}`,
            ] as const
          ).map((cue) => (
            <button
              key={cue}
              type="button"
              disabled={!manager}
              onClick={() => manager?.objects.addSwipeCue(cue)}
              className={cn(actionButton, "truncate px-2 text-xs")}
            >
              {cue}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
