"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HexColorPicker } from "react-colorful";
import type { BackgroundConfig } from "@/lib/canvas/types";

import { SOLID_PRESETS, GRADIENT_PRESETS } from "@/lib/canvas/presets";

interface BackgroundPanelProps {
  onBackgroundChange: (config: BackgroundConfig) => void;
}

export function BackgroundPanel({ onBackgroundChange }: BackgroundPanelProps) {
  const [selectedColor, setSelectedColor] = useState("#000000");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onBackgroundChange({ type: "image", url });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onBackgroundChange({ type: "solid", color });
  };

  return (
    <div className="w-full overflow-y-auto font-sans">
      <Tabs defaultValue="gradient" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="solid" className="text-xs">
            Color
          </TabsTrigger>
          <TabsTrigger value="gradient" className="text-xs">
            Gradient
          </TabsTrigger>
          <TabsTrigger value="image" className="text-xs">
            Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solid" className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Custom Color
            </Label>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg overflow-hidden border border-border">
                <HexColorPicker
                  color={selectedColor}
                  onChange={handleColorChange}
                  style={{ height: "125px", width: "100%" }}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 text-xs"
                  placeholder="#000000"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-border"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Presets
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {SOLID_PRESETS.map((preset, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="icon"
                  className="w-full aspect-square rounded-lg border border-border hover:border-primary transition-all active:scale-95"
                  style={{ backgroundColor: preset.color }}
                  onClick={() => onBackgroundChange(preset)}
                />
              ))}
            </div>
          </div>

          <Separator />


        </TabsContent>

        <TabsContent value="gradient" className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Presets
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {GRADIENT_PRESETS.map((preset, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="icon"
                  className="w-full aspect-square rounded-lg border border-border hover:border-primary transition-all active:scale-95 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${preset.colors?.[0]}, ${preset.colors?.[1]})`,
                  }}
                  onClick={() => onBackgroundChange(preset)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Upload Image
            </Label>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 cursor-pointer bg-muted/30 transition-colors">
                <span className="text-xs text-primary mb-1">
                  Выберите файл или перетащите
                </span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG, WEBP
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
