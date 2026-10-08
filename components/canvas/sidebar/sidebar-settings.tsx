"use client";

import { useCanvasStore } from "@/store/useCanvasStore";

const STORAGE_KEY = "swibp.autosave";

interface SidebarSettingsProps {
  showDotGrid: boolean;
  setShowDotGrid: (v: boolean) => void;
}

export function SidebarSettings({ showDotGrid, setShowDotGrid }: SidebarSettingsProps) {
  const autoSave = useCanvasStore((state) => state.autoSave);
  const setAutoSave = useCanvasStore((state) => state.setAutoSave);

  return (
    <div className="flex flex-col gap-3 text-xs">
      <span className="text-muted-foreground font-medium">Canvas Preferences</span>
      <label className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/40 cursor-pointer">
        <span>Show dot grid background</span>
        <input
          type="checkbox"
          checked={showDotGrid}
          onChange={(e) => setShowDotGrid(e.target.checked)}
          className="accent-primary rounded"
        />
      </label>
      <label className="flex items-center justify-between gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/40 cursor-pointer">
        <span>
          Autosave
          <span className="mt-0.5 block text-muted-foreground">Saves quietly in the background</span>
        </span>
        <input
          type="checkbox"
          checked={autoSave}
          onChange={(event) => {
            const enabled = event.target.checked;
            setAutoSave(enabled);
            window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
          }}
          className="accent-primary rounded"
        />
      </label>
    </div>
  );
}
