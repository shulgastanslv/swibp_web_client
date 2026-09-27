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
import { useCanvasStore } from "@/store/useCanvasStore";

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
  const store = useCanvasStore();

  const sections: ElementSection[] = useMemo(
    () => [
      {
        title: "Text & Typography",
        items: [
          { label: "Heading", icon: Type, action: store.addHeading },
          {
            label: "Subtitle",
            icon: Type,
            iconClassName: "opacity-50",
            action: store.addSubtitle,
          },
          { label: "Paragraph", icon: AlignLeft, action: store.addParagraph },
          { label: "Text", icon: Pencil, action: store.addText },
          { label: "Quote Block", icon: Quote, action: store.addQuote },
          { label: "Code Snippet", icon: Code, action: store.addCodeBlock },
        ],
      },
      {
        title: "Shapes",
        items: [
          { label: "Rectangle", icon: Square, action: store.addRectangle },
          { label: "Circle", icon: Circle, action: store.addCircle },
          { label: "Triangle", icon: Triangle, action: store.addTriangle },
          { label: "Line", icon: Minus, action: store.addLine },
          {
            label: "Connect Arrow",
            icon: Waypoints,
            iconClassName: "text-blue-500",
            title: "Выделите 2 объекта через Shift и нажмите",
            action: store.connectSelected,
          },
          { label: "Divider", icon: Minus, action: store.addDividerLine },
        ],
      },
      {
        title: "Badges & Blocks",
        items: [
          { label: "Tag Chip", icon: Tag, action: store.addTag },
          { label: "Badge", icon: Tag, action: store.addBadge },
          { label: "Star Rating", icon: Star, action: store.addStarRating },
          { label: "Handle", icon: User, action: store.addHandle },
          { label: "Swipe Tag", icon: ArrowRight, action: store.addSwipeTag },
          { label: "CTA Button", icon: MousePointerClick, action: store.addCTAButton },
        ],
      },
    ],
    [store]
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
                className="h-9 justify-start gap-2 rounded-xl bg-muted/50 text-xs"
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
