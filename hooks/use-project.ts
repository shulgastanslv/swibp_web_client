"use client";

import { useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

import {
  createProject,
  getProjectById,
  saveAsNewProject,
  saveProject,
  saveProjectThumbnails,
  updateProjectTitle,
} from "@/actions/projects";
import { useSlidesController } from "@/context/canvas-manager";
import { renderMissingThumbnails } from "@/lib/canvas/thumbnail";
import { useCanvasStore } from "@/store/useCanvasStore";
import type { RatioKey } from "@/lib/types";

function setProjectInUrl(projectId: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("project", projectId);
  window.history.replaceState({}, "", url.toString());
}

function notifyProjectsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("swibp:projects-changed"));
}

function scheduleThumbnailHydration(projectId: string | null, persistToDb: boolean) {
  const start = useCanvasStore.getState();
  const snapshot = start.slides.map((slide) => ({
    id: slide.id,
    canvasJSON: slide.canvasJSON,
    thumbnail: slide.thumbnail ?? null,
  }));
  if (!snapshot.some((slide) => !slide.thumbnail)) return;

  void (async () => {
    let rendered: Array<{ id: number; dataUrl: string }> = [];
    try {
      rendered = await renderMissingThumbnails(snapshot, start.canvasDimensions);
    } catch (err) {
      console.error(err);
      return;
    }
    if (rendered.length === 0) return;

    const current = useCanvasStore.getState();
    if (current.currentProjectId !== projectId) return;

    const byId = new Map(rendered.map((shot) => [shot.id, shot.dataUrl]));
    for (const slide of snapshot) {
      const thumb = byId.get(slide.id);
      if (!thumb) continue;
      const now = current.slides.find((item) => item.id === slide.id);
      if (!now || now.thumbnail || now.canvasJSON !== slide.canvasJSON) continue;
      current.updateSlideThumbnail(slide.id, thumb);
    }

    const after = useCanvasStore.getState();
    const unchanged =
      persistToDb &&
      !!projectId &&
      !after.isDirty &&
      after.currentProjectId === projectId &&
      after.slides.length === snapshot.length &&
      after.slides.every(
        (slide, index) =>
          slide.id === snapshot[index]?.id &&
          slide.canvasJSON === snapshot[index]?.canvasJSON,
      );
    if (!unchanged || !projectId) return;

    const saved = await saveProjectThumbnails(
      projectId,
      after.slides.map((slide) => slide.thumbnail ?? null),
    );
    if (saved.success && saved.updated) notifyProjectsChanged();
  })();
}

export function useProject() {
  const { status } = useSession();
  const slidesController = useSlidesController();
  const loadSeq = useRef(0);

  const currentProjectId = useCanvasStore((s) => s.currentProjectId);
  const projectTitle = useCanvasStore((s) => s.projectTitle);
  const isDirty = useCanvasStore((s) => s.isDirty);
  const isSaving = useCanvasStore((s) => s.isSaving);
  const isLoadingProject = useCanvasStore((s) => s.isLoadingProject);

  const loadProject = useCallback(
    async (projectId: string) => {
      const store = useCanvasStore.getState();
      if (store.currentProjectId === projectId && !store.isLoadingProject) {
        return { success: true as const };
      }

      const seq = ++loadSeq.current;
      // Optimistic selection so the sidebar doesn't flicker / bounce.
      store.setCurrentProjectId(projectId);
      store.setLoadingProject(true);
      setProjectInUrl(projectId);

      const res = await getProjectById(projectId);
      if (seq !== loadSeq.current) {
        return { success: false as const, error: "Cancelled" };
      }

      if (!res.success) {
        store.setLoadingProject(false);
        return { success: false as const, error: "Couldn't load" };
      }

      slidesController?.saveCurrent();
      store.loadProjectState(res.project);
      if (seq !== loadSeq.current) {
        return { success: false as const, error: "Cancelled" };
      }

      await slidesController?.loadCurrent();
      if (seq !== loadSeq.current) {
        return { success: false as const, error: "Cancelled" };
      }

      useCanvasStore.getState().markSaved();
      scheduleThumbnailHydration(projectId, res.isOwner);
      return { success: true as const };
    },
    [slidesController],
  );

  const persist = useCallback(async () => {
    if (status !== "authenticated") {
      return { success: false as const, error: "Sign in to save" };
    }

    const store = useCanvasStore.getState();
    if (store.isSaving) {
      return { success: false as const, error: "A save is already in progress" };
    }

    slidesController?.saveCurrent();

    const {
      currentProjectId: projectId,
      projectTitle: title,
      currentRatio,
      canvasDimensions,
      slides,
    } = useCanvasStore.getState();

    const payload = {
      title,
      aspectRatio: currentRatio as RatioKey,
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      slides: slides.map((s) => ({
        canvasJSON: s.canvasJSON,
        thumbnail: s.thumbnail ?? null,
      })),
    };

    store.setSaving(true);
    try {
      if (projectId) {
        const res = await saveProject(projectId, payload);
        if (!res.success) return res;
        useCanvasStore.getState().markSaved();
        notifyProjectsChanged();
        return { success: true as const, projectId };
      }

      const res = await saveAsNewProject(payload);
      if (!res.success) return res;

      useCanvasStore.getState().setCurrentProjectId(res.projectId);
      useCanvasStore.getState().markSaved();
      setProjectInUrl(res.projectId);
      notifyProjectsChanged();

      return { success: true as const, projectId: res.projectId };
    } finally {
      useCanvasStore.getState().setSaving(false);
    }
  }, [slidesController, status]);

  const newProject = useCallback(
    async (title?: string, aspectRatio?: RatioKey) => {
      if (status !== "authenticated") {
        return { success: false as const, error: "Sign in" };
      }

      const ratio =
        aspectRatio ?? useCanvasStore.getState().currentRatio;
      const res = await createProject({ title, aspectRatio: ratio });
      if (!res.success) return res;

      slidesController?.saveCurrent();
      useCanvasStore.getState().loadProjectState(res.project);
      await slidesController?.loadCurrent();
      useCanvasStore.getState().markSaved();
      setProjectInUrl(res.projectId);
      notifyProjectsChanged();
      scheduleThumbnailHydration(res.projectId, true);

      return res;
    },
    [slidesController, status],
  );

  const rename = useCallback(
    async (title: string) => {
      useCanvasStore.getState().setProjectTitle(title);
      const projectId = useCanvasStore.getState().currentProjectId;
      if (!projectId || status !== "authenticated") return;
      await updateProjectTitle(projectId, title);
    },
    [status],
  );

  return {
    currentProjectId,
    projectTitle,
    isDirty,
    isSaving,
    isLoadingProject,
    loadProject,
    persist,
    newProject,
    rename,
  };
}
