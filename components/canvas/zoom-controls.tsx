"use client";

import { useEffect } from "react";
import { Hand, MousePointer2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/store/useCanvasStore";

export const MIN_ZOOM = 25;
export const MAX_ZOOM = 400;

export function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function ZoomControls() {
  const zoom = useCanvasStore((s) => s.zoom);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const handActive = useCanvasStore((s) => s.handActive);
  const setHandActive = useCanvasStore((s) => s.setHandActive);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.repeat) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      if (typing) return;
      const key = event.key.toLowerCase();
      if (key !== "v" && key !== "h") return;
      event.preventDefault();
      setHandActive(key === "h");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setHandActive]);

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted/40 p-0.5">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${
          handActive
            ? "text-muted-foreground hover:text-foreground"
            : "bg-background text-foreground shadow-2xs"
        }`}
        onClick={() => setHandActive(false)}
        title="Select. Move and edit objects (V)"
        aria-pressed={!handActive}
      >
        <MousePointer2 className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${
          handActive
            ? "bg-background text-foreground shadow-2xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setHandActive(true)}
        title="Hand. Drag to move around the canvas. Hold Space (H)"
        aria-pressed={handActive}
      >
        <Hand className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        onClick={() => setZoom(clampZoom(zoom - 10))}
        title="Zoom out"
      >
        <ZoomOut className="size-3.5" />
      </Button>
      <button
        type="button"
        className="w-12 text-center font-mono text-[13px] text-foreground hover:text-primary"
        onClick={() => setZoom(100)}
        title="Reset zoom. Ctrl + scroll also zooms"
      >
        {Math.round(zoom)}%
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        onClick={() => setZoom(clampZoom(zoom + 10))}
        title="Zoom in"
      >
        <ZoomIn className="size-3.5" />
      </Button> 
    </div>
  );
}
