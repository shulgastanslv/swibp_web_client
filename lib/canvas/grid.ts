import {
  Canvas,
  Line,
  Rect,
  Pattern,
  Object as FabricObject,
  Point,
} from "fabric";
import { LayoutManager } from "./layouts";

export type GridStyle = "lines" | "dots";

type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

export interface GridSettings {
  size: number;
  color: string;
  opacity: number;
  style: GridStyle;
  snapToGrid: boolean;
}

/**
 * Visual grid + smart guides.
 * Hold Ctrl/⌘ while dragging to snap to canvas center, edges, and other objects.
 * When snapToGrid is on and the grid is visible, objects also snap to the grid.
 */
export class GridManager {
  private canvas: Canvas;
  public isGridVisible = false;
  private gridSize = 20;
  private gridColor = "#000000";
  private gridOpacity = 0.12;
  private gridStyle: GridStyle = "lines";
  private snapToGrid = true;
  private gridOverlay: Rect | null = null;
  private guideLines: Line[] = [];
  private snapThreshold = 8;
  private layoutManager: LayoutManager | null = null;
  private ctrlHeld = false;
  private disposed = false;

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") this.ctrlHeld = true;
  };

  private readonly onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Control" || e.key === "Meta") {
      this.ctrlHeld = false;
      this.clearGuides();
      this.canvas.requestRenderAll();
    }
  };

  private readonly onWindowBlur = () => {
    this.ctrlHeld = false;
    this.clearGuides();
  };

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.setupSmartGuides();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onWindowBlur);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onWindowBlur);
    this.clearGuides();
    this.hideGrid();
  }

  public setLayoutManager(manager: LayoutManager) {
    this.layoutManager = manager;
  }

  public applySettings(settings: Partial<GridSettings>) {
    if (settings.size != null) this.gridSize = Math.max(4, Math.round(settings.size));
    if (settings.color != null) this.gridColor = settings.color;
    if (settings.opacity != null) {
      this.gridOpacity = Math.min(1, Math.max(0, settings.opacity));
    }
    if (settings.style != null) this.gridStyle = settings.style;
    if (settings.snapToGrid != null) this.snapToGrid = settings.snapToGrid;
    if (this.isGridVisible) this.refreshGrid();
  }

  public setGridSize(size: number) {
    this.applySettings({ size });
  }

  public setGridColor(color: string) {
    this.applySettings({ color });
  }

  public setGridOpacity(opacity: number) {
    this.applySettings({ opacity });
  }

  public setGridStyle(style: GridStyle) {
    this.applySettings({ style });
  }

  public setSnapToGrid(enabled: boolean) {
    this.snapToGrid = enabled;
  }

  public setSnapThreshold(px: number) {
    this.snapThreshold = Math.max(2, px);
  }

  public toggleGrid() {
    if (this.isGridVisible) this.hideGrid();
    else this.showGrid();
  }

  public showGrid() {
    this.isGridVisible = true;
    this.refreshGrid();
  }

  public setVisible(visible: boolean) {
    if (visible) this.showGrid();
    else this.hideGrid();
  }

  /** Canvas content was replaced (loadFromJSON/clear) and the grid overlay is gone. */
  public redraw() {
    if (this.isGridVisible) this.refreshGrid();
  }

  public hideGrid() {
    this.isGridVisible = false;
    if (this.gridOverlay) {
      this.canvas.remove(this.gridOverlay);
      this.gridOverlay = null;
    }
    this.canvas.requestRenderAll();
  }

  /** Instantly center the active object on the canvas. */
  public centerObject(
    obj: FabricObject,
    axis: "horizontal" | "vertical" | "both" = "both",
  ): void {
    const { width, height } = this.getLogicalSize();
    const center = obj.getCenterPoint();
    const next = new Point(
      axis === "vertical" ? center.x : width / 2,
      axis === "horizontal" ? center.y : height / 2,
    );
    obj.setPositionByOrigin(next, "center", "center");
    obj.setCoords();
    this.canvas.requestRenderAll();
  }

  private getLogicalSize() {
    const zoom = this.canvas.getZoom() || 1;
    return {
      width: (this.canvas.getWidth() || 1080) / zoom,
      height: (this.canvas.getHeight() || 1080) / zoom,
      zoom,
    };
  }

  private getBounds(obj: FabricObject): Bounds {
    const center = obj.getCenterPoint();
    const width = obj.getScaledWidth();
    const height = obj.getScaledHeight();
    return {
      left: center.x - width / 2,
      top: center.y - height / 2,
      right: center.x + width / 2,
      bottom: center.y + height / 2,
      width,
      height,
      centerX: center.x,
      centerY: center.y,
    };
  }

  private setCenter(obj: FabricObject, x: number, y: number) {
    obj.setPositionByOrigin(new Point(x, y), "center", "center");
    obj.setCoords();
  }

  private isSnapTarget(obj: FabricObject): boolean {
    if (obj === this.gridOverlay) return false;
    if (obj.excludeFromExport) return false;
    if (obj.selectable === false && obj.evented === false) return false;
    return true;
  }

  private resolvedColor(): string {
    const hex = this.gridColor.replace("#", "");
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex.slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16) || 0;
    const g = parseInt(full.slice(2, 4), 16) || 0;
    const b = parseInt(full.slice(4, 6), 16) || 0;
    return `rgba(${r},${g},${b},${this.gridOpacity})`;
  }

  private createPatternSource(): HTMLCanvasElement {
    const size = Math.max(4, this.gridSize);
    const tile = document.createElement("canvas");
    tile.width = size;
    tile.height = size;
    const ctx = tile.getContext("2d");
    if (!ctx) return tile;

    const color = this.resolvedColor();

    if (this.gridStyle === "dots") {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0.5, 0.5, 1.15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0.5);
      ctx.lineTo(size, 0.5);
      ctx.moveTo(0.5, 0);
      ctx.lineTo(0.5, size);
      ctx.stroke();
    }

    return tile;
  }

  private refreshGrid() {
    if (this.gridOverlay) {
      this.canvas.remove(this.gridOverlay);
      this.gridOverlay = null;
    }

    const { width, height } = this.getLogicalSize();
    const pattern = new Pattern({
      source: this.createPatternSource(),
      repeat: "repeat",
    });

    this.gridOverlay = new Rect({
      left: 0,
      top: 0,
      width,
      height,
      fill: pattern,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      objectCaching: false,
    });

    this.canvas.add(this.gridOverlay);
    this.canvas.sendObjectToBack(this.gridOverlay);
    this.canvas.requestRenderAll();
  }

  private setupSmartGuides() {
    this.canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj || obj.excludeFromExport) return;

      const fromEvent = !!(
        e.e &&
        ((e.e as MouseEvent).ctrlKey || (e.e as MouseEvent).metaKey)
      );
      const guidesActive = this.ctrlHeld || fromEvent;
      const gridSnapActive = this.snapToGrid && this.isGridVisible;

      if (!guidesActive && !gridSnapActive) {
        this.clearGuides();
        return;
      }

      this.clearGuides();
      this.snapWhileMoving(obj, guidesActive, gridSnapActive);
    });

    this.canvas.on("mouse:up", () => this.clearGuides());
    this.canvas.on("selection:cleared", () => this.clearGuides());
  }

  private snapWhileMoving(
    obj: FabricObject,
    guidesActive: boolean,
    gridSnapActive: boolean,
  ) {
    const { width, height, zoom } = this.getLogicalSize();
    const threshold = this.snapThreshold / zoom;
    let bounds = this.getBounds(obj);

    let nextCX = bounds.centerX;
    let nextCY = bounds.centerY;
    let snappedX = false;
    let snappedY = false;

    if (guidesActive) {
      const canvasCX = width / 2;
      const canvasCY = height / 2;

      if (Math.abs(bounds.centerX - canvasCX) < threshold) {
        nextCX = canvasCX;
        snappedX = true;
        this.drawVerticalGuide(canvasCX);
      }
      if (Math.abs(bounds.centerY - canvasCY) < threshold) {
        nextCY = canvasCY;
        snappedY = true;
        this.drawHorizontalGuide(canvasCY);
      }

      if (!snappedX) {
        if (Math.abs(bounds.left) < threshold) {
          nextCX = bounds.width / 2;
          snappedX = true;
          this.drawVerticalGuide(0);
        } else if (Math.abs(bounds.right - width) < threshold) {
          nextCX = width - bounds.width / 2;
          snappedX = true;
          this.drawVerticalGuide(width);
        }
      }
      if (!snappedY) {
        if (Math.abs(bounds.top) < threshold) {
          nextCY = bounds.height / 2;
          snappedY = true;
          this.drawHorizontalGuide(0);
        } else if (Math.abs(bounds.bottom - height) < threshold) {
          nextCY = height - bounds.height / 2;
          snappedY = true;
          this.drawHorizontalGuide(height);
        }
      }

      const others = this.canvas
        .getObjects()
        .filter((o) => o !== obj && this.isSnapTarget(o));

      for (const other of others) {
        const o = this.getBounds(other);

        if (!snappedX) {
          if (Math.abs(bounds.centerX - o.centerX) < threshold) {
            nextCX = o.centerX;
            snappedX = true;
            this.drawVerticalGuide(o.centerX);
          } else if (Math.abs(bounds.left - o.left) < threshold) {
            nextCX = o.left + bounds.width / 2;
            snappedX = true;
            this.drawVerticalGuide(o.left);
          } else if (Math.abs(bounds.right - o.right) < threshold) {
            nextCX = o.right - bounds.width / 2;
            snappedX = true;
            this.drawVerticalGuide(o.right);
          } else if (Math.abs(bounds.left - o.right) < threshold) {
            nextCX = o.right + bounds.width / 2;
            snappedX = true;
            this.drawVerticalGuide(o.right);
          } else if (Math.abs(bounds.right - o.left) < threshold) {
            nextCX = o.left - bounds.width / 2;
            snappedX = true;
            this.drawVerticalGuide(o.left);
          }
        }

        if (!snappedY) {
          if (Math.abs(bounds.centerY - o.centerY) < threshold) {
            nextCY = o.centerY;
            snappedY = true;
            this.drawHorizontalGuide(o.centerY);
          } else if (Math.abs(bounds.top - o.top) < threshold) {
            nextCY = o.top + bounds.height / 2;
            snappedY = true;
            this.drawHorizontalGuide(o.top);
          } else if (Math.abs(bounds.bottom - o.bottom) < threshold) {
            nextCY = o.bottom - bounds.height / 2;
            snappedY = true;
            this.drawHorizontalGuide(o.bottom);
          } else if (Math.abs(bounds.top - o.bottom) < threshold) {
            nextCY = o.bottom + bounds.height / 2;
            snappedY = true;
            this.drawHorizontalGuide(o.bottom);
          } else if (Math.abs(bounds.bottom - o.top) < threshold) {
            nextCY = o.top - bounds.height / 2;
            snappedY = true;
            this.drawHorizontalGuide(o.top);
          }
        }
      }

      if (this.layoutManager?.getIsLayoutActive()) {
        const result = this.snapToLayoutFrames(
          obj,
          bounds,
          threshold,
          nextCX,
          nextCY,
          snappedX,
          snappedY,
        );
        nextCX = result.nextCX;
        nextCY = result.nextCY;
        snappedX = result.snappedX;
        snappedY = result.snappedY;
      }
    }

    if (gridSnapActive) {
      bounds = {
        ...this.getBounds(obj),
        // Use tentative center if we already snapped via guides
        centerX: snappedX ? nextCX : this.getBounds(obj).centerX,
        centerY: snappedY ? nextCY : this.getBounds(obj).centerY,
      };
      // Recompute edges from tentative center
      bounds.left = nextCX - bounds.width / 2;
      bounds.right = nextCX + bounds.width / 2;
      bounds.top = nextCY - bounds.height / 2;
      bounds.bottom = nextCY + bounds.height / 2;
      bounds.centerX = nextCX;
      bounds.centerY = nextCY;

      if (!snappedX) {
        const leftGrid = Math.round(bounds.left / this.gridSize) * this.gridSize;
        const centerGrid =
          Math.round(bounds.centerX / this.gridSize) * this.gridSize;
        const rightGrid =
          Math.round(bounds.right / this.gridSize) * this.gridSize;

        if (Math.abs(bounds.left - leftGrid) < threshold) {
          nextCX = leftGrid + bounds.width / 2;
          snappedX = true;
          this.drawVerticalGuide(leftGrid);
        } else if (Math.abs(bounds.centerX - centerGrid) < threshold) {
          nextCX = centerGrid;
          snappedX = true;
          this.drawVerticalGuide(centerGrid);
        } else if (Math.abs(bounds.right - rightGrid) < threshold) {
          nextCX = rightGrid - bounds.width / 2;
          snappedX = true;
          this.drawVerticalGuide(rightGrid);
        }
      }

      if (!snappedY) {
        const topGrid = Math.round(bounds.top / this.gridSize) * this.gridSize;
        const centerGrid =
          Math.round(bounds.centerY / this.gridSize) * this.gridSize;
        const bottomGrid =
          Math.round(bounds.bottom / this.gridSize) * this.gridSize;

        if (Math.abs(bounds.top - topGrid) < threshold) {
          nextCY = topGrid + bounds.height / 2;
          snappedY = true;
          this.drawHorizontalGuide(topGrid);
        } else if (Math.abs(bounds.centerY - centerGrid) < threshold) {
          nextCY = centerGrid;
          snappedY = true;
          this.drawHorizontalGuide(centerGrid);
        } else if (Math.abs(bounds.bottom - bottomGrid) < threshold) {
          nextCY = bottomGrid - bounds.height / 2;
          snappedY = true;
          this.drawHorizontalGuide(bottomGrid);
        }
      }
    }

    if (snappedX || snappedY) {
      this.setCenter(obj, nextCX, nextCY);
    }

    this.canvas.requestRenderAll();
  }

  private snapToLayoutFrames(
    _obj: FabricObject,
    bounds: Bounds,
    threshold: number,
    nextCX: number,
    nextCY: number,
    snappedX: boolean,
    snappedY: boolean,
  ) {
    if (!this.layoutManager) {
      return { nextCX, nextCY, snappedX, snappedY };
    }

    for (const boundary of this.layoutManager.getSnapBoundaries()) {
      if (boundary.type === "vertical" && !snappedX) {
        if (Math.abs(bounds.left - boundary.x) < threshold) {
          nextCX = boundary.x + bounds.width / 2;
          snappedX = true;
          this.drawVerticalGuide(boundary.x);
        } else if (Math.abs(bounds.right - boundary.x) < threshold) {
          nextCX = boundary.x - bounds.width / 2;
          snappedX = true;
          this.drawVerticalGuide(boundary.x);
        } else if (Math.abs(bounds.centerX - boundary.x) < threshold) {
          nextCX = boundary.x;
          snappedX = true;
          this.drawVerticalGuide(boundary.x);
        }
      } else if (boundary.type === "horizontal" && !snappedY) {
        if (Math.abs(bounds.top - boundary.y) < threshold) {
          nextCY = boundary.y + bounds.height / 2;
          snappedY = true;
          this.drawHorizontalGuide(boundary.y);
        } else if (Math.abs(bounds.bottom - boundary.y) < threshold) {
          nextCY = boundary.y - bounds.height / 2;
          snappedY = true;
          this.drawHorizontalGuide(boundary.y);
        } else if (Math.abs(bounds.centerY - boundary.y) < threshold) {
          nextCY = boundary.y;
          snappedY = true;
          this.drawHorizontalGuide(boundary.y);
        }
      }
    }

    return { nextCX, nextCY, snappedX, snappedY };
  }

  private clearGuides() {
    if (this.guideLines.length === 0) return;
    this.guideLines.forEach((line) => this.canvas.remove(line));
    this.guideLines = [];
  }

  private guideStrokeWidth() {
    return 1 / (this.canvas.getZoom() || 1);
  }

  private drawVerticalGuide(x: number) {
    const { height } = this.getLogicalSize();
    const line = new Line([x, 0, x, height], {
      stroke: "#ef4444",
      strokeWidth: this.guideStrokeWidth(),
      selectable: false,
      evented: false,
      excludeFromExport: true,
      opacity: 0.9,
    });
    this.guideLines.push(line);
    this.canvas.add(line);
  }

  private drawHorizontalGuide(y: number) {
    const { width } = this.getLogicalSize();
    const line = new Line([0, y, width, y], {
      stroke: "#ef4444",
      strokeWidth: this.guideStrokeWidth(),
      selectable: false,
      evented: false,
      excludeFromExport: true,
      opacity: 0.9,
    });
    this.guideLines.push(line);
    this.canvas.add(line);
  }
}
