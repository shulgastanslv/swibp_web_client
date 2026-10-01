"use client";

import { useMemo, useRef, useState } from "react";
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
  ImagePlus,
  Link2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";
import { cn } from "@/lib/utils";
import { fileToDataUrl } from "@/lib/image/file-to-data-url";
import { useCanvasManager } from "@/context/canvas-manager";

interface ElementItem {
  label: string;
  icon: LucideIcon;
  action: () => void;
  title?: string;
}

interface ElementSection {
  id: string;
  title: string;
  items: ElementItem[];
}

export function SidebarElements() {
  const manager = useCanvasManager();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const addImageFromFile = (file: File) => {
    if (!file.type.startsWith("image/") || !manager) return;
    void fileToDataUrl(file)
      .then((dataUrl) => manager.objects.addImage(dataUrl))
      .catch((err) => {
        console.error(err);
      });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addImageFromFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) addImageFromFile(file);
  };

  const addImageFromUrl = async () => {
    const trimmed = imageUrl.trim();
    if (!trimmed || !manager) return;

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
      if (!/^https?:$/i.test(parsed.protocol)) {
        setUrlError("Нужна ссылка http(s)");
        return;
      }
    } catch {
      setUrlError("Некорректная ссылка");
      return;
    }

    setUrlError(null);
    setUrlLoading(true);
    try {
      await manager.objects.addImage(parsed.toString());
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setUrlError("Не удалось загрузить изображение (CORS?)");
    } finally {
      setUrlLoading(false);
    }
  };

  const sections: ElementSection[] = useMemo(
    () => [
      {
        id: "elements-text",
        title: "Text",
        items: [
          { label: "Heading", icon: Type, action: () => manager?.objects.addHeading() },
          { label: "Subtitle", icon: Type, action: () => manager?.objects.addSubtitle() },
          { label: "Paragraph", icon: AlignLeft, action: () => manager?.objects.addParagraph() },
          { label: "Text", icon: Pencil, action: () => manager?.objects.addText("Новый текст") },
          { label: "Quote", icon: Quote, action: () => manager?.objects.addQuote() },
          { label: "Code", icon: Code, action: () => manager?.objects.addCodeBlock() },
        ],
      },
      {
        id: "elements-shapes",
        title: "Shapes",
        items: [
          { label: "Rectangle", icon: Square, action: () => manager?.objects.addRectangle() },
          { label: "Circle", icon: Circle, action: () => manager?.objects.addCircle() },
          { label: "Triangle", icon: Triangle, action: () => manager?.objects.addTriangle() },
          { label: "Line", icon: Minus, action: () => manager?.objects.addLine() },
          {
            label: "Connect",
            icon: Waypoints,
            title: "Выделите 2 объекта через Shift и нажмите",
            action: () => manager?.connectSelectedObjects(),
          },
          { label: "Divider", icon: Minus, action: () => manager?.objects.addDividerLine() },
        ],
      },
      {
        id: "elements-blocks",
        title: "Blocks",
        items: [
          { label: "Topic", icon: Tag, action: () => manager?.objects.addTag() },
          { label: "Step", icon: Tag, action: () => manager?.objects.addBadge() },
          { label: "Rating", icon: Star, action: () => manager?.objects.addStarRating() },
          { label: "Handle", icon: User, action: () => manager?.objects.addHandle() },
          { label: "Swipe", icon: ArrowRight, action: () => manager?.objects.addSwipeTag() },
          { label: "CTA", icon: MousePointerClick, action: () => manager?.objects.addCTAButton() },
        ],
      },
    ],
    [manager],
  );

  return (
    <div className="flex flex-col text-[11px] text-foreground">
      <CollapsibleGroup id="elements-image" title="Image">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
          disabled={!manager}
        />

        <button
          type="button"
          disabled={!manager}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (manager) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-xl border border-dashed px-3 text-left transition-colors disabled:opacity-40",
            isDragging
              ? "border-foreground/30 bg-muted"
              : "border-border/70 hover:border-foreground/20 hover:bg-muted/60",
          )}
        >
          <ImagePlus className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-foreground/80">Upload or drop</span>
          <span className="text-xs text-muted-foreground">PNG, JPG</span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="url"
              placeholder="Paste image URL"
              value={imageUrl}
              disabled={!manager}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setUrlError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void addImageFromUrl();
                }
              }}
              className="h-8 rounded-full border-border/50 bg-muted/30 pl-8 text-xs shadow-none"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!manager || urlLoading || !imageUrl.trim()}
            onClick={() => void addImageFromUrl()}
            className="h-8 shrink-0 rounded-full px-3 text-xs"
          >
            {urlLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
          </Button>
        </div>
        {urlError && <p className="text-xs text-destructive">{urlError}</p>}
      </CollapsibleGroup>

      {sections.map((section) => (
        <CollapsibleGroup key={section.id} id={section.id} title={section.title}>
          <div className="grid grid-cols-4 gap-1">
            {section.items.map(({ label, icon: Icon, action, title }) => (
              <button
                key={label}
                type="button"
                title={title ?? label}
                onClick={action}
                disabled={!manager}
                className="flex flex-col items-center justify-center gap-1.5 rounded-full px-2.5 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="max-w-full truncate text-xs leading-none">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CollapsibleGroup>
      ))}
    </div>
  );
}
