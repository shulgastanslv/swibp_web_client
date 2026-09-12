// src/components/canvas/PixabaySearch.tsx
"use client";

import { useState, useEffect } from "react";
import { searchPixabay } from "@/lib/pixabay/api";
import type { PixabayImage } from "@/lib/pixabay/types";
import { Search, Loader2, X, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PixabaySearchProps {
  onSelect: (imageUrl: string, metadata: PixabayImage) => void;
  onClose: () => void;
}

export function PixabaySearch({ onSelect, onClose }: PixabaySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Запрос к API
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return;
    }

    let isCancelled = false;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const data = await searchPixabay({
          query: debouncedQuery,
          page: 1,
          perPage: 10, // Ровно 6 элементов
          imageType: "vector",
          orderBy: "popular",
        });

        if (!isCancelled) {
          setResults(data.hits);
        }
      } catch (error) {
        console.error("Pixabay search error:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchImages();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search graphics..."
              className="w-full pl-9 h-9 rounded-xl border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Контент: ровно 6 элементов */}
        <div className="p-3">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground h-5 w-5" />
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-xs">
              {query.trim() ? "Nothing found" : "Type to start searching"}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {results.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.largeImageURL || item.previewURL, item)}
                  className="group relative aspect-square border border-border rounded-xl overflow-hidden hover:border-primary transition-all cursor-pointer bg-muted/20"
                >
                  <img
                    src={item.previewURL}
                    alt={item.tags}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
