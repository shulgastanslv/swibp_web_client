import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Textbox,
  Image as FabricImage,
  PencilBrush,
  Gradient,
  loadSVGFromString,
  Polygon,
} from "fabric";

import type { BackgroundConfig, CanvasState, ExportOptions } from "./types";
import { Group, Object as FabricObject } from "fabric";

export class CanvasManager {
  private canvas: Canvas;
  private history: CanvasState[] = [];
  private historyIndex = -1;
  private maxHistory = 50;
  private currentWidth = 1080;
  private currentHeight = 1080;
  private snapThreshold = 5;
  private guideLines: Line[] = [];
  private isGridVisible = false;
  private gridSize = 50;
  private gridGroup: Group | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new Canvas(canvasElement, {
      width: 1080,
      height: 1080,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    this.setupEventListeners();
    this.setupSmartGuides();
  }

  async addImageFromUrl(url: string): Promise<void> {
    try {
      // Используем прокси или прямой URL если разрешен CORS
      const img = await FabricImage.fromURL(url);

      const width = this.canvas.width || 1080;
      const height = this.canvas.height || 1080;

      // Центрируем и масштабируем под холст
      const scale = Math.min(
        (width * 0.8) / (img.width || 1),
        (height * 0.8) / (img.height || 1),
        1,
      );

      img.set({
        left: width / 2,
        top: height / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
      });

      this.canvas.add(img);
      this.canvas.setActiveObject(img);
      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  }

  toggleGrid(): void {
    if (this.isGridVisible) {
      this.hideGrid();
    } else {
      this.showGrid();
    }
  }

  showGrid(): void {
    if (this.gridGroup) {
      this.canvas.add(this.gridGroup);
      this.canvas.sendObjectToBack(this.gridGroup);
      this.isGridVisible = true;
      this.canvas.requestRenderAll();
      return;
    }

    const width = this.canvas.width || 1080;
    const height = this.canvas.height || 1080;
    const lines: Line[] = [];

    // Вертикальные линии
    for (let x = 0; x <= width; x += this.gridSize) {
      lines.push(
        new Line([x, 0, x, height], {
          stroke: "rgba(128, 128, 128, 0.15)",
          strokeWidth: 1,
          selectable: false,
          evented: false,
          hoverCursor: "default",
        }),
      );
    }

    // Горизонтальные линии
    for (let y = 0; y <= height; y += this.gridSize) {
      lines.push(
        new Line([0, y, width, y], {
          stroke: "rgba(128, 128, 128, 0.15)",
          strokeWidth: 1,
          selectable: false,
          evented: false,
          hoverCursor: "default",
        }),
      );
    }

    this.gridGroup = new Group(lines, {
      selectable: false,
      evented: false,
      hoverCursor: "default",
    });

    this.canvas.add(this.gridGroup);
    this.canvas.sendObjectToBack(this.gridGroup);
    this.isGridVisible = true;
    this.canvas.requestRenderAll();
  }

  hideGrid(): void {
      if (this.gridGroup) {
        this.canvas.remove(this.gridGroup);
      }
      this.isGridVisible = false;
      this.canvas.requestRenderAll();
    }

    isGridEnabled(): boolean {
      return this.isGridVisible;
    }

  addArrow(): void {
    const width = this.canvas.width || 1080;
    const height = this.canvas.height || 1080;

    // Параметры стрелки
    const startX = width / 2 - 100;
    const startY = height / 2;
    const endX = width / 2 + 100;
    const endY = height / 2;
    const strokeWidth = 4;
    const headSize = 15; // Размер наконечника

    // 1. Создаем линию (тело стрелки)
    const line = new Line([startX, startY, endX, endY], {
      stroke: "#000000",
      strokeWidth,
      strokeLineCap: "round",
    });

    // 2. Вычисляем координаты наконечника (треугольник)
    const angle = Math.atan2(endY - startY, endX - startX);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Три точки треугольника относительно конца линии
    const tipX = endX;
    const tipY = endY;
    const leftX = endX - headSize * cos + headSize * sin;
    const leftY = endY - headSize * sin - headSize * cos;
    const rightX = endX - headSize * cos - headSize * sin;
    const rightY = endY - headSize * sin + headSize * cos;

    const arrowHead = new Polygon(
      [
        { x: tipX, y: tipY },
        { x: leftX, y: leftY },
        { x: rightX, y: rightY },
      ],
      {
        fill: "#000000",
        originX: "center",
        originY: "center",
      },
    );

    const arrow = new Group([line, arrowHead], {
      left: width / 2,
      top: height / 2,
      originX: "center",
      originY: "center",
    });

    this.canvas.add(arrow);
    this.canvas.setActiveObject(arrow);
    this.canvas.renderAll();
  }

  async addImageFromBlob(blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          const img = await FabricImage.fromURL(dataUrl);

          const width = this.canvas.width || 1080;
          const height = this.canvas.height || 1080;

          // Центрируем и масштабируем
          const scale = Math.min(
            (width * 0.8) / (img.width || 1),
            (height * 0.8) / (img.height || 1),
            1,
          );

          img.set({
            left: width / 2,
            top: height / 2,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
          });

          this.canvas.add(img);
          this.canvas.setActiveObject(img);
          this.canvas.renderAll();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async addSVGFromContent(svgContent: string): Promise<void> {
    return new Promise((resolve) => {
      const width = this.canvas.width || 1080;
      const height = this.canvas.height || 1080;

      const objects: FabricObject[] = [];

      // ✅ Правильная сигнатура reviver для v6
      const myReviver = (element: Element, fabricObject: FabricObject) => {
        if (fabricObject) {
          objects.push(fabricObject);
        }
      };

      loadSVGFromString(svgContent, myReviver).then(() => {
        if (objects.length === 0) {
          resolve();
          return;
        }

        let target: FabricObject;

        if (objects.length > 1) {
          target = new Group(objects, {
            originX: "center",
            originY: "center",
          });
        } else {
          target = objects[0];
        }

        target.set({
          left: width / 2,
          top: height / 2,
          originX: "center",
          originY: "center",
        });

        const targetSize = 200;
        const currentWidth = (target.width || 0) * (target.scaleX || 1);
        const currentHeight = (target.height || 0) * (target.scaleY || 1);
        const safeWidth = currentWidth > 0 ? currentWidth : 1;
        const safeHeight = currentHeight > 0 ? currentHeight : 1;

        const scale = Math.min(
          targetSize / safeWidth,
          targetSize / safeHeight,
          1,
        );

        target.set({
          scaleX: (target.scaleX || 1) * scale,
          scaleY: (target.scaleY || 1) * scale,
        });

        this.canvas.add(target);
        this.canvas.setActiveObject(target);
        this.canvas.renderAll();
        resolve();
      });
    });
  }

  private snapToEdges(obj: FabricObject): void {
    const objLeft = obj.left || 0;
    const objTop = obj.top || 0;
    const objWidth = (obj.width || 0) * (obj.scaleX || 1);
    const objHeight = (obj.height || 0) * (obj.scaleY || 1);
    const objRight = objLeft + objWidth;
    const objBottom = objTop + objHeight;

    const allObjects = this.canvas
      .getObjects()
      .filter((o) => o !== obj && o.selectable !== false);

    allObjects.forEach((other) => {
      const otherLeft = other.left || 0;
      const otherTop = other.top || 0;
      const otherWidth = (other.width || 0) * (other.scaleX || 1);
      const otherHeight = (other.height || 0) * (other.scaleY || 1);
      const otherRight = otherLeft + otherWidth;
      const otherBottom = otherTop + otherHeight;

      // Snap левый край к левому краю
      if (Math.abs(objLeft - otherLeft) < this.snapThreshold) {
        obj.set("left", otherLeft);
        this.drawVerticalGuide(otherLeft);
      }

      // Snap правый край к правому краю
      if (Math.abs(objRight - otherRight) < this.snapThreshold) {
        obj.set("left", otherRight - objWidth);
        this.drawVerticalGuide(otherRight);
      }

      // Snap верхний край к верхнему краю
      if (Math.abs(objTop - otherTop) < this.snapThreshold) {
        obj.set("top", otherTop);
        this.drawHorizontalGuide(otherTop);
      }

      // Snap нижний край к нижнему краю
      if (Math.abs(objBottom - otherBottom) < this.snapThreshold) {
        obj.set("top", otherBottom - objHeight);
        this.drawHorizontalGuide(otherBottom);
      }
    });
  }

  private setupSmartGuides(): void {
    // Рисуем направляющие во время движения
    this.canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj) return;

      const isCtrlPressed = e.e?.ctrlKey || e.e?.metaKey;

      if (!isCtrlPressed) {
        this.clearGuides();
        return;
      }

      this.clearGuides();
      this.snapToCenter(obj);
      this.snapToEdges(obj);
    });

    // Очищаем направляющие когда отпускаем мышь
    this.canvas.on("mouse:up", () => {
      this.clearGuides();
    });

    // Также очищаем при потере фокуса / переключении инструмента
    this.canvas.on("selection:cleared", () => {
      this.clearGuides();
    });
  }

