"use client";

import { useState, useEffect } from "react";
import { searchPixabay } from "@/lib/pixabay/api";
import type { PixabayImage } from "@/lib/pixabay/types";
import {
  Search,
  Loader2,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PixabaySearchProps {
  onSelect: (imageUrl: string, metadata: PixabayImage) => void;
}

const CATEGORIES = [
  { id: "vector", label: "Vector", prefix: "vector" },
  { id: "color", label: "Color", prefix: "color" },
  { id: "vintage", label: "Vintage", prefix: "vintage" },
];

const RECENTLY_USED_KEY = "pixabay_recently_used";
const MAX_RECENT = 9;
const PER_PAGE = 10;

export function PixabaySearch({ onSelect }: PixabaySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setTotalHits(0);
    setPage(1);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setPage(1);

    if (!newQuery.trim()) {
      setResults([]);
      setTotalHits(0);
    }
  };

  const handleCategoryClick = (prefix: string) => {
    const baseQuery = query.trim() || "design";
    const newQuery = `${prefix} ${baseQuery}`;
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelect = (imageUrl: string, metadata: PixabayImage) => {
    onSelect(imageUrl, metadata);
  };

  useEffect(() => {
    if (!query.trim()) return;

    let isCancelled = false;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const data = await searchPixabay({
          query: query.trim(),
          page,
          perPage: PER_PAGE,
          imageType: "vector",
          orderBy: "popular",
        });

        if (!isCancelled) {
          setResults(data.hits);
          setTotalHits(data.total);
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
  }, [query, page]);

  const totalPages = Math.ceil(totalHits / PER_PAGE);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search graphics..."
            className="w-full pl-9 pr-9 h-9 rounded-full border-border bg-background text-sm"
            autoFocus
          />
          {hasQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      {!hasQuery && (
        <div className="flex gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.prefix)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
      <div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground h-6 w-6" />
          </div>
        )}
        {!loading && hasQuery && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No results found
          </div>
        )}
        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    handleSelect(item.largeImageURL || item.previewURL, item)
                  }
                  className="group relative aspect-square border border-border rounded-xl overflow-hidden hover:border-primary transition-all bg-muted/30"
                >
                  <img
                    src={item.previewURL}
                    alt={item.tags}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
