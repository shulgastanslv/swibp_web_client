"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CHANGELOG = [
  {
    version: "1.2.0",
    date: "sep 2026",
    changes: [
      "slide presets",
      "export without watermark",
      "copy slide JSON",
    ],
  },
  {
    version: "1.1.0",
    date: "aug 2026",
    changes: ["layers in sidebar", "auto save"],
  },
] as const;

interface WhatsNewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsNewModal({ open, onOpenChange }: WhatsNewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl border-border/70 p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border/40 text-left">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            What's new
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 space-y-4">
          {CHANGELOG.map((item) => (
            <div key={item.version} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="font-mono font-medium text-foreground">
                  v{item.version}
                </span>
                <span className="text-muted-foreground">{item.date}</span>
              </div>
              <ul className="space-y-1">
                {item.changes.map((change) => (
                  <li
                    key={change}
                    className="text-xs text-muted-foreground pl-2 border-l border-border/50"
                  >
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
