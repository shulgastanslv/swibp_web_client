"use client";

import React, { useState, useEffect } from "react";
import { Search, Clock, Loader2, Sparkles } from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas";
import { util, loadSVGFromString } from "fabric";
import { fetchIconifySvg } from "@/actions/icons";

interface IconItem {
  id: string;
  name: string;
}

const DEFAULT_RECENT: IconItem[] = [
  { id: "solar:rocket-2-bold-duotone", name: "Ракета" },
  { id: "solar:fire-bold-duotone", name: "Огонь" },
  { id: "solar:star-bold-duotone", name: "Звезда" },
  { id: "solar:chart-2-bold-duotone", name: "График" },
  { id: "solar:heart-bold-duotone", name: "Лайк" },
  { id: "solar:magic-stick-3-bold-duotone", name: "Магия" },
  { id: "solar:lightbulb-bolt-bold-duotone", name: "Идея" },
  { id: "solar:chat-round-dots-bold-duotone", name: "Чат" },
];

export function SidebarIcons() {
  const { managerRef } = useCanvas();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<IconItem[]>([]);
  const [recentIcons, setRecentIcons] = useState<IconItem[]>(DEFAULT_RECENT);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingIconId, setLoadingIconId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("canvas_recent_iconify");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setRecentIcons(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        // Ограничиваем поиск красивыми коллекциями (solar, lucide, tabler, flat-color-icons)
        const prefixes = "solar,lucide,tabler,fluent-emoji-flat";
        const url = `https://api.iconify.design/search?query=${encodeURIComponent(
          trimmed
        )}&prefixes=${prefixes}&limit=64`;

        const res = await fetch(url);
        const data = await res.json();

        const parsedIcons: IconItem[] = (data.icons || []).map((fullId: string) => {
          const parts = fullId.split(":");
          const rawName = parts[1] || fullId;
          return {
            id: fullId,
            name: rawName.replace(/-/g, " "),
          };
        });

        setSearchResults(parsedIcons);
      } catch (error) {
        console.error("Ошибка поиска иконок:", error);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelectIcon = async (icon: IconItem) => {
    if (!managerRef) return;
    setLoadingIconId(icon.id);

    try {
      // 1. Сохраняем в недавние
      const updatedRecent = [icon, ...recentIcons.filter((i) => i.id !== icon.id)].slice(0, 8);
      setRecentIcons(updatedRecent);
      try {
        localStorage.setItem("canvas_recent_iconify", JSON.stringify(updatedRecent));
      } catch {}

      // 2. Скачиваем чистый SVG
      const svgString = await fetchIconifySvg(icon.id);
      if (!svgString) return;

      const canvas = managerRef.getCanvas();

      // 3. Парсим SVG строку в векторные объекты Fabric.js
      const { objects, options } = await loadSVGFromString(svgString);
      const validObjects = objects.filter((o): o is NonNullable<typeof o> => o !== null);

      if (validObjects.length === 0) return;

      // 4. Группируем элементы и центрируем
      const svgGroup = util.groupSVGElements(validObjects, options);
      svgGroup.scaleToWidth(120);
      canvas.centerObject(svgGroup);

      canvas.add(svgGroup);
      canvas.setActiveObject(svgGroup);
      canvas.renderAll();
    } catch (error) {
      console.error("Не удалось добавить иконку на холст:", error);
    } finally {
      setLoadingIconId(null);
    }
  };

  const isSearchActive = search.trim().length > 0;
  const currentList = isSearchActive ? searchResults : recentIcons;

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Поиск иконок (e.g. fire, star, social)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-8 rounded-full border border-border/60 bg-muted/30 text-xs pl-8 pr-8 outline-none placeholder:text-muted-foreground/60 focus:border-border transition-colors"
        />
        {isSearching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin pointer-events-none" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{isSearchActive ? "Результаты поиска" : "Недавно использованные"}</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/50">
            {currentList.length}
          </span>
        </div>

        {!isSearching && currentList.length === 0 ? (
          <p className="text-center text-[11px] text-muted-foreground py-6">
            Иконки не найдены
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2 max-h-[52vh] overflow-y-auto pr-0.5">
            {currentList.map((item) => {
              const [prefix, iconName] = item.id.split(":");
              const previewUrl = `https://api.iconify.design/${prefix}/${iconName}.svg`;
              const isLoading = loadingIconId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectIcon(item)}
                  className="group relative flex flex-col items-center justify-center gap-1 h-16 rounded-xl bg-muted/20 hover:bg-muted/60 border border-border/40 hover:border-border transition-all active:scale-95 p-1"
                  title={item.id}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <img
                        src={previewUrl}
                        alt={item.name}
                        className="w-7 h-7 object-contain group-hover:scale-110 transition-transform dark:brightness-110"
                        loading="lazy"
                      />
                      <span className="text-[9px] font-mono text-muted-foreground group-hover:text-foreground truncate max-w-[48px] capitalize">
                        {item.name}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
