"use client";

import { useState } from "react";

export function SidebarGenerate() {
  const [theme, setTheme] = useState("");
  const [slides, setSlides] = useState(6);

  return (
    <div className="flex flex-col gap-3 px-1 py-1 text-xs text-foreground">
      <label className="flex flex-col gap-1.5">
        <span className="px-1 font-medium text-muted-foreground">Theme</span>
        <input
          type="text"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          placeholder="What the carousel is about"
          className="h-8 w-full rounded-full bg-muted/30 px-3 text-xs outline-none placeholder:text-muted-foreground focus:bg-muted/50"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="px-1 font-medium text-muted-foreground">Slides</span>
        <input
          type="number"
          min={1}
          max={20}
          value={slides}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isFinite(next)) return;
            setSlides(Math.min(20, Math.max(1, Math.round(next))));
          }}
          className="h-8 w-full rounded-full bg-muted/30 px-3 text-xs outline-none focus:bg-muted/50"
        />
      </label>

      <button
        type="button"
        disabled={theme.trim().length < 2}
        className="flex h-8 w-full items-center justify-center rounded-full bg-foreground px-2.5 text-xs text-background transition-opacity disabled:opacity-40"
      >
        Generate
      </button>
    </div>
  );
}
