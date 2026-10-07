import {
  Canvas,
  Image as FabricImage,
  Rect,
  Gradient,
} from "fabric";
import type { BackgroundConfig, CanvasState, ExportOptions } from "./types";

export class ImportExportManager {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  async setBackground(config: BackgroundConfig): Promise<void> {
    if (config.type === "solid" && config.color) {
      this.canvas.backgroundImage = undefined;
      this.canvas.backgroundColor = config.color;
      this.canvas.renderAll();
    } else if (config.type === "gradient" && config.colors) {
      this.setGradient(config.colors);
    } else if (config.type === "image" && config.url) {
      await this.setImage(config.url);
    }
  }

  private setImage(url: string): Promise<void> {
    const isRemote = /^https?:\/\//i.test(url);
    return FabricImage.fromURL(
      url,
      isRemote ? { crossOrigin: "anonymous" } : undefined,
    ).then((img) => {
      const zoom = this.canvas.getZoom() || 1;
      const width = (this.canvas.width || 1080) / zoom;
      const height = (this.canvas.height || 1080) / zoom;

      const scaleX = width / (img.width || 1);
      const scaleY = height / (img.height || 1);
      const scale = Math.max(scaleX, scaleY);

      img.set({
        left: 0,
        top: 0,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });

      this.canvas.backgroundImage = img;
      this.canvas.renderAll();
    });
  }

  private setGradient(colors: [string, string]): void {
    const zoom = this.canvas.getZoom() || 1;
    const width = (this.canvas.width || 1080) / zoom;
    const height = (this.canvas.height || 1080) / zoom;

    const rect = new Rect({
      left: 0,
      top: 0,
      width,
      height,
      selectable: false,
      evented: false,
    });

    rect.fill = new Gradient({
      type: "linear",
      coords: { x1: 0, y1: 0, x2: width, y2: height },
      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] },
      ],
    });

    this.canvas.backgroundImage = rect;
    this.canvas.renderAll();
  }

  async exportAsImage(options: ExportOptions): Promise<string> {
    const { format = "png", quality = 1, multiplier = 1 } = options;
    return this.canvas.toDataURL({ format, quality, multiplier });
  }


  toJSON(): CanvasState {
    return this.canvas.toJSON() as CanvasState;
  }
  exportAsJSON(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }


}
