"use client";

import React, { useState } from "react";
import {
  Search,
  PanelLeft,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  {
    id: "1",
    title: "Drip",
    description: "Each piece swells from a honey lip, hangs, lets go and lands in the pool.",
    badge: "NEW",
    isNew: true,
    imagePath: "/covers/first.jpg",
  },
  {
    id: "2",
    title: "Rig",
    description: "Two robot arms fly in panel after panel and build each screen from the top down.",
    badge: "NEW",
    isNew: true,
    imagePath: "/covers/second.jpg",
  },
  {
    id: "3",
    title: "Viscose",
    description: "Your work rides a liquid ring that melts apart card by card.",
    badge: "NEW",
    isNew: true,
    imagePath: "/covers/third.jpg",
  },
  {
    id: "4",
    title: "Flow",
    description: "Smooth transitions flowing naturally across multiple frames and layers.",
    badge: "POPULAR",
    isNew: false,
    imagePath: "/covers/fourth.jpg",
  },
];

const CATEGORIES = ["All", "Trending", "New", "Animation", "Minimal", "3D"];

interface LeftSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function LeftSidebar({ isOpen = true, onToggle }: LeftSidebarProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("community");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev < CATEGORIES.length - 1 ? prev + 1 : prev));
  };

  const visibleCategories = CATEGORIES.slice(carouselIndex, carouselIndex + 3);

  return (
    <aside
      className={`flex shrink-0 flex-col h-full overflow-y-auto backdrop-blur bg-sidebar border-r text-sm transition-all duration-300 ease-in-out ${
        isOpen ? "w-72 opacity-100" : "w-0 opacity-0 m-0 border-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
          title="Hide sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
            title="Filter templates"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Поиск и Табы */}
      <div className="p-3 pb-2 space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="h-9 w-full rounded-full border-border/60 bg-muted/40 pl-9 pr-4 text-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary text-primary"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-8 rounded-full bg-muted/50 p-1 border border-border/40">
            <TabsTrigger
              value="community"
              className="rounded-full text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
            >
              Community (10)
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-full text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
            >
              Saved (5)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-foreground">Categories</span>
        </div>
        <div className="relative flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={carouselIndex === 0}
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="flex-1 flex gap-1.5 overflow-hidden px-1">
            {visibleCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`h-7 px-2.5 text-xs font-medium rounded-full whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={carouselIndex >= CATEGORIES.length - 3}
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Список шаблонов */}
      <ScrollArea className="flex-1 px-3 py-1">
        <div className="space-y-3 pb-6">
          {TEMPLATES.map((item) => {
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-all duration-200 hover:border-border hover:shadow-md cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                  <img
                    src={item.imagePath}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  {item.isNew && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2.5 right-2.5 h-5 px-1.5 text-[10px] font-bold tracking-wide uppercase bg-black/70 text-white backdrop-blur border-0 rounded-full z-15"
                    >
                      • {item.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-2.5 z-10">
                    <div className="flex items-center justify-between w-full text-white font-semibold text-sm">
                      <span>{item.title}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-400">View</span>
                        <ChevronRight className="h-3 w-3 text-zinc-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
