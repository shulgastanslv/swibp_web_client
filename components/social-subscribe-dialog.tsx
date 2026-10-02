"use client";

import { AtSign, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SOCIAL_LINKS } from "@/lib/social";

interface SocialSubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SocialSubscribeDialog({
  open,
  onOpenChange,
}: SocialSubscribeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl border-border/70 p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border/40 text-left">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Follow along
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            New presets and updates land on Telegram and Threads.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-4 py-4">
          <Button
            variant="outline"
            className="h-9 w-full justify-start gap-2 rounded-full text-xs"
            asChild
          >
            <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer">
              <Send className="size-3.5 text-sky-500" />
              Telegram
            </a>
          </Button>
          <Button
            variant="outline"
            className="h-9 w-full justify-start gap-2 rounded-full text-xs"
            asChild
          >
            <a href={SOCIAL_LINKS.threads} target="_blank" rel="noopener noreferrer">
              <AtSign className="size-3.5 text-muted-foreground" />
              Threads
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
