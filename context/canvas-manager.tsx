"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CanvasManager } from "@/lib/canvas/manager";
import type { SlidesController } from "@/lib/canvas/slides";
import { createEditor, type Editor } from "@/lib/canvas/editor";
import { useCanvasStore } from "@/store/useCanvasStore";

interface CanvasContextValue {
  manager: CanvasManager | null;
  slides: SlidesController | null;
  /** Creates the editor on a mounted `<canvas>` and returns its cleanup. */
  attach: (element: HTMLCanvasElement) => () => void;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function CanvasManagerProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);

  const attach = useCallback((element: HTMLCanvasElement) => {
    const created = createEditor(element, useCanvasStore);
    setEditor(created);
    return () => {
      setEditor((current) => (current === created ? null : current));
      created.dispose();
    };
  }, []);

  const value = useMemo<CanvasContextValue>(
    () => ({ manager: editor?.manager ?? null, slides: editor?.slides ?? null, attach }),
    [editor, attach],
  );

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

function useCanvasContext(): CanvasContextValue {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw new Error("Canvas hooks must be used within CanvasManagerProvider");
  }
  return ctx;
}

/** `null` until `<CanvasView />` has mounted. */
export function useCanvasManager(): CanvasManager | null {
  return useCanvasContext().manager;
}

export function useSlidesController(): SlidesController | null {
  return useCanvasContext().slides;
}

export function useAttachCanvas(): CanvasContextValue["attach"] {
  return useCanvasContext().attach;
}
