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
import { useSession } from "next-auth/react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;

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
  } = useCanvas();

  const handlePrev = () => setCurrentSlide((prev) => Math.max(1, prev - 1));
  const handleNext = () =>
    setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));

  const handleExportPNG = async () => {
    const manager = managerRef.current;
    if (!manager) return;

    const dataURL = await manager.exportAsImage({
      format: "png",
      multiplier: 2,
    });
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "carousel.png";
    a.click();
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col overflow-hidden ">
      <Header onExportPNG={handleExportPNG} clearCanvas={clearCanvas} />
      <div className="flex min-h-0 flex-1 relative mt-4">
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
        <main className="relative flex-1 flex items-center justify-center overflow-hidden ">
          <CanvasWrapper
            canvasRef={canvasRef}
            containerRef={containerRef}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <SliderNavigator
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onRemove={handlePrev}
              onAdd={handleNext}
              onSelect={(index) => setCurrentSlide(index)}
            />
          </div>
        </main>
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onImageUpload={handleImageUpload}
        />
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
