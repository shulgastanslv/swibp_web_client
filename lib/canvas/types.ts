import type { Object as FabricObject } from "fabric";

export type BackgroundType = "solid" | "gradient" | "image";

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  colors?: [string, string];
  url?: string;
}

export type ToolType =
  | "select"
  | "rectangle"
  | "circle"
  | "triangle"
  | "line"
  | "pen"
  | "text"
  | "image";

export interface ToolConfig {
  id: ToolType;
  label: string;
  icon: string;
  shortcut?: string;
}

export interface CanvasState {
  version: string;
  objects: Record<string, unknown>[];
  background: string;
  width: number;
  height: number;
}

export interface ExportOptions {
  format: "png";
  quality?: number;
  multiplier?: number;
}

export const CANVAS_RATIOS = {
  '1:1': { width: 1080, height: 1080, label: 'Квадрат (Post)' },
  '4:5': { width: 1080, height: 1350, label: 'Портрет (Post)' },
  '9:16': { width: 1080, height: 1920, label: 'Stories / Reels' },
  '16:9': { width: 1920, height: 1080, label: 'Альбом (YouTube)' },
} as const;

export type RatioKey = keyof typeof CANVAS_RATIOS;
