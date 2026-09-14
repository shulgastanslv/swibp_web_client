import { Canvas } from "fabric";

export class CanvasCore {
  public canvas: Canvas;

  constructor(element: HTMLCanvasElement, width = 1080, height = 1080) {
    this.canvas = new Canvas(element, {
      width,
      height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
  }

  resize(width: number, height: number) {
    this.canvas.setDimensions({ width, height });
    this.canvas.renderAll();
  }

  clear() {
    this.canvas.clear();
  }

  dispose() {
    this.canvas.dispose();
  }

  getDimensions() {
    return {
        width: this.canvas.width || 1080,
        height: this.canvas.height || 1080
    };
  }
}