  private clearGuides(): void {
    this.guideLines.forEach((line) => this.canvas.remove(line));
    this.guideLines = [];
  }

  private drawVerticalGuide(x: number): void {
    const canvasHeight = this.canvas.height || 1080;
    const line = new Line([x, 0, x, canvasHeight], {
      stroke: "#ff0000",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    this.guideLines.push(line);
    this.canvas.add(line);
  }

  private drawHorizontalGuide(y: number): void {
    const canvasWidth = this.canvas.width || 1080;
    const line = new Line([0, y, canvasWidth, y], {
      stroke: "#ff0000",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    this.guideLines.push(line);
    this.canvas.add(line);
  }

  private snapToCenter(obj: FabricObject): void {
    const canvasWidth = this.canvas.width || 1080;
    const canvasHeight = this.canvas.height || 1080;

    const objCenterX =
      (obj.left || 0) + ((obj.width || 0) * (obj.scaleX || 1)) / 2;
    const objCenterY =
      (obj.top || 0) + ((obj.height || 0) * (obj.scaleY || 1)) / 2;

    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    // Snap к центру канваса
    if (Math.abs(objCenterX - canvasCenterX) < this.snapThreshold) {
      obj.set(
        "left",
        canvasCenterX - ((obj.width || 0) * (obj.scaleX || 1)) / 2,
      );
      this.drawVerticalGuide(canvasCenterX);
    }

    if (Math.abs(objCenterY - canvasCenterY) < this.snapThreshold) {
      obj.set(
        "top",
        canvasCenterY - ((obj.height || 0) * (obj.scaleY || 1)) / 2,
      );
      this.drawHorizontalGuide(canvasCenterY);
    }

    // Snap к центрам других объектов
    const allObjects = this.canvas
      .getObjects()
      .filter((o) => o !== obj && o.selectable !== false);

    allObjects.forEach((other) => {
      const otherCenterX =
        (other.left || 0) + ((other.width || 0) * (other.scaleX || 1)) / 2;
      const otherCenterY =
        (other.top || 0) + ((other.height || 0) * (other.scaleY || 1)) / 2;

      if (Math.abs(objCenterX - otherCenterX) < this.snapThreshold) {
        obj.set(
          "left",
          otherCenterX - ((obj.width || 0) * (obj.scaleX || 1)) / 2,
        );
        this.drawVerticalGuide(otherCenterX);
      }

      if (Math.abs(objCenterY - otherCenterY) < this.snapThreshold) {
        obj.set(
          "top",
          otherCenterY - ((obj.height || 0) * (obj.scaleY || 1)) / 2,
        );
        this.drawHorizontalGuide(otherCenterY);
      }
    });

    this.canvas.renderAll();
  }

  private setupEventListeners(): void {
    this.canvas.on("object:added", () => this.saveState());
    this.canvas.on("object:modified", () => this.saveState());
    this.canvas.on("object:removed", () => this.saveState());
  }

  addRectangle(): Rect {
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: "#3b82f6",
      rx: 8,
      ry: 8,
    });
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
    return rect;
  }

  addCircle(): Circle {
    const circle = new Circle({
      left: 150,
      top: 150,
      radius: 75,
      fill: "#ef4444",
    });
    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
    return circle;
  }

  addTriangle(): Triangle {
    const triangle = new Triangle({
      left: 200,
      top: 200,
      width: 150,
      height: 150,
      fill: "#10b981",
    });
    this.canvas.add(triangle);
    this.canvas.setActiveObject(triangle);
    this.canvas.renderAll();
    return triangle;
  }

  addLine(): Line {
    const line = new Line([50, 50, 300, 300], {
      stroke: "#000000",
      strokeWidth: 3,
    });
    this.canvas.add(line);
    this.canvas.setActiveObject(line);
    this.canvas.renderAll();
    return line;
  }

  addText(text: string): Textbox {
    const textbox = new Textbox(text, {
      left: 100,
      top: 100,
      width: 300,
      fontSize: 32,
      fontFamily: "Inter",
      fill: "#000000",
    });
    this.canvas.add(textbox);
    this.canvas.setActiveObject(textbox);
    this.canvas.renderAll();
    return textbox;
  }

  async addImage(url: string): Promise<FabricImage> {
    const img = await FabricImage.fromURL(url);
    img.set({
      left: 100,
      top: 100,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    this.canvas.add(img);
    this.canvas.setActiveObject(img);
    this.canvas.renderAll();
    return img;
  }

  enableDrawingMode(): void {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = 5;
      this.canvas.freeDrawingBrush.color = "#000000";
    }
  }

  disableDrawingMode(): void {
    this.canvas.isDrawingMode = false;
  }

  deleteSelected(): void {
    const activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach((obj) => this.canvas.remove(obj));
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  duplicateSelected(): void {
    const active = this.canvas.getActiveObject();
    if (!active) return;

    active.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (active.left || 0) + 20,
        top: (active.top || 0) + 20,
      });
      this.canvas.add(cloned);
      this.canvas.setActiveObject(cloned);
      this.canvas.renderAll();
    });
  }

