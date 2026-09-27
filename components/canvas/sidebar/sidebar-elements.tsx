"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/store/useCanvasStore";

export function SidebarElements() {
  const {
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

  return (
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
  );
}
