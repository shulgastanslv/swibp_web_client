"use client";

interface SidebarSettingsProps {
  showDotGrid: boolean;
  setShowDotGrid: (v: boolean) => void;
}

export function SidebarSettings({ showDotGrid, setShowDotGrid }: SidebarSettingsProps) {
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
    </div>
  );
}
