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
    // intensity от 0 до 1
    if (intensity <= 0.01) {
      if (this.vignetteRect) {
        this.canvas.remove(this.vignetteRect);
        this.vignetteRect = null;
      }
      return;
    }

    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();

    // Создаем прямоугольник, если его нет
    if (!this.vignetteRect) {
      this.vignetteRect = new Rect({
        left: 0,
        top: 0,
        width,
        height,
        selectable: false,
        evented: false,
        hoverCursor: "default",
        // Важно: прозрачность самого объекта будет контролировать силу виньетки
        opacity: intensity,
      });
      this.canvas.add(this.vignetteRect);
      this.canvas.bringObjectToFront(this.vignetteRect);
    } else {
      // Обновляем размеры при ресайзе канваса
      this.vignetteRect.set({
        width,
        height,
        opacity: intensity // Обновляем интенсивность через прозрачность слоя
      });
    }

    // Настраиваем градиент
    // Мы делаем градиент от Прозрачного (центр) к Черному (края)
    const gradient = {
      type: "radial",
      coords: {
        r1: 0, // Центр
        r2: Math.max(width, height) / 2, // Радиус до угла
        x1: width / 2,
        y1: height / 2,
        x2: width / 2,
        y2: height / 2,
      },
      colorStops: [
        { offset: 0, color: "rgba(0,0,0,0)" },   // Центр полностью прозрачный
        { offset: 0.6, color: "rgba(0,0,0,0)" }, // Плавное начало затемнения
        { offset: 1, color: "rgb(0,0,0)" },      // Края черные (но видны только на уровень opacity объекта)
      ],
    };

    this.vignetteRect.set({ fill: gradient });
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
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();

    if (!this.noiseRect) {
      this.noiseRect = new Rect({
        left: 0,
        top: 0,
        width,
        height,
        selectable: false,
        evented: false,
        hoverCursor: "default",
        globalCompositeOperation: "overlay", // Режим наложения для реалистичного шума
      });
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
    // Размытие применяем к активному объекту (если это изображение) или к фону
    const activeObject = this.canvas.getActiveObject();
    let target = activeObject;

    if (!target && this.canvas.backgroundImage && this.canvas.backgroundImage instanceof Image) {
      target = this.canvas.backgroundImage;
    }

    if (target && target instanceof Image) {
      target.filters = target.filters || [];
      // Удаляем старый фильтр размытия
      target.filters = target.filters.filter((f) => !(f instanceof filters.Blur));

      if (amount > 0) {
        // amount от 0 до 1 (в Fabric blur принимает значения примерно до 1 для сильного эффекта)
        target.filters.push(new filters.Blur({ blur: amount }));
      }

      target.applyFilters();
      this.canvas.requestRenderAll();
    }
  }

  public clearAll() {
    this.setVignette(0);
    this.setNoise(0);
    this.setBlur(0);
  }

  // Вызывать при изменении размера канваса
  public onCanvasResize() {
    if (this.vignetteRect) this.setVignette(this.vignetteRect.opacity || 0.5); // триггер обновления
    if (this.noiseRect) this.setNoise(this.noiseRect.opacity || 0.5);
  }
}
