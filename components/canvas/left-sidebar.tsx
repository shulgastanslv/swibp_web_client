"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderKanban,
  LayoutTemplate,
  Layers,
  Settings,
  User,
  Circle,
  Square,
  Triangle,
  Type,
  Quote,
  Code,
  Tag,
  Star,
  ArrowRight,
  MousePointerClick,
  Minus,
  Eye,
  X,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  AlignLeft,
  Pencil,
} from "lucide-react";
import { Object as FabricObject } from "fabric";
import { useCanvasStore } from "@/store/useCanvasStore";
import { templatePresets } from "@/components/canvas/types";

type NavId = "projects" | "templates" | "elements" | "layers" | "settings" | "ai";

interface LeftSidebarProps {
  activeNav: NavId;
  setActiveNav: (nav: NavId) => void;
  isLeftCollapsed: boolean;
  setIsLeftCollapsed: (v: boolean) => void;
  showDotGrid: boolean;
  setShowDotGrid: (v: boolean) => void;
}

export function LeftSidebar({
  activeNav,
  setActiveNav,
  isLeftCollapsed,
  setIsLeftCollapsed,
  showDotGrid,
  setShowDotGrid,
}: LeftSidebarProps) {
  const {
    managerRef,
    objectRevision,
    addRectangle,
    addCircle,
    addTriangle,
    addLine,
    addArrow,
    addText,
    addHeading,
    addSubtitle,
    addParagraph,
    addQuote,
    addCodeBlock,
    addTag,
    addStarRating,
    addSwipeTag,
    addCTAButton,
    addBadge,
    addHandle,
    addDividerLine,
  } = useCanvasStore();

  // Live Fabric objects for the Layers tab — recomputed on every canvas change
  const canvasObjects = React.useMemo<FabricObject[]>(() => {
    if (!managerRef) return [];
    return managerRef
      .getCanvas()
      .getObjects()
      .filter((o) => o.selectable !== false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerRef, objectRevision]);

  const selectObject = (obj: FabricObject) => {
    const canvas = managerRef?.getCanvas();
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  const deleteObject = (obj: FabricObject) => {
    const canvas = managerRef?.getCanvas();
    if (!canvas) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const getObjectLabel = (obj: FabricObject): string => {
    const type = obj.type ?? "object";
    const text = (obj as unknown as Record<string, unknown>).text;
    if (typeof text === "string" && text.length > 0) {
      return `${type}: "${text.slice(0, 22)}${text.length > 22 ? "…" : ""}"`;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const navItems: { id: NavId; icon: React.ElementType; label: string }[] = [
    { id: "projects",  icon: FolderKanban,   label: "Projects"   },
    { id: "templates", icon: LayoutTemplate, label: "Templates"  },
    { id: "elements",  icon: Circle,         label: "Elements"   },
    { id: "layers",    icon: Layers,         label: "Layers"     },
  ];

  return (
    <div className="flex h-full bg-background border-r border-border overflow-hidden">
      {/* ── Icon nav rail ── */}
      <aside className="w-12 flex flex-col items-center justify-between py-3 border-r border-border/50 bg-muted/20 shrink-0">
        <div className="flex flex-col gap-1.5">
          {navItems.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeNav === id ? "secondary" : "ghost"}
              size="icon"
              className="w-8 h-8 rounded-lg"
              title={label}
              onClick={() => {
                setActiveNav(id);
                if (isLeftCollapsed) setIsLeftCollapsed(false);
              }}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
            title={isLeftCollapsed ? "Expand panel" : "Collapse panel"}
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          >
            {isLeftCollapsed
              ? <PanelLeftOpen className="w-4 h-4" />
              : <PanelLeftClose className="w-4 h-4" />}
          </Button>

          <Button
            variant={activeNav === "settings" ? "secondary" : "ghost"}
            size="icon"
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
            title="Settings"
            onClick={() => {
              setActiveNav("settings");
              if (isLeftCollapsed) setIsLeftCollapsed(false);
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </aside>

      {/* ── Collapsible content panel ── */}
      <div
        className={`flex flex-col transition-all duration-200 ease-in-out overflow-hidden ${
          isLeftCollapsed ? "w-0 opacity-0" : "w-72 opacity-100 p-3"
        }`}
      >
        {/* Panel title */}
        <div className="h-8 flex items-center px-1 text-xs font-semibold tracking-tight text-foreground border-b border-border/40 mb-3 shrink-0">
          {activeNav === "projects"  && "Projects"}
          {activeNav === "templates" && "Templates Library"}
          {activeNav === "elements"  && "Canvas Elements"}
          {activeNav === "layers"    && "Layers"}
          {activeNav === "settings"  && "Settings"}
        </div>

        <ScrollArea className="flex-1 pr-1">

          {/* ══ TEMPLATES ══ */}
          {activeNav === "templates" && (
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] text-muted-foreground font-medium">Slide Presets</span>
              <div className="grid grid-cols-1 gap-2.5">
                {templatePresets.map((tpl) => (
                  <button
                    key={tpl.id}
                    className="group flex flex-col p-3 rounded-2xl bg-muted/30 hover:bg-muted/70 text-left border border-border/40 transition-all duration-200 gap-2"
                  >
                    <div className="w-full h-12 rounded-xl bg-card border border-border/40 p-2 flex flex-col justify-between">
                      <span className="text-[9px] font-mono text-muted-foreground">{tpl.badge}</span>
                      <div className="w-1/2 h-1.5 rounded-full bg-muted-foreground/30" />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium">{tpl.name}</span>
                      <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-background/60 border border-border/30">Apply</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══ ELEMENTS ══ */}
          {activeNav === "elements" && (
            <div className="flex flex-col gap-5 text-xs">

              {/* Text & Typography */}
              <section>
                <p className="text-[11px] text-muted-foreground font-medium mb-2">Text & Typography</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addHeading()}>
                    <Type className="w-3.5 h-3.5" /> Heading
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addSubtitle()}>
                    <Type className="w-3.5 h-3.5 opacity-50" /> Subtitle
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addParagraph()}>
                    <AlignLeft className="w-3.5 h-3.5" /> Paragraph
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addText()}>
                    <Pencil className="w-3.5 h-3.5" /> Text
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50 col-span-2" onClick={() => addQuote()}>
                    <Quote className="w-3.5 h-3.5" /> Quote Block
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50 col-span-2" onClick={() => addCodeBlock()}>
                    <Code className="w-3.5 h-3.5" /> Code Snippet
                  </Button>
                </div>
              </section>

              {/* Shapes */}
              <section>
                <p className="text-[11px] text-muted-foreground font-medium mb-2">Shapes</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addRectangle()}>
                    <Square className="w-3.5 h-3.5" /> Rectangle
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addCircle()}>
                    <Circle className="w-3.5 h-3.5" /> Circle
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addTriangle()}>
                    <Triangle className="w-3.5 h-3.5" /> Triangle
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addLine()}>
                    <Minus className="w-3.5 h-3.5" /> Line
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addArrow()}>
                    <ArrowRight className="w-3.5 h-3.5" /> Arrow
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addDividerLine()}>
                    <Minus className="w-3.5 h-3.5 rotate-0" /> Divider
                  </Button>
                </div>
              </section>

              {/* Badges & Blocks */}
              <section>
                <p className="text-[11px] text-muted-foreground font-medium mb-2">Badges & Blocks</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addTag()}>
                    <Tag className="w-3.5 h-3.5" /> Tag Chip
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addBadge()}>
                    <Tag className="w-3.5 h-3.5" /> Badge
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addStarRating()}>
                    <Star className="w-3.5 h-3.5" /> Star Rating
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addHandle()}>
                    <User className="w-3.5 h-3.5" /> Handle
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50" onClick={() => addSwipeTag()}>
                    <ArrowRight className="w-3.5 h-3.5" /> Swipe Tag
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 text-xs justify-start gap-2 rounded-xl border-border/50 col-span-2" onClick={() => addCTAButton()}>
                    <MousePointerClick className="w-3.5 h-3.5" /> CTA Button
                  </Button>
                </div>
              </section>
            </div>
          )}

          {/* ══ PROJECTS ══ */}
          {activeNav === "projects" && (
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-muted-foreground text-[11px] font-medium mb-1">Recent Files</span>
              {["Instagram Growth Carousel", "LinkedIn Tech Guide", "Minimalist UI Showcase"].map((p, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 cursor-pointer border border-border/40 flex items-center justify-between">
                  <span className="font-medium text-foreground truncate">{p}</span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* ══ LAYERS ══ */}
          {activeNav === "layers" && (
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-muted-foreground text-[11px] font-medium mb-1">
                Objects on canvas ({canvasObjects.length})
              </span>

              {canvasObjects.length === 0 && (
                <p className="text-muted-foreground text-[11px] py-6 text-center">
                  No objects yet. Add elements from the Elements tab.
                </p>
              )}

              {[...canvasObjects].reverse().map((obj, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-background hover:bg-muted/50 border border-border/50 flex items-center justify-between group cursor-pointer"
                  onClick={() => selectObject(obj)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Eye className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="truncate font-mono text-[11px]">{getObjectLabel(obj)}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteObject(obj); }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity ml-2 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {activeNav === "settings" && (
            <div className="flex flex-col gap-3 text-xs">
              <span className="text-muted-foreground font-medium">Canvas Preferences</span>
              <label className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/40 cursor-pointer">
                <span>Show dot grid background</span>
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
  );
}
