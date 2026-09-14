import { Canvas, Rect, Object as FabricObject } from "fabric";

export interface GridFrame {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  object: Rect;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  cells: { x: number; y: number; width: number; height: number }[];
}

export interface SnapBoundary {
  x: number;
  y: number;
  type: "vertical" | "horizontal";
}

export class LayoutManager {
  private canvas: Canvas;
  private frames: GridFrame[] = [];
  private isLayoutActive = false;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public getIsLayoutActive(): boolean {
    return this.isLayoutActive;
  }

  public getFrames(): GridFrame[] {
    return this.frames;
  }

  public applyLayout(template: LayoutTemplate) {
    this.clearLayout();

    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    template.cells.forEach((cell, index) => {
      const frame = new Rect({
        left: (cell.x / 100) * canvasWidth,
        top: (cell.y / 100) * canvasHeight,
        width: (cell.width / 100) * canvasWidth,
        height: (cell.height / 100) * canvasHeight,
        fill: "rgba(200, 200, 200, 0.1)",
        stroke: "rgba(100, 100, 100, 0.5)",
        strokeWidth: 2,
        strokeDashArray: [8, 4],
        selectable: true,
        evented: true,
        hasControls: false,
        hasBorders: true,
        name: `grid-frame-${index}`,
        hoverCursor: "pointer",
      });

      this.frames.push({
        id: `frame-${index}`,
        left: frame.left!,
        top: frame.top!,
        width: frame.width!,
        height: frame.height!,
        object: frame,
      });

      this.canvas.add(frame);
    });

    this.isLayoutActive = true;
    this.canvas.renderAll();
  }

  public clearLayout() {
    this.frames.forEach((frame) => {
      this.canvas.remove(frame.object);
    });
    this.frames = [];
    this.isLayoutActive = false;
    this.canvas.renderAll();
  }

  public getFrameAtPosition(x: number, y: number): GridFrame | null {
    return (
      this.frames.find((frame) => {
        return (
          x >= frame.left &&
          x <= frame.left + frame.width &&
          y >= frame.top &&
          y <= frame.top + frame.height
        );
      }) || null
    );
  }

  public getSnapBoundaries(): SnapBoundary[] {
    const boundaries: SnapBoundary[] = [];

    this.frames.forEach((frame) => {
      boundaries.push({ x: frame.left, y: 0, type: "vertical" });
      boundaries.push({ x: frame.left + frame.width, y: 0, type: "vertical" });

      boundaries.push({ x: 0, y: frame.top, type: "horizontal" });
      boundaries.push({
        x: 0,
        y: frame.top + frame.height,
        type: "horizontal",
      });
    });

    return boundaries;
  }
}
