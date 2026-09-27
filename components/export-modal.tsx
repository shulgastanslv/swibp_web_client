"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportPng?: () => void;
  onExportPdf?: () => void;
}

export function ExportModal({
  open,
  onOpenChange,
  onExportPng,
  onExportPdf,
}: ExportModalProps) {
  const handleSelectPng = () => {
    onExportPng?.();
    onOpenChange(false);
  };

  const handleSelectPdf = () => {
    onExportPdf?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-5 border-border">
        <DialogHeader className="space-y-1.5 text-left border-b border-border/40 pb-3">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Export Carousel Pack
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select the export format for your slides.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-1 text-xs">
          <button
            type="button"
            onClick={handleSelectPng}
            className="p-3 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-left flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-medium text-foreground block">
                PNG Images (.zip)
              </span>
              <span className="text-[11px] text-muted-foreground block">
                High-resolution separate PNG files for Instagram/LinkedIn.
              </span>
            </div>
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2" />
          </button>

          <button
            type="button"
            onClick={handleSelectPdf}
            className="p-3 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-left flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-medium text-foreground block">
                PDF Document (.pdf)
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Multi-page PDF file optimized for LinkedIn posts.
              </span>
            </div>
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
