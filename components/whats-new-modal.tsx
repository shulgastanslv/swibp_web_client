"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { listPublishedNews, type NewsItem } from "@/actions/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WhatsNewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function WhatsNewModal({ open, onOpenChange }: WhatsNewModalProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    void listPublishedNews()
      .then((res) => {
        setNews(res.success ? res.news : []);
      })
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border/70 p-0 sm:max-w-[360px]">
        <DialogHeader className="border-b border-border/40 px-4 pt-4 pb-3 text-left">
          <DialogTitle className="text-sm font-semibold tracking-tight">What's new</DialogTitle>
        </DialogHeader>

        <div className="max-h-[min(70vh,480px)] space-y-4 overflow-y-auto px-4 py-3">
          {loading && news.length === 0 ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : news.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing new yet.</p>
          ) : (
            news.map((item) => (
              <article key={item.id} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <time className="shrink-0 text-muted-foreground">{formatWhen(item.createdAt)}</time>
                </div>
                <p className="border-l border-border/50 pl-2 text-sm whitespace-pre-wrap text-muted-foreground">
                  {item.body}
                </p>
                {item.authorName ? (
                  <p className="text-[11px] text-muted-foreground">{item.authorName}</p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
