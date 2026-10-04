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
import { CornerLeftUpIcon, CornerRightUpIcon, MapIcon } from "lucide-react";
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

type CueStyleId = "brackets" | "plain" | "parentheses" | "dash";

const CUE_STYLES: readonly { id: CueStyleId; label: string }[] = [
  { id: "brackets", label: "Brackets" },
  { id: "plain", label: "Plain" },
  { id: "parentheses", label: "Parentheses" },
  { id: "dash", label: "Dash" },
];

function formatCue(style: CueStyleId, raw: string): string {
  const word = raw.trim() || "swipe";
  if (style === "brackets") return `[${word}]`;
  if (style === "parentheses") return `(${word})`;
  if (style === "dash") return `– ${word}`;
  return word;
}

const fieldLabel = "px-0.5 text-[11px] text-muted-foreground";

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
  const [cueStyle, setCueStyle] = useState<CueStyleId>("brackets");
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
  const handleText = handle.trim() || "@username";
  const handleInitial = (handleText.replace(/^@/, "")[0] || "?").toUpperCase();
  const cueText = formatCue(cueStyle, info);

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

      <CollapsibleGroup id="tools-handle" title="Author">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-muted/30 px-2.5 py-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold">
              {handleInitial}
            </span>
            <span className="min-w-0 leading-tight">
              {platform ? (
                <span className="block truncate text-xs font-medium">{platform}</span>
              ) : null}
              <span
                className={cn(
                  "block truncate",
                  platform ? "text-[11px] text-muted-foreground" : "text-xs font-medium",
                )}
              >
                ({handleText})
              </span>
            </span>
          </div>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@username"
            aria-label="Handle"
            className={fieldInput}
          />
          <div className="space-y-1">
            <p className={fieldLabel}>Platform name</p>
            <div className="grid grid-cols-2 gap-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={platform === p}
                  title={`Print ${p} above the handle`}
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "h-7 truncate rounded-full px-2 text-xs transition-colors",
                    platform === p
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className={fieldLabel}>Top edge</p>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                disabled={!manager}
                onClick={() => addHandle("left")}
                className={actionButton}
              >
                <CornerLeftUpIcon className="size-3.5" />
                Top left
              </button>
              <button
                type="button"
                disabled={!manager}
                onClick={() => addHandle("right")}
                className={actionButton}
              >
                <CornerRightUpIcon className="size-3.5" />
                Top right
              </button>
            </div>
          </div>
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-look" title="Attention">
        <div className="space-y-2.5">
          <div className="space-y-1.5">
            <p className={fieldLabel}>Where eyes go · {insightPlatform}</p>
            <ol className="space-y-1.5">
              {attention.map((zone, index) => (
                <li key={zone.id} className="flex gap-2">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="text-foreground">{zone.label}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{zone.hint}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            aria-pressed={showAttention}
            onClick={() => setShowAttention(!showAttention)}
            className={cn(
              actionButton,
              "w-full justify-between px-3",
              showAttention && "bg-foreground text-background hover:bg-foreground",
            )}
          >
            <span className="flex items-center gap-1.5">
              <MapIcon className="size-3.5" />
              Show on the slide
            </span>
            <span>{showAttention ? "On" : "Off"}</span>
          </button>
          <div className="space-y-1.5 rounded-xl bg-muted/30 px-2.5 py-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-foreground">Reach</span>
              <span className="tabular-nums text-muted-foreground">
                <span className="text-foreground">{reach.score}</span> {reach.label}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-foreground/70"
                style={{ width: `${reach.score}%` }}
              />
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

      <CollapsibleGroup id="tools-cues" title="Swipe">
        <div className="space-y-2">
          <div className="relative h-24 rounded-xl bg-muted/30">
            <button
              type="button"
              disabled={!manager}
              title={`Place “${cueText}” at the bottom left`}
              onClick={() => manager?.objects.addSwipeCue(cueText)}
              className="absolute bottom-2 left-2 flex max-w-[58%] flex-col items-start rounded-lg bg-background px-2 py-1 text-left shadow-sm ring-1 ring-foreground/10 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <span className="max-w-full truncate text-xs text-foreground">{cueText}</span>
              <span className="text-[10px] text-muted-foreground">Bottom left</span>
            </button>
            <button
              type="button"
              disabled={!manager}
              title="Place an arrow at the bottom right"
              onClick={() => manager?.objects.addSwipeArrow()}
              className="absolute bottom-2 right-2 flex flex-col items-end rounded-lg bg-background px-2 py-1 shadow-sm ring-1 ring-foreground/10 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <span className="font-mono text-sm leading-none text-foreground">→</span>
              <span className="text-[10px] text-muted-foreground">Bottom right</span>
            </button>
          </div>
          <div className="space-y-1">
            <p className={fieldLabel}>Caption</p>
            <input
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="swipe"
              aria-label="Swipe caption"
              className={fieldInput}
            />
          </div>
          <div className="space-y-1">
            <p className={fieldLabel}>Style</p>
            <div className="grid grid-cols-2 gap-1">
              {CUE_STYLES.map((style) => {
                const sample = formatCue(style.id, info);
                const selected = cueStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    title={style.label}
                    aria-pressed={selected}
                    onClick={() => setCueStyle(style.id)}
                    className={cn(
                      "h-8 min-w-0 truncate rounded-full px-2.5 text-xs transition-colors",
                      selected
                        ? "bg-foreground text-background"
                        : "bg-muted/40 text-foreground hover:bg-muted",
                    )}
                  >
                    {sample}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CollapsibleGroup>
    </div>
  );
}
