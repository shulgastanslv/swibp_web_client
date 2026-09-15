"use client";

import { Header } from "@/components/header";
import { RightToolbar } from "@/components/canvas/right-sidebar.tsx/sidebar";
import { LeftSidebar } from "@/components/canvas/left-sidebar.tsx/sidebar";
import { useEffect, useRef, useState } from "react";
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
    handleImageUpload,
  } = useCanvas();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 flex-1 relative">
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
          <CanvasWrapper canvasRef={canvasRef} containerRef={containerRef} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <SliderNavigator />
          </div>
        </main>

        <div className="flex flex-col items-center justify-between m-4">
          <Toolbar handleImageUpload={handleImageUpload} />
          <ScaleToolbar scale={10} onZoomIn={() => {}} onZoomOut={() => {}} />
        </div>

        <RightToolbar />
      </div>
    </div>
  );
}
