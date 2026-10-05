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

const GROUPS: { title: string; rows: [string, string][] }[] = [
  {
    title: "Edit",
    rows: [
      ["Delete / Backspace", "Delete the selection"],
      ["Ctrl / ⌘ D", "Duplicate the selection"],
      ["Ctrl / ⌘ Z", "Undo"],
      ["Ctrl / ⌘ Shift Z", "Redo"],
      ["Ctrl / ⌘ Y", "Redo"],
      ["Ctrl / ⌘ C", "Copy"],
      ["Ctrl / ⌘ V", "Paste"],
      ["Ctrl / ⌘ G", "Group"],
      ["Ctrl / ⌘ Shift G", "Ungroup"],
      ["Ctrl / ⌘ Shift C", "Copy style"],
      ["Ctrl / ⌘ Shift V", "Paste style"],
    ],
  },
  {
    title: "Place",
    rows: [
      ["Ctrl / ⌘ Alt H", "Center horizontally"],
      ["Ctrl / ⌘ Alt V", "Center vertically"],
      ["Ctrl / ⌘ Alt C", "Center on the slide"],
      ["Drag", "Snap to neighboring edges and centers"],
      ["Space, then drag", "Pan the canvas"],
      ["Ctrl / ⌘ scroll", "Zoom toward the pointer"],
      ["Esc", "Leave crop"],
    ],
  },
  {
    title: "Add",
    rows: [
      ["1", "Heading"],
      ["2", "Subtitle"],
      ["3", "Paragraph"],
      ["4", "Text"],
      ["5", "Quote"],
      ["6", "Rectangle"],
      ["7", "Circle"],
      ["8", "Triangle"],
      ["9", "Diamond"],
      ["0", "Star"],
      ["Shift 1", "Hexagon"],
      ["Shift 2", "Ellipse"],
      ["Shift 3", "Line"],
      ["Shift 4", "Divider"],
    ],
  },
  {
    title: "Slides",
    rows: [
      ["Click a frame", "Open that slide"],
      ["Corner mark", "Include it in font, palette, and export"],
      ["Drag a frame", "Reorder"],
    ],
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
          {GROUPS.map((group) => (
            <section key={group.title} className="space-y-1.5">
              <h3 className="text-[11px] text-muted-foreground">{group.title}</h3>
              <ul className="space-y-1.5">
                {group.rows.map(([keys, action]) => (
                  <li key={keys} className="flex items-baseline justify-between gap-4 text-xs">
                    <span className="font-medium text-foreground">{keys}</span>
                    <span className="text-right text-muted-foreground">{action}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
