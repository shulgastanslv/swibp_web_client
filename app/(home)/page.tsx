"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  FolderKanban,
  LayoutTemplate,
  Layers,
  Settings,
  Play,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Circle,
  Triangle,
  Type,
  Image as ImageIcon,
  Share2,
  User,
  Copy,
  Trash2,
  Grid,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Star,
  Quote,
  Code,
  Tag,
  ArrowRight,
  CheckCircle2,
  MousePointerClick,
  Minus,
  SlidersHorizontal,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import Logo from "@/components/logo";
import { Header } from "@/components/header";

// --- TYPES ---

interface CanvasElement {
  id: string;
  type:
    | "heading"
    | "subtitle"
    | "paragraph"
    | "rect"
    | "circle"
    | "triangle"
    | "star"
    | "divider"
    | "quote"
    | "code"
    | "tag"
    | "swipe"
    | "cta"
    | "badge"
    | "handle"
    | "image";
  content: string;
  x: number;
  y: number;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  align: "left" | "center" | "right" | "justify";
  badgeText: string;
  elements: CanvasElement[];
}

// --- INITIAL DATA ---

const initialSlides: SlideData[] = [
  {
    id: 1,
    title: "Boost Your Reach",
    subtitle: "A minimal carousel template for modern content creators.",
    align: "left",
    badgeText: "SWIPE ➔",
    elements: [
      { id: "e1", type: "handle", content: "@username", x: 10, y: 88 },
      { id: "e2", type: "tag", content: "DESIGN TIPS", x: 10, y: 15 },
    ],
  },
  {
    id: 2,
    title: "Step 01: The Hook",
    subtitle: "Grab immediate attention within the first 0.5 seconds.",
    align: "left",
    badgeText: "01/04",
    elements: [
      { id: "e3", type: "quote", content: "First impressions are everything.", x: 10, y: 65 },
    ],
  },
  {
    id: 3,
    title: "Step 02: High Value",
    subtitle: "Deliver concrete insights, clean data, or actionable tips.",
    align: "left",
    badgeText: "02/04",
    elements: [
      { id: "e4", type: "star", content: "5.0 Rating", x: 10, y: 70 },
    ],
  },
  {
    id: 4,
    title: "Call To Action",
    subtitle: "Save this post and share it with your network!",
    align: "center",
    badgeText: "SAVE IT",
    elements: [
      { id: "e5", type: "cta", content: "Follow for More", x: 25, y: 75 },
    ],
  },
];

const templatePresets = [
  { id: 1, name: "Minimal Clean", badge: "SWIPE ➔" },
  { id: 2, name: "Editorial Dark", badge: "01/05" },
  { id: 3, name: "Tech Minimal", badge: "INSIGHTS" },
  { id: 4, name: "Bold Mono", badge: "READ MORE" },
];

// --- MAIN COMPONENT ---

