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
    const width = Math.max(1, Math.round(nativeW * scale));
    const height = Math.max(1, Math.round(nativeH * scale));
    if (
      this.canvas.width === width &&
      this.canvas.height === height &&
      Math.abs(this.canvas.getZoom() - scale) < 1e-4
    ) {
      return;
    }
    this.canvas.setZoom(scale);
    // setDimensions clears the bitmap and only schedules a paint.
    // Draw in this turn so the cleared frame never reaches the screen.
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
