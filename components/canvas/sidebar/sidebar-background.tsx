"use client";

import React from "react";
import { useCanvasStore } from "@/store/useCanvasStore";
import {
  SOLID_PRESETS,
  GRADIENT_PRESETS,
  RADIAL_PRESETS,
} from "@/lib/presets/backgrounds";

export function SidebarBackground() {
  const { setBackground } = useCanvasStore();

  return (
    <div className="flex flex-col gap-5 text-xs">
      {/* ── Solid Colors ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Solid
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SOLID_PRESETS.map((p) => (
            <button
              key={p.color}
              onClick={() => setBackground({ type: "solid", color: p.color })}
              style={{ backgroundColor: p.color }}
              className="w-7 h-7 rounded-lg border border-white/10 hover:scale-110 hover:ring-2 hover:ring-primary/50 transition-all shrink-0"
            />
          ))}
          <label className="w-7 h-7 rounded-lg border border-dashed border-border/60 hover:scale-110 transition-all shrink-0 cursor-pointer flex items-center justify-center bg-muted/30">
            <input
              type="color"
              className="opacity-0 absolute w-0 h-0"
              onChange={(e) =>
                setBackground({ type: "solid", color: e.target.value })
              }
            />
            <span className="text-[11px] text-muted-foreground leading-none select-none">
              +
            </span>
          </label>
        </div>
      </section>

      {/* ── Linear Gradients ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Gradients
        </p>
        <div className="grid grid-cols-8 gap-1.5">
          {GRADIENT_PRESETS.map((g, i) => (
            <button
              key={i}
              onClick={() =>
                setBackground({ type: "gradient", colors: g.colors })
              }
              className="rounded-lg border border-white/10 hover:scale-[1.06] hover:ring-2 hover:ring-primary/50 transition-all"
              style={{
                background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                aspectRatio: "1 / 1",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Radial Gradients ── */}
      <section>
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Radial
        </p>
        <div className="grid grid-cols-8 gap-1.5">
          {RADIAL_PRESETS.map((r, i) => (
            <button
              key={i}
              onClick={() =>
                setBackground({ type: "gradient", colors: r.colors })
              }
              className=" rounded-lg  border border-white/10 hover:scale-[1.06] hover:ring-2 hover:ring-primary/50 transition-all"
              style={{
                background: `radial-gradient(circle at center, ${r.colors[0]}, ${r.colors[1]})`,
                aspectRatio: "1 / 1",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
