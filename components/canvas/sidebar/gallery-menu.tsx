"use client";

import { useState } from "react";
import { Copy, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const VISIBLE_KEYWORDS = 5;

export function GalleryMenu({
  title,
  createdAt,
  createdBy,
  category,
  ratio,
  canRename = true,
  starred = false,
  onRename,
  onDuplicate,
  onDelete,
  onStar,
}: {
  title: string;
  createdAt: string;
  createdBy?: string | null;
  category?: string | null;
  ratio: string;
  canRename?: boolean;
  starred?: boolean;
  onRename?: (title: string) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onStar?: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(title);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const when = new Date(createdAt);
  const dateLabel = Number.isNaN(when.getTime())
    ? createdAt
    : when.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  const keywords = [category, ratio, dateLabel].flatMap((value) => {
    if (!value) return [];
    return value
      .split(/[,/|]/)
      .map((part) => part.trim())
      .filter(Boolean);
  });
  const visible = showAllKeywords ? keywords : keywords.slice(0, VISIBLE_KEYWORDS);
  const hidden = keywords.length - visible.length;

  const commitRename = () => {
    const next = draft.trim();
    setRenaming(false);
    if (!next || next === title) return;
    onRename?.(next);
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) {
          setRenaming(false);
          setShowAllKeywords(false);
        }
        if (open) setDraft(title);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 rounded-full bg-background text-muted-foreground opacity-0 ring-1 ring-border/60 transition-opacity group-hover:opacity-100 hover:text-foreground"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        className="w-[280px] rounded-2xl bg-popover p-0 text-popover-foreground shadow-xl ring-1 ring-foreground/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-4 pt-3.5 pb-3">
          {renaming ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                commitRename();
              }}
            >
              <Input
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                className="h-9 text-sm font-semibold"
                aria-label="Name"
              />
            </form>
          ) : (
            <p className="text-[15px] leading-snug font-semibold tracking-tight text-foreground">{title}</p>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            {createdBy ? `View more by ${createdBy}` : "View more by Swibp"}
          </p>
          {visible.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {visible.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full border border-border/80 px-2.5 py-1 text-xs text-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
          {hidden > 0 ? (
            <button
              type="button"
              className="mt-2 text-xs text-violet-600 hover:underline dark:text-violet-300"
              onClick={() => setShowAllKeywords(true)}
            >
              Show all keywords
            </button>
          ) : null}
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        {onStar ? (
          <DropdownMenuItem
            className="cursor-pointer gap-3 rounded-none px-4 py-2.5 text-sm"
            onClick={onStar}
          >
            <Star className={cn("size-4", starred && "fill-current")} />
            Star
          </DropdownMenuItem>
        ) : null}
        {canRename && onRename ? (
          <DropdownMenuItem
            className="cursor-pointer gap-3 rounded-none px-4 py-2.5 text-sm"
            onSelect={(event) => {
              event.preventDefault();
              setDraft(title);
              setRenaming(true);
            }}
          >
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
        ) : null}
        {onDuplicate ? (
          <DropdownMenuItem className="cursor-pointer gap-3 rounded-none px-4 py-2.5 text-sm" onClick={onDuplicate}>
            <Copy className="size-4" />
            Duplicate
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-3 rounded-none px-4 py-2.5 text-sm"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
