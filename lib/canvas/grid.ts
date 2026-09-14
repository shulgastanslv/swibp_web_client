import { Canvas, Line, Group, Object as FabricObject } from "fabric";
import { LayoutManager } from "./layouts";

export class GridManager {
  private canvas: Canvas;
  public isGridVisible = false; // Made public for easier access if needed
  private gridSize = 50;
  private gridColor = "rgba(128,128,128,0.15)";
  private gridGroup: Group | null = null;
  private guideLines: Line[] = [];
  private snapThreshold = 5;
  private layoutManager: LayoutManager | null = null;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.setupSmartGuides();
  }

  public setLayoutManager(manager: LayoutManager) {
    this.layoutManager = manager;
  }

  public setGridSize(size: number) {
    this.gridSize = size;
    if (this.isGridVisible) {
      this.refreshGrid();
    }
  }

  public setGridColor(color: string) {
    this.gridColor = color;
    if (this.isGridVisible) {
      this.refreshGrid();
    }
  }

  public toggleGrid() {
    if (this.isGridVisible) this.hideGrid();
    else this.showGrid();
  }

  public showGrid() {
    this.isGridVisible = true;
    this.refreshGrid();
  }

  public hideGrid() {
    this.isGridVisible = false;
    if (this.gridGroup) {
      this.canvas.remove(this.gridGroup);
      this.gridGroup = null;
    }
    this.canvas.requestRenderAll();
  }

  private refreshGrid() {
    if (this.gridGroup) {
      this.canvas.remove(this.gridGroup);
    }

    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    const lines: Line[] = [];

    for (let x = 0; x <= width; x += this.gridSize) {
      lines.push(
        new Line([x, 0, x, height], {
          stroke: this.gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }),
      );
    }
    for (let y = 0; y <= height; y += this.gridSize) {
      lines.push(
        new Line([0, y, width, y], {
          stroke: this.gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }),
      );
    }

    this.gridGroup = new Group(lines, { selectable: false, evented: false });
    this.canvas.add(this.gridGroup);
    this.canvas.sendObjectToBack(this.gridGroup);
    this.canvas.requestRenderAll();
  }

  private setupSmartGuides() {
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

      if (this.layoutManager && this.layoutManager.getIsLayoutActive()) {
        this.snapToLayoutFrames(obj);
      }
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

  private snapToLayoutFrames(obj: FabricObject): void {
      if (!this.layoutManager) return;

      const boundaries = this.layoutManager.getSnapBoundaries();
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);
      const objRight = objLeft + objWidth;
      const objBottom = objTop + objHeight;
      const objCenterX = objLeft + objWidth / 2;
      const objCenterY = objTop + objHeight / 2;

      let snapped = false;

      boundaries.forEach((boundary) => {
        if (boundary.type === "vertical") {
          // Snap левый край объекта к вертикальной линии
          if (Math.abs(objLeft - boundary.x) < this.snapThreshold) {
            obj.set("left", boundary.x);
            this.drawVerticalGuide(boundary.x);
            snapped = true;
          }
          // Snap правый край объекта к вертикальной линии
          else if (Math.abs(objRight - boundary.x) < this.snapThreshold) {
            obj.set("left", boundary.x - objWidth);
            this.drawVerticalGuide(boundary.x);
            snapped = true;
          }
          // Snap центр объекта к вертикальной линии
          else if (Math.abs(objCenterX - boundary.x) < this.snapThreshold) {
            obj.set("left", boundary.x - objWidth / 2);
            this.drawVerticalGuide(boundary.x);
            snapped = true;
          }
        } else if (boundary.type === "horizontal") {
          // Snap верхний край объекта к горизонтальной линии
          if (Math.abs(objTop - boundary.y) < this.snapThreshold) {
            obj.set("top", boundary.y);
            this.drawHorizontalGuide(boundary.y);
            snapped = true;
          }
          // Snap нижний край объекта к горизонтальной линии
          else if (Math.abs(objBottom - boundary.y) < this.snapThreshold) {
            obj.set("top", boundary.y - objHeight);
            this.drawHorizontalGuide(boundary.y);
            snapped = true;
          }
          // Snap центр объекта к горизонтальной линии
          else if (Math.abs(objCenterY - boundary.y) < this.snapThreshold) {
            obj.set("top", boundary.y - objHeight / 2);
            this.drawHorizontalGuide(boundary.y);
            snapped = true;
          }
        }
      });

      if (snapped) {
        this.canvas.renderAll();
      }
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

      if (Math.abs(objLeft - otherLeft) < this.snapThreshold) {
        obj.set("left", otherLeft);
        this.drawVerticalGuide(otherLeft);
      }

      if (Math.abs(objRight - otherRight) < this.snapThreshold) {
        obj.set("left", otherRight - objWidth);
        this.drawVerticalGuide(otherRight);
      }

      if (Math.abs(objTop - otherTop) < this.snapThreshold) {
        obj.set("top", otherTop);
        this.drawHorizontalGuide(otherTop);
      }

      if (Math.abs(objBottom - otherBottom) < this.snapThreshold) {
        obj.set("top", otherBottom - objHeight);
        this.drawHorizontalGuide(otherBottom);
      }
    });
  }
}
