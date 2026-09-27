"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface ModalsProps {
  showShareModal: boolean;
  setShowShareModal: (v: boolean) => void;
  showExportModal: boolean;
  setShowExportModal: (v: boolean) => void;
}

export function Modals({
  showShareModal,
  setShowShareModal,
  showExportModal,
  setShowExportModal,
}: ModalsProps) {
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
    </>
  );
}
