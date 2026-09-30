"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Copy, Loader2, Link2 } from "lucide-react";
import { setProjectPublic } from "@/actions/projects";
import { useProject } from "@/hooks/use-project";
import { useSession } from "next-auth/react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when auth is required before sharing */
  onNeedAuth?: () => void;
}

export function ShareModal({
  open,
  onOpenChange,
  onNeedAuth,
}: ShareModalProps) {
  const { status } = useSession();
  const { currentProjectId, persist, isSaving } = useProject();
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(currentProjectId);

  const shareUrl =
    typeof window !== "undefined" && projectId
      ? `${window.location.origin}/?project=${projectId}`
      : "";

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCopied(false);
    setProjectId(currentProjectId);

    if (status !== "authenticated") return;
    if (!currentProjectId) return;

    // Ensure link works for recipients: turn public on when opening share.
    setBusy(true);
    void setProjectPublic(currentProjectId, true)
      .then((res) => {
        if (res.success) setIsPublic(true);
        else alert("Ошибка при установке публичного доступа");
      })
      .finally(() => setBusy(false));
  }, [open, currentProjectId, status]);

  const ensureSavedAndPublic = async () => {
    if (status !== "authenticated") {
      onNeedAuth?.();
      return null;
    }

    setBusy(true);
    setError(null);
    try {
      let id = currentProjectId;
      if (!id) {
        const res = await persist();
        if (!res.success || !("projectId" in res) || !res.projectId) {
          setError("Сначала сохраните проект");
          return null;
        }
        id = res.projectId;
        setProjectId(id);
      }

      const pub = await setProjectPublic(id, true);
      if (!pub.success) {
        alert("Ошибка при установке публичного доступа");
        return null;
      }
      setIsPublic(true);
      return id;
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePublic = async (next: boolean) => {
    setIsPublic(next);
    const id = projectId ?? (await ensureSavedAndPublic());
    if (!id) {
      setIsPublic(false);
      return;
    }
    setBusy(true);
    const res = await setProjectPublic(id, next);
    setBusy(false);
    if (!res.success) {
      setIsPublic(!next);
      alert("Ошибка при установке публичного доступа");
    }
  };

  const handleCopy = async () => {
    const id = projectId ?? (await ensureSavedAndPublic());
    if (!id || typeof window === "undefined") return;

    const url = `${window.location.origin}/?project=${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Не удалось скопировать ссылку");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-5 border-border">
        <DialogHeader className="space-y-1.5 text-left border-b border-border/40 pb-3">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Share Project
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ссылка откроет карусель у любого, у кого есть доступ к приложению.
            Публичный доступ можно выключить в любой момент.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          {status !== "authenticated" ? (
            <p className="text-xs text-muted-foreground">
              Войдите в аккаунт, чтобы поделиться проектом.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
                <div className="min-w-0">
                  <Label htmlFor="share-public" className="text-xs font-medium">
                    Публичная ссылка
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    {isPublic ? "Сейчас доступна по ссылке" : "Выключена"}
                  </p>
                </div>
                <Switch
                  id="share-public"
                  checked={isPublic}
                  disabled={busy || isSaving}
                  onCheckedChange={(v) => void handleTogglePublic(v)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareUrl || "Сохраните проект, чтобы получить ссылку"}
                  className="h-8 text-xs font-mono bg-muted/40 border-border/60 rounded-xl"
                />
                <Button
                  size="sm"
                  onClick={() => void handleCopy()}
                  disabled={busy || isSaving}
                  className="h-8 px-3 text-xs rounded-xl shrink-0 gap-1.5"
                >
                  {busy || isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>

              {!projectId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-xl gap-1.5"
                  disabled={busy || isSaving}
                  onClick={() => void ensureSavedAndPublic()}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Сохранить и создать ссылку
                </Button>
              )}
            </>
          )}

          {error && <p className="text-[11px] text-destructive">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
