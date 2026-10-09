"use client";

import { useMemo, useState } from "react";
import { Dices, Loader2, RefreshCw, Sparkles } from "lucide-react";

import { useCanvasManager, useSlidesController } from "@/context/canvas-manager";
import {
  beginGenerateSession,
  cancelGenerateSession,
  endGenerateSession,
} from "@/lib/ai/generate-session";
import type { CarouselPaletteIdea, CarouselThemeIdea } from "@/lib/ai/ideas";
import { runCarouselGenerate } from "@/lib/ai/run-carousel-generate";
import { suggestedSetById } from "@/lib/ai/carousel-style";
import { SUGGESTED_SETS } from "@/lib/presets/backgrounds";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

export function SidebarGenerate() {
  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const genStatus = useCanvasStore((s) => s.genStatus);
  const [theme, setTheme] = useState("");
  const [slides, setSlides] = useState(6);
  const [setId, setSetId] = useState<string>("night");
  const [localError, setLocalError] = useState<string | null>(null);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [themes, setThemes] = useState<CarouselThemeIdea[]>([]);
  const [paletteIdeas, setPaletteIdeas] = useState<CarouselPaletteIdea[]>([]);

  const busy = genStatus === "streaming" || genStatus === "building";
  const selectedSet = suggestedSetById(setId) ?? SUGGESTED_SETS[0]!;

  const paletteRows = useMemo(() => {
    if (paletteIdeas.length === 0) return SUGGESTED_SETS.slice(0, 8);
    const picked = paletteIdeas
      .map((idea) => suggestedSetById(idea.setId))
      .filter((set): set is NonNullable<typeof set> => Boolean(set));
    const rest = SUGGESTED_SETS.filter((set) => !picked.some((p) => p.id === set.id));
    return [...picked, ...rest].slice(0, 10);
  }, [paletteIdeas]);

  const cancel = () => {
    cancelGenerateSession();
    useCanvasStore.getState().setGenerate({
      genStatus: "idle",
      genPhase: "",
      genFx: "idle",
    });
  };

  const applyPalette = (id: string) => {
    const set = suggestedSetById(id);
    if (!set) return;
    setSetId(set.id);
    useCanvasStore.getState().setPalette({
      background: set.background,
      text: set.text,
      accent: set.accent,
      card: set.card,
    });
  };

  const fetchIdeas = async () => {
    if (ideasLoading || busy) return;
    setIdeasLoading(true);
    setLocalError(null);
    try {
      const response = await fetch("/api/generate/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: theme.trim() }),
      });
      const data = (await response.json().catch(() => null)) as
        | { themes?: CarouselThemeIdea[]; palettes?: CarouselPaletteIdea[]; error?: string }
        | null;
      if (!response.ok) {
        throw new Error(data?.error || `Ideas failed (${response.status})`);
      }
      setThemes(data?.themes ?? []);
      setPaletteIdeas(data?.palettes ?? []);
      const firstPalette = data?.palettes?.[0]?.setId;
      if (firstPalette && suggestedSetById(firstPalette)) {
        applyPalette(firstPalette);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Couldn't invent themes");
    } finally {
      setIdeasLoading(false);
    }
  };

  const pickTheme = (idea: CarouselThemeIdea) => {
    setTheme(idea.prompt);
    setSlides(idea.slides);
    if (idea.setId) applyPalette(idea.setId);
  };

  const surpriseTheme = () => {
    if (themes.length === 0) {
      void fetchIdeas();
      return;
    }
    const idea = themes[Math.floor(Math.random() * themes.length)]!;
    pickTheme(idea);
  };

  const generate = async () => {
    if (!manager || !slidesController || busy) return;
    const trimmed = theme.trim();
    if (trimmed.length < 2) return;

    setLocalError(null);
    const abort = beginGenerateSession();

    try {
      await runCarouselGenerate({
        theme: trimmed,
        slides,
        setId,
        store: useCanvasStore,
        manager,
        slidesController,
        signal: abort.signal,
      });
    } catch (error) {
      if (abort.signal.aborted) return;
      const message = error instanceof Error ? error.message : "Generation failed";
      setLocalError(message);
      useCanvasStore.getState().setGenerate({
        genStatus: "error",
        genError: message,
        genPhase: "Generation failed",
        genFx: "idle",
      });
    } finally {
      endGenerateSession(abort);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-1 py-1 text-sm text-foreground">

      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={ideasLoading || busy}
          onClick={() => void fetchIdeas()}
          className={cn(
            "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-muted px-2.5 text-sm transition-colors",
            "hover:bg-muted/80 disabled:opacity-40",
          )}
        >
          {ideasLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {ideasLoading ? "Ideas…" : "Suggest themes"}
        </button>
        <button
          type="button"
          disabled={ideasLoading || busy}
          onClick={surpriseTheme}
          className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-muted px-3 text-sm transition-colors hover:bg-muted/80 disabled:opacity-40"
          title="Surprise theme"
        >
          <Dices className="size-3.5" />
        </button>
      </div>

      {themes.length > 0 ? (
        <div className="flex flex-col gap-1">
          <span className="px-1 font-medium text-muted-foreground">Themes</span>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
            {themes.map((idea) => {
              const set = suggestedSetById(idea.setId);
              const active = theme.trim() === idea.prompt.trim();
              return (
                <button
                  key={`${idea.title}-${idea.prompt}`}
                  type="button"
                  disabled={busy}
                  onClick={() => pickTheme(idea)}
                  className={cn(
                    "rounded-xl px-2.5 py-2 text-left transition-colors disabled:opacity-40",
                    active ? "bg-foreground text-background" : "bg-muted/40 hover:bg-muted/70",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {set ? (
                      <span
                        className="size-3.5 shrink-0 rounded-full border border-border/40"
                        style={{ backgroundColor: set.background }}
                      />
                    ) : null}
                    <span className="truncate font-medium">{idea.title}</span>
                    <span
                      className={cn(
                        "ml-auto shrink-0 text-[10px]",
                        active ? "text-background/70" : "text-muted-foreground",
                      )}
                    >
                      {idea.slides}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 line-clamp-2 text-[11px] w-12 leading-snug",
                      active ? "text-background/75" : "text-muted-foreground",
                    )}
                  >
                    {idea.prompt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="px-1 font-medium text-muted-foreground">Theme</span>
        <textarea
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          placeholder="Seed a niche, or paste a full carousel brief…"
          rows={3}
          disabled={busy}
          className="w-full resize-none rounded-xl bg-muted/30 px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus:bg-muted/50 disabled:opacity-50"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-medium text-muted-foreground">Palette</span>
          <span className="text-[10px] text-muted-foreground">{selectedSet.label}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted/30 px-2 py-1.5">
          {(
            [
              ["background", selectedSet.background],
              ["text", selectedSet.text],
              ["accent", selectedSet.accent],
              ["card", selectedSet.card],
            ] as const
          ).map(([label, color]) => (
            <span
              key={label}
              title={`${label} ${color}`}
              className="size-5 rounded-full border border-border/50"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="truncate pl-1 text-[11px] text-muted-foreground">
            {paletteIdeas.find((p) => p.setId === selectedSet.id)?.reason || selectedSet.label}
          </span>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {paletteRows.map((set) => {
            const active = set.id === setId;
            return (
              <button
                key={set.id}
                type="button"
                disabled={busy}
                title={set.label}
                onClick={() => applyPalette(set.id)}
                className={cn(
                  "aspect-square rounded-full border transition-transform hover:scale-105 disabled:opacity-40",
                  active ? "border-foreground ring-2 ring-foreground/70" : "border-border/40",
                )}
                style={{ backgroundColor: set.background }}
                aria-label={set.label}
              />
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="px-1 font-medium text-muted-foreground">Slides</span>
        <input
          type="number"
          min={1}
          max={20}
          value={slides}
          disabled={busy}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isFinite(next)) return;
            setSlides(Math.min(20, Math.max(1, Math.round(next))));
          }}
          className="h-8 w-full rounded-full bg-muted/30 px-3 text-sm outline-none focus:bg-muted/50 disabled:opacity-50"
        />
      </label>

      {localError ? <p className="px-1 text-[11px] text-destructive">{localError}</p> : null}

      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={theme.trim().length < 2 || !manager || !slidesController || busy}
          onClick={() => void generate()}
          className={cn(
            "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground px-2.5 text-sm text-background transition-opacity",
            "disabled:opacity-40",
          )}
        >
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
          {busy ? "Generating…" : "Generate"}
        </button>
        {busy ? (
          <button
            type="button"
            onClick={cancel}
            className="h-8 rounded-full bg-muted px-3 text-sm text-foreground transition-colors hover:bg-muted/80"
          >
            Stop
          </button>
        ) : null}
      </div>
    </div>
  );
}
