"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type LegalKind = "terms" | "privacy";

const COPY: Record<LegalKind, { title: string; paragraphs: string[] }> = {
  terms: {
    title: "Terms of Service",
    paragraphs: [
      "This app is provided as is for creating and exporting carousels.",
      "You keep the rights to what you upload. Don't use the service to break the law or harm others.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    paragraphs: [
      "We store your account and projects so you can sign in and keep your work.",
      "We don't sell your data. You can delete a project at any time from the projects panel.",
    ],
  },
};

interface LegalDialogProps {
  kind: LegalKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LegalDialog({ kind, open, onOpenChange }: LegalDialogProps) {
  const copy = COPY[kind];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl border-border/70 p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border/40 text-left">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="sr-only">{copy.title}</DialogDescription>
        </DialogHeader>

        <div className="px-4 py-3 space-y-2">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-xs text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
