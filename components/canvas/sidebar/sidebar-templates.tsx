"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X, Loader2, Sparkles, RefreshCw } from "lucide-react";

import {
  getTemplates,
  getTemplateCategories,
  seedBuiltinTemplates,
  type TemplateListItem,
} from "@/actions/templates";
import { useApplyTemplate } from "@/hooks/use-apply-template";
import { cn } from "@/lib/utils";

export function SidebarTemplates() {
  const { applyTemplateById } = useApplyTemplate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, catsRes] = await Promise.all([
        getTemplates({
          category: category === "all" ? undefined : category,
          search: search.trim() || undefined,
        }),
        getTemplateCategories(),
      ]);

      if (!listRes.success) {
        alert("Ошибка при загрузке шаблонов");
        setTemplates([]);
        return;
      }

      setTemplates(listRes.templates);
      if (catsRes.success) setCategories(catsRes.categories);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchTemplates();
    }, search ? 220 : 0);
    return () => window.clearTimeout(t);
  }, [fetchTemplates, search]);

  useEffect(() => {
    const onChanged = () => void fetchTemplates();
    window.addEventListener("swibp:templates-changed", onChanged);
    return () => window.removeEventListener("swibp:templates-changed", onChanged);
  }, [fetchTemplates]);

  const handleSeed = async () => {
    setSeeding(true);
    const res = await seedBuiltinTemplates();
    setSeeding(false);
    if (!res.success) {
      alert("Ошибка при засеивании шаблонов");
      return;
    }
    await fetchTemplates();
  };

  const handleApply = async (id: string) => {
    if (applyingId) return;
    setApplyingId(id);
    setError(null);
    try {
      const res = await applyTemplateById(id);
      if (!res.success) alert("Ошибка при применении шаблона");
    } finally {
      setApplyingId(null);
    }
  };

  const tabs = useMemo(() => ["all", ...categories], [categories]);

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground font-medium">Шаблоны</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {templates.length}
          </span>
          <button
            type="button"
            title="Обновить"
            onClick={() => void fetchTemplates()}
            className="h-6 w-6 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </button>
        </div>
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

      {tabs.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCategory(tab)}
              className={cn(
                "h-6 shrink-0 px-2.5 rounded-full text-[10px] border transition-colors",
                category === tab
                  ? "bg-foreground text-background border-foreground"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground",
              )}
            >
              {tab === "all" ? "Все" : tab}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-destructive px-1">{error}</p>
      )}

      {loading && templates.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="py-6 px-2 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            В базе пока нет шаблонов. Засейте встроенные пресеты или опубликуйте свой через Publish.
          </p>
          <button
            type="button"
            disabled={seeding}
            onClick={() => void handleSeed()}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-60"
          >
            {seeding ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            Засеять Built-in
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {templates.map((tpl) => {
            const busy = applyingId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                disabled={!!applyingId}
                onClick={() => void handleApply(tpl.id)}
                className={cn(
                  "flex flex-col p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 text-left gap-2 transition-colors cursor-pointer disabled:opacity-60",
                  busy && "ring-1 ring-primary/40",
                )}
              >
                <div className="w-full h-32 rounded-lg bg-card border border-border/40 overflow-hidden flex items-center justify-center relative">
                  {tpl.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tpl.previewUrl}
                      alt={tpl.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-xs font-bold text-foreground px-3 text-center leading-snug">
                      {tpl.title}
                    </span>
                  )}
                  {busy && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{tpl.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {tpl.badge || tpl.category} · {tpl.slideCount} сл. · {tpl.aspectRatio}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border/40 shrink-0">
                    {busy ? "…" : "Применить"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