  private saveState(): void {
    const state = this.toJSON();
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(state);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    this.historyIndex = this.history.length - 1;
  }

  undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.loadFromJSON(this.history[this.historyIndex]);
    }
  }

  redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.loadFromJSON(this.history[this.historyIndex]);
    }
  }

  setRatio(width: number, height: number): void {
    this.currentWidth = width;
    this.currentHeight = height;

    this.canvas.setDimensions({ width, height });
    this.canvas.renderAll();
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

  getDimensions() {
    return { width: this.currentWidth, height: this.currentHeight };
  }

  toJSON(): CanvasState {
    return this.canvas.toJSON() as unknown as CanvasState;
  }

  loadFromJSON(json: CanvasState | string): void {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    this.canvas.loadFromJSON(data).then(() => {
      this.canvas.renderAll();
    });
  }

  async exportAsImage(options: ExportOptions): Promise<string> {
    const { format = "png", quality = 1, multiplier = 1 } = options;
    return this.canvas.toDataURL({ format, quality, multiplier });
  }

  exportAsJSON(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  getCanvas(): Canvas {
    return this.canvas;
  }

  getHistoryLength(): number {
    return this.history.length;
  }

  getHistoryIndex(): number {
    return this.historyIndex;
  }

  clearCanvas(): void {
    this.canvas.clear();
  }

  dispose(): void {
    this.canvas.dispose();
  }
}
