"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ChangelogItem {
  version: string;
  date: string;
  isLatest?: boolean;
  changes: string[];
}

const CHANGELOG: ChangelogItem[] = [
  {
    version: "v1.2.0",
    date: "Сентябрь 2026",
    isLatest: true,
    changes: [
      "Пресеты слайдов с эстетичной типографикой и версткой",
      "Рендеринг и экспорт холста без потери резкости",
      "Быстрое копирование JSON структуры слайда в буфер",
    ],
  },
  {
    version: "v1.1.0",
    date: "Август 2026",
    changes: [
      "Управление порядком и z-index слоев через боковую панель",
      "Улучшенное автосохранение изменений в локальное состояние",
    ],
  },
];

interface WhatsNewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsNewModal({ open, onOpenChange }: WhatsNewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 border border-border/60 shadow-xl rounded-2xl bg-background gap-5">

        {/* Шапка */}
        <DialogHeader className="p-0 space-y-1 text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-semibold tracking-tight text-foreground">
              What&apos;s new
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Недавние обновления и улучшения редактора.
          </DialogDescription>
        </DialogHeader>

        {/* Список версий */}
        <div className="flex flex-col gap-5 divide-y divide-border/40">
          {CHANGELOG.map((item) => (
            <div key={item.version} className="flex flex-col gap-2.5 pt-4 first:pt-0">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-foreground">
                    {item.version}
                  </span>
                  {item.isLatest && (
                    <span className="text-[9px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-foreground text-background">
                      Latest
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {item.date}
                </span>
              </div>

              <ul className="flex flex-col gap-1.5 pl-1">
                {item.changes.map((change, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                  >
                    <span className="text-foreground/40 select-none">•</span>
                    <span>{change}</span>
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
