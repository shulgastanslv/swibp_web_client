"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  BringToFront,
  SendToBack,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  PanelRightClose,
  PanelRightOpen,
  MousePointerClick,
  Image as ImageIcon,
  Upload,
  RotateCw,
} from "lucide-react";
import { useSelectedObject } from "@/hooks/use-selected-object";
import {
  FabricImage,
  type FabricObject,
  type FabricText,
  Rect,
  Shadow as FabricShadow,
} from "fabric";
import { useCanvasManager } from "@/context/canvas-manager";

type TextAlign = "left" | "center" | "right" | "justify";

interface RightSidebarProps {
  isRightCollapsed: boolean;
  setIsRightCollapsed: (v: boolean) => void;
}

interface InspectedProperties {
  type: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  padding: number;
  angle: number;
  width: number;
  height: number;
  rx?: number;
  // Image properties
  src?: string;
  // Text properties
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  textAlign?: TextAlign;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  backgroundColor?: string;
  // Shadow
  hasShadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export function RightSidebar({
  isRightCollapsed,
  setIsRightCollapsed,
}: RightSidebarProps) {
  const { selectedObject, updateSelected } = useSelectedObject();
  const manager = useCanvasManager();
  const [formValues, setFormValues] = useState<InspectedProperties | null>(
    null,
  );
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedObject) {
      setFormValues(null);
      setImageUrlInput("");
      return;
    }

    const type = selectedObject.type ?? "object";
    const rawFill = selectedObject.fill;
    const fill = typeof rawFill === "string" ? rawFill : "#000000";

    const rawStroke = selectedObject.stroke;
    const stroke = typeof rawStroke === "string" ? rawStroke : "#000000";

    const strokeWidth = selectedObject.strokeWidth ?? 0;
    const opacity = selectedObject.opacity ?? 1;
    const padding = selectedObject.padding ?? 0;
    const angle = Math.round(selectedObject.angle ?? 0);
    const width = Math.round(
      (selectedObject.width ?? 0) * (selectedObject.scaleX ?? 1),
    );
    const height = Math.round(
      (selectedObject.height ?? 0) * (selectedObject.scaleY ?? 1),
    );

    const shadow = selectedObject.shadow as FabricShadow | null;

    const baseProps: InspectedProperties = {
      type,
      fill,
      stroke,
      strokeWidth,
      opacity,
      padding,
      angle,
      width,
      height,
      hasShadow: !!shadow,
      shadowColor: shadow?.color ?? "#00000040",
      shadowBlur: shadow?.blur ?? 12,
      shadowOffsetX: shadow?.offsetX ?? 0,
      shadowOffsetY: shadow?.offsetY ?? 8,
    };

    if (type === "text" || type === "i-text" || type === "textbox") {
      const textObj = selectedObject as unknown as FabricText;
      baseProps.text = textObj.text ?? "";
      baseProps.fontSize = textObj.fontSize ?? 32;
      baseProps.lineHeight = textObj.lineHeight ?? 1.16;
      baseProps.textAlign = (textObj.textAlign as TextAlign) ?? "left";
      baseProps.isBold =
        textObj.fontWeight === "bold" || Number(textObj.fontWeight) >= 700;
      baseProps.isItalic = textObj.fontStyle === "italic";
      baseProps.isUnderline = !textObj.underline;
      baseProps.backgroundColor =
        typeof textObj.backgroundColor === "string"
          ? textObj.backgroundColor
          : "transparent";
    }

    if (type === "rect") {
      const rectObj = selectedObject as unknown as Rect;
      baseProps.rx = rectObj.rx ?? 0;
    }

    if (type === "image") {
      const imgObj = selectedObject as unknown as FabricImage;
      const currentSrc = imgObj.getSrc ? imgObj.getSrc() : "";
      baseProps.src = currentSrc;
      setImageUrlInput(currentSrc);
      baseProps.rx = (imgObj as unknown as { rx?: number }).rx ?? 0;
    }

