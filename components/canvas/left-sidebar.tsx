"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderKanban,
  LayoutTemplate,
  Layers,
  Settings,
  Circle,
  ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
  LightbulbIcon,
  BoxIcon,
  FilterIcon,
} from "lucide-react";
import { Object as FabricObject } from "fabric";
import { useCanvasStore } from "@/store/useCanvasStore";

import { SidebarProjects } from "@/components/canvas/sidebar/projects/sidebar-projects";
import { SidebarTemplates } from "@/components/canvas/sidebar/sidebar-templates";
import { SidebarElements } from "@/components/canvas/sidebar/sidebar-elements";
import { SidebarLayers } from "@/components/canvas/sidebar/sidebar-layers";
import { SidebarSettings } from "@/components/canvas/sidebar/sidebar-settings";
import { SidebarBackground } from "@/components/canvas/sidebar/sidebar-background";
import Link from "next/link";
import { SidebarFilters } from "./sidebar/sidebar-filters";
import { SidebarIcons } from "./sidebar/sidebar-icons";

export type NavId =
  | "projects"
  | "templates"
  | "elements"
  | "layers"
  | "settings"
  | "filters"
  | "icons"
  | "background"
  | "ai";

interface LeftSidebarProps {
  activeNav: NavId;
  setActiveNav: (nav: NavId) => void;
  isLeftCollapsed: boolean;
  setIsLeftCollapsed: (v: boolean) => void;
  showDotGrid: boolean;
  setShowDotGrid: (v: boolean) => void;
}

const PANEL_TITLES: Record<NavId, string> = {
  projects: "Projects",
  templates: "Templates Library",
  elements: "Canvas Elements",
  layers: "Layers",
  settings: "Settings",
  icons: "Icons",
  filters: "Filters",
  background: "Background",
  ai: "AI",
};

export function LeftSidebar({
  activeNav,
  setActiveNav,
  isLeftCollapsed,
  setIsLeftCollapsed,
  showDotGrid,
  setShowDotGrid,
}: LeftSidebarProps) {

  const { managerRef } = useCanvasStore();

  const canvasObjects = React.useMemo<FabricObject[]>(() => {
    if (!managerRef) return [];
    return managerRef
      .getCanvas()
      .getObjects()
      .filter((o) => o.selectable !== false);
  }, [managerRef]);

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

  const reorderObjects = (fromIndex: number, toIndex: number) => {
    const canvas = managerRef?.getCanvas();
    if (!canvas) return;
    const objs = canvas.getObjects().filter((o) => o.selectable !== false);
    const obj = objs[fromIndex];
    if (!obj) return;
    canvas.moveObjectTo(obj, toIndex);
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
    { id: "projects", icon: FolderKanban, label: "Projects" },
    { id: "elements", icon: BoxIcon, label: "Elements" },
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "templates", icon: LayoutTemplate, label: "Templates" },
    { id: "background", icon: ImageIcon, label: "Background" },
    { id: "filters", icon: FilterIcon, label: "Filter" },
    { id: "icons", icon: LightbulbIcon, label: "Icons" },
  ];

  return (
    <div className="flex h-full bg-background border-r border-border overflow-hidden min-h-0">
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
        className={`flex flex-col transition-all duration-200 ease-in-out overflow-hidden min-h-0 min-w-0 ${
          isLeftCollapsed ? "w-0 opacity-0" : "w-72 opacity-100"
        }`}
      >
        {/* Panel title */}
        <div className="h-8 flex items-center px-4 text-xs font-semibold tracking-tight text-foreground border-b border-border/40 shrink-0">
          {PANEL_TITLES[activeNav] ?? activeNav}
        </div>

        <ScrollArea className="flex-1 min-h-0 p-2">
          {activeNav === "projects" && <SidebarProjects />}
          {activeNav === "templates" && <SidebarTemplates />}
          {activeNav === "elements" && <SidebarElements />}
          {activeNav === "layers" && (
            <SidebarLayers
              canvasObjects={canvasObjects}
              selectObject={selectObject}
              deleteObject={deleteObject}
              getObjectLabel={getObjectLabel}
              reorderObjects={reorderObjects}
            />
          )}
          {activeNav === "filters" && <SidebarFilters />}
          {activeNav === "icons" && <SidebarIcons />}
          {activeNav === "settings" && (
            <SidebarSettings
              showDotGrid={showDotGrid}
              setShowDotGrid={setShowDotGrid}
            />
          )}
          {activeNav === "background" && <SidebarBackground />}
        </ScrollArea>
        <div className="px-4 py-2 border-t border-border/40 shrink-0 flex items-center justify-start gap-2 text-[11px] text-muted-foreground">
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
