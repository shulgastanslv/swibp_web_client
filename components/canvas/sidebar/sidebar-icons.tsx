"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useCanvasManager } from "@/context/canvas-manager";
import { cn } from "@/lib/utils";
import {
  categoriesForTab,
  defaultsForTab,
  displayName,
  ICON_TABS,
  tabById,
  type IconItem,
  type IconTabId,
} from "@/lib/icons/catalog";
import { searchIconifyIcons } from "@/lib/icons/fetch-svg";
import {
  ensureIconBodies,
  fetchIconSvg,
  getCachedIconDataUrl,
} from "@/lib/icons/icon-cache";
import { fetchUndrawSvg, searchUndraw } from "@/actions/undraw";

const RECENT_KEY = "canvas_recent_icons_v2";
const ICON_COLORS = [
  "#111827",
  "#ffffff",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#6c63ff",
  "#a855f7",
  "#ec4899",
] as const;

export function SidebarIcons() {
  const manager = useCanvasManager();
  const [tab, setTab] = useState<IconTabId>("icons");
  const [categoryId, setCategoryId] = useState("popular");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<IconItem[]>([]);
  const [recent, setRecent] = useState<IconItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [iconColor, setIconColor] = useState("#6c63ff");
  const [thumbsTick, setThumbsTick] = useState(0);

  const activeTab = tabById(tab);
  const isUndraw = tab === "undraw";
  const categories = categoriesForTab(tab);
  const showColorPicker = tab === "icons" || isUndraw;
  const previewColor = showColorPicker ? iconColor : "#111827";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as IconItem[];
      if (Array.isArray(parsed) && parsed.length > 0) setRecent(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  const runSearch = useCallback(
    async (query: string) => {
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
        if (isUndraw) {
          const res = await searchUndraw(q);
          if (res.ok === false) {
            setError(res.error);
            return;
          }
          setResults(res.items.map((item) => ({
            id: item.id,
            name: item.title,
            media: item.media,
            kind: "undraw" as const,
          })));
        } else {
          const icons = await searchIconifyIcons({
            query: q,
            prefixes: activeTab.prefixes,   
            limit: 60,
          });
          setResults(icons);
        }
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [activeTab.prefixes, isUndraw],
  );

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    const t = window.setTimeout(() => void runSearch(trimmed), 320);
    return () => window.clearTimeout(t);
  }, [search, runSearch]);

  useEffect(() => {
    if (search.trim()) return;
    const cat = categories.find((c) => c.id === categoryId) ?? categories[0];
    if (!cat) return;
    void runSearch(cat.query);
  }, [categoryId, tab, search, runSearch, categories]);

  const list = useMemo(() => {
    if (search.trim() || results.length > 0) return results;
    return defaultsForTab(tab);
  }, [search, results, tab]);

  useEffect(() => {
    if (isUndraw) return;
    const ids = [
      ...list.filter((i) => i.kind !== "undraw").map((i) => i.id),
      ...(!search.trim()
        ? recent
            .filter((i) => i.kind !== "undraw")
            .slice(0, 8)
            .map((i) => i.id)
        : []),
    ];
    if (ids.length === 0) return;

    let cancelled = false;
    void ensureIconBodies(ids).then(() => {
      if (!cancelled) setThumbsTick((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [list, recent, search, isUndraw]);

  const handleSelect = async (icon: IconItem) => {
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

      let svg: string | null = null;
      if (icon.kind === "undraw" && icon.media) {
        const res = await fetchUndrawSvg(icon.media, previewColor);
        if (!res.ok) {
          return;
        }
        svg = res.svg;
      } else {
        svg = await fetchIconSvg(icon.id, previewColor);
      }

      if (!svg) {
        setError("Иконка недоступна");
        return;
      }

      await manager.io.addSVG(svg, {
        maxSize: icon.kind === "undraw" ? 360 : 120,
      });
      manager.commit();
    } catch (err) {
      console.error(err);
      setError("Ошибка добавления");
    } finally {
      setLoadingId(null);
    }
  };

  const switchTab = (next: IconTabId) => {
    setTab(next);
    setSearch("");
    setResults([]);
    const cats = categoriesForTab(next);
    setCategoryId(cats[0]?.id ?? "popular");
    if (next === "undraw") setIconColor("#6c63ff");
    else if (next === "icons") setIconColor("#111827");
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-hidden p-1.5">
      <nav className="flex min-w-0 gap-0.5 rounded-xl bg-muted/30 p-1">
        {ICON_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTab(t.id)}
            className={cn(
              "h-8 min-w-0 flex-1 truncate rounded-lg text-[10px] font-medium tracking-tight transition-colors",
              tab === t.id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="relative min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isUndraw ? "Найти иллюстрацию…" : "Найти…"}
          className="h-9 w-full min-w-0 rounded-xl bg-muted/30 pl-9 pr-9 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:bg-muted/45"
        />
        {search ? (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      {!search.trim() && (
        <div className="flex min-w-0 flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={cn(
                "h-6 rounded-md px-2 text-[10px] transition-colors",
                categoryId === cat.id
                  ? "bg-foreground/90 text-background"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {showColorPicker && (
        <div className="flex items-center gap-1.5">
          {ICON_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => setIconColor(c)}
              className={cn(
                "h-[18px] w-[18px] rounded-full transition-transform",
                c === "#ffffff" && "ring-1 ring-border/60",
                iconColor === c
                  ? "scale-110 ring-2 ring-foreground ring-offset-1 ring-offset-background"
                  : "hover:opacity-80",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <label className="relative h-[18px] w-[18px] cursor-pointer overflow-hidden rounded-full ring-1 ring-border/50">
            <input
              type="color"
              value={iconColor}
              onChange={(e) => setIconColor(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <span
              className="block h-full w-full"
              style={{
                background:
                  "conic-gradient(from 90deg, #f43f5e, #eab308, #22c55e, #06b6d4, #6366f1, #d946ef, #f43f5e)",
              }}
            />
          </label>
        </div>
      )}

      {error && <p className="text-[11px] text-destructive">{error}</p>}

      {recent.length > 0 && !search.trim() && (
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground/80">
            Недавние
          </span>
          <div
            className={cn(
              "grid gap-1.5",
              isUndraw ? "grid-cols-4" : "grid-cols-8",
            )}
          >
            {recent
              .filter((i) => (isUndraw ? i.kind === "undraw" : i.kind !== "undraw"))
              .slice(0, isUndraw ? 4 : 8)
              .map((item) => (
                <IconTile
                  key={`r-${item.id}`}
                  item={item}
                  color={previewColor}
                  tick={thumbsTick}
                  loading={loadingId === item.id}
                  onSelect={() => void handleSelect(item)}
                  size={item.kind === "undraw" ? "illustration" : "sm"}
                />
              ))}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground/80">
            {search.trim()
              ? "Результаты"
              : isUndraw
                ? "Иллюстрации"
                : "Библиотека"}
          </span>
          <span className="tabular-nums text-[10px] text-muted-foreground/40">
            {list.length}
          </span>
        </div>

        {isSearching && list.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : list.length === 0 ? (
          <p className="py-12 text-center text-[11px] text-muted-foreground">
            Ничего не найдено
          </p>
        ) : (
          <div
            className={cn(
              "grid min-w-0 gap-2",
              isUndraw ? "grid-cols-2" : "grid-cols-4",
            )}
          >
            {list.map((item) => (
              <IconTile
                key={item.id}
                item={item}
                color={previewColor}
                tick={thumbsTick}
                loading={loadingId === item.id}
                onSelect={() => void handleSelect(item)}
                size={item.kind === "undraw" ? "illustration" : "md"}
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
  color,
  tick,
  loading,
  onSelect,
  size = "md",
}: {
  item: IconItem;
  color: string;
  tick: number;
  loading: boolean;
  onSelect: () => void;
  size?: "sm" | "md" | "illustration";
}) {
  const isIllustration = size === "illustration" || item.kind === "undraw";
  const sm = size === "sm";
  const cached = item.kind === "undraw" ? null : getCachedIconDataUrl(item.id, color);
  const src = item.media ?? cached;
  void tick;

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onSelect}
      title={displayName(item.id, item.name)}
      className={cn(
        "group flex min-w-0 flex-col items-center justify-center rounded-xl bg-muted/25 transition-colors",
        "hover:bg-muted/55 active:scale-[0.97] disabled:opacity-50",
        isIllustration ? "aspect-[4/3] gap-1 p-2" : "aspect-square",
        sm && "p-0",
        size === "md" && "p-2.5",
      )}
    >
      {loading || !src ? (
        <Loader2
          className={cn(
            "animate-spin text-muted-foreground/50",
            sm ? "h-3.5 w-3.5" : "h-4 w-4",
          )}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={displayName(item.id, item.name)}
            className={cn(
              "object-contain opacity-90 transition-transform group-hover:scale-[1.03] group-hover:opacity-100",
              isIllustration
                ? "h-full w-full"
                : sm
                  ? "h-4 w-4"
                  : "h-6 w-6",
            )}
            draggable={false}
            loading="lazy"
          />
          {isIllustration && (
            <span className="w-full truncate text-center text-[9px] text-muted-foreground group-hover:text-foreground">
              {item.name}
            </span>
          )}
        </>
      )}
    </button>
  );
}
