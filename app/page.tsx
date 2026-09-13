// src/app/page.tsx
"use client";

import { Header } from "@/components/header";
import { RightToolbar } from "@/components/canvas/right-sidebar.tsx/sidebar";
import { LeftSidebar } from "@/components/canvas/left-sidebar.tsx/sidebar";
import { useState } from "react";
import { SliderNavigator } from "@/components/canvas/slide-navigator";
import { Toolbar } from "@/components/canvas/toolbar";
import { useCanvas } from "@/hooks/useCanvas";
import CanvasWrapper from "@/components/canvas/wrapper";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";
import { ScaleToolbar } from "@/components/canvas/scale-toolbar";

export default function Home() {
  const {
    canvasRef,
    containerRef,
    managerRef,
    activeTool,
    currentRatio,
    handleRatioChange,
    setActiveTool,
    handleDelete,
    handleDuplicate,
    handleUpdateObject,
    selectedObject,
    canvasDimensions,
    clearCanvas,
    exportToJSON,
    handlePixabaySelect,
    handleToggleGrid,
    isGridVisible,
    handleBackgroundChange,
    handleImageUpload,
    slides,
    currentSlide,
    switchToSlide,
    handleAddSlide,
    handleRemoveSlide,
    handlePrev,
    exportAllSlides,
    handleNext,
  } = useCanvas();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onExportPNG={exportAllSlides} clearCanvas={clearCanvas} />

      <div className="flex min-h-0 flex-1 relative m-4">
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 rounded-xl"
            title="Show sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}

        <LeftSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
        />

        <main className="relative flex-1 flex items-center justify-center overflow-hidden">
          <CanvasWrapper
            canvasRef={canvasRef}
            containerRef={containerRef}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <SliderNavigator
              currentSlide={currentSlide}
              slides={slides}
              onSelect={switchToSlide}
              onAdd={handleAddSlide}
              onRemove={handleRemoveSlide}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </main>

        <div className="flex flex-col justify-between">
          <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onImageUpload={handleImageUpload}
          />
          <ScaleToolbar scale={10} onZoomIn={() => {}} onZoomOut={() => {}}/>
        </div>

        <RightToolbar
          selectedObject={selectedObject}
          handlePixabaySelect={handlePixabaySelect}
          currentRatio={currentRatio}
          exportToJSON={exportToJSON}
          onRatioChange={handleRatioChange}
          onBackgroundChange={handleBackgroundChange}
          onDeleteObject={handleDelete}
          onDuplicateObject={handleDuplicate}
          onUpdateObject={handleUpdateObject}
          onToggleGrid={handleToggleGrid}
          isGridVisible={isGridVisible}
        />
      </div>
    </div>
  );
}
