export type BackgroundType = "solid" | "gradient" | "image";

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  colors?: [string, string];
  url?: string;
}

export type RatioKey = "4:5" | "1:1" | "9:16" | "16:9";

export const CANVAS_RATIOS: Record<RatioKey, { width: number; height: number }> = {
  "4:5": { width: 1080, height: 1350 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
};

// Fabric types `Canvas.toJSON()` as `any`, so the shape is declared explicitly.
export interface FabricCanvasJSON {
  version: string;
  objects: Record<string, unknown>[];
  background?: string;
  [key: string]: unknown;
}

export interface SlideItem {
  id: number;
  canvasJSON: FabricCanvasJSON;
  thumbnail?: string | null;
}

export interface ProjectState {
  id: string;
  title: string;
  aspectRatio: RatioKey;
  width: number;
  height: number;
  slides: SlideItem[];
  currentSlideId: number;
}

export interface EditorUIState {
  selectedObjectId: string | null;
  zoom: number;
  isGridVisible: boolean;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  gridStyle: "lines" | "dots";
  snapToGrid: boolean;
}
