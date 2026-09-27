"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { TEMPLATES } from "@/lib/templates/templates-data";

export function SidebarTemplates() {
  const [search, setSearch] = useState("");

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return TEMPLATES;

    return TEMPLATES.filter((tpl) =>
      tpl.name.toLowerCase().includes(query) ||
      (tpl.badge && tpl.badge.toLowerCase().includes(query))
    );
  }, [search]);

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium">Шаблоны</span>
        <span className="text-[10px] text-muted-foreground">{filteredTemplates.length}</span>
      </div>

      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск шаблонов..."
          className="w-full h-8 pl-8 pr-7 text-xs bg-muted/50 rounded-full placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((tpl) => (
            <button
              key={tpl.id}
              className="flex flex-col p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 text-left gap-2 transition-colors cursor-pointer"
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
          ))
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Шаблоны не найдены
          </div>
        )}
      </div>
    </div>
  );
}
