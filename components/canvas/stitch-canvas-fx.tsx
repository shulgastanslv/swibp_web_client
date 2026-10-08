"use client";

import { useEffect, useState } from "react";

import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";

type FrameBox = {
  width: number;
  height: number;
  left: number;
  top: number;
};

const BLOCKS = [
  { key: "chrome-l", top: "5%", left: "6%", width: "28%", height: "2.4%", delay: 0 },
  { key: "chrome-r", top: "5%", left: "62%", width: "32%", height: "2.4%", delay: 40 },
  { key: "title-a", top: "34%", left: "8%", width: "72%", height: "5.5%", delay: 120 },
  { key: "title-b", top: "41%", left: "8%", width: "54%", height: "5.5%", delay: 180 },
  { key: "body-a", top: "52%", left: "8%", width: "78%", height: "2.2%", delay: 260 },
  { key: "body-b", top: "56.5%", left: "8%", width: "70%", height: "2.2%", delay: 300 },
  { key: "body-c", top: "61%", left: "8%", width: "62%", height: "2.2%", delay: 340 },
  { key: "footer-l", top: "88%", left: "6%", width: "42%", height: "3.2%", delay: 400 },
  { key: "footer-r", top: "89%", left: "68%", width: "26%", height: "2.4%", delay: 440 },
] as const;

/**
 * Google Stitch–style generation FX: blueprint wireframe over the canvas stage,
 * scan beam, then dissolve into the real slide.
 */
export function StitchCanvasFx({ frame }: { frame: FrameBox | null }) {
  const genFx = useCanvasStore((s) => s.genFx);
  const pulse = useCanvasStore((s) => s.genStagePulse);
  const built = useCanvasStore((s) => s.genBuiltCount);
  const expected = useCanvasStore((s) => s.genExpectedSlides);
  const palette = useCanvasStore((s) => s.palette);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    if (pulse <= 0) return;
    setFlash(pulse);
  }, [pulse]);

  const visible = genFx === "composing" || genFx === "revealing";
  if (!visible || !frame) return null;

  const revealing = genFx === "revealing";
  const ink = palette.text || "#111111";
  const paper = palette.background || "#ffffff";

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-30 overflow-hidden shadow-2xl ring-1 ring-foreground/10",
        revealing ? "stitch-fx-reveal" : "stitch-fx-compose",
      )}
      style={{
        width: frame.width,
        height: frame.height,
        left: frame.left,
        top: frame.top,
        background: paper,
      }}
      aria-hidden
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(${ink}22 1px, transparent 1px),
            linear-gradient(90deg, ${ink}22 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% 40%, transparent 40%, ${ink}18 100%)`,
        }}
      />

      {/* Assembling layout blocks */}
      {BLOCKS.map((block) => (
        <div
          key={`${block.key}-${flash}`}
          className={cn("absolute rounded-[3px]", revealing ? "stitch-block-out" : "stitch-block-in")}
          style={{
            top: block.top,
            left: block.left,
            width: block.width,
            height: block.height,
            animationDelay: `${block.delay}ms`,
            background:
              block.key.startsWith("title")
                ? `linear-gradient(90deg, ${ink}55, ${ink}22)`
                : `linear-gradient(90deg, ${ink}35, ${ink}12)`,
            boxShadow: `inset 0 0 0 1px ${ink}30`,
          }}
        >
          <div className="stitch-block-sheen absolute inset-0" />
        </div>
      ))}

      {/* Horizontal scan beam */}
      {!revealing ? <div className="stitch-scan-beam absolute inset-x-0 h-16" /> : null}

      {/* Drawing outline */}
      <div
        className={cn("pointer-events-none absolute inset-3 rounded-sm", revealing ? "opacity-0" : "stitch-frame-draw")}
        style={{ boxShadow: `inset 0 0 0 1px ${ink}40` }}
      />

      {/* Status chip */}
      <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
        <div
          className={cn(
            "rounded-full px-3 py-1 text-[10px] font-medium tracking-wide backdrop-blur-md",
            "bg-background/70 text-foreground shadow-sm ring-1 ring-border/50",
          )}
        >
          {revealing
            ? "Revealing slide…"
            : expected > 0
              ? `Composing ${Math.min(built + 1, expected)}/${expected}`
              : "Composing layout…"}
        </div>
      </div>

      {/* White flash on reveal */}
      {revealing ? <div key={`flash-${flash}`} className="stitch-reveal-flash absolute inset-0" /> : null}
    </div>
  );
}
