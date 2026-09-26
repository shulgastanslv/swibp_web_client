"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { SlideData } from "@/components/canvas/types";

interface RightSidebarProps {
  activeSlide: SlideData;
  updateSlideField: <K extends keyof SlideData>(field: K, value: SlideData[K]) => void;
  fontFamily: "sans" | "serif" | "mono";
  setFontFamily: (f: "sans" | "serif" | "mono") => void;
  padding: number;
  setPadding: (v: number) => void;
  borderRadius: number;
  setBorderRadius: (v: number) => void;
  isRightCollapsed: boolean;
  setIsRightCollapsed: (v: boolean) => void;
}

export function RightSidebar({
  activeSlide,
  updateSlideField,
  fontFamily,
  setFontFamily,
  padding,
  setPadding,
  borderRadius,
  setBorderRadius,
  isRightCollapsed,
  setIsRightCollapsed,
}: RightSidebarProps) {
  const alignIcons = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify,
  } as const;

  return (
    <div className="flex h-full bg-background border-l border-border overflow-hidden relative">
      {/* Collapsible content panel */}
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
            {/* Text Alignment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground font-medium">
                Text Alignment
              </label>
              <div className="flex bg-muted/40 rounded-xl p-0.5 border border-border/40">
                {(["left", "center", "right", "justify"] as const).map((align) => {
                  const Icon = alignIcons[align];
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
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badge / Tag Label */}
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

            {/* Slide Heading */}
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

            {/* Slide Subtitle */}
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

            {/* Font Family */}
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

            {/* Card Padding */}
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

            {/* Corner Radius */}
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

      {/* Collapse toggle rail */}
      <aside className="w-10 flex flex-col items-center justify-start py-3 border-l border-border/50 bg-muted/20">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          title={isRightCollapsed ? "Expand properties" : "Collapse properties"}
        >
          {isRightCollapsed ? (
            <PanelRightOpen className="w-4 h-4" />
          ) : (
            <PanelRightClose className="w-4 h-4" />
          )}
        </Button>
      </aside>
    </div>
  );
}
