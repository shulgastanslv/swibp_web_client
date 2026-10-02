"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  ["Slides", "bottom of the canvas — carousel frames"],
  ["Ctrl / ⌘ + C / V", "copy and paste elements, images, or text"],
  ["Ctrl / ⌘ + drag", "edge and center binding"],
  ["Save", "save project"],
  ["Export", "PNG / JPEG → ZIP"],
  ["Publish", "send to templates"],
] as const;

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl border-border/70 p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border/40 text-left">
          <DialogTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            Help
          </DialogTitle>
        </DialogHeader>

        <ul className="px-4 py-3 space-y-2">
          {SHORTCUTS.map(([label, hint]) => (
            <li
              key={label}
              className="flex items-baseline justify-between gap-4 text-xs"
            >
              <span className="font-medium text-foreground shrink-0">{label}</span>
              <span className="text-muted-foreground text-right">{hint}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
