"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";

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
  const { slides, managerRef, updateCurrentSlideJSON, canvasDimensions } = useCanvasStore();

  const [activeId, setActiveId] = useState(initialSlideId);
  const [snapshots, setSnapshots] = useState<SlideSnapshot[]>([]);
  const [rendering, setRendering] = useState(false);
  const initDoneRef = useRef(false);

  const slideIds = slides.map((s) => s.id);
  const activeIdx = Math.max(0, slideIds.indexOf(activeId));
  const aspectRatio = canvasDimensions.width / canvasDimensions.height;

  // ── Initialise + render when modal opens ─────────────────────────────────
  useEffect(() => {
    if (!open || !managerRef || initDoneRef.current) return;
    initDoneRef.current = true;

    const canvas = managerRef.getCanvas();

    // Save current slide state
    const json = managerRef.exportAsJSON();
    const thumb = canvas.toDataURL({ format: "png", multiplier: 1.5, quality: 0.95 });
    updateCurrentSlideJSON(json, thumb);

    // Capture fresh store state (thumbnail just set above)
    const freshSlides = useCanvasStore.getState().slides;

    // Build initial snapshots — already-rendered slides have thumbnails
    const initial: SlideSnapshot[] = freshSlides.map((s) => ({
      id: s.id,
      thumbnail: s.thumbnail ?? null,
      loading: !s.thumbnail && !!s.canvasJSON,
    }));

    setActiveId(initialSlideId);
    setSnapshots(initial);

    // Check if anything needs rendering
    const needsRender = freshSlides.filter((s) => !s.thumbnail && s.canvasJSON);
    if (needsRender.length === 0) return;

    setRendering(true);

    // Async: render missing thumbnails offscreen via Fabric
    const savedJSON = json;
    (async () => {
      for (const slide of freshSlides) {
        if (slide.thumbnail || !slide.canvasJSON) continue;
        try {
          await managerRef.loadFromJSON(slide.canvasJSON);
          const dataURL = canvas.toDataURL({ format: "png", multiplier: 0.4, quality: 0.9 });
          setSnapshots((prev) =>
            prev.map((s) => s.id === slide.id ? { ...s, thumbnail: dataURL, loading: false } : s)
          );
        } catch {
          setSnapshots((prev) =>
            prev.map((s) => s.id === slide.id ? { ...s, loading: false } : s)
          );
        }
      }
      // Restore original slide
      await managerRef.loadFromJSON(savedJSON);
      setRendering(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Reset init flag when modal closes
  useEffect(() => {
    if (!open) initDoneRef.current = false;
  }, [open]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
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
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const activeSnap = snapshots.find((s) => s.id === activeId);

  const goTo = (id: number) => setActiveId(id);
  const goPrev = () => setActiveId((id) => slideIds[Math.max(0, slideIds.indexOf(id) - 1)] ?? id);
  const goNext = () => setActiveId((id) => slideIds[Math.min(slideIds.length - 1, slideIds.indexOf(id) + 1)] ?? id);

  // Responsive slide sizing — fit inside viewport keeping aspect ratio
  const thumbW = 64;
  const thumbH = Math.round(thumbW / aspectRatio);

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex flex-col select-none">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white/60 tracking-wide">Preview</span>
          {rendering && (
            <span className="flex items-center gap-1.5 text-[11px] text-white/30">
              <Loader2 className="w-3 h-3 animate-spin" />
              Rendering…
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-white/30">
            {activeIdx + 1} / {slides.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-white/50 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Main slide ── */}
      <div className="flex-1 flex items-center justify-center gap-4 px-8 min-h-0">

        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={activeIdx === 0}
          className="h-10 w-10 rounded-full text-white/40 hover:text-white hover:bg-white/10 shrink-0 disabled:opacity-10 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Slide frame — sized to fit screen */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-all duration-300"
          style={{
            aspectRatio,
            height: aspectRatio < 1 ? "min(76vh, 700px)" : undefined,
            width: aspectRatio >= 1 ? "min(72vw, 900px)" : undefined,
            maxHeight: "76vh",
            maxWidth: "88vw",
          }}
        >
          {activeSnap?.loading ? (
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white/20" />
            </div>
          ) : activeSnap?.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeSnap.thumbnail}
              alt={`Slide ${activeIdx + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-white flex items-center justify-center">
              <span className="text-sm text-zinc-400">Empty slide</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          disabled={activeIdx === slides.length - 1}
          className="h-10 w-10 rounded-full text-white/40 hover:text-white hover:bg-white/10 shrink-0 disabled:opacity-10 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

      </div>

      {/* ── Filmstrip ── */}
      <div className="shrink-0 py-4 px-6 flex items-center justify-center gap-2 overflow-x-auto">
        {snapshots.map((snap, i) => {
          const isActive = snap.id === activeId;
          return (
            <button
              key={snap.id}
              onClick={() => goTo(snap.id)}
              className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ring-2 ${
                isActive
                  ? "ring-white/80 shadow-[0_0_16px_rgba(255,255,255,0.2)] scale-110"
                  : "ring-transparent opacity-40 hover:opacity-70 hover:ring-white/20"
              }`}
              style={{ width: thumbW, height: thumbH }}
            >
              {snap.loading ? (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 animate-spin text-white/30" />
                </div>
              ) : snap.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={snap.thumbnail}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-zinc-800" />
              )}
              {isActive && (
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-lg pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
