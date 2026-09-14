import { Canvas, Line, Group, Object as FabricObject } from "fabric";

export class GridManager {
  private canvas: Canvas;
  private isGridVisible = false;
  private gridSize = 50;
  private gridGroup: Group | null = null;
  private guideLines: Line[] = [];
  private snapThreshold = 5;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.setupSmartGuides();
  }

  toggleGrid() {
    if (this.isGridVisible) this.hideGrid();
    else this.showGrid();
  }

  showGrid() {
    if (this.gridGroup) {
      this.canvas.add(this.gridGroup);
      this.canvas.sendObjectToBack(this.gridGroup);
      this.isGridVisible = true;
      this.canvas.requestRenderAll();
      return;
    }

    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    const lines: Line[] = [];

    for (let x = 0; x <= width; x += this.gridSize) {
      lines.push(
        new Line([x, 0, x, height], {
          stroke: "rgba(128,128,128,0.15)",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }),
      );
    }
    for (let y = 0; y <= height; y += this.gridSize) {
      lines.push(
        new Line([0, y, width, y], {
          stroke: "rgba(128,128,128,0.15)",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }),
      );
    }

    this.gridGroup = new Group(lines, { selectable: false, evented: false });
    this.canvas.add(this.gridGroup);
    this.canvas.sendObjectToBack(this.gridGroup);
    this.isGridVisible = true;
    this.canvas.requestRenderAll();
  }

  hideGrid() {
    if (this.gridGroup) this.canvas.remove(this.gridGroup);
    this.isGridVisible = false;
    this.canvas.requestRenderAll();
  }

  private setupSmartGuides() {
    this.canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj) return;

      // Проверяем Ctrl/Cmd для включения снаппинга
      const isCtrlPressed = e.e?.ctrlKey || e.e?.metaKey;
      if (!isCtrlPressed) {
        this.clearGuides();
        return;
      }

      this.clearGuides();
      this.snapToCenter(obj);
      this.snapToEdges(obj);
    });

    this.canvas.on("mouse:up", () => this.clearGuides());
    this.canvas.on("selection:cleared", () => this.clearGuides());
  }

  private clearGuides() {
    this.guideLines.forEach((line) => this.canvas.remove(line));
    this.guideLines = [];
  }

  private drawVerticalGuide(x: number) {
    const h = this.canvas.height || 1080;
    const line = new Line([x, 0, x, h], {
      stroke: "#ff0000",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    this.guideLines.push(line);
    this.canvas.add(line);
  }

  private drawHorizontalGuide(y: number) {
    const w = this.canvas.width || 1080;
    const line = new Line([0, y, w, y], {
      stroke: "#ff0000",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    this.guideLines.push(line);
    this.canvas.add(line);
  }

  private snapToCenter(obj: FabricObject): void {

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
}
