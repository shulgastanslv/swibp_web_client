import { Canvas, Rect, Image, filters, Pattern } from "fabric";

export class EffectsManager {
  private canvas: Canvas;
  private vignetteRect: Rect | null = null;
  private noiseRect: Rect | null = null;
  private static noisePattern: Pattern | null = null;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.generateNoisePattern();
  }

  /** Logical (unzoomed) canvas size — objects live in this space. */
  private getLogicalSize() {
    const zoom = this.canvas.getZoom() || 1;
    return {
      width: (this.canvas.getWidth() || 1080) / zoom,
      height: (this.canvas.getHeight() || 1080) / zoom,
    };
  }

  private async generateNoisePattern() {
    if (EffectsManager.noisePattern) return;

    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 150;
    patternCanvas.height = 150;
    const ctx = patternCanvas.getContext("2d")!;
    const imageData = ctx.createImageData(150, 150);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = Math.random() * 255;
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    EffectsManager.noisePattern = new Pattern({
      source: patternCanvas,
      repeat: "repeat",
    });
  }

  public setVignette(intensity: number) {
    if (intensity <= 0.01) {
      if (this.vignetteRect) {
        this.canvas.remove(this.vignetteRect);
        this.vignetteRect = null;
      }
      return;
    }

    const { width, height } = this.getLogicalSize();
    // Reach the corners of the rectangle, not just the shorter half-side.
    const cornerRadius = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);

    if (!this.vignetteRect) {
      this.vignetteRect = new Rect({
        left: 0,
        top: 0,
        width,
        height,
        selectable: false,
        evented: false,
        hoverCursor: "default",
        excludeFromExport: true,
        opacity: intensity,
      });
      // @ts-expect-error custom flag for effect layers
      this.vignetteRect.isEffectLayer = true;
      this.canvas.add(this.vignetteRect);
      this.canvas.bringObjectToFront(this.vignetteRect);
    } else {
      this.vignetteRect.set({
        width,
        height,
        opacity: intensity,
      });
    }

    this.vignetteRect.set({
      fill: {
        type: "radial",
        coords: {
          r1: 0,
          r2: cornerRadius,
          x1: width / 2,
          y1: height / 2,
          x2: width / 2,
          y2: height / 2,
        },
        colorStops: [
          { offset: 0, color: "rgba(0,0,0,0)" },
          { offset: 0.55, color: "rgba(0,0,0,0)" },
          { offset: 1, color: "rgb(0,0,0)" },
        ],
      },
    });
    this.canvas.requestRenderAll();
  }

  public async setNoise(intensity: number) {
    if (intensity <= 0) {
      if (this.noiseRect) {
        this.canvas.remove(this.noiseRect);
        this.noiseRect = null;
      }
      return;
    }

    await this.generateNoisePattern();
    const { width, height } = this.getLogicalSize();

    if (!this.noiseRect) {
      this.noiseRect = new Rect({
        left: 0,
        top: 0,
        width,
        height,
        selectable: false,
        evented: false,
        hoverCursor: "default",
        excludeFromExport: true,
        globalCompositeOperation: "overlay",
      });
      // @ts-expect-error custom flag for effect layers
      this.noiseRect.isEffectLayer = true;
      this.canvas.add(this.noiseRect);
      this.canvas.bringObjectToFront(this.noiseRect);
    } else {
      this.noiseRect.set({ width, height });
    }

    this.noiseRect.set({
      fill: EffectsManager.noisePattern,
      opacity: intensity,
    });
    this.canvas.requestRenderAll();
  }

  public setBlur(amount: number) {
    // amount from UI is px 0–40; Fabric Blur expects ~0–1
    const blurValue = Math.min(1, Math.max(0, amount / 40));
    const activeObject = this.canvas.getActiveObject();
    let target = activeObject;

    if (!target && this.canvas.backgroundImage && this.canvas.backgroundImage instanceof Image) {
      target = this.canvas.backgroundImage;
    }

    if (target && target instanceof Image) {
      target.filters = target.filters || [];
      target.filters = target.filters.filter((f) => !(f instanceof filters.Blur));

      if (blurValue > 0) {
        target.filters.push(new filters.Blur({ blur: blurValue }));
      }

      target.applyFilters();
      this.canvas.requestRenderAll();
    }
  }

  public clearAll() {
    this.setVignette(0);
    void this.setNoise(0);
    this.setBlur(0);
  }

  public onCanvasResize() {
    if (this.vignetteRect) this.setVignette(this.vignetteRect.opacity || 0.5);
    if (this.noiseRect) void this.setNoise(this.noiseRect.opacity || 0.5);
  }
}
