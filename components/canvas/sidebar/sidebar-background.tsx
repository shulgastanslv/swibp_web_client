"use client";

import { useMemo, useRef, useState } from "react";
import { UploadCloud, Link2, Loader2, Plus, Dices } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { fileToDataUrl } from "@/lib/image/file-to-data-url";
import { useCanvasManager } from "@/context/canvas-manager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Tab = "color" | "gradient" | "image";

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

  const palette = useMemo(() => generatePalette(seed, mode), [seed, mode]);

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
    <div className="flex min-w-0 flex-col gap-3 overflow-hidden p-1.5 text-xs">
      <nav className="flex min-w-0 gap-0.5 rounded-full bg-muted/30 p-1">
        {(
          [
            ["color", "Color"],
            ["gradient", "Gradient"],
            ["image", "Image"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-6 min-w-0 flex-1 truncate rounded-full text-xs font-medium tracking-tight transition-colors",
              tab === id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "color" && (
        <>
          <section className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground/80">
                Palette
              </span>
              <div className="flex items-center gap-1">
                <label
                  className="relative h-5 w-5 overflow-hidden rounded-full ring-1 ring-border/50 cursor-pointer"
                  title="Seed color"
                >
                  <input
                    type="color"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <span
                    className="block h-full w-full"
                    style={{ backgroundColor: seed }}
                  />
                </label>
                <button
                  type="button"
                  title="Random seed"
                  onClick={() => setSeed(randomSeedHex())}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  <Dices className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap gap-1">
              {PALETTE_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "h-6 rounded-full px-2 text-xs transition-colors",
                    mode === m.id
                      ? "bg-foreground/90 text-background"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex flex-row flex-wrap gap-1">
              {palette.map((c, i) => (
                <button
                  key={`${c}-${i}`}
                  type="button"
                  title={c}
                  onClick={() => applySolid(c)}
                  className="h-8 w-8 rounded-full border border-border/30 transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                applyGradient([palette[0], palette[palette.length - 1]])
              }
              className="h-7 w-full rounded-full border border-border/30 text-xs text-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
              style={{
                background: `linear-gradient(135deg, ${palette[0]}, ${palette[palette.length - 1]})`,
              }}
            >
              <span className="rounded-full bg-muted/50 px-1.5 py-0.5 backdrop-blur-sm">
                Use as gradient
              </span>
            </button>
          </section>

          <section className="flex min-w-0 flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground/80">
              Solids
            </span>
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
              <label className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full border border-dashed border-border/80 bg-muted/30 transition-transform hover:scale-110">
                <input
                  type="color"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => applySolid(e.target.value)}
                />
                <Plus className="h-3 w-3 text-muted-foreground" />
              </label>
            </div>
          </section>
        </>
      )}

      {tab === "gradient" && (
        <section className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground/80">
              Presets
            </span>
            <span className="tabular-nums text-xs text-muted-foreground/40">
              {GRADIENT_PRESETS.length}
            </span>
          </div>
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
        </section>
      )}

      {tab === "image" && (
        <section className="flex min-w-0 flex-col gap-2.5">
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
              "flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed p-4 text-center cursor-pointer transition-colors",
              isDragging
                ? "border-foreground/40 bg-muted/40"
                : "border-border/80 bg-muted/20 hover:bg-muted/35",
            )}
          >
            <UploadCloud className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Upload</span>
            <span className="text-[10px] text-muted-foreground">
              Drop or click
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground/80">
              <Link2 className="h-3 w-3" />
              URL
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
                className="h-8 rounded-full border-border/60 bg-muted/30 text-xs"
              />
              <Button
                type="button"
                size="sm"
                disabled={urlLoading || !imageUrl.trim()}
                onClick={() => void applyImageFromUrl()}
                className="h-8 shrink-0 rounded-full px-3 text-xs"
              >
                {urlLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {urlError && (
              <p className="text-xs text-destructive">{urlError}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
