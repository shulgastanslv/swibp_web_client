import {
  Canvas,
  Image as FabricImage,
  loadSVGFromString,
  Object as FabricObject,
  Group,
  Rect,
  Gradient,
} from "fabric";
import type { BackgroundConfig, ExportOptions } from "./types";

export class ImportExportManager {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  async addSVGFromContent(svgContent: string) {
    return new Promise<void>((resolve) => {
      const objects: FabricObject[] = [];
      const myReviver = (_element: Element, fabricObject: FabricObject) => {
        if (fabricObject) objects.push(fabricObject);
      };

      loadSVGFromString(svgContent, myReviver).then(() => {
        if (objects.length === 0) {
          resolve();
          return;
        }

        const target: FabricObject =
          objects.length > 1
            ? new Group(objects, { originX: "center", originY: "center" })
            : objects[0];

        target.set({ left: 0, top: 0, originX: "center", originY: "center" });

        const scale = Math.min(
          200 / (target.width || 1),
          200 / (target.height || 1),
          1,
        );
        target.scale(scale);

        this.canvas.add(target);
        this.canvas.centerObject(target);
        this.canvas.setActiveObject(target);
        this.canvas.renderAll();
        resolve();
      });
    });
  }

  setBackground(config: BackgroundConfig): void {
    if (config.type === "solid" && config.color) {
      this.canvas.backgroundColor = config.color;
      this.canvas.renderAll();
    } else if (config.type === "gradient" && config.colors) {
      this.setGradient(config.colors);
    } else if (config.type === "image" && config.url) {
      this.setImage(config.url);
    }
  }

  private setImage(url: string): void {
    FabricImage.fromURL(url).then((img) => {
      const width = this.canvas.width || 1080;
      const height = this.canvas.height || 1080;

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
    const width = this.canvas.width || 1080;
    const height = this.canvas.height || 1080;

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
      coords: {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height,
      },
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
    return this.canvas.toJSON() as unknown as CanvasState;
  }
  exportAsJSON(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }


}
