import React, { createContext, useContext, useState, useMemo } from "react";
import type { CanvasManager } from "@/lib/canvas/manager";

interface CanvasManagerContextType {
  manager: CanvasManager | null;
  setManager: (manager: CanvasManager | null) => void;
}

const CanvasManagerContext = createContext<CanvasManagerContextType | null>(null);

export function CanvasManagerProvider({ children }: { children: React.ReactNode }) {
  const [manager, setManager] = useState<CanvasManager | null>(null);

  const actions = useMemo(() => ({
    manager,
    setManager,
  }), [manager]);

  return (
    <CanvasManagerContext.Provider value={actions}>
      {children}
    </CanvasManagerContext.Provider>
  );
}

export function useCanvasManager() {
  const ctx = useContext(CanvasManagerContext);
  if (!ctx) {
    throw new Error("useCanvasManager must be used within CanvasManagerProvider");
  }
  return ctx;
}
