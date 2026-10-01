"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CarouselStackProps {
  slideCount?: number;
  previewUrl?: string | null;
  badge?: string;
  busy?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MAX_STACK = 3;
const CARD_W = 48;
const CARD_H = 64;
const OFFSET = 10;

export function CarouselStack({
  slideCount = 1,
  previewUrl,
  badge,
  busy,
  className,
  children,
}: CarouselStackProps) {
  const count = Math.max(1, Math.min(slideCount || 1, MAX_STACK));

  return (
    <div
      className={cn(
        "relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-background/50",
        className,
      )}
    >
      <div
        className="relative"
        style={{
          width: CARD_W + 8 + (count - 1) * OFFSET,
          height: CARD_H + 12,
        }}
        aria-hidden
      >
        {Array.from({ length: count }).map((_, i) => {
          const isFront = i === count - 1;
          return (
            <div
              key={i}
              className={cn(
                "absolute overflow-hidden rounded-md ring-1 ring-border/50",
                isFront ? "bg-muted/80 shadow-sm" : "bg-muted-foreground/15",
              )}
              style={{
                left: i * OFFSET,
                width: CARD_W,
                height: CARD_H + (isFront ? 8 : 0) - (count - 1 - i) * 2,
                top: count - 1 - i,
                zIndex: i + 1,
              }}
            >
              {isFront && previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {badge ? (
        <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground ring-1 ring-border/40">
          {badge}
        </span>
      ) : null}

      {children}

      {busy ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : null}
    </div>
  );
}
