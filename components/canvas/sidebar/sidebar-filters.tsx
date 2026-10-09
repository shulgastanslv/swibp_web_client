"use client";

import { useCallback, useEffect, useState } from "react";
import { Filter, Library, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCanvasManager } from "@/context/canvas-manager";
import { useCanvasStore } from "@/store/useCanvasStore";
import type { FilterPresetValues } from "@/store/slices/settingsSlice";
import { FilterMenu } from "@/components/canvas/sidebar/filter-menu";

type Tab = "slide" | "image";

const PRESETS: { id: string; label: string; values: FilterPresetValues }[] = [
  {
    id: "none",
    label: "None",
    values: {},
  },
  {
    id: "film",
    label: "Film",
    values: {
      vignette: 0.4,
      noise: 0.22,
      warmth: 0.15,
      contrast: 0.08,
      saturation: -0.12,
    },
  },
  {
    id: "soft",
    label: "Soft",
    values: {
      vignette: 0.18,
      blur: 2,
      brightness: 0.06,
      contrast: -0.06,
      saturation: -0.05,
    },
  },
  {
    id: "punch",
    label: "Punch",
    values: {
      contrast: 0.28,
      saturation: 0.22,
      brightness: 0.04,
      vignette: 0.12,
    },
  },
  {
    id: "bw",
    label: "B&W",
    values: {
      saturation: -1,
      contrast: 0.12,
      vignette: 0.25,
      noise: 0.1,
    },
  },
  {
    id: "warm",
    label: "Warm",
    values: {
      warmth: 0.45,
      saturation: 0.08,
      vignette: 0.2,
    },
  },
  {
    id: "cool",
    label: "Cool",
    values: {
      warmth: -0.4,
      saturation: -0.05,
      contrast: 0.06,
      vignette: 0.15,
    },
  },
];

function Control({
  label,
  valueLabel,
  children,
}: {
  label: string;
  valueLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-sm text-muted-foreground/70">
          {valueLabel}
        </span>
      </div>
      {children}
    </div>
  );
}

