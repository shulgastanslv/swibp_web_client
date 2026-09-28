"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useCanvasManager } from "@/context/canvas-manager";
import { Canvas as FabricCanvas } from "fabric";

interface PreviewModalProps {
  open: boolean;
  initialSlideId: number;
  onClose: () => void;
}

interface SlideSnapshot {
  id: number;
  thumbnail: string | null;
  loading: boolean;
}

export function PreviewModal({ open, initialSlideId, onClose }: PreviewModalProps) {
  const slides = useCanvasStore((s) => s.slides);
  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);
  const currentSlideId = useCanvasStore((s) => s.currentSlideId);
  const updateSlideJSONById = useCanvasStore((s) => s.updateSlideJSONById);
  const updateSlideThumbnail = useCanvasStore((s) => s.updateSlideThumbnail);

  const { manager } = useCanvasManager();

  const [activeId, setActiveId] = useState(initialSlideId);
  const [snapshots, setSnapshots] = useState<SlideSnapshot[]>([]);
  const [rendering, setRendering] = useState(false);

  const isMountedRef = useRef(true);

  const slideIds = slides.map((s) => s.id);
  const activeIdx = Math.max(0, slideIds.indexOf(activeId));
  const aspectRatio = canvasDimensions.width / canvasDimensions.height;

  // Синхронизация текущего состояния и генерация миниатюр
  useEffect(() => {
    if (!open) return;
    isMountedRef.current = true;

    // 1. Сохраняем текущее актуальное состояние активного слайда перед открытием
    if (manager) {
      const currentJson = manager.io.exportAsJSON();
      updateSlideJSONById(currentSlideId, currentJson);
    }

    const freshSlides = useCanvasStore.getState().slides;

    // Инициализируем снапшоты
    const initialSnapshots: SlideSnapshot[] = freshSlides.map((s) => ({
      id: s.id,
      thumbnail: s.thumbnail ?? null,
      loading: !s.thumbnail && !!s.canvasJSON,
    }));

    setActiveId(initialSlideId);
    setSnapshots(initialSnapshots);

    const slidesNeedingRender = freshSlides.filter((s) => !s.thumbnail && s.canvasJSON);
    if (slidesNeedingRender.length === 0) return;

    setRendering(true);

    // 2. Рендерим отсутствующие миниатюры через скрытый offscreen-канвас, не трогая рабочий
    const offscreenEl = document.createElement("canvas");
    offscreenEl.width = canvasDimensions.width;
    offscreenEl.height = canvasDimensions.height;

    const offscreenCanvas = new FabricCanvas(offscreenEl, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      renderOnAddRemove: false,
    });

    (async () => {
      for (const slide of slidesNeedingRender) {
        if (!isMountedRef.current) break;
        if (!slide.canvasJSON) continue;

        try {
          await offscreenCanvas.loadFromJSON(slide.canvasJSON);

          if (!offscreenCanvas.backgroundColor) {
            offscreenCanvas.backgroundColor = "#ffffff";
          }
          offscreenCanvas.renderAll();

          // Формируем оптимизированное превью
          const dataURL = offscreenCanvas.toDataURL({
            format: "png",
            multiplier: Math.min(1, 300 / canvasDimensions.width),
            quality: 0.8,
          });

          if (isMountedRef.current) {
            updateSlideThumbnail(slide.id, dataURL);
            setSnapshots((prev) =>
              prev.map((s) =>
                s.id === slide.id ? { ...s, thumbnail: dataURL, loading: false } : s
              )
            );
          }
        } catch (error) {
          console.error(`Ошибка рендеринга слайда ${slide.id}:`, error);
          if (isMountedRef.current) {
            setSnapshots((prev) =>
              prev.map((s) => (s.id === slide.id ? { ...s, loading: false } : s))
            );
          }
        }
      }

      offscreenCanvas.dispose();
      if (isMountedRef.current) {
        setRendering(false);
      }
    })();

    return () => {
      isMountedRef.current = false;
      offscreenCanvas.dispose();
    };
  }, [
    open,
    manager,
    initialSlideId,
    currentSlideId,
    canvasDimensions,
    updateSlideJSONById,
    updateSlideThumbnail,
  ]);

  // Навигация с клавиатуры
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActiveId((id) => {
          const i = slideIds.indexOf(id);
          return slideIds[Math.min(slideIds.length - 1, i + 1)] ?? id;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActiveId((id) => {
          const i = slideIds.indexOf(id);
          return slideIds[Math.max(0, i - 1)] ?? id;
        });
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, slideIds, onClose]);

  if (!open) return null;

  const activeSnap = snapshots.find((s) => s.id === activeId);

  const goPrev = () => {
    setActiveId((id) => slideIds[Math.max(0, slideIds.indexOf(id) - 1)] ?? id);
  };

  const goNext = () => {
    setActiveId((id) => slideIds[Math.min(slideIds.length - 1, slideIds.indexOf(id) + 1)] ?? id);
  };

  const thumbW = 56;
  const thumbH = Math.round(thumbW / aspectRatio);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col select-none animate-in fade-in-0 duration-200">
      {/* ── Верхняя панель ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-foreground tracking-wide">Предпросмотр</span>
          {rendering && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Подготовка слайдов…
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">
            {activeIdx + 1} / {slides.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Основная область просмотра слайда ── */}
      <div className="flex-1 flex items-center justify-center gap-4 px-8 min-h-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={activeIdx === 0}
          className="h-10 w-10 rounded-full shrink-0 disabled:opacity-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Рамка текущего слайда */}
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/50 bg-background transition-all duration-200"
          style={{
            aspectRatio,
            height: aspectRatio < 1 ? "min(72vh, 680px)" : undefined,
            width: aspectRatio >= 1 ? "min(72vw, 860px)" : undefined,
            maxHeight: "72vh",
            maxWidth: "88vw",
          }}
        >
          {activeSnap?.loading ? (
            <div className="absolute inset-0 bg-muted/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : activeSnap?.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeSnap.thumbnail}
              alt={`Слайд ${activeIdx + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-background flex items-center justify-center border border-dashed border-border/60">
              <span className="text-xs text-muted-foreground">Пустой слайд</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          disabled={activeIdx === slides.length - 1}
          className="h-10 w-10 rounded-full shrink-0 disabled:opacity-20"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* ── Нижняя лента миниатюр ── */}
      <div className="shrink-0 py-4 px-6 flex items-center justify-center gap-2 overflow-x-auto border-t border-border/40">
        {snapshots.map((snap, i) => {
          const isActive = snap.id === activeId;
          return (
            <button
              key={snap.id}
              type="button"
              onClick={() => setActiveId(snap.id)}
              className={`relative shrink-0 rounded-md overflow-hidden transition-all duration-150 ring-2 ${
                isActive
                  ? "ring-primary shadow-sm scale-105"
                  : "ring-transparent opacity-50 hover:opacity-100 hover:ring-border"
              }`}
              style={{ width: thumbW, height: thumbH }}
            >
              {snap.loading ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                </div>
              ) : snap.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={snap.thumbnail}
                  alt={`Превью ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
