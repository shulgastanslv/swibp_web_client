"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useCanvasManager } from "@/context/canvas-manager";
import { cn } from "@/lib/utils";
import {
  searchPixabayIcons,
  type PixabayIcon,
} from "@/actions/pixabay";

const RECENT_KEY = "canvas_recent_pixabay_icons_v2";

function proxiedPixabayUrl(remoteUrl: string): string {
  return `/api/pixabay/image?url=${encodeURIComponent(remoteUrl)}`;
}

const CATEGORIES = [
  { id: "popular", label: "Top", query: "icon" },
  { id: "arrows", label: "Arrows", query: "arrow icon" },
  { id: "business", label: "Business", query: "business icon" },
  { id: "people", label: "People", query: "people icon" },
  { id: "social", label: "Social", query: "social media icon" },
  { id: "tech", label: "Tech", query: "technology icon" },
  { id: "nature", label: "Nature", query: "nature icon" },
  { id: "food", label: "Food", query: "food icon" },
] as const;

export function SidebarIcons() {
  const manager = useCanvasManager();
  const [categoryId, setCategoryId] = useState<string>(CATEGORIES[0].id);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<PixabayIcon[]>([]);
  const [recent, setRecent] = useState<PixabayIcon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as PixabayIcon[];
      if (Array.isArray(parsed) && parsed.length > 0) setRecent(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  const runSearch = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const res = await searchPixabayIcons(q, { perPage: 100 });
      if (res.ok === false) {
        setError(res.error);
        setResults([]);
        return;
      }
      setResults(res.items);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed) {
      const t = window.setTimeout(() => void runSearch(trimmed), 320);
      return () => window.clearTimeout(t);
    }

    const cat =
      CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
    void runSearch(cat.query);
  }, [search, categoryId, runSearch]);

  const handleSelect = async (icon: PixabayIcon) => {
    if (!manager || loadingId) return;
    setLoadingId(icon.id);
    setError(null);

    try {
      const updated = [icon, ...recent.filter((i) => i.id !== icon.id)].slice(
        0,
        8,
      );
      setRecent(updated);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      await manager.objects.addImage(proxiedPixabayUrl(icon.imageUrl), {
        maxSize: 160,
      });
      manager.commit();
    } catch (err) {
      console.error(err);
      setError("Ошибка добавления");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-hidden p-1.5">
      <div className="relative min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
          className="h-9 w-full min-w-0 rounded-xl bg-muted/30 pl-9 pr-9 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:bg-muted/45"
        />
        {search ? (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      {!search.trim() && (
        <div className="flex min-w-0 flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={cn(
                "h-6 rounded-full px-2 text-xs transition-colors",
                categoryId === cat.id
                  ? "bg-muted/50 rounded-full text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {recent.length > 0 && !search.trim() && (
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground/80">
            Recent
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {recent.slice(0, 8).map((item) => (
              <IconTile
                key={`r-${item.id}`}
                item={item}
                loading={loadingId === item.id}
                onSelect={() => void handleSelect(item)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground/80">
            {search.trim() ? "Results" : "Assets"}
          </span>
          <span className="tabular-nums text-xs text-muted-foreground/40">
            {results.length}
          </span>
        </div>

        {isSearching && results.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <p className="py-12 text-center text-xs text-muted-foreground">
            No assets found
          </p>
        ) : (
          <div className="grid min-w-0 grid-cols-3 gap-2">
            {results.map((item) => (
              <IconTile
                key={item.id}
                item={item}
                loading={loadingId === item.id}
                onSelect={() => void handleSelect(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconTile({
  item,
  loading,
  onSelect,
}: {
  item: PixabayIcon;
  loading: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onSelect}
      title={item.name}
      className={cn(
        "group flex aspect-square min-w-0 flex-col items-center justify-center rounded-xl bg-muted/25 p-2 transition-colors",
        "hover:bg-muted/55 active:scale-[0.97] disabled:opacity-50",
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground/50" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.previewUrl}
          alt={item.name}
          className="size-full object-contain opacity-90 transition-transform group-hover:scale-[1.03] group-hover:opacity-100"
          draggable={false}
          loading="lazy"
        />
      )}
    </button>
  );
}
