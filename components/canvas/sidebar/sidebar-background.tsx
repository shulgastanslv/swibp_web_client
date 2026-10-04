"use client";

import { useMemo, useRef, useState } from "react";
import { UploadCloud, Loader2, Plus, Dices, ImageIcon } from "lucide-react";
import {
  SOLID_PRESETS,
  GRADIENT_PRESETS,
} from "@/lib/presets/backgrounds";
import {
  generatePalette,
  PALETTE_MODES,
  randomSeedHex,
  type PaletteMode,
} from "@/lib/color/palette";
import {
  PALETTE_SLOTS,
  paintSlide,
  paletteFromHarmony,
  type PaletteSlot,
  type ProjectPalette,
} from "@/lib/canvas/document";
import { paintSlotOnCanvas } from "@/lib/canvas/paint-live";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import { fileToDataUrl } from "@/lib/image/file-to-data-url";
import { useCanvasManager } from "@/context/canvas-manager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = "color" | "gradient" | "image";

const FILL_TABS: { id: Tab; label: string }[] = [
  { id: "color", label: "Color" },
  { id: "gradient", label: "Gradient" },
  { id: "image", label: "Image" },
];

export function SidebarBackground() {
  const manager = useCanvasManager();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("color");
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const [seed, setSeed] = useState("#3b82f6");
  const [mode, setMode] = useState<PaletteMode>("analogous");

  const harmony = useMemo(() => generatePalette(seed, mode), [seed, mode]);
  const projectPalette = useCanvasStore((s) => s.palette);

  const applyProjectPalette = (next: ProjectPalette) => {
    const store = useCanvasStore.getState();
    const before = store.palette;
    const slots = Object.keys(next) as PaletteSlot[];
    if (slots.every((slot) => next[slot] === before[slot])) return;

    let slides = store.slides;
    for (const slot of slots) {
      if (next[slot] === before[slot]) continue;
      slides = slides.map((slide) => ({
        ...slide,
        canvasJSON: paintSlide(slide.canvasJSON, slot, next[slot]),
      }));
      if (manager) paintSlotOnCanvas(manager.canvas, slot, next[slot]);
    }
    store.setPalette(next);
    store.setSlides(slides);
    store.setDirty(true);
    if (next.background !== before.background) {
      void manager?.setBackground({ type: "solid", color: next.background });
    } else {
      manager?.commit();
    }
  };

  const setProjectSlot = (slot: PaletteSlot, color: string) => {
    applyProjectPalette({ ...projectPalette, [slot]: color });
  };

  const applySolid = (color: string) => {
    void manager?.setBackground({ type: "solid", color });
  };

  const applyGradient = (colors: [string, string]) => {
    void manager?.setBackground({ type: "gradient", colors });
  };

  const applyImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    void fileToDataUrl(file)
      .then((dataUrl) => manager?.setBackground({ type: "image", url: dataUrl }))
      .catch(console.error);
  };

  const applyImageFromUrl = async () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
      if (!/^https?:$/i.test(parsed.protocol)) {
        setUrlError("Need http(s) URL");
        return;
      }
    } catch {
      setUrlError("Invalid URL");
      return;
    }

    setUrlError(null);
    setUrlLoading(true);
    try {
      await manager?.setBackground({ type: "image", url: parsed.toString() });
    } catch (err) {
      console.error(err);
      setUrlError("Couldn't load image (CORS?)");
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-hidden p-2 text-xs">
      <section className="flex min-w-0 flex-col gap-2">
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="gap-2">
        <TabsList className="grid h-8 w-full grid-cols-3 rounded-full">
          {FILL_TABS.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="rounded-full text-xs shadow-none data-active:border-transparent dark:data-active:border-transparent"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="color">
          <div className="grid grid-cols-8 gap-1.5">
            {SOLID_PRESETS.map((p) => (
              <button
                key={p.color}
                type="button"
                title={p.color}
                onClick={() => applySolid(p.color)}
                style={{ backgroundColor: p.color }}
                className="aspect-square rounded-full border border-border/40 transition-transform hover:scale-110 active:scale-95"
              />
            ))}
            <label
              title="Custom color"
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full border border-dashed border-border/80 bg-muted/30 transition-transform hover:scale-110"
            >
              <input
                type="color"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => applySolid(e.target.value)}
              />
              <Plus className="h-3 w-3 text-muted-foreground" />
            </label>
          </div>
        </TabsContent>

        <TabsContent value="gradient">
          <div className="grid grid-cols-8 gap-1.5">
            {GRADIENT_PRESETS.map((g, i) => (
              <button
                key={`${g.colors[0]}-${g.colors[1]}-${i}`}
                type="button"
                onClick={() => applyGradient(g.colors)}
                className="aspect-square rounded-full border border-border/30 transition-transform hover:scale-[1.04] active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                }}
                aria-label={`Gradient ${i + 1}`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="image">
          <div className="flex min-w-0 flex-col gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) applyImageFile(file);
                e.target.value = "";
              }}
              accept="image/*"
              className="hidden"
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) applyImageFile(file);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed p-4 text-center transition-colors",
                isDragging
                  ? "border-foreground/40 bg-muted/40"
                  : "border-border/80 bg-muted/20 hover:bg-muted/35",
              )}
            >
              <UploadCloud className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Upload</span>
              <span className="text-xs text-muted-foreground">Drop or click</span>
            </div>

            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="flex items-center gap-1 font-medium text-muted-foreground">
                <ImageIcon className="h-3 w-3" />
                Or paste a link
              </p>
              <div className="flex gap-1.5">
                <Input
                  type="url"
                  placeholder="https://…"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setUrlError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void applyImageFromUrl();
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={urlLoading || !imageUrl.trim()}
                  onClick={() => void applyImageFromUrl()}
                  className="rounded-full"
                >
                  {urlLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {urlError && <p className="text-xs text-destructive">{urlError}</p>}
            </div>
          </div>
        </TabsContent>
        </Tabs>
      </section>

      <section className="flex min-w-0 flex-col gap-2 border-t border-border/50 pt-3">
        <div>
          <p className="font-medium text-foreground">Every slide</p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Text, accent, and cards use these colors on the whole carousel.
          </p>
        </div>

        <div className="flex flex-col">
          {PALETTE_SLOTS.map((slot) => (
            <label
              key={slot.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-full px-2 py-2 hover:bg-muted/30"
            >
              <input
                type="color"
                value={projectPalette[slot.id]}
                onChange={(e) => setProjectSlot(slot.id, e.target.value)}
                aria-label={slot.label}
                className="size-7 shrink-0 cursor-pointer rounded-full border border-border/50 bg-transparent p-0"
              />
              <span className="flex-1 text-foreground">{slot.label}</span>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                {projectPalette[slot.id]}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-sm bg-muted/25 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-foreground">Suggest a set</span>
            <div className="flex items-center gap-1">
              <label
                className="relative h-5 w-5 cursor-pointer overflow-hidden rounded-full ring-1 ring-border/50"
                title="Starting color"
              >
                <input
                  type="color"
                  value={seed}
                  aria-label="Starting color"
                  onChange={(e) => setSeed(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <span className="block h-full w-full" style={{ backgroundColor: seed }} />
              </label>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                title="Random starting color"
                onClick={() => setSeed(randomSeedHex())}
                className="rounded-full"
              >
                <Dices />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {PALETTE_MODES.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="xs"
                variant={mode === item.id ? "default" : "secondary"}
                onClick={() => setMode(item.id)}
                className="rounded-full"
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {harmony.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                title={`Fill this slide with ${color}`}
                onClick={() => applySolid(color)}
                className="h-7 w-7 rounded-full border border-border/30 transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            A color fills this slide. Apply sets Background, Text, Accent, and Card on every slide.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full rounded-full"
            onClick={() => applyGradient([harmony[0], harmony[harmony.length - 1]])}
          >
            Fill this slide with a gradient
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full rounded-full"
            onClick={() => applyProjectPalette(paletteFromHarmony(harmony, seed))}
          >
            Apply to every slide
          </Button>
        </div>
      </section>
    </div>
  );
}
