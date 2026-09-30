"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CollapsibleGroup } from "@/components/ui/collapsible-group";
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
  Upload,
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
  src?: string;
  text?: string;
  fontSize?: number;
  lineHeight?: number;
  textAlign?: TextAlign;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  backgroundColor?: string;
  hasShadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Shared shell for inspector fields — border only, fully rounded, no fill. */
const fieldShell =
  "flex items-center rounded-full bg-muted/40";

const btnRound = "rounded-full";

function normalizeHex(raw: string): string | null {
  let value = raw.trim();
  if (!value) return null;
  if (!value.startsWith("#")) value = `#${value}`;
  if (!HEX_RE.test(value)) return null;
  if (value.length === 4) {
    const [, r, g, b] = value;
    value = `#${r}${r}${g}${g}${b}${b}`;
  }
  return value.toLowerCase();
}

function toPickerHex(value: string): string {
  const normalized = normalizeHex(value.slice(0, 7));
  return normalized ?? "#000000";
}

function clampNumber(value: number, min?: number, max?: number): number {
  let next = value;
  if (min != null) next = Math.max(min, next);
  if (max != null) next = Math.min(max, next);
  return next;
}

function ColorField({
  label,
  value,
  onChange,
  trailing,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  trailing?: React.ReactNode;
}) {
  const display = value === "transparent" ? "" : value;
  const [draft, setDraft] = useState(display);

  useEffect(() => {
    setDraft(display);
  }, [display]);

  const commit = () => {
    if (!draft.trim()) return;
    const next = normalizeHex(draft);
    if (next) {
      onChange(next);
      setDraft(next);
    } else {
      setDraft(display);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className={`${fieldShell} h-9 gap-2 px-2`}>
        <input
          type="color"
          value={toPickerHex(value || "#000000")}
          onChange={(e) => {
            onChange(e.target.value);
            setDraft(e.target.value);
          }}
          className="size-6 shrink-0 cursor-pointer rounded-full border border-border bg-transparent p-0"
          title={label}
        />
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          placeholder="#000000"
          spellCheck={false}
          className="h-7 flex-1 border-0 bg-transparent px-1 font-mono text-xs uppercase shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        {trailing}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  decimals = 0,
  showSlider = true,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  decimals?: number;
  showSlider?: boolean;
}) {
  const format = (n: number) =>
    decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
  const [draft, setDraft] = useState(format(value));

  useEffect(() => {
    setDraft(format(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from external value only
  }, [value, decimals]);

  const commit = () => {
    const parsed = Number(draft.replace(",", "."));
    if (!Number.isFinite(parsed)) {
      setDraft(format(value));
      return;
    }
    const next = clampNumber(parsed, min, max);
    onChange(next);
    setDraft(format(next));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={`${fieldShell} h-8 w-[4.75rem] px-2`}>
          <Input
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="h-7 flex-1 border-0 bg-transparent px-0.5 text-right font-mono text-xs tabular-nums shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          {unit ? (
            <span className="shrink-0 pl-0.5 text-[10px] text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
      {showSlider && min != null && max != null ? (
        <Slider
          value={[clampNumber(value, min, max)]}
          onValueChange={([val]) => onChange(val ?? min)}
          min={min}
          max={max}
          step={step}
        />
      ) : null}
    </div>
  );
}

function DimInput({
  label,
  value,
  onChange,
  unit = "px",
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  unit?: string;
}) {
  const [draft, setDraft] = useState(String(Math.round(value)));

  useEffect(() => {
    setDraft(String(Math.round(value)));
  }, [value]);

  const commit = () => {
    const parsed = Number(draft.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0) {
      setDraft(String(Math.round(value)));
      return;
    }
    const next = Math.round(parsed);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className={`${fieldShell} h-9 px-3`}>
        <Input
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="h-7 flex-1 border-0 bg-transparent px-0.5 font-mono text-xs tabular-nums shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <span className="shrink-0 text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
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
    if (active && manager) {
      manager.grid.centerObject(active, "horizontal");
      manager.commit();
    }
  };

  const handleCenterV = () => {
    const active = canvas?.getActiveObject();
    if (active && manager) {
      manager.grid.centerObject(active, "vertical");
      manager.commit();
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

  const setWidth = (val: number) => {
    setFormValues((p) => (p ? { ...p, width: val } : null));
    if (selectedObject && val > 0) {
      selectedObject.scaleToWidth(val);
      canvas?.requestRenderAll();
      canvas?.fire("object:modified");
    }
  };

  const setHeight = (val: number) => {
    setFormValues((p) => (p ? { ...p, height: val } : null));
    if (selectedObject && val > 0) {
      selectedObject.scaleToHeight(val);
      canvas?.requestRenderAll();
      canvas?.fire("object:modified");
    }
  };

  const isText =
    formValues?.type === "text" ||
    formValues?.type === "i-text" ||
    formValues?.type === "textbox";

  const isRect = formValues?.type === "rect";
  const isImage = formValues?.type === "image";
  const canHaveRadius = isRect || isImage;

  const typeLabel: Record<string, string> = {
    rect: "Прямоугольник",
    circle: "Круг",
    triangle: "Треугольник",
    image: "Изображение",
    text: "Текст",
    "i-text": "Текст",
    textbox: "Текст",
    path: "Фигура",
    group: "Группа",
  };

  const alignIcons: Record<TextAlign, React.ElementType> = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify,
  };

  return (
    <div className="relative flex h-full overflow-hidden border-l border-border bg-background">
      <div
        className={`flex flex-col overflow-y-auto transition-all duration-200 ease-in-out ${
          isRightCollapsed ? "w-0 opacity-0" : "w-72 opacity-100"
        }`}
      >
        <div className="flex h-11 shrink-0 items-center border-b border-border/60 px-3.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {formValues
              ? (typeLabel[formValues.type] ?? formValues.type)
              : "Свойства"}
          </span>
        </div>

        <ScrollArea className="flex-1">
          {!formValues ? (
            <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center text-muted-foreground">
              <MousePointerClick className="size-7 stroke-[1.5] text-muted-foreground/60" />
              <p className="text-sm leading-snug">
                Выберите объект на холсте, чтобы изменить его свойства
              </p>
            </div>
          ) : (
            <div className="flex flex-col pb-3">
              <div className="flex items-center gap-1 border-b border-border/60 px-2.5 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`size-8 ${btnRound}`}
                  onClick={handleCenterH}
                  title="По центру горизонтально"
                >
                  <AlignHorizontalDistributeCenter className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`size-8 ${btnRound}`}
                  onClick={handleCenterV}
                  title="По центру вертикально"
                >
                  <AlignVerticalDistributeCenter className="size-4" />
                </Button>
                <div className="mx-1.5 h-5 w-px bg-border/70" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`size-8 ${btnRound}`}
                  onClick={handleBringForward}
                  title="На слой выше"
                >
                  <BringToFront className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`size-8 ${btnRound}`}
                  onClick={handleSendBackwards}
                  title="На слой ниже"
                >
                  <SendToBack className="size-4" />
                </Button>
              </div>

              <CollapsibleGroup id="rs-position" title="Размер и угол">
                <div className="grid grid-cols-2 gap-2.5">
                  <DimInput
                    label="Ширина"
                    value={formValues.width}
                    onChange={setWidth}
                  />
                  <DimInput
                    label="Высота"
                    value={formValues.height}
                    onChange={setHeight}
                  />
                </div>
                <NumberField
                  label="Поворот"
                  value={formValues.angle}
                  onChange={(v) => updateProp("angle", v)}
                  min={-180}
                  max={360}
                  unit="°"
                />
              </CollapsibleGroup>

              {isImage && (
                <CollapsibleGroup id="rs-image" title="Изображение">
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
                    className={`h-9 w-full justify-center gap-2 text-sm ${btnRound}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4" />
                    Загрузить файл
                  </Button>
                  <div className="flex gap-2">
                    <Input
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Ссылка на картинку"
                      className="h-9 border border-border bg-transparent px-3 text-sm dark:bg-transparent"
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
                      className={`h-9 px-3 text-sm ${btnRound}`}
                      disabled={!imageUrlInput.trim()}
                      onClick={() => changeImageSource(imageUrlInput.trim())}
                    >
                      ОК
                    </Button>
                  </div>
                </CollapsibleGroup>
              )}

              {isText && (
                <CollapsibleGroup id="rs-text" title="Текст">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      Содержимое
                    </span>
                    <textarea
                      rows={3}
                      value={formValues.text ?? ""}
                      onChange={(e) => updateProp("text", e.target.value)}
                      className="resize-none rounded-2xl border border-border bg-transparent p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground">Стиль</span>
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        variant={formValues.isBold ? "secondary" : "outline"}
                        size="icon"
                        className={`size-8 ${btnRound}`}
                        onClick={() => {
                          const next = !formValues.isBold;
                          updateProp("isBold", next, "fontWeight");
                          updateSelected({
                            fontWeight: next ? "bold" : "normal",
                          } as unknown as Partial<FabricObject>);
                        }}
                      >
                        <Bold className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant={formValues.isItalic ? "secondary" : "outline"}
                        size="icon"
                        className={`size-8 ${btnRound}`}
                        onClick={() => {
                          const next = !formValues.isItalic;
                          updateProp("isItalic", next, "fontStyle");
                          updateSelected({
                            fontStyle: next ? "italic" : "normal",
                          } as unknown as Partial<FabricObject>);
                        }}
                      >
                        <Italic className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant={
                          formValues.isUnderline ? "secondary" : "outline"
                        }
                        size="icon"
                        className={`size-8 ${btnRound}`}
                        onClick={() => {
                          const next = !formValues.isUnderline;
                          updateProp("isUnderline", next, "underline");
                        }}
                      >
                        <Underline className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <NumberField
                    label="Размер шрифта"
                    value={formValues.fontSize ?? 32}
                    onChange={(v) => updateProp("fontSize", v)}
                    min={10}
                    max={140}
                    unit="px"
                  />

                  <NumberField
                    label="Межстрочный интервал"
                    value={formValues.lineHeight ?? 1.16}
                    onChange={(v) => updateProp("lineHeight", v)}
                    min={0.8}
                    max={2.5}
                    step={0.05}
                    decimals={2}
                  />

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      Выравнивание
                    </span>
                    <div className="flex rounded-full border border-border bg-transparent p-1">
                      {(
                        ["left", "center", "right", "justify"] as const
                      ).map((align) => {
                        const Icon = alignIcons[align];
                        return (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateProp("textAlign", align)}
                            className={`flex h-7 flex-1 items-center justify-center rounded-full transition-colors ${
                              formValues.textAlign === align
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon className="size-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleGroup>
              )}

              <CollapsibleGroup id="rs-fill" title="Заливка">
                {!isImage ? (
                  <ColorField
                    label={isText ? "Цвет текста" : "Цвет заливки"}
                    value={formValues.fill}
                    onChange={(hex) => updateProp("fill", hex)}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    У изображения нет заливки — замените файл в секции выше.
                  </p>
                )}
                {isText && (
                  <ColorField
                    label="Фон текста"
                    value={
                      formValues.backgroundColor === "transparent"
                        ? ""
                        : (formValues.backgroundColor ?? "")
                    }
                    onChange={(hex) => updateProp("backgroundColor", hex)}
                    trailing={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 text-xs ${btnRound}`}
                        onClick={() =>
                          updateProp("backgroundColor", "transparent")
                        }
                      >
                        Сброс
                      </Button>
                    }
                  />
                )}
              </CollapsibleGroup>

              <CollapsibleGroup id="rs-stroke" title="Обводка">
                <ColorField
                  label="Цвет обводки"
                  value={formValues.stroke}
                  onChange={(hex) => updateProp("stroke", hex)}
                />
                <NumberField
                  label="Толщина"
                  value={formValues.strokeWidth}
                  onChange={(v) => updateProp("strokeWidth", v)}
                  min={0}
                  max={20}
                  unit="px"
                />
              </CollapsibleGroup>

              <CollapsibleGroup id="rs-appearance" title="Внешний вид">
                <NumberField
                  label="Непрозрачность"
                  value={Math.round(formValues.opacity * 100)}
                  onChange={(v) => updateProp("opacity", v / 100)}
                  min={0}
                  max={100}
                  unit="%"
                />

                {canHaveRadius && (
                  <NumberField
                    label="Скругление углов"
                    value={formValues.rx ?? 0}
                    onChange={updateCornerRadius}
                    min={0}
                    max={120}
                    unit="px"
                  />
                )}

                <NumberField
                  label="Внутренний отступ"
                  value={formValues.padding}
                  onChange={(v) => updateProp("padding", v)}
                  min={0}
                  max={60}
                  unit="px"
                />
              </CollapsibleGroup>

              <CollapsibleGroup
                id="rs-effects"
                title="Тень"
                headerRight={
                  <Switch
                    size="sm"
                    checked={formValues.hasShadow}
                    onCheckedChange={toggleShadow}
                    aria-label="Включить тень"
                  />
                }
              >
                {formValues.hasShadow ? (
                  <div className="flex flex-col gap-3">
                    <ColorField
                      label="Цвет тени"
                      value={formValues.shadowColor.slice(0, 7)}
                      onChange={(hex) => updateShadowProp("shadowColor", hex)}
                    />
                    <NumberField
                      label="Размытие"
                      value={formValues.shadowBlur}
                      onChange={(v) => updateShadowProp("shadowBlur", v)}
                      min={0}
                      max={50}
                      unit="px"
                    />
                    <NumberField
                      label="Смещение по вертикали"
                      value={formValues.shadowOffsetY}
                      onChange={(v) => updateShadowProp("shadowOffsetY", v)}
                      min={-30}
                      max={50}
                      unit="px"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Включите переключатель справа, чтобы добавить тень.
                  </p>
                )}
              </CollapsibleGroup>
            </div>
          )}
        </ScrollArea>
      </div>

      <aside className="flex w-10 shrink-0 flex-col items-center justify-start border-l border-border/50 py-3">
        <Button
          variant="ghost"
          size="icon"
          className={`size-8 text-muted-foreground hover:text-foreground ${btnRound}`}
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          title={isRightCollapsed ? "Развернуть панель" : "Свернуть панель"}
        >
          {isRightCollapsed ? (
            <PanelRightOpen className="size-4" />
          ) : (
            <PanelRightClose className="size-4" />
          )}
        </Button>
      </aside>
    </div>
  );
}
