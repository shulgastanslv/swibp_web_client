"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

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
import { useProject } from "@/hooks/use-project";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const { status } = useSession();
  const { newProject } = useProject();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || loading) return;

    if (status !== "authenticated") {
      alert("Сначала авторизуйтесь, чтобы создать проект");
      return;
    }

    setLoading(true);
    const res = await newProject(name.trim());

    if (res.success) {
      setName("");
      onOpenChange(false);
    } else {
      alert("Ошибка при создании");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border border-border/80 bg-background p-2 shadow-2xl">
        <DialogHeader className="px-5 pb-2 pt-5">
          <DialogTitle className="text-sm font-semibold tracking-tight text-foreground">
            Новый проект
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
            Введите название карусели
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-3">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleCreate()}
            placeholder="Например: AI Tools Carousel"
            className="h-9 rounded-xl border-border/70 bg-muted/30 px-3 text-xs"
          />
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 border-t border-border/40 bg-muted/20 p-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            Отмена
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void handleCreate()}
            disabled={!name.trim() || loading}
            className="h-7 rounded-full px-4 text-xs font-medium"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
