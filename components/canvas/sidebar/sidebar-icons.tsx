"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, X, LayoutGrid } from "lucide-react";
import { useCanvasManager } from "@/context/canvas-manager";
import { cn } from "@/lib/utils";
import { FilterMenu } from "@/components/canvas/sidebar/filter-menu";
import { listLibraryIcons, type LibraryIcon } from "@/actions/icons";

const RECENT_KEY = "canvas_recent_library_icons_v1";

function folderLabel(folder: string): string {
  return folder
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function SidebarIcons() {
  const manager = useCanvasManager();
  const [icons, setIcons] = useState<LibraryIcon[]>([]);
  const [categoryId, setCategoryId] = useState("all");
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<LibraryIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as LibraryIcon[];
      if (Array.isArray(parsed) && parsed.length > 0) setRecent(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void listLibraryIcons().then((res) => {
      if (cancelled) return;
      if (res.ok === false) {
        setError(res.error);
        setIcons([]);
      } else {
        setIcons(res.items);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const icon of icons) {
      if (icon.category) names.add(icon.category);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [icons]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return icons.filter((icon) => {
      if (query) {
        return (
          icon.name.toLowerCase().includes(query) ||
          icon.id.toLowerCase().includes(query)
        );
      }
      if (categoryId !== "all" && icon.category !== categoryId) return false;
      return true;
    });
  }, [icons, search, categoryId]);

  const handleSelect = async (icon: LibraryIcon) => {
    if (!manager || loadingId) return;
    setLoadingId(icon.id);
    setError(null);

    try {
      const updated = [icon, ...recent.filter((item) => item.id !== icon.id)].slice(0, 8);
      setRecent(updated);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }

      if (icon.url.toLowerCase().endsWith(".svg")) {
        const res = await fetch(icon.url);
        if (!res.ok) throw new Error(`icon ${res.status}`);
        await manager.io.addSVG(await res.text(), { maxSize: 160 });
      } else {
        await manager.objects.addImage(icon.url, { maxSize: 160 });
      }
      manager.commit();
    } catch (err) {
      console.error(err);
      setError("Couldn't add");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-hidden p-1.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="h-8 w-full min-w-0 rounded-lg bg-muted/30 pl-8 pr-8 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:bg-muted/45"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        {!search.trim() && categories.length > 0 && (
          <FilterMenu
            icon={LayoutGrid}
            value={categoryId}
            onChange={setCategoryId}
            groups={[
              {
                label: "Category",
                options: [
                  { id: "all", label: "All" },
                  ...categories.map((folder) => ({
                    id: folder,
                    label: folderLabel(folder),
                  })),
                ],
              },
            ]}
          />
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {recent.length > 0 && !search.trim() && (
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground/80">Recent</span>
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
            {visible.length}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-xs text-muted-foreground">
            {icons.length === 0
              ? "Put images in public/icons"
              : "No assets found"}
          </p>
        ) : (
          <div className="grid min-w-0 grid-cols-3 gap-2">
            {visible.map((item) => (
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
  item: LibraryIcon;
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
          src={item.url}
          alt={item.name}
          className="size-full object-contain opacity-90 transition-transform group-hover:scale-[1.03] group-hover:opacity-100"
          draggable={false}
          loading="lazy"
        />
      )}
    </button>
  );
}
