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
import { CornerLeftUpIcon, CornerRightUpIcon } from "lucide-react";
import { applyCarouselFont } from "@/lib/canvas/apply-carousel-font";
import { carouselTextHits, replaceTextInJSON, replaceTextOnNodes } from "@/lib/canvas/find-text";
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

const actionButton =
  "h-8 rounded-full bg-muted px-2.5 text-xs text-foreground/80 transition-colors hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-40 flex items-center justify-center gap-1";
const fieldInput =
  "h-8 w-full rounded-full bg-muted/40 px-3 text-xs outline-none placeholder:text-muted-foreground focus:bg-muted/60";

export function SidebarTools() {
  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const { currentIndex, currentSlideId, slides } = useSlides();
  const [prompt, setPrompt] = useState("");
  const [slideStyle, setSlideStyle] = useState<TextStyleId>("heading");
  const [handle, setHandle] = useState("@username");
  const [info, setInfo] = useState("swipe");
  const [cueStyle, setCueStyle] = useState<CueStyleId>("brackets");
  const [textTick, setTextTick] = useState(0);
  const objects = useCanvasObjects();
  const markedSlideIds = useCanvasStore((s) => s.markedSlideIds);
  const [fontScope, setFontScope] = useState<"all" | "marked">("all");
  const [findQuery, setFindQuery] = useState("");
  const [findReplacement, setFindReplacement] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const activeFont = firstFont(objects);

  useEffect(() => {
    for (const family of SUGGESTED_FONTS) void loadGoogleFont(family);
  }, []);

  const useFont = (family: string) => {
    if (fontScope === "marked" && markedSlideIds.length === 0) return;
    void loadGoogleFont(family).then(() => {
      applyCarouselFont(
        family,
        manager,
        fontScope === "marked" ? markedSlideIds : undefined,
      );
    });
  };

  const slideIndex = Math.max(currentIndex, 0);
  const slideTotal = Math.max(slides.length, 1);
  const handleText = handle.trim() || "@username";
  const handleInitial = (handleText.replace(/^@/, "")[0] || "?").toUpperCase();
  const cueText = formatCue(cueStyle, info);

  const addHandle = (side: Side) =>
    manager?.objects.addCornerHandle(handle.trim() || "@username", side);

  const lineCount = splitSlideLines(prompt).length;

  useEffect(() => {
    if (!manager) return;
    const bump = () => setTextTick((tick) => tick + 1);
    manager.canvas.on("text:changed", bump);
    return () => {
      manager.canvas.off("text:changed", bump);
    };
  }, [manager]);

  const textHits = useMemo(() => {
    return carouselTextHits({
      query: findQuery.trim(),
      matchCase,
      slides: slides.map((slide) => ({
        id: slide.id,
        objects:
          slide.id === currentSlideId && manager
            ? manager.canvas.getObjects()
            : (slide.canvasJSON.objects ?? []),
      })),
    });
  }, [slides, currentSlideId, manager, findQuery, matchCase, textTick, objects]);

  const replaceText = () => {
    const query = findQuery.trim();
    if (!query || !slidesController) return;
    slidesController.saveCurrent();
    const store = useCanvasStore.getState();
    let total = 0;
    const next = store.slides.map((slide) => {
      const replaced = replaceTextInJSON(slide.canvasJSON, query, findReplacement, matchCase);
      total += replaced.count;
      return replaced.count > 0 ? { ...slide, canvasJSON: replaced.json } : slide;
    });
    if (total === 0) return;
    store.setSlides(next);
    if (manager) {
      replaceTextOnNodes(manager.canvas.getObjects(), query, findReplacement, matchCase);
      manager.canvas.requestRenderAll();
      manager.commit();
    }
    store.setDirty(true);
  };

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
        <div className="flex rounded-full bg-muted/50 p-0.5">
          {(
            [
              ["all", "All slides"],
              ["marked", markedSlideIds.length > 0 ? `Marked ${markedSlideIds.length}` : "Marked"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFontScope(id)}
              className={cn(
                "h-7 flex-1 rounded-full text-xs transition-colors",
                fontScope === id ? "bg-background text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {SUGGESTED_FONTS.map((family) => {
            const selected = activeFont === family;
            return (
              <button
                key={family}
                type="button"
                title={
                  fontScope === "marked"
                    ? `Use ${family} on marked slides`
                    : `Use ${family} on every text`
                }
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

      <CollapsibleGroup id="tools-find" title="Find">
        <div className="space-y-1.5">
          <input
            value={findQuery}
            onChange={(event) => setFindQuery(event.target.value)}
            placeholder="Find"
            aria-label="Find text"
            className={fieldInput}
          />
          <input
            value={findReplacement}
            onChange={(event) => setFindReplacement(event.target.value)}
            placeholder="Replace with"
            aria-label="Replacement text"
            className={fieldInput}
          />
          <label className="flex items-center gap-2 px-0.5 text-[11px] text-muted-foreground">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(event) => setMatchCase(event.target.checked)}
              className="size-3.5 rounded-sm"
            />
            Match case
          </label>
          <p className="px-0.5 text-[11px] text-muted-foreground">
            {findQuery.trim()
              ? textHits.count === 0
                ? "No matches"
                : `${textHits.count} on slide${textHits.slides.length === 1 ? "" : "s"} ${textHits.slides.join(", ")}`
              : "Searches every slide"}
          </p>
          <button
            type="button"
            disabled={!findQuery.trim() || textHits.count === 0}
            onClick={replaceText}
            className={cn(actionButton, "w-full")}
          >
            Replace
          </button>
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
            <span className="min-w-0 truncate text-xs font-medium leading-tight">{handleText}</span>
          </div>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@username"
            aria-label="Handle"
            className={fieldInput}
          />
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
      </CollapsibleGroup>

      <CollapsibleGroup id="tools-cues" title="Swipe">
        <div className="space-y-2">
          <input
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="swipe"
            aria-label="Swipe text"
            className={fieldInput}
          />
          <div className="grid grid-cols-2 gap-1">
            {CUE_STYLES.map((style) => {
              const sample = formatCue(style.id, info);
              const selected = cueStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCueStyle(style.id)}
                  className={cn(
                    "h-8 min-w-0 truncate rounded-full px-2.5 text-xs transition-colors",
                    selected
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {sample}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              disabled={!manager}
              title="Bottom left"
              onClick={() => manager?.objects.addSwipeCue(cueText)}
              className={actionButton}
            >
              <span className="truncate">{cueText}</span>
            </button>
            <button
              type="button"
              disabled={!manager}
              title="Bottom right"
              onClick={() => manager?.objects.addSwipeArrow()}
              className={actionButton}
            >
              Arrow →
            </button>
          </div>
        </div>
      </CollapsibleGroup>
    </div>
  );
}
