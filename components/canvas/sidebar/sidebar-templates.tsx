"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Loader2, LayoutGrid, FileJson } from "lucide-react";

import {
  getTemplates,
  getTemplateCategories,
  type TemplateListItem,
} from "@/actions/templates";
import { useApplyTemplate } from "@/hooks/use-apply-template";
import { parseImportedTemplate } from "@/lib/templates/parse";
import { useCanvasStore } from "@/store/useCanvasStore";
import { cn } from "@/lib/utils";
import { CarouselStack } from "@/components/canvas/sidebar/carousel-stack";
import { FilterMenu } from "@/components/canvas/sidebar/filter-menu";

export function SidebarTemplates() {
  const { applyTemplateById, applyPayload } = useApplyTemplate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
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
    window.addEventListener("core:templates-changed", onChanged);
    return () => window.removeEventListener("core:templates-changed", onChanged);
  }, [fetchTemplates]);


  const handleImportFile = async (file: File | undefined) => {
    if (!file || importing) return;
    setImporting(true);
    setError(null);
    try {
      const parsed = parseImportedTemplate(await file.text());
      if (parsed.ok === false) {
        setError(parsed.error);
        return;
      }

      const store = useCanvasStore.getState();
      await applyPayload({
        title: parsed.template.title,
        aspectRatio: parsed.template.aspectRatio ?? store.currentRatio,
        slides: parsed.template.slides,
        thumbnails: parsed.template.thumbnails,
        previewUrl: parsed.template.previewUrl,
      });
      const title = parsed.template.title?.trim();
      if (title) useCanvasStore.getState().setProjectTitle(title);
    } catch (err) {
      console.error(err);
      setError("Couldn't import that template");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleImportFile(file);
        }}
      />


      <div className="flex min-w-0 items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="h-8 w-full min-w-0 rounded-full bg-muted/50 pl-8 pr-7 text-xs placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <FilterMenu
          icon={LayoutGrid}
          value={category}
          onChange={setCategory}
          groups={[
            {
              label: "Category",
              options: tabs.map((tab) => ({
                id: tab,
                label: tab === "all" ? "All" : tab,
              })),
            },
          ]}
        />
        <button
          type="button"
          disabled={importing}
          title="Import a template from a JSON file"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files?.[0];
            void handleImportFile(file);
          }}
          className="flex h-8 items-center justify-center gap-1.5 rounded-full  px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 disabled:opacity-60"
        >
          {importing ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <FileJson className="size-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

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
