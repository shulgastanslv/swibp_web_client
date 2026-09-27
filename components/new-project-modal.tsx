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
import { createProject, getProjectById } from "@/actions/projects";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string; // Можно передать пропсом, либо взять из useSession
}

export function NewProjectModal({ open, onOpenChange, userId: propsUserId }: NewProjectModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  // const loadProjectState = useCanvasStore((s) => s.loadProjectState);

  // Используем переданный userId или ID из текущей сессии
  const currentUserId = propsUserId || (session?.user as { id?: string })?.id;

  const handleCreate = async () => {
    if (!name.trim() || loading) return;

    if (!currentUserId) {
      alert("Сначала авторизуйтесь, чтобы создать проект");
      return;
    }

    setLoading(true);

    // Передаем userId первым аргументом
    const res = await createProject(currentUserId, name);

    if (res.success && res.projectId) {
      const fullProject = await getProjectById(res.projectId);
      // if (fullProject.project) {
      //   await loadProjectState(fullProject.project);
      // }
      setName("");
      onOpenChange(false);
      router.push(`/?project=${res.projectId}`);
    } else {
      alert(res.error || "Ошибка при создании");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden border border-border/80 shadow-2xl rounded-2xl bg-background max-w-[380px]">
        <DialogHeader className="px-5 pt-5 pb-2">
          <DialogTitle className="text-sm font-semibold tracking-tight text-foreground">
            Новый проект
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Введите название карусели
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-3">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Например: AI Tools Carousel"
            className="h-9 rounded-xl border-border/70 bg-muted/30 px-3 text-xs"
          />
        </div>

        <DialogFooter className="px-5 py-3 bg-muted/20 border-t border-border/40 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-3 h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Отмена
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="rounded-full px-4 h-7 text-xs font-medium"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
