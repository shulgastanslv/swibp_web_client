"use client";

import { useState } from "react";
import {
  AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  Lock, Unlock, Plus,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";
import { cn } from "@/lib/utils";

interface ObjectProperties {
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  opacity: number;
  cornerRadius: number;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right";
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWidth: number;
  locked: boolean;
  visible: boolean;
}

const PRESET_COLORS = [
  "#8b5cf6", "#a78bfa", "#c4b5fd", "#1e1e2e", "#2a2a3e",
  "#3a3a4e", "#ffffff", "#000000", "#ef4444", "#22c55e",
];

function IconButton({
  active,
  onClick,
  children,
  className
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-md text-xs transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm" // Using standard primary colors
          : "bg-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200",
        className
      )}
    >
      {children}
    </button>
  );
}

function LabeledInput({
  label, value, onChange, suffix, type = "text"
}: {
  label?: string;
  value: string | number;
  onChange: (val: string) => void;
  suffix?: string;
  type?: string;
}) {
  return (
    <div className="relative flex items-center group">
      {label && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-500 uppercase pointer-events-none z-10">
          {label}
        </span>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 text-zinc-200 text-xs font-mono pl-8 pr-8 bg-zinc-900 border-zinc-800 focus-visible:border-primary/50 focus-visible:ring-primary/20",
          !label && "pl-2"
        )}
      />
      {suffix && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function ObjectPropertiesPanel() {
  const [props, setProps] = useState<ObjectProperties>({
    x: 3411, y: 4179, rotation: 0, width: 9, height: 15,
    opacity: 100, cornerRadius: 0, fontFamily: "Inter", fontWeight: "Regular",
    fontSize: 12, lineHeight: 150, letterSpacing: 0, textAlign: "left",
    fillColor: "#8b5cf6", fillOpacity: 100, strokeColor: "#ffffff",
    strokeWidth: 0, locked: false, visible: true,
  });

  const update = <K extends keyof ObjectProperties>(key: K, value: ObjectProperties[K]) =>
    setProps((p) => ({ ...p, [key]: value }));

  return (
    <div className="w-full bg-sidebar h-full overflow-y-auto">

      <div className="flex flex-col">

        <CollapsibleGroup id="position" title="Position">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex gap-1 bg-muted/50 rounded-md">
              <IconButton active={false}><AlignLeft className="w-3.5 h-3.5" /></IconButton>
              <IconButton active={false}><AlignCenter className="w-3.5 h-3.5" /></IconButton>
              <IconButton active={false}><AlignRight className="w-3.5 h-3.5" /></IconButton>
            </div>
            <div className="flex gap-1 bg-muted/50 rounded-md">
              <IconButton active={false}><AlignStartVertical className="w-3.5 h-3.5" /></IconButton>
              <IconButton active={false}><AlignCenterVertical className="w-3.5 h-3.5" /></IconButton>
              <IconButton active={false}><AlignEndVertical className="w-3.5 h-3.5" /></IconButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-muted/50 rounded-md">
            <LabeledInput label="X" value={props.x} onChange={(v) => update("x", Number(v))} />
            <LabeledInput label="Y" value={props.y} onChange={(v) => update("y", Number(v))} />
          </div>

          <div className="flex gap-2 mt-2 ">
             <div className="flex-1">
                <LabeledInput value={props.rotation} onChange={(v) => update("rotation", Number(v))} suffix="°" />
             </div>
             <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white",
                  props.locked ? "text-primary border-primary/50" : "text-zinc-500"
                )}
                onClick={() => update("locked", !props.locked)}
             >
                {props.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
             </Button>
          </div>
        </CollapsibleGroup>
        <CollapsibleGroup id="layout" title="Layout">
          <div className="flex gap-1 mb-3 ">
             <IconButton>H</IconButton>
             <IconButton>V</IconButton>
             <IconButton>G</IconButton>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <LabeledInput label="W" value={props.width} onChange={(v) => update("width", Number(v))} />
            <LabeledInput label="H" value={props.height} onChange={(v) => update("height", Number(v))} />
          </div>
        </CollapsibleGroup>
        <CollapsibleGroup id="appearance" title="Appearance">
          <div className="space-y-4">
            <div className="space-y-2">
               <div className="flex justify-between text-xs text-zinc-500">
                 <span>Opacity</span>
                 <span>{props.opacity}%</span>
               </div>
               <Slider
                 value={[props.opacity]}
                 max={100}
                 step={1}
                 onValueChange={([v]) => update("opacity", v)}
                 className="py-1"
               />
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs text-zinc-500">
                 <span>Corner Radius</span>
                 <span>{props.cornerRadius}px</span>
               </div>
               <Slider
                 value={[props.cornerRadius]}
                 max={50}
                 step={1}
                 onValueChange={([v]) => update("cornerRadius", v)}
                 className="py-1"
               />
            </div>
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup id="typography" title="Typography">
          <div className="space-y-3">
            <Select value={props.fontFamily} onValueChange={(v) => update("fontFamily", v)}>
              <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-xs text-zinc-200 focus:ring-primary/50">
                <SelectValue placeholder="Font Family" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                {["Inter", "Roboto", "Poppins", "DM Sans"].map((f) => (
                  <SelectItem key={f} value={f} className="text-xs focus:bg-zinc-800 focus:text-white">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Select value={props.fontWeight} onValueChange={(v) => update("fontWeight", v)}>
                <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-xs text-zinc-200 focus:ring-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                  {["Regular", "Medium", "Bold"].map((w) => (
                    <SelectItem key={w} value={w} className="text-xs focus:bg-zinc-800">{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <LabeledInput value={props.fontSize} onChange={(v) => update("fontSize", Number(v))} suffix="px" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <LabeledInput label="LH" value={props.lineHeight} onChange={(v) => update("lineHeight", Number(v))} suffix="%" />
              <LabeledInput label="LS" value={props.letterSpacing} onChange={(v) => update("letterSpacing", Number(v))} suffix="%" />
            </div>

            <div className="flex gap-1 pt-1 border-t border-white/5">
              <IconButton active={props.textAlign === "left"} onClick={() => update("textAlign", "left")}><AlignLeft className="w-3.5 h-3.5" /></IconButton>
              <IconButton active={props.textAlign === "center"} onClick={() => update("textAlign", "center")}><AlignCenter className="w-3.5 h-3.5" /></IconButton>
              <IconButton active={props.textAlign === "right"} onClick={() => update("textAlign", "right")}><AlignRight className="w-3.5 h-3.5" /></IconButton>
            </div>
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup id="fill" title="Fill">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => update("fillColor", color)}
                  className={cn(
                    "w-6 h-6 rounded-md border transition-transform hover:scale-110",
                    props.fillColor.toLowerCase() === color.toLowerCase()
                      ? "border-primary ring-1 ring-primary/50 scale-110"
                      : "border-zinc-700"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              <button className="w-6 h-6 rounded-md border border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-400">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                 <div
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-zinc-700"
                    style={{ backgroundColor: props.fillColor }}
                 />
                 <Input
                    value={props.fillColor.replace("#", "")}
                    onChange={(e) => update("fillColor", `#${e.target.value}`)}
                    className="h-8 bg-zinc-900 border-zinc-800 text-xs font-mono pl-8 text-zinc-200 focus-visible:ring-primary/50"
                 />
              </div>
              <div className="w-16">
                <LabeledInput value={props.fillOpacity} onChange={(v) => update("fillOpacity", Number(v))} suffix="%" />
              </div>
            </div>
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup id="stroke" title="Stroke">
           <div className="space-y-3">
              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-zinc-500">
                   <span>Width</span>
                   <span>{props.strokeWidth}px</span>
                 </div>
                 <Slider
                   value={[props.strokeWidth]}
                   max={20}
                   step={1}
                   onValueChange={([v]) => update("strokeWidth", v)}
                 />
              </div>

              <div className="flex gap-2">
                 <div className="flex-1 relative">
                    <div
                       className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-zinc-700"
                       style={{ backgroundColor: props.strokeColor }}
                    />
                    <Input
                       value={props.strokeColor.replace("#", "")}
                       onChange={(e) => update("strokeColor", `#${e.target.value}`)}
                       className="h-8 bg-zinc-900 border-zinc-800 text-xs font-mono pl-8 text-zinc-200 focus-visible:ring-primary/50"
                    />
                 </div>
              </div>
           </div>
        </CollapsibleGroup>

        <CollapsibleGroup id="effects" title="Effects">
           <div className="text-center py-4 text-xs text-zinc-600 italic">
              No effects applied
           </div>
        </CollapsibleGroup>

      </div>
    </div>
  );
}
