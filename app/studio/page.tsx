"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { LeftSidebar } from "@/components/canvas/left-sidebar";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { CanvasView } from "@/components/canvas/canvas-view";
import { RightSidebar } from "@/components/canvas/right-sidebar";
import { PreviewModal } from "@/components/canvas/preview-modal";
import type { NavId } from "@/components/canvas/left-sidebar";
import { useCanvasStore } from "@/store/useCanvasStore";
import dynamic from "next/dynamic";

const SlideNavigator = dynamic(
  () => import("@/components/canvas/slide-navigator").then((mod) => mod.SlideNavigator),
  { ssr: false }
);

export default function CarouselStudio() {
  const [activeNav, setActiveNav] = useState<NavId>("templates");
  const [showDotGrid, setShowDotGrid] = useState(true);
  const [projectName, setProjectName] = useState("Untitled Carousel");
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSlideId, setPreviewSlideId] = useState<number>(0);

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground font-sans overflow-hidden select-none">
      <Header projectName={projectName} onProjectNameChange={setProjectName} />

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
          <CanvasToolbar
            onPreview={() => {
              const storeCurrentId = useCanvasStore.getState().currentSlideId;
              setPreviewSlideId(storeCurrentId);
              setShowPreviewModal(true);
            }}
          />

          <CanvasView />
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