    setFormValues(baseProps);
  }, [selectedObject]);

  const canvas = manager?.canvas;

  const updateProp = (
    key: keyof InspectedProperties,
    value: unknown,
    fabricKey: string = key,
  ) => {
    setFormValues((prev) => (prev ? { ...prev, [key]: value } : null));
    updateSelected({
      [fabricKey]: value,
    } as unknown as Partial<FabricObject>);
  };

  const updateCornerRadius = (radius: number) => {
    if (!selectedObject || !canvas) return;

    setFormValues((prev) => (prev ? { ...prev, rx: radius } : null));

    if (selectedObject.type === "rect") {
      updateSelected({
        rx: radius,
        ry: radius,
      } as unknown as Partial<FabricObject>);
    } else if (selectedObject.type === "image") {
      const img = selectedObject as FabricImage;

      // Use .set() instead of direct property assignment:
      img.set("rx" as keyof FabricImage, radius);

      if (radius > 0) {
        const clipRect = new Rect({
          width: img.width,
          height: img.height,
          rx: radius,
          ry: radius,
          originX: "center",
          originY: "center",
        });
        img.set({ clipPath: clipRect });
      } else {
        img.set({ clipPath: undefined });
      }
      canvas.requestRenderAll();
      canvas.fire("object:modified");
    }
  };

  const toggleShadow = (enable: boolean) => {
    if (!selectedObject || !canvas || !formValues) return;

    if (enable) {
      const shadow = new FabricShadow({
        color: formValues.shadowColor,
        blur: formValues.shadowBlur,
        offsetX: formValues.shadowOffsetX,
        offsetY: formValues.shadowOffsetY,
      });
      selectedObject.set({ shadow });
    } else {
      selectedObject.set({ shadow: null });
    }

    setFormValues((prev) => (prev ? { ...prev, hasShadow: enable } : null));
    canvas.requestRenderAll();
    canvas.fire("object:modified");
  };

  const updateShadowProp = (
    key: "shadowColor" | "shadowBlur" | "shadowOffsetX" | "shadowOffsetY",
    val: unknown,
  ) => {
    if (!selectedObject || !canvas || !formValues) return;

    const nextValues = { ...formValues, [key]: val };
    setFormValues(nextValues);

    if (nextValues.hasShadow) {
      const shadow = new FabricShadow({
        color: nextValues.shadowColor,
        blur: nextValues.shadowBlur,
        offsetX: nextValues.shadowOffsetX,
        offsetY: nextValues.shadowOffsetY,
      });
      selectedObject.set({ shadow });
      canvas.requestRenderAll();
      canvas.fire("object:modified");
    }
  };

  const changeImageSource = (newSrc: string) => {
    if (!selectedObject || selectedObject.type !== "image" || !canvas) return;

    const imgObj = selectedObject as unknown as FabricImage;
    if (typeof imgObj.setSrc === "function") {
      imgObj.setSrc(newSrc, { crossOrigin: "anonymous" }).then(() => {
        imgObj.setCoords();
        canvas.requestRenderAll();
        canvas.fire("object:modified");
        setFormValues((prev) => (prev ? { ...prev, src: newSrc } : null));
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        changeImageSource(dataUrl);
        setImageUrlInput("");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCenterH = () => {
    const active = canvas?.getActiveObject();
    if (active && canvas) {
      canvas.centerObjectH(active);
      active.setCoords();
      canvas.requestRenderAll();
      manager?.commit();
    }
  };

  const handleCenterV = () => {
    const active = canvas?.getActiveObject();
    if (active && canvas) {
      canvas.centerObjectV(active);
      active.setCoords();
      canvas.requestRenderAll();
      manager?.commit();
    }
  };

  const handleBringForward = () => {
    const active = canvas?.getActiveObject();
    if (active && canvas) {
      canvas.bringObjectForward(active);
      canvas.requestRenderAll();
      manager?.commit();
    }
  };

  const handleSendBackwards = () => {
    const active = canvas?.getActiveObject();
    if (active && canvas) {
      canvas.sendObjectBackwards(active);
      canvas.requestRenderAll();
      manager?.commit();
    }
  };

  const isText =
    formValues?.type === "text" ||
    formValues?.type === "i-text" ||
    formValues?.type === "textbox";

  const isRect = formValues?.type === "rect";
  const isImage = formValues?.type === "image";
  const canHaveRadius = isRect || isImage;

  const alignIcons: Record<TextAlign, React.ElementType> = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify,
  };

  return (
    <div className="flex h-full bg-background border-l border-border overflow-y-scroll relative">
      <div
        className={`flex flex-col transition-all duration-200 ease-in-out overflow-y-scroll ${
          isRightCollapsed ? "w-0 opacity-0" : "w-64 opacity-100 p-4"
        }`}
      >
        <div className="h-8 flex items-center justify-between px-1 border-b border-border/40 mb-3">
          <span className="text-xs font-semibold tracking-tight uppercase">
            {formValues ? formValues.type : "Свойства"}
          </span>
        </div>

        <ScrollArea className="flex-1 pr-1">
          {!formValues ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
              <MousePointerClick className="w-6 h-6 stroke-[1.5] text-muted-foreground/60" />
              <p className="text-xs">
                Выберите объект на холсте для редактирования
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xs">
              {/* ── Геометрия: Размеры и Угол ── */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    W (px)
                  </span>
                  <Input
                    type="number"
                    value={formValues.width}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormValues((p) => (p ? { ...p, width: val } : null));
                      if (selectedObject) {
                        selectedObject.scaleToWidth(val);
                        canvas?.requestRenderAll();
                      }
                    }}
                    className="h-7 text-xs px-2 font-mono bg-muted/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    H (px)
                  </span>
                  <Input
                    type="number"
                    value={formValues.height}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormValues((p) => (p ? { ...p, height: val } : null));
                      if (selectedObject) {
                        selectedObject.scaleToHeight(val);
                        canvas?.requestRenderAll();
                      }
                    }}
                    className="h-7 text-xs px-2 font-mono bg-muted/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5">
                    <RotateCw className="w-2.5 h-2.5" /> Угол
                  </span>
                  <Input
                    type="number"
                    value={formValues.angle}
                    onChange={(e) =>
                      updateProp("angle", Number(e.target.value))
                    }
                    className="h-7 text-xs px-2 font-mono bg-muted/20"
                  />
                </div>
              </div>

              {/* ── Настройки картинки ── */}
              {isImage && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-border/40">
                  <label className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Замена изображения
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-center gap-2 h-8 rounded-xl text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Загрузить файл
                  </Button>

                  <div className="flex gap-1.5">
                    <Input
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="h-8 text-xs rounded-xl px-2.5 bg-muted/30 border-border/60"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && imageUrlInput.trim()) {
                          changeImageSource(imageUrlInput.trim());
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 px-2.5 rounded-xl text-xs"
                      disabled={!imageUrlInput.trim()}
                      onClick={() => changeImageSource(imageUrlInput.trim())}
                    >
                      ОК
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Текстовые поля ── */}
              {isText && (
                <>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                    <label className="text-muted-foreground font-medium">
                      Текст
                    </label>
                    <textarea
                      rows={2}
                      value={formValues.text ?? ""}
                      onChange={(e) => updateProp("text", e.target.value)}
                      className="p-2 rounded-xl bg-muted/30 text-xs text-foreground focus:outline-none border border-border/50 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-medium">
                      Стиль текста
                    </label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant={formValues.isBold ? "secondary" : "outline"}
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => {
                          const next = !formValues.isBold;
                          updateProp("isBold", next, "fontWeight");
                          updateSelected({
                            fontWeight: next ? "bold" : "normal",
                          } as unknown as Partial<FabricObject>);
                        }}
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant={formValues.isItalic ? "secondary" : "outline"}
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => {
                          const next = !formValues.isItalic;
                          updateProp("isItalic", next, "fontStyle");
                          updateSelected({
                            fontStyle: next ? "italic" : "normal",
                          } as unknown as Partial<FabricObject>);
                        }}
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant={
                          formValues.isUnderline ? "secondary" : "outline"
                        }
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => {
                          const next = !formValues.isUnderline;
                          updateProp("isUnderline", next, "underline");
                        }}
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span className="font-medium">Размер текста</span>
                      <span className="font-mono">
                        {Math.round(formValues.fontSize ?? 32)}px
                      </span>
                    </div>
                    <Slider
                      value={[formValues.fontSize ?? 32]}
                      onValueChange={([val]) =>
                        updateProp("fontSize", val ?? 32)
                      }
                      min={10}
                      max={140}
                      step={1}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span className="font-medium">Межстрочный интервал</span>
                      <span className="font-mono">
                        {(formValues.lineHeight ?? 1.16).toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[(formValues.lineHeight ?? 1.16) * 100]}
                      onValueChange={([val]) =>
                        updateProp("lineHeight", (val ?? 116) / 100)
                      }
                      min={80}
                      max={250}
                      step={5}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-medium">
                      Выравнивание
                    </label>
                    <div className="flex bg-muted/40 rounded-xl p-0.5 border border-border/40">
                      {(["left", "center", "right", "justify"] as const).map(
                        (align) => {
                          const Icon = alignIcons[align];
                          return (
                            <button
                              key={align}
                              type="button"
                              onClick={() => updateProp("textAlign", align)}
                              className={`flex-1 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                formValues.textAlign === align
                                  ? "bg-background text-foreground font-medium border border-border/60 shadow-2xs"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Цвета (Заливка и Фон) ── */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                {!isImage && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-muted-foreground">
                      Цвет {isText ? "текста" : "заливки"}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formValues.fill}
                        onChange={(e) => updateProp("fill", e.target.value)}
                        className="w-6 h-6 rounded-md cursor-pointer border border-border/60 bg-transparent p-0"
                      />
                      <span className="font-mono text-[11px] text-muted-foreground uppercase">
                        {formValues.fill}
                      </span>
                    </div>
                  </div>
                )}

                {isText && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-muted-foreground">
                      Фон текста
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={
                          formValues.backgroundColor === "transparent"
                            ? "#ffffff"
                            : formValues.backgroundColor
                        }
                        onChange={(e) =>
                          updateProp("backgroundColor", e.target.value)
                        }
                        className="w-6 h-6 rounded-md cursor-pointer border border-border/60 bg-transparent p-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-[10px]"
                        onClick={() =>
                          updateProp("backgroundColor", "transparent")
                        }
                      >
                        Сброс
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Обводка ── */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">
                    Обводка
                  </span>
                  <input
                    type="color"
                    value={formValues.stroke}
                    onChange={(e) => updateProp("stroke", e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer border border-border/60 bg-transparent p-0"
                  />
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Толщина обводки</span>
                  <span className="font-mono">
                    {Math.round(formValues.strokeWidth)}px
                  </span>
                </div>
                <Slider
                  value={[formValues.strokeWidth]}
                  onValueChange={([val]) => updateProp("strokeWidth", val ?? 0)}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>

              {/* ── Скругление углов (Border Radius) ── */}
              {canHaveRadius && (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="font-medium">
                      Border Radius (скругление)
                    </span>
                    <span className="font-mono">
                      {Math.round(formValues.rx ?? 0)}px
                    </span>
                  </div>
                  <Slider
                    value={[formValues.rx ?? 0]}
                    onValueChange={([val]) => updateCornerRadius(val ?? 0)}
                    min={0}
                    max={120}
                    step={1}
                  />
                </div>
              )}

              {/* ── Внутренний отступ (Padding) ── */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <div className="flex justify-between text-muted-foreground">
                  <span className="font-medium">
                    Внутренний отступ (Padding)
                  </span>
                  <span className="font-mono">
                    {Math.round(formValues.padding)}px
                  </span>
                </div>
                <Slider
                  value={[formValues.padding]}
                  onValueChange={([val]) => updateProp("padding", val ?? 0)}
                  min={0}
                  max={60}
                  step={1}
                />
              </div>

              {/* ── Тень (Drop Shadow) ── */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                    Тень
                  </span>
                  <input
                    type="checkbox"
                    checked={formValues.hasShadow}
                    onChange={(e) => toggleShadow(e.target.checked)}
                    className="rounded border-border accent-primary cursor-pointer"
                  />
                </div>

                {formValues.hasShadow && (
                  <div className="flex flex-col gap-2 mt-1 bg-muted/20 p-2 rounded-xl border border-border/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Цвет тени
                      </span>
                      <input
                        type="color"
                        value={formValues.shadowColor.slice(0, 7)}
                        onChange={(e) =>
                          updateShadowProp("shadowColor", e.target.value)
                        }
                        className="w-5 h-5 rounded cursor-pointer border border-border/60 bg-transparent p-0"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Размытие (Blur)</span>
                      <span className="font-mono">
                        {formValues.shadowBlur}px
                      </span>
                    </div>
                    <Slider
                      value={[formValues.shadowBlur]}
                      onValueChange={([val]) =>
                        updateShadowProp("shadowBlur", val ?? 0)
                      }
                      min={0}
                      max={50}
                      step={1}
                    />

                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Смещение Y</span>
                      <span className="font-mono">
                        {formValues.shadowOffsetY}px
                      </span>
                    </div>
                    <Slider
                      value={[formValues.shadowOffsetY]}
                      onValueChange={([val]) =>
                        updateShadowProp("shadowOffsetY", val ?? 0)
                      }
                      min={-30}
                      max={50}
                      step={1}
                    />
                  </div>
                )}
              </div>

              {/* ── Непрозрачность (Opacity) ── */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <div className="flex justify-between text-muted-foreground">
                  <span className="font-medium">Непрозрачность</span>
                  <span className="font-mono">
                    {Math.round(formValues.opacity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[formValues.opacity * 100]}
                  onValueChange={([val]) =>
                    updateProp("opacity", (val ?? 100) / 100)
                  }
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              {/* ── Позиционирование и слои ── */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                <label className="text-muted-foreground font-medium">
                  Положение на холсте
                </label>
                <div className="flex flex-row gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleCenterH}
                    title="Выровнять по центру горизонтально"
                  >
                    <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleCenterV}
                    title="Выровнять по центру вертикально"
                  >
                    <AlignVerticalDistributeCenter className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleBringForward}
                    title="На слой выше"
                  >
                    <BringToFront className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleSendBackwards}
                    title="На слой ниже"
                  >
                    <SendToBack className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <aside className="w-10 flex flex-col items-center justify-start py-3 border-l border-border/50 bg-muted/20">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          title={isRightCollapsed ? "Развернуть панель" : "Свернуть панель"}
        >
          {isRightCollapsed ? (
            <PanelRightOpen className="w-4 h-4" />
          ) : (
            <PanelRightClose className="w-4 h-4" />
          )}
        </Button>
      </aside>
    </div>
  );
}
