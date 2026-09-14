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
  | "arrow"
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

export type RatioKey = keyof typeof CANVAS_RATIOS;

export const CANVAS_RATIOS = {
  "1:1": { width: 1080, height: 1080, label: "Instagram Post" },
  "4:5": { width: 1080, height: 1350, label: "Instagram Portrait" },
  "9:16": { width: 1080, height: 1920, label: "Instagram Story / Reel" },
  "21:9": { width: 1080, height: 457, label: "Instagram Landscape" },
  "9:16-tiktok": { width: 1080, height: 1920, label: "TikTok Video" },
  "16:9-yt": { width: 1920, height: 1080, label: "YouTube Video" },
  "16:9-thumb": { width: 1280, height: 720, label: "YouTube Thumbnail" },
  "21:9-yt": { width: 2560, height: 1440, label: "YouTube Banner" },
  "1.91:1-fb": { width: 1200, height: 628, label: "Facebook Link" },
  "1:1-fb": { width: 1080, height: 1080, label: "Facebook Post" },
  "4:5-fb": { width: 1080, height: 1350, label: "Facebook Portrait" },
  "820:312": { width: 820, height: 312, label: "Facebook Cover" },
  "16:9-x": { width: 1600, height: 900, label: "X Header" },
  "1:1-x": { width: 1080, height: 1080, label: "X Post" },
  "16:9-x-post": { width: 1200, height: 675, label: "X Media" },
  "1.91:1-li": { width: 1200, height: 627, label: "LinkedIn Share" },
  "4:5-li": { width: 1080, height: 1350, label: "LinkedIn Portrait" },
  "1584:396": { width: 1584, height: 396, label: "LinkedIn Cover" },
  "2:3-pin": { width: 1000, height: 1500, label: "Pinterest Pin" },
  "1:1-pin": { width: 1000, height: 1000, label: "Pinterest Square" },
  "16:9-pin": { width: 1920, height: 1080, label: "Pinterest Idea Pin" },
  "1:1-tg": { width: 1080, height: 1080, label: "Telegram Post" },
  "4:5-tg": { width: 1080, height: 1350, label: "Telegram Portrait" },
  "16:9": { width: 1920, height: 1080, label: "Full HD" },
  "4:3": { width: 1024, height: 768, label: "Standard" },
  "3:2": { width: 1200, height: 800, label: "Photo Print" },
} as const;
