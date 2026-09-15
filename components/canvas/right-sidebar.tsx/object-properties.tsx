"use client";

import React from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Palette, Move, RotateCw, Eye } from "lucide-react";
import { Object as FabricObject } from "fabric";

interface ObjectsPropertiesProps {
  selectedObject: FabricObject;
}

export function ObjectsPropertiesPanel({
  selectedObject,
}: ObjectsPropertiesProps) {
  const { handleUpdateObject, handleDelete } = useCanvas();

  // Безопасное получение цвета
  const getSafeColor = (
    color: FabricObject["fill"] | FabricObject["stroke"],
    defaultColor: string,
  ): string => {
    if (typeof color === "string") return color;
    return defaultColor;
  };

  const fill = getSafeColor(selectedObject.fill, "#000000");
  const stroke = getSafeColor(selectedObject.stroke, "#000000");

  const strokeWidth = selectedObject.strokeWidth ?? 0;
  const opacity = selectedObject.opacity ?? 1;
  const angle = Math.round(selectedObject.angle ?? 0);
  const scale = selectedObject.scaleX ?? 1;

  const update = (key: keyof FabricObject, value: string | number) => {
    handleUpdateObject({ [key]: value });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Шапка: Название и Кнопка удаления */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="default"
          onClick={handleDelete}
          className="rounded-full"
          title="Delete object"
        >
          Delete
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" /> Fill Color
          </Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={fill.startsWith("#") ? fill : "#000000"}
              onChange={(e) => update("fill", e.target.value)}
              className="h-9 w-9 p-1 cursor-pointer shrink-0 border-border rounded-full bg-background"
            />
            <Input
              type="text"
              value={fill}
              onChange={(e) => update("fill", e.target.value)}
              className="h-9 font-mono text-xs bg-muted/30 border-transparent rounded-full focus-visible:border-primary focus-visible:bg-background transition-colors"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Stroke Color */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3.5 h-3.5" /> Stroke Color
          </Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={stroke.startsWith("#") ? stroke : "#000000"}
              onChange={(e) => update("stroke", e.target.value)}
              className="h-9 w-9 p-1 cursor-pointer shrink-0 border-border rounded-full bg-background"
            />
            <Input
              type="text"
              value={stroke}
              onChange={(e) => update("stroke", e.target.value)}
              className="h-9 font-mono text-xs bg-muted/30 border-transparent rounded-full focus-visible:border-primary focus-visible:bg-background transition-colors"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Stroke Width (только если есть обводка) */}
        {strokeWidth >= 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Stroke Width
              </Label>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {strokeWidth}px
              </span>
            </div>
            <Slider
              min={0}
              max={20}
              step={1}
              value={[strokeWidth]}
              onValueChange={([val]) => update("strokeWidth", val)}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
      <Separator />
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Move className="w-3.5 h-3.5" /> Scale
            </Label>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {Math.round(scale * 100)}%
            </span>
          </div>
          <Slider
            min={0.1}
            max={3}
            step={0.1}
            value={[scale]}
            onValueChange={([val]) =>
              handleUpdateObject({ scaleX: val, scaleY: val })
            }
            className="cursor-pointer"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5" /> Rotation
            </Label>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {angle}°
            </span>
          </div>
          <Slider
            min={0}
            max={360}
            step={1}
            value={[angle]}
            onValueChange={([val]) => update("angle", val)}
            className="cursor-pointer"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" /> Opacity
            </Label>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[opacity]}
            onValueChange={([val]) => update("opacity", val)}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
