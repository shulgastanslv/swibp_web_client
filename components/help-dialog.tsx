"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOTES = [
  "Drag to move. Space pans. Scroll zooms.",
  "Right-click an object for its actions.",
  "Keys 1–9 switch panels. Esc leaves focus.",
];

function PhoneMock() {
  return (
    <div
      className="relative h-[132px] w-[72px] shrink-0 overflow-hidden rounded-[1.15rem] border-[3px] border-foreground bg-background"
      aria-hidden
    >
      <div className="absolute top-1 left-1/2 z-10 h-1 w-7 -translate-x-1/2 rounded-full bg-foreground" />
      <div className="flex h-full flex-col px-1.5 pt-4 pb-2">
        <div className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-muted" />
          <span className="h-1 w-6 rounded-full bg-muted" />
        </div>
        <div className="mt-1.5 flex-1 rounded-md bg-primary/15" />
        <div className="mt-1.5 h-1 w-8 rounded-full bg-foreground/25" />
        <div className="mt-1 h-1 w-5 rounded-full bg-foreground/15" />
        <div className="mt-1.5 flex justify-center gap-1">
          <span className="size-1 rounded-full bg-foreground" />
          <span className="size-1 rounded-full bg-foreground/25" />
          <span className="size-1 rounded-full bg-foreground/25" />
        </div>
      </div>
    </div>
  );
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[360px]"
      >
        <div className="relative flex items-center justify-between gap-4 bg-muted px-5 py-5">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-2 rounded-full text-foreground hover:bg-foreground/10"
            >
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>

          <DialogHeader className="gap-1 pr-6 text-left p-4">
            <p className="text-[13px] font-medium text-muted-foreground">You have a question?</p>
            <DialogTitle className="text-lg font-semibold tracking-tight">Help</DialogTitle>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              One slide at a time. The strip under the canvas is the carousel.
            </p>
          </DialogHeader>
          <div className="flex justify-center mr-4">
            <PhoneMock />
          </div>
        </div>

        <ul className="space-y-2 px-5 py-4 text-[13px] leading-relaxed text-muted-foreground">
          {NOTES.map((note) => (
            <li key={note} className="flex gap-2.5">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/40" />
              {note}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
