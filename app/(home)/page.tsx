"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { Header } from "@/components/header";
import { LeftSidebar } from "@/components/canvas/left-sidebar";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { CanvasView } from "@/components/canvas/canvas-view";
import { ReferencePanel } from "@/components/canvas/reference-panel";
import { AutoFlowPrompt } from "@/components/canvas/auto-flow-prompt";
import { RightSidebar } from "@/components/canvas/right-sidebar";
import { PreviewModal } from "@/components/canvas/preview-modal";
import type { NavId } from "@/components/canvas/left-sidebar";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useProject } from "@/hooks/use-project";
import { useSlidesController } from "@/context/canvas-manager";

const SlideNavigator = dynamic(
  () => import("@/components/canvas/slide-navigator").then((mod) => mod.SlideNavigator),
  { ssr: false },
);

function ProjectBootstrap() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const { loadProject, persist } = useProject();
  const slidesController = useSlidesController();

  // Hydrate once from the URL only if nothing is selected yet.
  // Do not re-apply searchParams when currentProjectId changes: sidebar uses
  // history.replaceState, so Next.js params stay stale and would bounce back.
  useEffect(() => {
    if (!slidesController) return;

    const storeId = useCanvasStore.getState().currentProjectId;
    if (storeId) return;
    if (!projectId) return;

    void loadProject(projectId);
  }, [projectId, slidesController, loadProject]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void persist();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [persist]);

  return null;
}

function AuthLinkHandler() {
  const searchParams = useSearchParams();
  const verify = searchParams.get("verify");
  const reset = searchParams.get("reset");

  useEffect(() => {
    if (!verify && !reset) return;
    window.dispatchEvent(
      new CustomEvent("core:auth-link", {
        detail: { verify, reset },
      }),
    );
    const url = new URL(window.location.href);
    url.searchParams.delete("verify");
    url.searchParams.delete("reset");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(null, "", next);
  }, [verify, reset]);

  return null;
}

export default function CarouselStudio() {
  const [activeNav, setActiveNav] = useState<NavId>("templates");
  const [showDotGrid, setShowDotGrid] = useState(true);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSlideId, setPreviewSlideId] = useState<number>(0);

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground font-sans overflow-hidden select-none">
      <Header
        onPreview={() => {
          const storeCurrentId = useCanvasStore.getState().currentSlideId;
          setPreviewSlideId(storeCurrentId);
          setShowPreviewModal(true);
        }}
      />

      <Suspense fallback={null}>
        <ProjectBootstrap />
        <AuthLinkHandler />
      </Suspense>

      <div className="flex flex-1 min-h-0">
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isLeftCollapsed={isLeftCollapsed}
          setIsLeftCollapsed={setIsLeftCollapsed}
          showDotGrid={showDotGrid}
          setShowDotGrid={setShowDotGrid}
        />

        <main
          className="flex-1 flex flex-col bg-muted/50 overflow-hidden min-w-0 relative"
          style={
            showDotGrid
              ? {
                  backgroundImage:
                    "radial-gradient(var(--border) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }
              : {}
          }
        >
          <CanvasToolbar />

          <div className="flex flex-1 min-h-0 relative">
            <CanvasView />
            <ReferencePanel />
            <AutoFlowPrompt />
          </div>
          <SlideNavigator />
        </main>

        <RightSidebar
          isRightCollapsed={isRightCollapsed}
          setIsRightCollapsed={setIsRightCollapsed}
        />
      </div>

      <PreviewModal
        open={showPreviewModal}
        initialSlideId={previewSlideId}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