export function SidebarFilters() {
  const manager = useCanvasManager();
  const vignette = useCanvasStore((s) => s.vignette);
  const noise = useCanvasStore((s) => s.noise);
  const warmth = useCanvasStore((s) => s.warmth);
  const blur = useCanvasStore((s) => s.blur);
  const brightness = useCanvasStore((s) => s.brightness);
  const contrast = useCanvasStore((s) => s.contrast);
  const saturation = useCanvasStore((s) => s.saturation);
  const hue = useCanvasStore((s) => s.hue);
  const setVignette = useCanvasStore((s) => s.setVignette);
  const setNoise = useCanvasStore((s) => s.setNoise);
  const setWarmth = useCanvasStore((s) => s.setWarmth);
  const setBlur = useCanvasStore((s) => s.setBlur);
  const setBrightness = useCanvasStore((s) => s.setBrightness);
  const setContrast = useCanvasStore((s) => s.setContrast);
  const setSaturation = useCanvasStore((s) => s.setSaturation);
  const setHue = useCanvasStore((s) => s.setHue);
  const resetFilters = useCanvasStore((s) => s.resetFilters);
  const applyFilterPreset = useCanvasStore((s) => s.applyFilterPreset);

  const [tab, setTab] = useState<Tab>("slide");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [hasImageTarget, setHasImageTarget] = useState(false);

  const syncImageTarget = useCallback(() => {
    setHasImageTarget(Boolean(manager?.effects.resolveImageTarget()));
  }, [manager]);

  useEffect(() => {
    if (!manager) return;
    syncImageTarget();
    const canvas = manager.canvas;
    const bump = () => syncImageTarget();
    canvas.on("selection:created", bump);
    canvas.on("selection:updated", bump);
    canvas.on("selection:cleared", bump);
    return () => {
      canvas.off("selection:created", bump);
      canvas.off("selection:updated", bump);
      canvas.off("selection:cleared", bump);
    };
  }, [manager, syncImageTarget]);

  const applyImage = useCallback(
    (patch: Partial<{
      blur: number;
      brightness: number;
      contrast: number;
      saturation: number;
      hue: number;
    }>) => {
      const next = {
        blur: patch.blur ?? blur,
        brightness: patch.brightness ?? brightness,
        contrast: patch.contrast ?? contrast,
        saturation: patch.saturation ?? saturation,
        hue: patch.hue ?? hue,
      };
      const ok = manager?.effects.setImageAdjustments(next);
      if (ok === false) syncImageTarget();
    },
    [manager, blur, brightness, contrast, saturation, hue, syncImageTarget],
  );

  const applySlideFromStore = useCallback(
    (values: {
      vignette: number;
      noise: number;
      warmth: number;
    }) => {
      manager?.effects.setVignette(values.vignette);
      void manager?.effects.setNoise(values.noise);
      manager?.effects.setWarmth(values.warmth);
    },
    [manager],
  );

  const hasActive =
    vignette > 0 ||
    noise > 0 ||
    Math.abs(warmth) > 0.01 ||
    blur > 0 ||
    Math.abs(brightness) > 0.01 ||
    Math.abs(contrast) > 0.01 ||
    Math.abs(saturation) > 0.01 ||
    Math.abs(hue) > 0.01;

  const handleReset = () => {
    resetFilters();
    setActivePreset("none");
    manager?.effects.clearAll();
  };

  const handlePreset = (id: string, values: FilterPresetValues) => {
    setActivePreset(id);
    applyFilterPreset(values);
    const next = {
      vignette: values.vignette ?? 0,
      noise: values.noise ?? 0,
      warmth: values.warmth ?? 0,
      blur: values.blur ?? 0,
      brightness: values.brightness ?? 0,
      contrast: values.contrast ?? 0,
      saturation: values.saturation ?? 0,
      hue: values.hue ?? 0,
    };
    applySlideFromStore(next);
    manager?.effects.setImageAdjustments(next);
    syncImageTarget();
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as Tab)}
      className="gap-3 overflow-hidden p-1.5 text-sm"
    >
      <div className="flex items-center gap-1">
        <TabsList className="grid h-8 min-w-0 flex-1 grid-cols-2 rounded-full">
          <TabsTrigger
            value="slide"
            className="rounded-full text-sm shadow-none data-active:border-transparent dark:data-active:border-transparent"
          >
            Slide
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="rounded-full text-sm shadow-none data-active:border-transparent dark:data-active:border-transparent"
          >
            Image
          </TabsTrigger>
        </TabsList>
        <FilterMenu
          icon={Filter}
          value={activePreset ?? "none"}
          onChange={(id) => {
            const preset = PRESETS.find((item) => item.id === id);
            if (preset) handlePreset(preset.id, preset.values);
          }}
          groups={[
            {
              label: "Preset",
              options: PRESETS.map((preset) => ({ id: preset.id, label: preset.label })),
            },
          ]}
        />
        {hasActive && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
        )}
      </div>

      <TabsContent value="slide">
        <div className="flex flex-col gap-3">
          <Control label="Vignette" valueLabel={`${Math.round(vignette * 100)}%`}>
            <Slider
              value={[vignette * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setVignette(v);
                manager?.effects.setVignette(v);
              }}
              className="py-0.5"
            />
          </Control>

          <Control label="Grain" valueLabel={`${Math.round(noise * 100)}%`}>
            <Slider
              value={[noise * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setNoise(v);
                void manager?.effects.setNoise(v);
              }}
              className="py-0.5"
            />
          </Control>

          <Control
            label="Warmth"
            valueLabel={
              Math.abs(warmth) < 0.01
                ? "0"
                : `${warmth > 0 ? "+" : ""}${Math.round(warmth * 100)}`
            }
          >
            <Slider
              value={[warmth * 100]}
              min={-100}
              max={100}
              step={1}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setWarmth(v);
                manager?.effects.setWarmth(v);
              }}
              className="py-0.5"
            />
          </Control>
        </div>
      </TabsContent>

      <TabsContent value="image">
        <div className="flex flex-col gap-3">
          {!hasImageTarget && (
            <p className="text-sm text-muted-foreground">
              Select an image or use an image background.
            </p>
          )}

          <Control label="Blur" valueLabel={`${blur}px`}>
            <Slider
              value={[blur]}
              min={0}
              max={40}
              step={1}
              disabled={!hasImageTarget}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = val ?? 0;
                setBlur(v);
                applyImage({ blur: v });
              }}
              className="py-0.5"
            />
          </Control>

          <Control
            label="Brightness"
            valueLabel={`${brightness >= 0 ? "+" : ""}${Math.round(brightness * 100)}`}
          >
            <Slider
              value={[brightness * 100]}
              min={-100}
              max={100}
              step={1}
              disabled={!hasImageTarget}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setBrightness(v);
                applyImage({ brightness: v });
              }}
              className="py-0.5"
            />
          </Control>

          <Control
            label="Contrast"
            valueLabel={`${contrast >= 0 ? "+" : ""}${Math.round(contrast * 100)}`}
          >
            <Slider
              value={[contrast * 100]}
              min={-100}
              max={100}
              step={1}
              disabled={!hasImageTarget}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setContrast(v);
                applyImage({ contrast: v });
              }}
              className="py-0.5"
            />
          </Control>

          <Control
            label="Saturation"
            valueLabel={`${saturation >= 0 ? "+" : ""}${Math.round(saturation * 100)}`}
          >
            <Slider
              value={[saturation * 100]}
              min={-100}
              max={100}
              step={1}
              disabled={!hasImageTarget}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setSaturation(v);
                applyImage({ saturation: v });
              }}
              className="py-0.5"
            />
          </Control>

          <Control
            label="Hue"
            valueLabel={`${hue >= 0 ? "+" : ""}${Math.round(hue * 100)}`}
          >
            <Slider
              value={[hue * 100]}
              min={-100}
              max={100}
              step={1}
              disabled={!hasImageTarget}
              onValueChange={([val]) => {
                setActivePreset(null);
                const v = (val ?? 0) / 100;
                setHue(v);
                applyImage({ hue: v });
              }}
              className="py-0.5"
            />
          </Control>
        </div>
      </TabsContent>
    </Tabs>
  );
}
