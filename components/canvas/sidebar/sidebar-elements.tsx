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
  UploadCloud,
  Link2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  const manager = useCanvasManager();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const addImageFromFile = (file: File) => {
    if (!file.type.startsWith("image/") || !manager) return;
    const url = URL.createObjectURL(file);
    void manager.objects.addImage(url).catch((err) => {
      console.error(err);
      URL.revokeObjectURL(url);
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
        title: "Text & Typography",
        items: [
          { label: "Heading", icon: Type, action: () => manager?.objects.addHeading() },
          {
            label: "Subtitle",
            icon: Type,
            iconClassName: "opacity-50",
            action: () => manager?.objects.addSubtitle(),
          },
          { label: "Paragraph", icon: AlignLeft, action: () => manager?.objects.addParagraph() },
          { label: "Text", icon: Pencil, action: () => manager?.objects.addText("Новый текст") },
          { label: "Quote Block", icon: Quote, action: () => manager?.objects.addQuote() },
          { label: "Code Snippet", icon: Code, action: () => manager?.objects.addCodeBlock() },
        ],
      },
      {
        title: "Shapes",
        items: [
          { label: "Rectangle", icon: Square, action: () => manager?.objects.addRectangle() },
          { label: "Circle", icon: Circle, action: () => manager?.objects.addCircle() },
          { label: "Triangle", icon: Triangle, action: () => manager?.objects.addTriangle() },
          { label: "Line", icon: Minus, action: () => manager?.objects.addLine() },
          {
            label: "Connect Arrow",
            icon: Waypoints,
            iconClassName: "text-blue-500",
            title: "Выделите 2 объекта через Shift и нажмите",
            action: () => manager?.connectSelectedObjects(),
          },
          { label: "Divider", icon: Minus, action: () => manager?.objects.addDividerLine() },
        ],
      },
      {
        title: "Badges & Blocks",
        items: [
          { label: "Tag Chip", icon: Tag, action: () => manager?.objects.addTag() },
          { label: "Badge", icon: Tag, action: () => manager?.objects.addBadge() },
          { label: "Star Rating", icon: Star, action: () => manager?.objects.addStarRating() },
          { label: "Handle", icon: User, action: () => manager?.objects.addHandle() },
          { label: "Swipe Tag", icon: ArrowRight, action: () => manager?.objects.addSwipeTag() },
          { label: "CTA Button", icon: MousePointerClick, action: () => manager?.objects.addCTAButton() },
        ],
      },
    ],
    [manager]
  );

  return (
    <div className="flex flex-col gap-5 p-2 text-xs">
      <section>
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">
          Изображение
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
          disabled={!manager}
        />

        <div
          role="button"
          tabIndex={manager ? 0 : -1}
          onClick={() => manager && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (!manager) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (manager) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed p-4 text-center transition-all",
            !manager && "opacity-50 pointer-events-none",
            isDragging
              ? "border-primary bg-primary/10 ring-2 ring-primary/20 cursor-pointer"
              : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-xs border border-border/50 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-foreground">
              С компьютера
            </span>
            <span className="text-[10px] text-muted-foreground">
              Перетащите файл или нажмите для выбора
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-col gap-1.5">
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            По ссылке
          </p>
          <div className="flex gap-1.5">
            <Input
              type="url"
              placeholder="https://…"
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
              className="h-8 text-xs rounded-xl bg-muted/30 border-border/60"
            />
            <Button
              type="button"
              size="sm"
              disabled={!manager || urlLoading || !imageUrl.trim()}
              onClick={() => void addImageFromUrl()}
              className="h-8 px-3 rounded-xl shrink-0 text-xs"
            >
              {urlLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Добавить"
              )}
            </Button>
          </div>
          {urlError && (
            <p className="text-[10px] text-destructive">{urlError}</p>
          )}
        </div>
      </section>

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
