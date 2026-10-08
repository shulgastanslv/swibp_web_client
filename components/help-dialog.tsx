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

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Canvas",
    body: "The stage is one slide of a carousel. Drag to move, corner handles to resize, and the side handles to restack. Space pans the view. Hold Ctrl or ⌘ and scroll to zoom toward the pointer. H switches to the hand.",
  },
  {
    title: "Slides",
    body: "The strip under the canvas is the carousel. Click a frame to open it. Drag a frame to reorder. The corner mark includes that slide in a font change, a palette, and export.",
  },
  {
    title: "Templates and projects",
    body: "Templates start a layout. Apply one, then edit the copy on your canvas. Projects are yours: the card menu renames, duplicates, and shows who made it and which ratio it uses. Autosave keeps the open project, and Save writes it now.",
  },
  {
    title: "Left rail",
    body: "Templates, projects, text, icons, photos, and background live in the left panel. Background covers fill, pattern, and palette. A suggested set can paint every slide, only marked slides, or the slide you have open.",
  },
  {
    title: "Type, color, and share",
    body: "Select text and pick a face in the right panel. The new face is applied as soon as it finishes loading. Palette slots recolor text, accent, and cards that were tagged with those roles. Share and export use the marked slides when you have marked any.",
  },
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border/70 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/40 px-4 py-3 text-left">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <HelpCircle className="size-4 text-muted-foreground" />
            Help
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[min(70vh,520px)] space-y-4 overflow-y-auto px-4 py-3">
          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-1">
              <h3 className="text-[11px] text-muted-foreground">{section.title}</h3>
              <p className="text-xs leading-relaxed text-foreground">{section.body}</p>
            </section>
          ))}
          <p className="text-[11px] leading-snug text-muted-foreground">
            Every shortcut is listed in the command menu in the header.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
