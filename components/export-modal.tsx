"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Download, Loader2 } from "lucide-react";
import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import {
  downloadSlidesAsZip,
  downloadSlidesSeparately,
  renderSlidesToImages,
  type ExportFormat,
} from "@/lib/export/carousel";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PackMode = "zip" | "files";
type ScaleOption = 1 | 2;

function Segmented<T extends string | number>({
  value,
  options,
  disabled,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  disabled?: boolean;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full bg-muted/50 p-0.5">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-8 flex-1 rounded-full text-xs transition-colors",
            value === opt.value
              ? "bg-background text-foreground shadow-xs font-medium"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const slidesController = useSlidesController();
  const slides = useCanvasStore((s) => s.slides);
  const markedSlideIds = useCanvasStore((s) => s.markedSlideIds);
  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);

  const [format, setFormat] = useState<ExportFormat>("png");
  const [pack, setPack] = useState<PackMode>("zip");
  const [scale, setScale] = useState<ScaleOption>(1);
  const [scope, setScope] = useState<"all" | "marked">("all");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
      setExporting(false);
      setProgress(0);
      setDone(false);
      setError(null);
    }
  }, [open]);

  const sizeLabel = useMemo(() => {
    const w = canvasDimensions.width * scale;
    const h = canvasDimensions.height * scale;
    return `${w}×${h}`;
  }, [canvasDimensions, scale]);

  const exportSlides = useMemo(
    () =>
      scope === "marked"
        ? slides.filter((slide) => markedSlideIds.includes(slide.id))
        : slides,
    [scope, slides, markedSlideIds],
  );

  const handleExport = async () => {
    if (exporting || exportSlides.length === 0) return;
    setError(null);
    setDone(false);
    setExporting(true);
    setProgress(0);

    slidesController?.saveCurrent();
    const state = useCanvasStore.getState();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const rendered = await renderSlidesToImages(
        state.slides
          .filter((slide) => exportSlides.some((chosen) => chosen.id === slide.id))
          .map((s) => ({ id: s.id, canvasJSON: s.canvasJSON })),
        state.canvasDimensions,
        {
          format,
          quality: format === "jpeg" ? 0.92 : 1,
          multiplier: scale,
          signal: controller.signal,
          onProgress: (doneCount, total) => {
            setProgress(Math.round((doneCount / total) * 100));
          },
        },
      );

      if (pack === "zip") {
        await downloadSlidesAsZip(rendered, state.projectTitle, format);
      } else {
        downloadSlidesSeparately(rendered, state.projectTitle, format);
      }

      setDone(true);
      setTimeout(() => onOpenChange(false), 600);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
      abortRef.current = null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl border-none p-5 gap-5 shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-base font-semibold tracking-tight">
            Export
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {scope === "marked"
              ? `${exportSlides.length} of ${slides.length} marked`
              : `${slides.length} slide${slides.length === 1 ? "" : "s"}`}
            {" · "}
            {sizeLabel}
          </p>
        </DialogHeader>

        <div className="space-y-3">
          <Segmented
            value={scope}
            disabled={exporting}
            onChange={(value) => setScope(value as "all" | "marked")}
            options={[
              { value: "all", label: "All" },
              {
                value: "marked",
                label: markedSlideIds.length > 0 ? `Marked ${markedSlideIds.length}` : "Marked",
              },
            ]}
          />
          <Segmented
            value={format}
            disabled={exporting}
            onChange={(v) => setFormat(v as ExportFormat)}
            options={[
              { value: "png", label: "PNG" },
              { value: "jpeg", label: "JPEG" },
            ]}
          />
          <Segmented
            value={scale}
            disabled={exporting}
            onChange={(v) => setScale(v as ScaleOption)}
            options={[
              { value: 1, label: "1×" },
              { value: 2, label: "2×" },
            ]}
          />
          <Segmented
            value={pack}
            disabled={exporting}
            onChange={(v) => setPack(v as PackMode)}
            options={[
              { value: "zip", label: "ZIP" },
              { value: "files", label: "Files" },
            ]}
          />
          {scope === "marked" && exportSlides.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Mark slides with the corner check on the strip.
            </p>
          )}
        </div>

        {(exporting || done) && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{done ? "Done" : "Rendering…"}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button
          type="button"
          size="lg"
          className="w-full rounded-full"
          disabled={exporting || exportSlides.length === 0}
          onClick={() => void handleExport()}
        >
          {exporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : done ? (
            <Check className="size-4" />
          ) : (
            <Download className="size-4" />
          )}
          {exporting ? "Exporting…" : done ? "Downloaded" : "Download"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
