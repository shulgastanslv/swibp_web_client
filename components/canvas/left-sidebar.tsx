"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutTemplate,
  Layers,
  Settings,
  ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
  FilterIcon,
  Folder,
  Shapes,
  Sparkles,
  StickerIcon,
  WandSparklesIcon,
} from "lucide-react";
import { SidebarProjects } from "@/components/canvas/sidebar/projects/sidebar-projects";
import { SidebarTemplates } from "@/components/canvas/sidebar/sidebar-templates";
import { SidebarElements } from "@/components/canvas/sidebar/sidebar-elements";
import { SidebarLayers } from "@/components/canvas/sidebar/sidebar-layers";
import { SidebarSettings } from "@/components/canvas/sidebar/sidebar-settings";
import { SidebarBackground } from "@/components/canvas/sidebar/sidebar-background";
import { SidebarFilters } from "./sidebar/sidebar-filters";
import { LegalDialog, type LegalKind } from "@/components/legal-dialog";
import { SidebarIcons } from "./sidebar/sidebar-icons";
import { SidebarTools } from "./sidebar/sidebar-tools";
import { SidebarGenerate } from "./sidebar/sidebar-generate";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export type NavId =
  | "projects"
  | "templates"
  | "elements"
  | "layers"
  | "settings"
  | "filters"
  | "icons"
  | "background"
  | "tools"
  | "generate";

export const RAIL_SHORTCUTS: NavId[] = [
  "generate",
  "tools",
  "elements",
  "projects",
  "layers",
  "templates",
  "background",
  "filters",
  "icons",
];

interface LeftSidebarProps {
  activeNav: NavId;
  setActiveNav: (nav: NavId) => void;
  isLeftCollapsed: boolean;
  setIsLeftCollapsed: (v: boolean) => void;
  showDotGrid: boolean;
  setShowDotGrid: (v: boolean) => void;
}

function RailTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
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
  tools: "Tools",
  generate: "Generate",
};

export function LeftSidebar({
  activeNav,
  setActiveNav,
  isLeftCollapsed,
  setIsLeftCollapsed,
  showDotGrid,
  setShowDotGrid,
}: LeftSidebarProps) {

  const [legal, setLegal] = useState<LegalKind | null>(null);

  const navItems: { id: NavId; icon: React.ElementType | null; label: string }[] = [
    { id: "generate", icon: Sparkles, label: "AI" },
    { id: "tools", icon: WandSparklesIcon, label: "Tools" },
    { id: "elements", icon: Shapes, label: "Elements" },
    { id: "projects", icon: Folder, label: "Projects" },
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "templates", icon: LayoutTemplate, label: "Templates" },
    { id: "background", icon: ImageIcon, label: "Background" },
    { id: "filters", icon: FilterIcon, label: "Filter" },
    { id: "icons", icon: StickerIcon, label: "Icons" },
  ];

  return (
    <div className="flex h-full bg-background border-r border-border overflow-hidden min-h-0">
      <aside className="w-12 flex flex-col items-center justify-between py-3 border-r border-border/50 bg-muted/20 shrink-0">
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-col gap-1.5">
            {navItems.map(({ id, icon: Icon, label }, index) => (
              <RailTooltip key={id} label={`${index + 1}  ${label}`}>
                <Button
                  variant={activeNav === id ? "secondary" : "ghost"}
                  size="icon"
                  className="w-8 h-8 rounded-lg text-xs font-medium tracking-tight"
                  aria-label={label}
                  onClick={() => {
                    setActiveNav(id);
                    if (isLeftCollapsed) setIsLeftCollapsed(false);
                  }}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : "Tools"}
                </Button>
              </RailTooltip>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <RailTooltip label={isLeftCollapsed ? "Expand panel" : "Collapse panel"}>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label={isLeftCollapsed ? "Expand panel" : "Collapse panel"}
                onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              >
                {isLeftCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </Button>
            </RailTooltip>

            <RailTooltip label="Settings">
              <Button
                variant={activeNav === "settings" ? "secondary" : "ghost"}
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Settings"
                onClick={() => {
                  setActiveNav("settings");
                  if (isLeftCollapsed) setIsLeftCollapsed(false);
                }}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </RailTooltip>
          </div>
        </TooltipProvider>
      </aside>

      {/* ── Collapsible content panel ── */}
      <div
        className={`flex flex-col transition-all duration-200 ease-in-out overflow-hidden min-h-0 min-w-0 ${
          isLeftCollapsed ? "w-0 opacity-0" : "w-72 opacity-100"
        }`}
      >
        <div className="h-8 flex items-center px-4 text-xs font-semibold tracking-tight text-foreground border-b border-border/40 shrink-0">
          {PANEL_TITLES[activeNav] ?? activeNav}
        </div>

        <ScrollArea className="flex-1 min-h-0 p-2">
          {activeNav === "projects" && <SidebarProjects />}
          {activeNav === "templates" && <SidebarTemplates />}
          {activeNav === "elements" && <SidebarElements />}
          {activeNav === "layers" && (
            <SidebarLayers />
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
          {activeNav === "tools" && <SidebarTools />}
          {activeNav === "generate" && <SidebarGenerate />}
        </ScrollArea>
        <div className="px-4 py-2 border-t border-border/40 shrink-0 flex items-center justify-start gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setLegal("terms")}
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Terms of Service
          </button>
          <span className="text-muted-foreground/40">•</span>
          <button
            type="button"
            onClick={() => setLegal("privacy")}
            className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <LegalDialog
        kind={legal ?? "terms"}
        open={legal !== null}
        onOpenChange={(open) => {
          if (!open) setLegal(null);
        }}
      />
    </div>
  );
}
