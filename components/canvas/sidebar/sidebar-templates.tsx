"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X, Loader2, Sparkles } from "lucide-react";

import {
  getTemplates,
  getTemplateCategories,
  seedBuiltinTemplates,
  type TemplateListItem,
} from "@/actions/templates";
import { useApplyTemplate } from "@/hooks/use-apply-template";
import { cn } from "@/lib/utils";
import { CarouselStack } from "@/components/canvas/sidebar/carousel-stack";

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
        alert("Couldn't load templates");
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
      alert("Couldn't seed templates");
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
      if (!res.success) alert("Couldn't apply the template");
    } finally {
      setApplyingId(null);
    }
  };

  const tabs = useMemo(() => ["all", ...categories], [categories]);

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-medium">Templates</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            {templates.length}
          </span>
        </div>
      </div>

      <div className="relative flex items-center">
        <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full h-8 pl-8 pr-7 text-xs bg-muted/50 rounded-full placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {tabs.length > 1 && (
        <div className="flex gap-1 overflow-x-scroll pb-0.5 px-0.5 w-64">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCategory(tab)}
              className={cn(
                "h-6 shrink-0 px-2.5 rounded-full text-xs border transition-colors",
                category === tab
                  ? "bg-foreground text-background border-foreground"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:text-foreground",
              )}
            >
              {tab === "all" ? "All" : tab}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive px-1">{error}</p>
      )}

      {loading && templates.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="py-6 px-2 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            No templates found. Seed built-in presets or publish your own through Publish.
          </p>
          <button
            type="button"
            disabled={seeding}
            onClick={() => void handleSeed()}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-60"
          >
            {seeding ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Sparkles className="size-3" />
            )}
            Seed Built-in
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
                  "flex flex-col gap-2 rounded-2xl bg-muted/30 p-3 text-left transition-colors hover:bg-muted/70 disabled:opacity-60",
                  busy && "ring-1 ring-foreground/15",
                )}
              >
                <CarouselStack
                  slideCount={tpl.slideCount}
                  previewUrl={tpl.previewUrl}
                  badge="Template"
                  busy={busy}
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{tpl.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {tpl.category} · {tpl.slideCount} slides · {tpl.aspectRatio}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border/40">
                    {busy ? "…" : "Apply"}
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
