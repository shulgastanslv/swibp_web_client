"use client";

import { useEffect, useMemo, type DragEvent, type ReactNode } from "react";
import { ChevronDown, ImagePlus, Link2, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useElementLibrary } from "@/components/canvas/use-element-library";
import { ZoomControls } from "@/components/canvas/zoom-controls";

interface ElementsToolbarProps {
  onExit: () => void;
}

const HINTS: Record<string, string> = {
  "Upload image": "Adds a picture from a file",
  "Image from a link": "Adds a picture from a URL",
  iPhone: "iPhone mockup",
  Android: "Android phone mockup",
  iPad: "iPad mockup",
  Tablet: "Android tablet mockup",
  Laptop: "Laptop mockup",
  Monitor: "Monitor mockup",
  "Image in frame": "Puts a picture on the selected device",
  Heading: "Large title",
  Subtitle: "Smaller title under the heading",
  Paragraph: "Body text",
  Text: "Single line of text",
  Quote: "Quoted line",
  Rectangle: "Rectangle",
  Circle: "Circle",
  Triangle: "Triangle",
  Diamond: "Diamond",
  Star: "Five-point star",
  Hexagon: "Hexagon",
  Ellipse: "Oval",
  Line: "Straight line",
  Divider: "Thin horizontal rule",
};

function shortcutFor(index: number) {
  const n = (index % 10) + 1;
  const digit = n === 10 ? "0" : String(n);
  const shift = index >= 10;
  return { digit, shift, shortcut: shift ? `⇧${digit}` : digit };
}

function digitFromCode(code: string): string | null {
  if (code.startsWith("Digit") && code.length === 6) return code.slice(5);
  if (code.startsWith("Numpad") && code.length === 7) return code.slice(6);
  return null;
}

function ToolButton({
  label,
  hint,
  shortcut,
  disabled,
  onClick,
  onDragOver,
  onDrop,
  children,
}: {
  label: string;
  hint?: string;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
  onDragOver?: (event: DragEvent<HTMLButtonElement>) => void;
  onDrop?: (event: DragEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={shortcut ? `${label}, ${shortcut}` : label}
          disabled={disabled}
          onClick={onClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={cn(
            "flex h-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            shortcut ? "gap-1 px-2" : "size-8",
          )}
        >
          {children}
          {shortcut && (
            <span className="font-mono text-[11px] font-medium leading-none tabular-nums text-foreground/80">
              {shortcut}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        <span className="flex flex-col items-start gap-0.5">
          <span className="flex items-center gap-1.5">
            {label}
            {shortcut && (
              <kbd className="rounded-sm bg-background/15 px-1 font-mono text-[10px]">{shortcut}</kbd>
            )}
          </span>
          {hint && <span className="opacity-80">{hint}</span>}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}

function Group({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-muted/50 p-0.5">
      {children}
    </div>
  );
}

export function ElementsToolbar({ onExit }: ElementsToolbarProps) {
  const {
    manager,
    sections,
    frames,
    fileInputRef,
    frameInputRef,
    isDragging,
    setIsDragging,
    imageUrl,
    setImageUrl,
    urlLoading,
    urlError,
    setUrlError,
    addImageFromFile,
    fillFrameFromFile,
    handleImageFileChange,
    handleFrameFileChange,
    addImageFromUrl,
  } = useElementLibrary();

  const numbered = useMemo(() => {
    const items: { label: string; action: () => void }[] = [];
    for (const section of sections) {
      for (const item of section.items) items.push({ label: item.label, action: item.action });
    }
    return items.map((item, index) => ({ ...item, ...shortcutFor(index) }));
  }, [sections, manager]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const el = document.activeElement;
      if (
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)
      ) {
        return;
      }
      const active = manager?.getActiveObject() as { isEditing?: boolean } | null;
      if (active?.isEditing) return;
      const digit = digitFromCode(event.code);
      if (!digit) return;
      const tool = numbered.find((item) => item.digit === digit && item.shift === event.shiftKey);
      if (!tool || !manager) return;
      event.preventDefault();
      tool.action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [manager, numbered]);

  const shortcutByLabel = new Map(numbered.map((item) => [item.label, item.shortcut]));

  return (
    <TooltipProvider delayDuration={250}>
      <div className="z-10 flex h-12 w-full shrink-0 items-center gap-1.5 border-b border-border/40 bg-background/80 px-2 backdrop-blur-md">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          className="hidden"
          disabled={!manager}
        />
        <input
          type="file"
          ref={frameInputRef}
          onChange={handleFrameFileChange}
          accept="image/*"
          className="hidden"
          disabled={!manager}
        />

      

        <Group>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Upload image"
                title="Upload image"
                disabled={!manager}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (manager) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) addImageFromFile(file);
                }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-40",
                  isDragging
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-background hover:text-foreground",
                )}
              >
                <ImagePlus className="size-4" strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              <span className="flex flex-col items-start gap-0.5">
                <span>Upload image</span>
                <span className="opacity-80">{HINTS["Upload image"]}</span>
              </span>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Image from a link"
                    title="Image from a link"
                    disabled={!manager}
                    className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronDown className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                <span className="flex flex-col items-start gap-0.5">
                  <span>Image from a link</span>
                  <span className="opacity-80">{HINTS["Image from a link"]}</span>
                </span>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="w-64 p-2">
              <div className="flex items-center gap-1.5">
                <div className="relative min-w-0 flex-1">
                  <Link2 className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="Image URL"
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
                    className="h-8 rounded-full border-border/50 bg-muted/30 pl-7 text-xs shadow-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!manager || urlLoading || !imageUrl.trim()}
                  onClick={() => void addImageFromUrl()}
                  className="h-8 shrink-0 rounded-full px-2.5 text-xs"
                >
                  {urlLoading ? <Loader2 className="size-3 animate-spin" /> : "Add"}
                </Button>
              </div>
              {urlError && <p className="px-1 pt-1.5 text-xs text-destructive">{urlError}</p>}
            </DropdownMenuContent>
          </DropdownMenu>
        </Group>

        <Group>
          {frames.map(({ kind, label, icon: Icon }) => (
            <ToolButton
              key={kind}
              label={label}
              hint={HINTS[label]}
              disabled={!manager}
              onClick={() => manager?.objects.addFrame(kind)}
            >
              <Icon className="size-4" strokeWidth={1.5} />
            </ToolButton>
          ))}
          <ToolButton
            label="Image in frame"
            hint={HINTS["Image in frame"]}
            disabled={!manager}
            onClick={() => frameInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) fillFrameFromFile(file);
            }}
          >
            <ImagePlus className="size-4" strokeWidth={1.5} />
          </ToolButton>
        </Group>

        {sections.map((section) => (
          <Group key={section.id}>
            {section.items.map(({ label, icon: Icon, action, title }) => (
              <ToolButton
                key={label}
                label={label}
                hint={title ?? HINTS[label]}
                shortcut={shortcutByLabel.get(label)}
                disabled={!manager}
                onClick={action}
              >
                <Icon className="size-4" strokeWidth={1.5} />
              </ToolButton>
            ))}
          </Group>
        ))}
        </div>
        <ZoomControls />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="h-8 shrink-0 gap-1.5 rounded-full px-2.5 text-xs"
          title="Leave focus mode"
        >
          <Minimize2 className="size-3.5" />
          Exit
        </Button>
      </div>
    </TooltipProvider>
  );
}
