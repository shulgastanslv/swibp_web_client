"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
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
  User,
  AlignLeft,
  Pencil,
  Waypoints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasManager } from "@/context/canvas-manager";

interface ElementItem {
  label: string;
  icon: LucideIcon;
  action: () => void;
  iconClassName?: string;
  title?: string;
}

interface ElementSection {
  title: string;
  items: ElementItem[];
}

export function SidebarElements() {
  const { manager } = useCanvasManager();

  const sections: ElementSection[] = useMemo(
    () => [
      {
        title: "Text & Typography",
        items: [
          { label: "Heading", icon: Type, action: () => manager?.addHeading() },
          {
            label: "Subtitle",
            icon: Type,
            iconClassName: "opacity-50",
            action: () => manager?.addSubtitle(),
          },
          { label: "Paragraph", icon: AlignLeft, action: () => manager?.addParagraph() },
          { label: "Text", icon: Pencil, action: () => manager?.addText("Новый текст") },
          { label: "Quote Block", icon: Quote, action: () => manager?.addQuote() },
          { label: "Code Snippet", icon: Code, action: () => manager?.addCodeBlock() },
        ],
      },
      {
        title: "Shapes",
        items: [
          { label: "Rectangle", icon: Square, action: () => manager?.addRectangle() },
          { label: "Circle", icon: Circle, action: () => manager?.addCircle() },
          { label: "Triangle", icon: Triangle, action: () => manager?.addTriangle() },
          { label: "Line", icon: Minus, action: () => manager?.addLine() },
          {
            label: "Connect Arrow",
            icon: Waypoints,
            iconClassName: "text-blue-500",
            title: "Выделите 2 объекта через Shift и нажмите",
            action: () => manager?.connectSelectedObjects(),
          },
          { label: "Divider", icon: Minus, action: () => manager?.addDividerLine() },
        ],
      },
      {
        title: "Badges & Blocks",
        items: [
          { label: "Tag Chip", icon: Tag, action: () => manager?.addTag() },
          { label: "Badge", icon: Tag, action: () => manager?.addBadge() },
          { label: "Star Rating", icon: Star, action: () => manager?.addStarRating() },
          { label: "Handle", icon: User, action: () => manager?.addHandle() },
          { label: "Swipe Tag", icon: ArrowRight, action: () => manager?.addSwipeTag() },
          { label: "CTA Button", icon: MousePointerClick, action: () => manager?.addCTAButton() },
        ],
      },
    ],
    [manager]
  );

  return (
    <div className="flex flex-col gap-5 p-2 text-xs">
      {sections.map((section) => (
        <section key={section.title}>
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">
            {section.title}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {section.items.map(({ label, icon: Icon, action, iconClassName, title }) => (
              <Button
                key={label}
                variant="secondary"
                size="sm"
                title={title}
                onClick={action}
                disabled={!manager}
                className="h-10 justify-start gap-2 rounded-full bg-muted/50 text-xs"
              >
                <Icon className={`h-3.5 w-3.5 ${iconClassName ?? ""}`} />
                <span className="truncate">{label}</span>
              </Button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
