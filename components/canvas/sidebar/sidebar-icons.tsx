"use client";

import { useEffect, useState } from "react";
import { Loader2, LayoutGrid, Search, X } from "lucide-react";

import { loadIconScoutImage, loadIconScoutSvg, searchIconScout } from "@/actions/iconscout";
import { FilterMenu } from "@/components/canvas/sidebar/filter-menu";
import { GallerySection } from "@/components/canvas/sidebar/gallery-card";
import { useCanvasManager } from "@/context/canvas-manager";
import type { IconScoutHit } from "@/lib/iconscout";
import {
  RECENT_PREVIEW,
  RECENT_STORAGE_KEY,
  readRecentIcons,
  rememberIcon,
  type RecentIcon,
} from "@/lib/iconscout-recent";
import { cn } from "@/lib/utils";

const ASSETS = [
  { id: "icon", label: "Icons" },
  { id: "illustration", label: "Illustrations" },
  { id: "3d", label: "3D" },
] as const;

type AssetId = (typeof ASSETS)[number]["id"];

/** IconScout serves at most 1500 results, 200 per page. */
const MAX_PAGES = 8;

function IconTile({
  item,
  busy,
  disabled,
  onClick,
}: {
  item: IconScoutHit;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={item.name}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex aspect-square min-w-0 items-center justify-center rounded-xl bg-muted/25 p-2 transition-colors",
        "hover:bg-muted/55 disabled:opacity-50",
      )}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground/50" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.previewUrl} alt={item.name} className="size-full object-contain" draggable={false} loading="lazy" />
      )}
    </button>
  );
}

export function SidebarIcons() {
  const manager = useCanvasManager();
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState<AssetId>("icon");
  const [items, setItems] = useState<IconScoutHit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<RecentIcon[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);

  useEffect(() => {
    setRecent(readRecentIcons(window.localStorage.getItem(RECENT_STORAGE_KEY)));
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      setPaging(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setPaging(false);
    const timer = window.setTimeout(() => {
      void (async () => {
        const first = await searchIconScout({ query: trimmed, asset, page: 1 });
        if (cancelled) return;
        if (!first.ok) {
          setItems([]);
          setTotal(0);
          setError("Failed to search IconScout");
          setLoading(false);
          return;
        }
        setItems(first.items);
        setTotal(first.total);
        setError(null);
        setLoading(false);

        const lastPage = Math.min(first.lastPage, MAX_PAGES);
        if (lastPage < 2) return;
        setPaging(true);
        for (let page = 2; page <= lastPage; page += 1) {
          const next = await searchIconScout({ query: trimmed, asset, page });
          if (cancelled) return;
          if (!next.ok) break;
          setItems((current) => {
            const seen = new Set(current.map((item) => item.id));
            return [...current, ...next.items.filter((item) => !seen.has(item.id))];
          });
        }
        if (!cancelled) setPaging(false);
      })();
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, asset]);

  const remember = (hit: RecentIcon) => {
    setRecent((current) => {
      const next = rememberIcon(current, hit);
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addHit = async (hit: IconScoutHit, kind: AssetId) => {
    if (!manager || loadingId) return;
    setLoadingId(hit.id);
    setError(null);
    try {
      if (kind === "icon") {
        const res = await loadIconScoutSvg(hit.id);
        if (res.ok === false) {
          setError(res.error);
          return;
        }
        await manager.objects.addSvgIcon(res.svg, { maxSize: 280 });
      } else {
        const res = await loadIconScoutImage(hit.previewUrl);
        if (!res.ok) {
          setError("Failed to load IconScout image");
          return;
        }
        await manager.objects.addImage(res.dataUrl, { maxSize: 280 });
      }
      manager.commit();
      remember({ ...hit, asset: kind });
    } catch (err) {
      console.error(err);
      setError("Couldn't add that image");
    } finally {
      setLoadingId(null);
    }
  };

  const visibleRecent = showAllRecent ? recent : recent.slice(0, RECENT_PREVIEW);
  const searching = query.trim().length >= 2;

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-hidden p-1.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search IconScout..."
            className="h-8 w-full min-w-0 rounded-lg bg-muted/30 pl-8 pr-8 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:bg-muted/45"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <FilterMenu
          icon={LayoutGrid}
          value={asset}
          onChange={(id) => {
            if (ASSETS.some((item) => item.id === id)) setAsset(id as AssetId);
          }}
          groups={[{ label: "Type", options: ASSETS.map((item) => ({ id: item.id, label: item.label })) }]}
        />
      </div>

      {error ? <p className="text-[13px] text-destructive">{error}</p> : null}

      {recent.length > 0 ? (
        <GallerySection
          title="Recently used"
          action={recent.length > RECENT_PREVIEW ? (showAllRecent ? "Show less" : "See all") : undefined}
          onAction={() => setShowAllRecent((open) => !open)}
        >
          {visibleRecent.map((item) => (
            <IconTile
              key={item.id}
              item={item}
              busy={loadingId === item.id}
              disabled={loadingId !== null}
              onClick={() => void addHit(item, item.asset)}
            />
          ))}
        </GallerySection>
      ) : null}

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-muted-foreground/80">Results</span>
          <span className="inline-flex items-center gap-1 tabular-nums text-[13px] text-muted-foreground/40">
            {paging ? <Loader2 className="size-3 animate-spin" /> : null}
            {searching ? `${items.length}${total > items.length ? ` / ${total}` : ""}` : recent.length}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : !searching ? (
          recent.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-muted-foreground">Search icons, illustrations, or 3D.</p>
          ) : null
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-[13px] text-muted-foreground">Nothing matched.</p>
        ) : (
          <div className="grid min-w-0 grid-cols-3 gap-2">
            {items.map((item) => (
              <IconTile
                key={item.id}
                item={item}
                busy={loadingId === item.id}
                disabled={loadingId !== null}
                onClick={() => void addHit(item, asset)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
