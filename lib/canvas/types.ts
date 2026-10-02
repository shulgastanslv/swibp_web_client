export type { BackgroundConfig, BackgroundType, FabricCanvasJSON as CanvasState } from "../types";

export interface ExportOptions {
  format?: "png" | "jpeg";
  quality?: number;
  multiplier?: number;
}
