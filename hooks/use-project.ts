"use client";

import { useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

import {
  createProject,
  getProjectById,
  saveAsNewProject,
  saveProject,
  updateProjectTitle,
} from "@/actions/projects";
import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import type { RatioKey } from "@/lib/types";

function setProjectInUrl(projectId: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("project", projectId);
  window.history.replaceState({}, "", url.toString());
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
        return { success: true as const, projectId };
      }

      const res = await saveAsNewProject(payload);
      if (!res.success) return res;

      useCanvasStore.getState().setCurrentProjectId(res.projectId);
      useCanvasStore.getState().markSaved();
      setProjectInUrl(res.projectId);

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
