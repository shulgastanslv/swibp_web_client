"use client";

import {
  Dialog,
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

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[340px]">
        <div className="relative bg-[#efe6d8] px-6 pt-8 pb-5">
          <div className="flex items-end justify-center">
            <div className="z-0 mb-1 flex aspect-4/5 w-[68px] -rotate-6 flex-col justify-between rounded-[3px] bg-[#f3d6d0] p-2 shadow-[0_10px_24px_rgba(40,24,16,0.12)]">
              <span className="font-serif text-[18px] leading-none text-[#6b2430]">01</span>
              <span className="h-px w-7 bg-[#6b2430]/50" />
            </div>
            <div className="z-10 -mx-3 flex aspect-4/5 w-[86px] flex-col justify-between rounded-[3px] bg-[#171513] p-2.5 text-[#f6f1e8] shadow-[0_16px_30px_rgba(40,24,16,0.22)]">
              <span className="text-[9px] tracking-[0.18em] uppercase opacity-60">Slide</span>
              <div>
                <p className="font-serif text-[17px] leading-none">Hold</p>
                <span className="mt-2 block h-px w-8 bg-[#f3d6d0]" />
              </div>
            </div>
            <div className="z-0 mb-1 flex aspect-4/5 w-[68px] rotate-6 flex-col justify-between rounded-[3px] border border-[#171513]/10 bg-[#fbf7f1] p-2 shadow-[0_10px_24px_rgba(40,24,16,0.1)]">
              <span className="size-2 bg-[#6b2430]" />
              <span className="font-serif text-[18px] leading-none text-[#171513]">02</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-3.5">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-[13px] font-medium">Help</DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            One slide at a time. The strip under the canvas is the carousel.
          </p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-foreground">
            {NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
