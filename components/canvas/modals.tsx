"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { SlideData } from "@/components/canvas/types";
import { useCanvasStore } from "@/store/useCanvasStore";

interface ModalsProps {
  showShareModal: boolean;
  setShowShareModal: (v: boolean) => void;
  showExportModal: boolean;
  setShowExportModal: (v: boolean) => void;
  showPreviewModal: boolean;
  setShowPreviewModal: (v: boolean) => void;
  previewIdx: number;
  setPreviewIdx: React.Dispatch<React.SetStateAction<number>>;
  slides: SlideData[];
  padding: number;
  borderRadius: number;
}

export function Modals({
  showShareModal,
  setShowShareModal,
  showExportModal,
  setShowExportModal,
  showPreviewModal,
  setShowPreviewModal,
  previewIdx,
  setPreviewIdx,
  slides,
  padding,
  borderRadius,
}: ModalsProps) {
  const { canvasDimensions: dims } = useCanvasStore();
  return (
    <>
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-5 max-w-sm w-full flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-sm">Share Project</span>
              <button onClick={() => setShowShareModal(false)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view or make a duplicate of this carousel deck.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://carousel.studio/p/3f8d2a1"
                className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-mono"
              />
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs rounded-xl"
                onClick={() => setShowShareModal(false)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-5 max-w-md w-full flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-sm">Export Carousel Pack</span>
              <button onClick={() => setShowExportModal(false)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => setShowExportModal(false)}
                className="p-3 rounded-xl border border-border/60 hover:bg-muted/40 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-medium block">PNG Images (.zip)</span>
                  <span className="text-[11px] text-muted-foreground">
                    High-resolution separate PNG files for Instagram/LinkedIn.
                  </span>
                </div>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => setShowExportModal(false)}
                className="p-3 rounded-xl border border-border/60 hover:bg-muted/40 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-medium block">PDF Document (.pdf)</span>
                  <span className="text-[11px] text-muted-foreground">
                    Multi-page PDF file optimized for LinkedIn posts.
                  </span>
                </div>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-between p-6">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Preview Mode (Slide 0{previewIdx + 1} / 0{slides.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviewModal(false)}
              className="h-8 rounded-xl"
            >
              Close
            </Button>
          </div>

          <div
            style={{
              width: `${dims.width * 1.1}px`,
              height: `${dims.height * 1.1}px`,
              padding: `${padding}px`,
              borderRadius: `${borderRadius}px`,
            }}
            className="bg-card text-card-foreground border border-border shadow-2xl flex flex-col justify-between my-auto"
          >
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="bg-muted px-2.5 py-1 rounded-full text-[10px] font-mono">
                {slides[previewIdx]?.badgeText}
              </span>
              <span className="text-[10px] font-mono uppercase">SWIPE ➔</span>
            </div>

            <div className="flex flex-col gap-2 my-auto">
              <h2 className="text-2xl font-bold tracking-tight">
                {slides[previewIdx]?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {slides[previewIdx]?.subtitle}
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/30">
              <span>carousel.studio</span>
              <span>0{previewIdx + 1}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              disabled={previewIdx === 0}
              onClick={() => setPreviewIdx((p) => Math.max(0, p - 1))}
              className="h-9 w-9 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-mono text-xs">
              0{previewIdx + 1} / 0{slides.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={previewIdx === slides.length - 1}
              onClick={() =>
                setPreviewIdx((p) => Math.min(slides.length - 1, p + 1))
              }
              className="h-9 w-9 rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
