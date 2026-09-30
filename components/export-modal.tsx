"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Check,
  Download,
  FileImage,
  FolderArchive,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
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

const SCALE_OPTIONS: { value: ScaleOption; label: string; hint: string }[] = [
  { value: 1, label: "1×", hint: "1080 / native" },
  { value: 2, label: "2×", hint: "Retina / ads" },
];

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const slidesController = useSlidesController();
  const slides = useCanvasStore((s) => s.slides);
  const projectTitle = useCanvasStore((s) => s.projectTitle);
  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);

  const [format, setFormat] = useState<ExportFormat>("png");
  const [pack, setPack] = useState<PackMode>("zip");
  const [scale, setScale] = useState<ScaleOption>(1);
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

  const summary = useMemo(() => {
    const w = canvasDimensions.width * scale;
    const h = canvasDimensions.height * scale;
    return `${slides.length} слайд${slides.length === 1 ? "" : "ов"} · ${w}×${h} · ${format.toUpperCase()}`;
  }, [slides.length, canvasDimensions, scale, format]);

  const handleExport = async () => {
    if (exporting) return;
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
        state.slides.map((s) => ({ id: s.id, canvasJSON: s.canvasJSON })),
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
      setTimeout(() => onOpenChange(false), 700);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
      setError(err instanceof Error ? err.message : "Ошибка экспорта");
    } finally {
      setExporting(false);
      abortRef.current = null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-2xl border-border/70 p-4 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40 text-left space-y-1">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Export carousel
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Скачайте все слайды в полном разрешении. {summary}
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-[11px] text-muted-foreground">Формат</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "png" as const, title: "PNG", desc: "Без потерь, прозрачность" },
                  { id: "jpeg" as const, title: "JPEG", desc: "Меньше вес, для ленты" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={exporting}
                  onClick={() => setFormat(opt.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition-colors",
                    format === opt.id
                      ? "border-foreground/40 bg-muted/50 ring-1 ring-foreground/10"
                      : "border-border/50 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileImage className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{opt.title}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-snug">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] text-muted-foreground">Упаковка</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={exporting}
                onClick={() => setPack("zip")}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition-colors",
                  pack === "zip"
                    ? "border-foreground/40 bg-muted/50 ring-1 ring-foreground/10"
                    : "border-border/50 hover:bg-muted/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">ZIP архив</span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">Один файл со всеми слайдами</p>
              </button>
              <button
                type="button"
                disabled={exporting}
                onClick={() => setPack("files")}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition-colors",
                  pack === "files"
                    ? "border-foreground/40 bg-muted/50 ring-1 ring-foreground/10"
                    : "border-border/50 hover:bg-muted/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Файлы</span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">Скачать каждый слайд отдельно</p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] text-muted-foreground">Масштаб</Label>
            <div className="flex gap-1.5 p-0.5 rounded-full bg-muted/40 border border-border/40 w-fit">
              {SCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={exporting}
                  onClick={() => setScale(opt.value)}
                  className={cn(
                    "h-7 px-3 rounded-full text-[11px] transition-colors",
                    scale === opt.value
                      ? "bg-background text-foreground shadow-xs font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title={opt.hint}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(exporting || done) && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{done ? "Готово" : "Рендер слайдов…"}</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 border-t border-border/40 bg-muted/15 px-4 py-3 sm:justify-between">
          <p className="text-[10px] text-muted-foreground truncate min-w-0 hidden sm:block">
            {projectTitle}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              disabled={exporting}
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-7 rounded-full px-4 text-xs gap-1.5"
              disabled={exporting || slides.length === 0}
              onClick={() => void handleExport()}
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : done ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {exporting ? "Экспорт…" : done ? "Скачано" : "Скачать"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
