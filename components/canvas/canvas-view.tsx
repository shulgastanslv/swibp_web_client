"use client";

import React, { useRef, useEffect, useState } from "react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useAttachCanvas, useCanvasManager } from "@/context/canvas-manager";
import { AttentionMap } from "@/components/canvas/attention-map";
import { useInsightUi } from "@/lib/canvas/insight-ui";
import { clampZoom } from "@/components/canvas/zoom-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PADDING = 48;

export function CanvasView() {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const attach = useAttachCanvas();
  const manager = useCanvasManager();

  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);
  const ratio = useCanvasStore((s) => s.currentRatio);
  const zoom = useCanvasStore((s) => s.zoom);
  const isLoadingProject = useCanvasStore((s) => s.isLoadingProject);
  const handActive = useCanvasStore((s) => s.handActive);
  const showAttention = useInsightUi((s) => s.showAttention);
  const platform = useInsightUi((s) => s.platform);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [spaceDown, setSpaceDown] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const panning = handActive || spaceDown;
  const panningRef = useRef(false);
  panningRef.current = panning;

  useEffect(() => {
    const el = canvasElementRef.current;
    if (!el) return;
    return attach(el);
  }, [attach]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !manager) return;

    const applyZoom = (containerW: number, containerH: number) => {
      const { width: nativeW, height: nativeH } = canvasDimensions;
      const scaleX = (containerW - PADDING * 2) / nativeW;
      const scaleY = (containerH - PADDING * 2) / nativeH;
      const baseScale = Math.min(scaleX, scaleY);
      const scale = Math.max(0.05, baseScale * (zoom / 100));
      const width = Math.round(nativeW * scale);
      const height = Math.round(nativeH * scale);

      setStage((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
      manager.setViewportScale(scale, nativeW, nativeH);
    };

    applyZoom(container.clientWidth, container.clientHeight);

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) applyZoom(rect.width, rect.height);
    });

    ro.observe(container);

    return () => ro.disconnect();
  }, [manager, canvasDimensions, zoom]);

  useEffect(() => {
    if (!manager) return;
    const canvas = manager.canvas;
    const previous = {
      selection: canvas.selection,
      skipTargetFind: canvas.skipTargetFind,
      defaultCursor: canvas.defaultCursor,
      hoverCursor: canvas.hoverCursor,
    };
    if (panning) {
      canvas.selection = false;
      canvas.skipTargetFind = true;
      canvas.defaultCursor = grabbing ? "grabbing" : "grab";
      canvas.hoverCursor = grabbing ? "grabbing" : "grab";
      canvas.setCursor(grabbing ? "grabbing" : "grab");
    }
    return () => {
      canvas.selection = previous.selection;
      canvas.skipTargetFind = previous.skipTargetFind;
      canvas.defaultCursor = previous.defaultCursor;
      canvas.hoverCursor = previous.hoverCursor;
      canvas.setCursor(previous.defaultCursor);
    };
  }, [manager, panning, grabbing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const drag = { active: false, x: 0, y: 0, left: 0, top: 0 };

    const typing = () => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement)) return false;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable) {
        return true;
      }
      const active = manager?.getActiveObject() as { isEditing?: boolean } | null;
      return Boolean(active?.isEditing);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (typing()) return;
      if (event.code === "Space") {
        if (event.repeat) return;
        event.preventDefault();
        setSpaceDown(true);
        return;
      }
      if (event.code === "KeyH" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        useCanvasStore.getState().toggleHand();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") setSpaceDown(false);
    };
    const onBlur = () => setSpaceDown(false);

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !panningRef.current) return;
      drag.active = true;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.left = container.scrollLeft;
      drag.top = container.scrollTop;
      setGrabbing(true);
      event.preventDefault();
      event.stopPropagation();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag.active) return;
      container.scrollLeft = drag.left - (event.clientX - drag.x);
      container.scrollTop = drag.top - (event.clientY - drag.y);
      event.preventDefault();
    };
    const onPointerUp = () => {
      if (!drag.active) return;
      drag.active = false;
      setGrabbing(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    container.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      container.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [manager]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const current = useCanvasStore.getState().zoom;
      const next = clampZoom(current * Math.exp(-event.deltaY * 0.002));
      if (next !== current) useCanvasStore.getState().setZoom(next);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-0 flex-1 overflow-auto bg-muted/20",
        panning && (grabbing ? "cursor-grabbing" : "cursor-grab"),
      )}
    >
      <div className="flex min-h-full min-w-full items-center justify-center">
      <div
        className="relative shadow-2xl ring-1 ring-border/20 bg-white"
        style={stage.width > 0 ? { width: stage.width, height: stage.height } : undefined}
        onDragOver={(event) => {
          if ([...event.dataTransfer.types].includes("Files")) event.preventDefault();
        }}
        onDrop={(event) => {
          const file = event.dataTransfer.files?.[0];
          if (!file || !manager) return;
          event.preventDefault();
          manager.objects.fillSplitFromFile(file);
        }}
      >
        <canvas ref={canvasElementRef} />
        {showAttention ? <AttentionMap platform={platform ?? "Instagram"} ratio={ratio} /> : null}
      </div>
      </div>
      {isLoadingProject && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-muted/40"
          aria-busy="true"
          aria-label="Loading project"
        >
          <div
            className="flex flex-col gap-4 bg-background p-8 shadow-2xl ring-1 ring-border/20"
            style={{
              aspectRatio: `${canvasDimensions.width} / ${canvasDimensions.height}`,
              width: stage.width > 0 ? stage.width : undefined,
              height: stage.height > 0 ? stage.height : undefined,
              maxWidth: "calc(100% - 96px)",
              maxHeight: "calc(100% - 96px)",
            }}
          >
            <Skeleton className="h-8 w-2/3 rounded-md" />
            <Skeleton className="min-h-24 w-full flex-1 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
