"use client";

import { useEffect, useMemo, useState } from "react";
import type { FabricObject } from "fabric";
import { useCanvasManager, useSlidesController } from "@/context/canvas-manager";
import { useSlides } from "@/hooks/use-slides";
import { useCanvasObjects } from "@/hooks/use-canvas-objects";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";
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
import { applyCarouselFont } from "@/lib/canvas/apply-carousel-font";
import { loadGoogleFont, normalizeFontFamily, SUGGESTED_FONTS } from "@/lib/fonts/google-fonts";

const NUMBER_STYLES: readonly SlideNumberStyle[] = ["1", "01", "1 / 8"];

function firstFont(objects: FabricObject[]): string | null {
  for (const obj of objects) {
    const type = (obj.type || "").toLowerCase();
    if (type === "text" || type === "i-text" || type === "textbox") {
      const family = (obj as FabricObject & { fontFamily?: string }).fontFamily;
      if (typeof family === "string" && family.trim()) return normalizeFontFamily(family);
    }
    const children = (obj as FabricObject & { getObjects?: () => FabricObject[] }).getObjects?.();
    if (!children) continue;
    const nested = firstFont(children);
    if (nested) return nested;
  }
  return null;
}

const PLATFORMS: readonly InsightPlatform[] = ["Telegram", "Threads", "Instagram", "X"];

const actionButton =
  "h-8 rounded-full bg-muted px-2.5 text-xs text-foreground/80 transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40 flex items-center justify-center gap-1";
const fieldInput =
  "h-8 w-full rounded-full bg-muted/40 px-3 text-xs outline-none placeholder:text-muted-foreground focus:bg-muted/60";

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
  const [info, setInfo] = useState("swipe");
  const [textTick, setTextTick] = useState(0);
  const objects = useCanvasObjects();
  const activeFont = firstFont(objects);

  useEffect(() => {
    for (const family of SUGGESTED_FONTS) void loadGoogleFont(family);
  }, []);

  const useFont = (family: string) => {
    void loadGoogleFont(family).then(() => {
      applyCarouselFont(family, manager);
    });
  };

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
    <div className="flex flex-col text-xs text-foreground">
      <CollapsibleGroup id="tools-fonts" title="Fonts">
        <div className="grid grid-cols-2 gap-1">
          {SUGGESTED_FONTS.map((family) => {
            const selected = activeFont === family;
            return (
              <button
                key={family}
                type="button"
                title={`Use ${family} on every text`}
                disabled={!manager}
                onClick={() => useFont(family)}
                style={{ fontFamily: `"${family}", sans-serif` }}
                className={cn(
                  "h-8 truncate rounded-full px-2.5 text-left text-xs transition-colors disabled:pointer-events-none disabled:opacity-40",
                  selected
                    ? "bg-foreground text-background"
                    : "bg-muted/40 text-foreground hover:bg-muted",
                )}
              >
                {family}
              </button>
            );
          })}
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-slides" title="Slides from text">
        <div className="space-y-2">
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
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-numbers" title="Slide numbers">
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
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-handle" title="Author handle">
        <div className="space-y-2">
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
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-look" title="Look">
        <div className="space-y-2">
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">
            Where people look on {insightPlatform}, plus a reach estimate from slides, text length, and contrast.
          </p>
          <button
            type="button"
            onClick={() => setShowAttention(!showAttention)}
            className={cn(
              actionButton,
              "w-full justify-between px-3",
              showAttention && "bg-foreground text-background hover:bg-foreground",
            )}
          >
            <span className="flex items-center gap-1.5">
              <MapIcon className="size-3.5" />
              Heat map
            </span>
            <span>{showAttention ? "On" : "Off"}</span>
          </button>
          {showAttention && (
            <ul className="space-y-1.5 px-1">
              {attention.map((zone) => (
                <li key={zone.id} className="text-xs leading-snug">
                  <span className="text-foreground">{zone.label}</span>
                  <span className="text-muted-foreground"> · {zone.hint}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-1 px-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-foreground">Reach</span>
              <span className="tabular-nums text-muted-foreground">
                <span className="text-foreground">{reach.score}</span> {reach.label}
              </span>
            </div>
            {(
              [
                ["Slides", reach.notes[0]],
                ["Text", reach.notes[1]],
                ["Contrast", reach.notes[2]],
              ] as const
            ).map(([name, note]) => (
              <div key={name} className="flex items-baseline justify-between gap-2 text-muted-foreground">
                <span>{name}</span>
                <span className="truncate text-foreground/80">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-cues" title="Swipe cues">
        <div className="space-y-2">
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">
            A hint that another slide is next. The arrow sits bottom right, the caption bottom left.
          </p>
          <button
            type="button"
            disabled={!manager}
            onClick={() => manager?.objects.addSwipeArrow()}
            className={cn(actionButton, "w-full justify-between px-3")}
          >
            <span>Arrow</span>
            <span className="font-mono text-muted-foreground">→</span>
          </button>
          <input
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Caption, e.g. swipe"
            aria-label="Swipe caption"
            className={fieldInput}
          />
          <div className="grid grid-cols-2 gap-1">
            {(
              [
                ["Brackets", `[${info.trim() || "swipe"}]`],
                ["Plain", info.trim() || "swipe"],
                ["Parentheses", `(${info.trim() || "swipe"})`],
                ["Dash", `– ${info.trim() || "swipe"}`],
              ] as const
            ).map(([name, cue]) => (
              <button
                key={name}
                type="button"
                disabled={!manager}
                title={`Add “${cue}” at the bottom left`}
                onClick={() => manager?.objects.addSwipeCue(cue)}
                className={cn(actionButton, "flex-col gap-0.5 px-2 py-1.5 h-auto")}
              >
                <span className="max-w-full truncate text-foreground">{cue}</span>
                <span className="text-[10px] text-muted-foreground">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </CollapsibleGroup>
    </div>
  );
}
