"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl?: string;
}

export function ShareModal({
  open,
  onOpenChange,
  shareUrl = "https://carousel.studio/p/3f8d2a1",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Фолбэк, если буфер обмена недоступен
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-5 border-border">
        <DialogHeader className="space-y-1.5 text-left border-b border-border/40 pb-3">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Share Project
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Anyone with this link can view or make a duplicate of this carousel deck.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pt-1">
          <Input
            readOnly
            value={shareUrl}
            className="h-8 text-xs font-mono bg-muted/40 border-border/60 rounded-xl"
          />
          <Button
            size="sm"
            onClick={handleCopy}
            className="h-8 px-3 text-xs rounded-xl shrink-0 gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
