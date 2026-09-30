"use client";

import { useCallback } from "react";

import { getTemplateById } from "@/actions/templates";
import { useSlidesController } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import { templateSlidesToItems } from "@/lib/templates/parse";
import type { FabricCanvasJSON, RatioKey } from "@/lib/types";

export function useApplyTemplate() {
  const slidesController = useSlidesController();

  const applyPayload = useCallback(
    async (payload: {
      title?: string;
      aspectRatio: RatioKey;
      slides: FabricCanvasJSON[];
    }) => {
      slidesController?.saveCurrent();

      const items = templateSlidesToItems(payload.slides);
      const store = useCanvasStore.getState();

      store.setSlides(items);
      store.setCurrentSlideId(items[0]?.id ?? 1);
      store.setCurrentRatio(payload.aspectRatio);
      store.setDirty(true);

      await slidesController?.loadCurrent();
      return { success: true as const };
    },
    [slidesController],
  );

  const applyTemplateById = useCallback(
    async (templateId: string) => {
      const res = await getTemplateById(templateId);
      if (!res.success) return res;

      await applyPayload({
        title: res.template.title,
        aspectRatio: res.template.aspectRatio,
        slides: res.template.slides,
      });

      return { success: true as const, title: res.template.title };
    },
    [applyPayload],
  );

  return { applyTemplateById, applyPayload };
}
