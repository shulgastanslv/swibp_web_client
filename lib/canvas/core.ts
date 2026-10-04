import { Canvas } from "fabric";
import "./fabric-props";

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

  /**
   * Apply viewport zoom via Fabric's built-in zoom.
   * Also resizes the canvas DOM element so it occupies the correct screen space.
   * nativeW/nativeH are the logical canvas dimensions (e.g. 1080×1080).
   */
  setZoom(scale: number, nativeW: number, nativeH: number) {
    this.canvas.setZoom(scale);
    this.canvas.setDimensions({
      width: Math.round(nativeW * scale),
      height: Math.round(nativeH * scale),
    });
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
