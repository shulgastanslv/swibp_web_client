"use client";

import { FileJson, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/useCanvas";
import { ObjectsPropertiesPanel } from "./object-properties";
import { CanvasPropertiesPanel } from "./canvas-properties";

export function RightToolbar() {
  const { selectedObject, exportToJSON } = useCanvas();
  const isObjectSelected = !!selectedObject;

  const handleExportToJSON = () => {
    const json = exportToJSON();
    navigator.clipboard.writeText(json);
  };

  return (
    <aside className="w-72 shrink-0 h-full overflow-y-auto bg-sidebar border-l flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0 bg-muted/50">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {isObjectSelected ? "Object" : "Canvas"}
        </span>

        <div className="flex items-center gap-1">
          {!isObjectSelected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToJSON}
              className="h-7 text-[11px] gap-1.5 px-2.5"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>JSON</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <PanelRightClose className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isObjectSelected ? (
        <ObjectsPropertiesPanel selectedObject={selectedObject} />
      ) : (
        <CanvasPropertiesPanel />
      )}

    </aside>
  );
}
