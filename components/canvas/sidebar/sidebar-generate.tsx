"use client";

import { useState } from "react";
import type { FabricObject } from "fabric";
import { generateDesign, type GenerateKind } from "@/actions/generate";
import { useCanvasManager, useSlidesController } from "@/context/canvas-manager";
import { paintSlide, type PaletteSlot, type ProjectPalette } from "@/lib/canvas/document";
import { collectSlideText, slidesFromGenerated } from "@/lib/canvas/generated-carousel";
import { paintSlotOnCanvas } from "@/lib/canvas/paint-live";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

const KINDS: readonly { id: GenerateKind; label: string; note: string; placeholder: string }[] = [
  {
    id: "slides",
    label: "Slides",
    note: "Quiet pins. One line, lots of space",
    placeholder: "Topic, tone, how many slides",
  },
  {
    id: "text",
    label: "Text",
    note: "Rewrites the copy on this slide",
    placeholder: "What the slide should say",
  },
  {
    id: "image",
    label: "Image",
    note: "DeepSeek doesn't generate pictures",
    placeholder: "Subject, style, mood",
  },
  {
    id: "background",
    label: "Background",
    note: "DeepSeek doesn't generate pictures",
    placeholder: "Color, texture, atmosphere",
  },
  {
    id: "icons",
    label: "Icons",
    note: "A simple mark on this slide",
    placeholder: "What the icon stands for",
  },
  {
    id: "palette",
    label: "Palette",
    note: "Colors for the whole carousel",
    placeholder: "Brand, feeling, references",
  },
];

const CHROME = new Set(["number", "handle", "swipe", "cue"]);
const SLOTS: readonly PaletteSlot[] = ["background", "text", "accent", "card"];

function isCopyText(obj: FabricObject): boolean {
  const type = (obj.type || "").toLowerCase();
  if (type !== "text" && type !== "i-text" && type !== "textbox" && type !== "itext") return false;
  const role = (obj as FabricObject & { swibpRole?: string }).swibpRole;
  return !role || !CHROME.has(role);
}

function carouselContext(): string {
  return useCanvasStore
    .getState()
    .slides.map((slide, index) => {
      const lines = collectSlideText(slide.canvasJSON.objects ?? []).slice(0, 3);
      return lines.length ? `${index + 1}. ${lines.join(" / ")}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

export function SidebarGenerate() {
  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const [kind, setKind] = useState<GenerateKind>("slides");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selected = KINDS.find((item) => item.id === kind) ?? KINDS[0];

  const applyPalette = (palette: ProjectPalette) => {
    const store = useCanvasStore.getState();
    const changed = SLOTS.filter((slot) => palette[slot] !== store.palette[slot]);
    const slides = store.slides.map((slide) => {
      let canvasJSON = slide.canvasJSON;
      for (const slot of changed) canvasJSON = paintSlide(canvasJSON, slot, palette[slot]);
      return { ...slide, canvasJSON };
    });
    store.setPalette(palette);
    if (changed.length > 0) store.setSlides(slides);
    store.setDirty(true);
    if (!manager || changed.length === 0) return;
    for (const slot of changed) paintSlotOnCanvas(manager.canvas, slot, palette[slot]);
    if (changed.includes("background")) {
      void manager.setBackground({ type: "solid", color: palette.background });
    } else {
      manager.commit();
    }
  };

  const applyText = (lines: string[]) => {
    if (!manager) return;
    const nodes = manager.canvas.getObjects().filter(isCopyText);
    if (nodes.length === 0) {
      manager.objects.addHeading(lines[0] ?? "");
      if (lines.length > 1) manager.objects.addParagraph(lines.slice(1).join(" "));
      manager.commit();
      return;
    }
    manager.transact(() => {
      nodes.forEach((node, index) => {
        if (index >= lines.length) return;
        const parts = index === nodes.length - 1 ? lines.slice(index) : [lines[index]!];
        node.set({ text: parts.join("\n") });
        (node as FabricObject & { initDimensions?: () => void }).initDimensions?.();
      });
    });
  };

  const run = async () => {
    if (busy || prompt.trim().length < 2) return;
    if (!manager || !slidesController) {
      setError("Canvas is still loading");
      return;
    }
    setBusy(true);
    setError(null);
    const store = useCanvasStore.getState();
      const result = await generateDesign({
      kind,
      prompt,
      width: store.canvasDimensions.width,
      height: store.canvasDimensions.height,
      context: kind === "slides" || kind === "text" ? carouselContext() : undefined,
    });
    setBusy(false);
    if (!result.ok) {
      setError("Generation failed");
      return;
    }

    if (result.kind === "slides") {
      const current = useCanvasStore.getState();
      const next = slidesFromGenerated({
        carousel: result.carousel,
        textStyles: current.textStyles,
        chrome: current.chrome,
        width: current.canvasDimensions.width,
        height: current.canvasDimensions.height,
      });
      current.setPalette(result.carousel.palette);
      current.setSlides(next);
      current.setCurrentSlideId(next[0]!.id);
      current.setDirty(true);
      await slidesController.loadCurrent();
      return;
    }

    if (result.kind === "text") {
      applyText(result.lines);
      return;
    }

    if (result.kind === "palette") {
      applyPalette(result.palette);
      return;
    }

    if (result.kind === "icons") {
      await manager.io.addSVG(result.svg, { maxSize: 180, recolorable: true });
      manager.commit();
      return;
    }

    if (result.kind === "background") {
      await manager.setBackground({ type: "image", url: result.dataUrl });
      return;
    }

    const size = Math.round(
      Math.min(store.canvasDimensions.width, store.canvasDimensions.height) * 0.72,
    );
    await manager.objects.addImage(result.dataUrl, { maxSize: size });
    manager.commit();
  };

  return (
    <div className="flex flex-col gap-3 px-1 py-1 text-xs text-foreground">
      <div className="grid grid-cols-2 gap-1">
        {KINDS.map((item) => {
          const active = item.id === kind;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setKind(item.id);
                setError(null);
              }}
              className={cn(
                "h-8 rounded-full px-2.5 text-xs transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "bg-muted/40 text-foreground/80 hover:bg-muted",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <p className="px-1 text-muted-foreground">{selected.note}</p>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder={selected.placeholder}
        rows={4}
        disabled={busy}
        className="w-full resize-none rounded-xl bg-muted/30 px-3 py-2 text-xs leading-relaxed outline-none placeholder:text-muted-foreground focus:bg-muted/50 disabled:opacity-60"
      />

      <button
        type="button"
        disabled={busy || prompt.trim().length < 2}
        onClick={() => void run().catch((reason: unknown) => {
          setBusy(false);
          setError(reason instanceof Error ? reason.message : "Generation failed");
        })}
        className="flex h-8 w-full items-center justify-center rounded-full bg-foreground px-2.5 text-xs text-background transition-opacity disabled:opacity-40"
      >
        {busy ? "Generating" : "Generate"}
      </button>

      {error ? <p className="px-1 text-center text-destructive">{error}</p> : null}
    </div>
  );
}
