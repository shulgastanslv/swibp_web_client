"use client";

import React, { useEffect, useRef, useState } from "react";
import type { FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { Layers, X } from "lucide-react";
import { useCanvasManager, useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";

const EDGE_TOLERANCE = 8;

function isOutOfBounds(
  obj: FabricObject,
  width: number,
  height: number,
  zoom: number,
): boolean {
  // @ts-expect-error custom effect flag
  if (obj.isEffectLayer || obj.excludeFromExport) return false;

  obj.setCoords();
  // getBoundingRect includes viewport zoom — convert back to logical slide space.
  const rect = obj.getBoundingRect();
  const left = rect.left / zoom;
  const top = rect.top / zoom;
  const w = rect.width / zoom;
  const h = rect.height / zoom;

  return (
    left < -EDGE_TOLERANCE ||
    top < -EDGE_TOLERANCE ||
    left + w > width + EDGE_TOLERANCE ||
    top + h > height + EDGE_TOLERANCE
  );
}

/**
 * When Auto Flow is on and an object leaves the slide, offer to create
 * a new slide and move that object there.
 */
export function AutoFlowPrompt() {
  const manager = useCanvasManager();
  const slidesController = useSlidesController();
  const autoFlowEnabled = useCanvasStore((s) => s.autoFlowEnabled);
  const canvasDimensions = useCanvasStore((s) => s.canvasDimensions);

  const [pending, setPending] = useState<FabricObject | null>(null);
  const dismissedFor = useRef<WeakSet<FabricObject>>(new WeakSet());
  const busy = useRef(false);

  useEffect(() => {
    if (!manager || !autoFlowEnabled) {
      setPending(null);
      return;
    }

    const onModified = (e?: { target?: FabricObject }) => {
      const target = e?.target ?? manager.getActiveObject();
      if (!target || busy.current) return;
      if (dismissedFor.current.has(target)) return;

      const { width, height } = canvasDimensions;
      const zoom = manager.canvas.getZoom() || 1;
      if (isOutOfBounds(target, width, height, zoom)) {
        setPending(target);
      } else {
        setPending((prev) => (prev === target ? null : prev));
      }
    };

    manager.canvas.on("object:modified", onModified);
    return () => {
      manager.canvas.off("object:modified", onModified);
    };
  }, [manager, autoFlowEnabled, canvasDimensions]);

  if (!pending || !autoFlowEnabled) return null;

  const dismiss = () => {
    dismissedFor.current.add(pending);
    setPending(null);
  };

  const accept = async () => {
    if (!manager || !slidesController || busy.current) return;
    busy.current = true;
    try {
      const obj = pending;
      setPending(null);

      // Clone before removing from the current slide.
      const cloned = await obj.clone();
      manager.canvas.remove(obj);
      manager.canvas.discardActiveObject();
      manager.canvas.requestRenderAll();
      manager.commit();

      await slidesController.add();

      const w = canvasDimensions.width;
      const h = canvasDimensions.height;
      const left = Math.max(40, Math.min(Number(cloned.left) || 40, w - 80));
      const top = Math.max(40, Math.min(Number(cloned.top) || 40, h - 80));
      cloned.set({ left, top });
      cloned.setCoords();

      manager.canvas.add(cloned);
      manager.canvas.setActiveObject(cloned);
      manager.canvas.requestRenderAll();
      manager.commit();
    } catch (err) {
      console.error("Auto Flow failed:", err);
    } finally {
      busy.current = false;
    }
  };

  return (
    <div className="pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 px-3">
      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border/60 bg-background/95 px-3 py-2 shadow-lg backdrop-blur-md">
        <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <p className="text-xs text-foreground max-w-[240px]">
          Объект выходит за край слайда. Создать следующий и перенести?
        </p>
        <Button
          size="sm"
          className="h-7 rounded-xl text-xs px-2.5 shrink-0"
          onClick={() => void accept()}
        >
          Создать
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full shrink-0"
          onClick={dismiss}
          title="Скрыть"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
