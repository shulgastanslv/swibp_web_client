"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { LeftSidebar } from "@/components/canvas/left-sidebar";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { CanvasView } from "@/components/canvas/canvas-view";
import { SlideNavigator } from "@/components/canvas/slide-navigator";
import { RightSidebar } from "@/components/canvas/right-sidebar";
import { Modals } from "@/components/canvas/modals";
import { PreviewModal } from "@/components/canvas/preview-modal";
import {
  SlideData,
  initialSlides,
} from "@/components/canvas/types";
import type { NavId } from "@/components/canvas/left-sidebar";
import { useCanvasStore } from "@/store/useCanvasStore";

export default function CarouselStudio() {
  const [activeNav, setActiveNav] = useState<NavId>("templates");

  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showDotGrid, setShowDotGrid] = useState(true);
  const [projectName, setProjectName] = useState("Untitled Carousel");

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSlideId, setPreviewSlideId] = useState<number>(0);

  const [padding, setPadding] = useState(32);
  const [borderRadius, setBorderRadius] = useState(16);
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">("sans");

  const activeSlide = slides[currentIdx] || slides[0];

  const updateSlideField = <K extends keyof SlideData>(
    field: K,
    value: SlideData[K],
  ) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === currentIdx ? { ...s, [field]: value } : s)),
    );
  };

  const addSlide = () => {
    const newSlide: SlideData = {
      id: Date.now(),
      title: `Slide 0${slides.length + 1}`,
      subtitle: "Add your supporting details here...",
      align: "left",
      badgeText: `0${slides.length + 1}/0${slides.length + 1}`,
      elements: [],
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentIdx(slides.length);
  };

  const duplicateSlide = () => {
    const clone: SlideData = {
      ...activeSlide,
      id: Date.now(),
      title: `${activeSlide.title} (Copy)`,
      elements: [...activeSlide.elements],
    };
    const updated = [...slides];
    updated.splice(currentIdx + 1, 0, clone);
    setSlides(updated);
    setCurrentIdx(currentIdx + 1);
  };

  const removeSlide = () => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, idx) => idx !== currentIdx);
    setSlides(updated);
    setCurrentIdx(Math.max(0, currentIdx - 1));
  };

  const moveSlide = (direction: "up" | "down") => {
    const targetIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(currentIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setSlides(updated);
    setCurrentIdx(targetIdx);
  };




  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground font-sans overflow-hidden select-none">
      <Header
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onShare={() => setShowShareModal(true)}
        onExport={() => setShowExportModal(true)}
      />

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
            duplicateSlide={duplicateSlide}
            removeSlide={removeSlide}
            slidesCount={slides.length}
            onPreview={() => {
              const storeCurrentId = useCanvasStore.getState().currentSlideId;
              setPreviewSlideId(storeCurrentId);
              setShowPreviewModal(true);
            }}
          />

          <CanvasView />

          <SlideNavigator
            slides={slides}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            addSlide={addSlide}
            moveSlide={moveSlide}
          />
        </main>

        <RightSidebar
          activeSlide={activeSlide}
          updateSlideField={updateSlideField}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          padding={padding}
          setPadding={setPadding}
          borderRadius={borderRadius}
          setBorderRadius={setBorderRadius}
          isRightCollapsed={isRightCollapsed}
          setIsRightCollapsed={setIsRightCollapsed}
        />
      </div>

      <Modals
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
      />

      <PreviewModal
        open={showPreviewModal}
        initialSlideId={previewSlideId}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
