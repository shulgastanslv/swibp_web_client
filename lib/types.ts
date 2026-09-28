import { Canvas } from "fabric";

export type BackgroundType = "solid" | "gradient" | "image";

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  colors?: [string, string];
  url?: string;
}

export type RatioKey = '1:1' | '4:5' | '9:16' | '16:9';

export type FabricCanvasJSON = ReturnType<InstanceType<typeof Canvas>['toJSON']>;

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
  currentSlideId: string | null;
}

export interface EditorUIState {
  selectedObjectId: string | null;
  zoom: number;
  isGridVisible: boolean;
  gridSize: number;
  gridColor: string;
}
