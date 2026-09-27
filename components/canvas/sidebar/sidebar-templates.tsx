"use client";

import { TEMPLATES } from "@/lib/templates/templates-data";
import { useCanvasStore } from "@/store/useCanvasStore";

export function SidebarTemplates() {
  const applyTemplatePreset = useCanvasStore((s) => s.applyTemplatePreset);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] text-muted-foreground font-medium">Шаблоны</span>

      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => applyTemplatePreset(tpl.json)}
          className="flex flex-col p-3 rounded-xl bg-muted/30 hover:bg-muted/70 text-left gap-2 transition-colors"
        >
          <div className="w-full h-32 rounded-lg bg-card border border-border/40 flex items-center justify-center text-xs font-bold text-foreground">
            {tpl.name}
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">{tpl.badge}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border/40">
              Применить
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
