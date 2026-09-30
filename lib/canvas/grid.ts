import { Canvas, Line, Group, Object as FabricObject, Point } from "fabric";
import { LayoutManager } from "./layouts";

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

/**
 * Visual grid + smart guides.
 * Hold Ctrl/⌘ while dragging to snap to canvas center, edges, and other objects.
 */
export class GridManager {
  private canvas: Canvas;
  public isGridVisible = false;
  private gridSize = 50;
  private gridColor = "rgba(128,128,128,0.15)";
  private gridGroup: Group | null = null;
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

  public setGridSize(size: number) {
    this.gridSize = Math.max(4, size);
    if (this.isGridVisible) this.refreshGrid();
  }

  public setGridColor(color: string) {
    this.gridColor = color;
    if (this.isGridVisible) this.refreshGrid();
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

  /** Canvas content was replaced (loadFromJSON/clear) and the grid group is gone. */
  public redraw() {
    if (this.isGridVisible) this.refreshGrid();
  }

  public hideGrid() {
    this.isGridVisible = false;
    if (this.gridGroup) {
      this.canvas.remove(this.gridGroup);
      this.gridGroup = null;
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
    if (obj === this.gridGroup) return false;
    if (obj.excludeFromExport) return false;
    if (obj.selectable === false && obj.evented === false) return false;
    return true;
  }

  private refreshGrid() {
    if (this.gridGroup) {
      this.canvas.remove(this.gridGroup);
      this.gridGroup = null;
    }

    const { width, height } = this.getLogicalSize();
    const lines: Line[] = [];

    for (let x = 0; x <= width; x += this.gridSize) {
      lines.push(
        new Line([x, 0, x, height], {
          stroke: this.gridColor,
          strokeWidth: 1 / (this.canvas.getZoom() || 1),
          selectable: false,
          evented: false,
        }),
      );
    }
    for (let y = 0; y <= height; y += this.gridSize) {
      lines.push(
        new Line([0, y, width, y], {
          stroke: this.gridColor,
          strokeWidth: 1 / (this.canvas.getZoom() || 1),
          selectable: false,
          evented: false,
        }),
      );
    }

    this.gridGroup = new Group(lines, {
      selectable: false,
      evented: false,
      excludeFromExport: true,
      objectCaching: false,
    });
    this.canvas.add(this.gridGroup);
    this.canvas.sendObjectToBack(this.gridGroup);
    this.canvas.requestRenderAll();
  }

  private setupSmartGuides() {
    this.canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (!obj || obj.excludeFromExport) return;

      const fromEvent = !!(e.e && ((e.e as MouseEvent).ctrlKey || (e.e as MouseEvent).metaKey));
      const active = this.ctrlHeld || fromEvent;

      if (!active) {
        this.clearGuides();
        return;
      }

      this.clearGuides();
      this.snapWhileMoving(obj);
    });

    this.canvas.on("mouse:up", () => this.clearGuides());
    this.canvas.on("selection:cleared", () => this.clearGuides());
  }

  private snapWhileMoving(obj: FabricObject) {
    const { width, height, zoom } = this.getLogicalSize();
    const threshold = this.snapThreshold / zoom;
    let bounds = this.getBounds(obj);

    let nextCX = bounds.centerX;
    let nextCY = bounds.centerY;
    let snappedX = false;
    let snappedY = false;

    // ── Canvas center ─────────────────────────────────────────────
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

    // ── Canvas edges ──────────────────────────────────────────────
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

    // ── Other objects ─────────────────────────────────────────────
    const others = this.canvas.getObjects().filter((o) => o !== obj && this.isSnapTarget(o));

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

    // ── Grid lines (when visible) ─────────────────────────────────
    if (this.isGridVisible) {
      if (!snappedX) {
        const gx = Math.round(bounds.centerX / this.gridSize) * this.gridSize;
        if (Math.abs(bounds.centerX - gx) < threshold) {
          nextCX = gx;
          snappedX = true;
          this.drawVerticalGuide(gx);
        }
      }
      if (!snappedY) {
        const gy = Math.round(bounds.centerY / this.gridSize) * this.gridSize;
        if (Math.abs(bounds.centerY - gy) < threshold) {
          nextCY = gy;
          snappedY = true;
          this.drawHorizontalGuide(gy);
        }
      }
    }

    // ── Layout frames ─────────────────────────────────────────────
    if (this.layoutManager?.getIsLayoutActive()) {
      const result = this.snapToLayoutFrames(obj, bounds, threshold, nextCX, nextCY, snappedX, snappedY);
      nextCX = result.nextCX;
      nextCY = result.nextCY;
      snappedX = result.snappedX;
      snappedY = result.snappedY;
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