export default function CarouselStudio() {
  const [activeNav, setActiveNav] = useState<
    "projects" | "templates" | "elements" | "layers" | "settings"
  >("templates");

  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<"4:5" | "1:1" | "9:16" | "16:9">("4:5");
  const [zoom, setZoom] = useState(100);
  const [showDotGrid, setShowDotGrid] = useState(true);
  const [projectName, setProjectName] = useState("Untitled Carousel");

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  const [padding, setPadding] = useState(32);
  const [borderRadius, setBorderRadius] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans");

  const activeSlide = slides[currentIdx] || slides[0];

  const updateSlideField = <K extends keyof SlideData>(
    field: K,
    value: SlideData[K]
  ) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === currentIdx ? { ...s, [field]: value } : s))
    );
  };

  const addSlide = () => {
    const newSlide: SlideData = {
      id: Date.now(),
      title: `Slide 0${slides.length + 1}`,
      subtitle: "Add your supporting details here...",
      align: "left",
      badgeText: `0${slides.length + 1}/0${slides.length + 1}`,
      elements: [],
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentIdx(slides.length);
  };

  const duplicateSlide = () => {
    const clone: SlideData = {
      ...activeSlide,
      id: Date.now(),
      title: `${activeSlide.title} (Copy)`,
      elements: [...activeSlide.elements],
    };
    const updated = [...slides];
    updated.splice(currentIdx + 1, 0, clone);
    setSlides(updated);
    setCurrentIdx(currentIdx + 1);
  };

  const removeSlide = () => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, idx) => idx !== currentIdx);
    setSlides(updated);
    setCurrentIdx(Math.max(0, currentIdx - 1));
  };

  const moveSlide = (direction: "up" | "down") => {
    const targetIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(currentIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setSlides(updated);
    setCurrentIdx(targetIdx);
  };

  const addElementToCanvas = (type: CanvasElement["type"], defaultContent: string) => {
    const newEl: CanvasElement = {
      id: `el_${Date.now()}`,
      type,
      content: defaultContent,
      x: 10,
      y: 50,
    };
    updateSlideField("elements", [...activeSlide.elements, newEl]);
  };

  const removeElement = (id: string) => {
    updateSlideField(
      "elements",
      activeSlide.elements.filter((e) => e.id !== id)
    );
  };

  const getCanvasDimensions = () => {
    const baseWidth = 380;
    switch (aspectRatio) {
      case "4:5":
        return { width: baseWidth, height: baseWidth * (5 / 4) };
      case "1:1":
        return { width: baseWidth, height: baseWidth };
      case "9:16":
        return { width: 300, height: 300 * (16 / 9) };
      case "16:9":
        return { width: 460, height: 460 * (9 / 16) };
      default:
        return { width: baseWidth, height: baseWidth * (5 / 4) };
    }
  };

  const dims = getCanvasDimensions();

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground font-sans overflow-hidden select-none">
      {/* ========================================================= */}
      {/* 1. TOP HEADER                                             */}
      {/* ========================================================= */}
      <Header />

      {/* ========================================================= */}
      {/* WORKSPACE AREA                                            */}
      {/* ========================================================= */}
      <div className="flex flex-1 min-h-0">
        {/* --------------------------------------------------------- */}
        {/* LEFT SIDEBAR                                              */}
        {/* --------------------------------------------------------- */}
        <div className="flex h-full bg-background border-r border-border overflow-hidden relative">
          <aside className="w-12 flex flex-col items-center justify-between py-3 border-r border-border/50 bg-muted/20">
            <div className="flex flex-col gap-1.5">
              {[
                { id: "projects", icon: FolderKanban, label: "Projects" },
                { id: "templates", icon: LayoutTemplate, label: "Templates" },
                { id: "elements", icon: Circle, label: "Elements" },
                { id: "layers", icon: Layers, label: "Layers" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeNav === item.id ? "secondary" : "ghost"}
                    size="icon"
                    className="w-8 h-8 rounded-lg"
                    onClick={() => {
                      setActiveNav(item.id as any);
                      if (isLeftCollapsed) setIsLeftCollapsed(false);
                    }}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                title={isLeftCollapsed ? "Expand panel" : "Collapse panel"}
              >
                {isLeftCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant={activeNav === "settings" ? "secondary" : "ghost"}
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setActiveNav("settings");
                  if (isLeftCollapsed) setIsLeftCollapsed(false);
                }}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </aside>

          <div
            className={`flex flex-col transition-all duration-200 ease-in-out overflow-hidden ${
              isLeftCollapsed ? "w-0 opacity-0" : "w-72 opacity-100 p-3"
            }`}
          >
            <div className="h-8 flex items-center justify-between px-1 text-xs font-semibold tracking-tight text-foreground border-b border-border/40 mb-3">
              <span>
                {activeNav === "projects" && "Projects"}
                {activeNav === "templates" && "Templates Library"}
                {activeNav === "elements" && "Canvas Elements"}
                {activeNav === "layers" && "Scene Layers"}
                {activeNav === "settings" && "Settings"}
              </span>
            </div>

            <ScrollArea className="flex-1 pr-1">
              {/* Minimalist Rounded Cards for Templates */}
              {activeNav === "templates" && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Slide Presets
                  </span>

                  <div className="grid grid-cols-1 gap-2.5">
                    {templatePresets.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => updateSlideField("badgeText", tpl.badge)}
                        className="group flex flex-col p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 text-left border border-border/40 transition-all duration-200 hover:shadow-2xs gap-2"
                      >
                        <div className="w-full h-12 rounded-xl bg-card border border-border/40 p-2 flex flex-col justify-between">
                          <span className="text-[9px] font-mono text-muted-foreground">
                            {tpl.badge}
                          </span>
                          <div className="w-1/2 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-medium">{tpl.name}</span>
                          <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-background/60 border border-border/30">
                            Apply
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Elements Tab */}
              {activeNav === "elements" && (
                <div className="flex flex-col gap-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium block mb-2">
                      Text & Typography
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("heading", "New Heading")}
                      >
                        <Type className="w-3.5 h-3.5" /> Heading
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("subtitle", "New Subtitle")}
                      >
                        <Type className="w-3.5 h-3.5 text-muted-foreground" /> Subtitle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("quote", '"Quote text..."')}
                      >
                        <Quote className="w-3.5 h-3.5" /> Quote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("code", "const code = true;")}
                      >
                        <Code className="w-3.5 h-3.5" /> Code Snippet
                      </Button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground font-medium block mb-2">
                      Primitives & Badges
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("tag", "CATEGORY")}
                      >
                        <Tag className="w-3.5 h-3.5" /> Tag Chip
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("star", "5.0 ★★★★★")}
                      >
                        <Star className="w-3.5 h-3.5" /> Rating
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("swipe", "SWIPE ➔")}
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> Swipe Tag
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("cta", "Action Button")}
                      >
                        <MousePointerClick className="w-3.5 h-3.5" /> CTA Button
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("handle", "@username")}
                      >
                        <User className="w-3.5 h-3.5" /> User Handle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50"
                        onClick={() => addElementToCanvas("divider", "—")}
                      >
                        <Minus className="w-3.5 h-3.5" /> Divider Line
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeNav === "projects" && (
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="text-muted-foreground text-[11px] font-medium mb-1">
                    Recent Files
                  </span>

                  {[
                    "Instagram Growth Carousel",
                    "LinkedIn Tech Guide",
                    "Minimalist UI Showcase",
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 cursor-pointer border border-border/40 flex items-center justify-between"
                    >
                      <span className="font-medium text-foreground truncate">{p}</span>
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}

              {/* Layers Tab */}
              {activeNav === "layers" && (
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="text-muted-foreground text-[11px] font-medium mb-1">
                    Elements Stack
                  </span>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between">
                    <span>Main Title Block</span>
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between">
                    <span>Subtitle Block</span>
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  {activeSlide.elements.map((el) => (
                    <div
                      key={el.id}
                      className="p-2.5 rounded-xl bg-background hover:bg-muted/50 border border-border/50 flex items-center justify-between group"
                    >
                      <span className="truncate max-w-[130px] font-mono text-[11px]">
                        {el.type}: {el.content}
                      </span>
                      <button
                        onClick={() => removeElement(el.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Settings Tab */}
              {activeNav === "settings" && (
                <div className="flex flex-col gap-3 text-xs">
                  <span className="text-muted-foreground font-medium">
                    Canvas Preferences
                  </span>
                  <label className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/40 cursor-pointer">
                    <span>Show Grid Background</span>
                    <input
                      type="checkbox"
                      checked={showDotGrid}
                      onChange={(e) => setShowDotGrid(e.target.checked)}
                      className="accent-primary rounded"
                    />
                  </label>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* 2. MAIN CANVAS AREA                                       */}
        {/* --------------------------------------------------------- */}
        <main
          className="flex-1 flex flex-col bg-muted/50 overflow-hidden min-w-0 relative"
          style={
            showDotGrid
              ? {
                  backgroundImage:
                    "radial-gradient(var(--border) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }
              : {}
          }
        >
          {/* CANVAS HEADER BAR */}
          <header className="h-11 flex items-center justify-between px-4 bg-background border-b border-border text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Aspect Ratio:</span>
              <div className="flex bg-muted/50 rounded-xl p-0.5 border border-border/40">
                {(["4:5", "1:1", "9:16", "16:9"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-0.5 text-[11px] rounded-lg transition-colors ${
                      aspectRatio === ratio
                        ? "bg-background text-foreground font-medium border border-border/60 shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-xl border border-border/40">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="text-muted-foreground hover:text-foreground p-1"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] min-w-[36px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                className="text-muted-foreground hover:text-foreground p-1"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={duplicateSlide}
                title="Duplicate Slide"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={slides.length <= 1}
                onClick={removeSlide}
                title="Delete Slide"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>

              <div className="h-4 w-[1px] bg-border mx-1" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreviewIdx(currentIdx);
                  setShowPreviewModal(true);
                }}
                className="h-7 text-xs font-normal gap-1.5 rounded-xl border-border/60"
              >
                <Play className="w-3 h-3" />
                <span>Preview Deck</span>
              </Button>
            </div>
          </header>

          {/* INTERACTIVE CANVAS CENTER */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div
              style={{
                width: `${dims.width}px`,
                height: `${dims.height}px`,
                transform: `scale(${zoom / 100})`,
                padding: `${padding}px`,
                borderRadius: `${borderRadius}px`,
              }}
              className={`transition-all duration-150 bg-card text-card-foreground border border-border shadow-xl flex flex-col justify-between relative group ${
                fontFamily === "serif"
                  ? "font-serif"
                  : fontFamily === "mono"
                  ? "font-mono"
                  : "font-sans"
              }`}
            >
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="bg-muted px-2.5 py-1 rounded-full border border-border/50 text-[10px] font-mono uppercase tracking-wider">
                  {activeSlide.badgeText || `0${currentIdx + 1}/0${slides.length}`}
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase">
                  SWIPE ➔
                </span>
              </div>

              <div
                className={`flex flex-col gap-3 my-auto ${
                  activeSlide.align === "center"
                    ? "items-center text-center"
                    : activeSlide.align === "right"
                    ? "items-end text-right"
                    : activeSlide.align === "justify"
                    ? "items-stretch text-justify"
                    : "items-start text-left"
                }`}
              >
                <textarea
                  rows={2}
                  value={activeSlide.title}
                  onChange={(e) => updateSlideField("title", e.target.value)}
                  className="bg-transparent text-xl font-bold tracking-tight text-foreground border border-transparent hover:border-border/50 focus:border-border focus:bg-background/50 focus:outline-none w-full resize-none transition-colors rounded-xl p-1"
                />
                <textarea
                  rows={3}
                  value={activeSlide.subtitle}
                  onChange={(e) => updateSlideField("subtitle", e.target.value)}
                  className="bg-transparent text-xs text-muted-foreground border border-transparent hover:border-border/50 focus:border-border focus:bg-background/50 focus:outline-none w-full resize-none transition-colors rounded-xl p-1"
                />
              </div>

              {activeSlide.elements.map((el) => (
                <div
                  key={el.id}
                  className="my-1 p-2 rounded-xl bg-muted/20 border border-dashed border-border/60 text-xs flex items-center justify-between group/el"
                >
                  <span className="font-mono text-[11px]">{el.content}</span>
                  <button
                    onClick={() => removeElement(el.id)}
                    className="opacity-0 group-hover/el:opacity-100 text-destructive hover:text-destructive/80 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/30">
                <span>carousel.studio</span>
                <span>Slide 0{currentIdx + 1}</span>
              </div>
            </div>
          </div>

          {/* SLIDE NAVIGATOR */}
          <footer className="h-14 flex items-center justify-between px-6 bg-background border-t border-border text-xs z-10">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-xl border-border/60"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1 max-w-[360px] overflow-x-auto py-1 px-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                      currentIdx === idx
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-2xs"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted border-border/40"
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-xl border-border/60"
                disabled={currentIdx === slides.length - 1}
                onClick={() =>
                  setCurrentIdx((prev) => Math.min(slides.length - 1, prev + 1))
                }
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={addSlide}
                className="h-8 text-xs font-normal gap-1.5 rounded-xl border-border/60 ml-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentIdx === 0}
                onClick={() => moveSlide("up")}
                className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Move Left
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentIdx === slides.length - 1}
                onClick={() => moveSlide("down")}
                className="h-8 text-xs rounded-xl text-muted-foreground hover:text-foreground gap-1"
              >
                Move Right <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </footer>
        </main>

        {/* --------------------------------------------------------- */}
        {/* 3. RIGHT SIDEBAR / INSPECTOR                              */}
        {/* --------------------------------------------------------- */}
        <div className="flex h-full bg-background border-l border-border overflow-hidden relative">
          <div
            className={`flex flex-col transition-all duration-200 ease-in-out overflow-hidden ${
              isRightCollapsed ? "w-0 opacity-0" : "w-64 opacity-100 p-3"
            }`}
          >
            <div className="h-8 flex items-center justify-between px-1 border-b border-border/40 mb-3">
              <span className="text-xs font-semibold tracking-tight">
                Properties Inspector
              </span>
            </div>

            <ScrollArea className="flex-1 pr-1">
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-medium">
                    Text Alignment
                  </label>
                  <div className="flex bg-muted/40 rounded-xl p-0.5 border border-border/40">
                    {(["left", "center", "right", "justify"] as const).map(
                      (align) => {
                        const Icons = {
                          left: AlignLeft,
                          center: AlignCenter,
                          right: AlignRight,
                          justify: AlignJustify,
                        }[align];
                        return (
                          <button
                            key={align}
                            onClick={() => updateSlideField("align", align)}
                            className={`flex-1 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              activeSlide.align === align
                                ? "bg-background text-foreground font-medium border border-border/60 shadow-2xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icons className="w-3.5 h-3.5" />
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-medium">
                    Badge / Tag Label
                  </label>
                  <input
                    type="text"
                    value={activeSlide.badgeText}
                    onChange={(e) => updateSlideField("badgeText", e.target.value)}
                    placeholder="e.g. SWIPE ➔"
                    className="h-8 px-2.5 rounded-xl bg-muted/30 text-xs text-foreground focus:outline-none border border-border/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-medium">
                    Slide Heading
                  </label>
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) => updateSlideField("title", e.target.value)}
                    className="h-8 px-2.5 rounded-xl bg-muted/30 text-xs text-foreground focus:outline-none border border-border/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-medium">
                    Slide Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={activeSlide.subtitle}
                    onChange={(e) => updateSlideField("subtitle", e.target.value)}
                    className="p-2.5 rounded-xl bg-muted/30 text-xs text-foreground focus:outline-none border border-border/50 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-medium">
                    Font Family
                  </label>
                  <div className="flex bg-muted/40 rounded-xl p-0.5 border border-border/40">
                    {(["sans", "serif", "mono"] as const).map((font) => (
                      <button
                        key={font}
                        onClick={() => setFontFamily(font)}
                        className={`flex-1 h-7 text-[11px] rounded-lg capitalize transition-colors ${
                          fontFamily === font
                            ? "bg-background text-foreground font-medium border border-border/60 shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="font-medium">Card Padding</span>
                    <span className="font-mono">{padding}px</span>
                  </div>
                  <Slider
                    value={[padding]}
                    onValueChange={(val) => setPadding(val[0])}
                    min={16}
                    max={56}
                    step={4}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="font-medium">Corner Radius</span>
                    <span className="font-mono">{borderRadius}px</span>
                  </div>
                  <Slider
                    value={[borderRadius]}
                    onValueChange={(val) => setBorderRadius(val[0])}
                    min={0}
                    max={32}
                    step={2}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>

          <aside className="w-10 flex flex-col items-center justify-start py-3 border-l border-border/50 bg-muted/20">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
              onClick={() => setIsRightCollapsed(!isRightCollapsed)}
              title={
                isRightCollapsed ? "Expand properties" : "Collapse properties"
              }
            >
              {isRightCollapsed ? (
                <PanelRightOpen className="w-4 h-4" />
              ) : (
                <PanelRightClose className="w-4 h-4" />
              )}
            </Button>
          </aside>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODALS & DIALOGS                                          */}
      {/* ========================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-5 max-w-sm w-full flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-sm">Share Project</span>
              <button onClick={() => setShowShareModal(false)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view or make a duplicate of this carousel deck.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://carousel.studio/p/3f8d2a1"
                className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-mono"
              />
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs rounded-xl"
                onClick={() => setShowShareModal(false)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-5 max-w-md w-full flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-sm">Export Carousel Pack</span>
              <button onClick={() => setShowExportModal(false)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => setShowExportModal(false)}
                className="p-3 rounded-xl border border-border/60 hover:bg-muted/40 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-medium block">PNG Images (.zip)</span>
                  <span className="text-[11px] text-muted-foreground">
                    High-resolution separate PNG files for Instagram/LinkedIn.
                  </span>
                </div>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => setShowExportModal(false)}
                className="p-3 rounded-xl border border-border/60 hover:bg-muted/40 text-left flex items-center justify-between"
              >
                <div>
                  <span className="font-medium block">PDF Document (.pdf)</span>
                  <span className="text-[11px] text-muted-foreground">
                    Multi-page PDF file optimized for LinkedIn posts.
                  </span>
                </div>
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-between p-6">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              Preview Mode (Slide 0{previewIdx + 1} / 0{slides.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviewModal(false)}
              className="h-8 rounded-xl"
            >
              Close
            </Button>
          </div>

          <div
            style={{
              width: `${dims.width * 1.1}px`,
              height: `${dims.height * 1.1}px`,
              padding: `${padding}px`,
              borderRadius: `${borderRadius}px`,
            }}
            className="bg-card text-card-foreground border border-border shadow-2xl flex flex-col justify-between my-auto"
          >
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="bg-muted px-2.5 py-1 rounded-full text-[10px] font-mono">
                {slides[previewIdx]?.badgeText}
              </span>
              <span className="text-[10px] font-mono uppercase">SWIPE ➔</span>
            </div>

            <div className="flex flex-col gap-2 my-auto">
              <h2 className="text-2xl font-bold tracking-tight">
                {slides[previewIdx]?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {slides[previewIdx]?.subtitle}
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border/30">
              <span>carousel.studio</span>
              <span>0{previewIdx + 1}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              disabled={previewIdx === 0}
              onClick={() => setPreviewIdx((p) => Math.max(0, p - 1))}
              className="h-9 w-9 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-mono text-xs">
              0{previewIdx + 1} / 0{slides.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={previewIdx === slides.length - 1}
              onClick={() =>
                setPreviewIdx((p) => Math.min(slides.length - 1, p + 1))
              }
              className="h-9 w-9 rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
