"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { LayoutGrid, Smartphone, Monitor, Square } from "lucide-react";

// ─── Format definitions ───────────────────────────────────────────────────────

const FORMATS = [
  { id: "1:1",     label: "Square",    ratio: "1080×1080", icon: <Square className="w-4 h-4" /> },
  { id: "4:5",     label: "Portrait",  ratio: "1080×1350", icon: <Smartphone className="w-4 h-4" /> },
  { id: "9:16",    label: "Story",     ratio: "1080×1920", icon: <Smartphone className="w-4 h-4" /> },
  { id: "16:9",    label: "Landscape", ratio: "1920×1080", icon: <Monitor className="w-4 h-4" /> },
  { id: "carousel",label: "Carousel",  ratio: "1080×1080", icon: <LayoutGrid className="w-4 h-4" /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const router = useRouter();
  const [name, setName] = useState("Untitled Carousel");
  const [format, setFormat] = useState("1:1");

  const handleCreate = () => {
    onOpenChange(false);
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0" showCloseButton>

        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/50">
          <DialogTitle className="text-sm font-semibold">New project</DialogTitle>
          <DialogDescription className="text-xs">
            Choose a format and give your project a name.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-4 flex flex-col gap-5">

          {/* Project name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Project name</label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Untitled Carousel"
              className="h-9 rounded-xl border border-border bg-muted/30 px-3 text-sm"
            />
          </div>

          {/* Format picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Format</label>
            <div className="grid grid-cols-5 gap-2">
              {FORMATS.map((f) => {
                const active = format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[11px] font-medium transition-all",
                      active
                        ? "border-primary bg-primary/5 text-foreground shadow-sm"
                        : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <span className={cn(active ? "text-primary" : "opacity-60")}>
                      {f.icon}
                    </span>
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={!name.trim()}
            className="rounded-xl gap-1.5"
          >
            Create project
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
