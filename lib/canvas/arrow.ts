import { Canvas, Line, Polygon, Object as FabricObject, Point } from "fabric";

export class ConnectorArrow {
  public id: string;
  public line: Line;
  public head: Polygon;
  public fromObj: FabricObject;
  public toObj: FabricObject;
  public headSize: number = 14;

  constructor(
    fromObj: FabricObject,
    toObj: FabricObject,
    options: { color?: string; strokeWidth?: number } = {},
  ) {
    this.id = `connector_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.fromObj = fromObj;
    this.toObj = toObj;

    const strokeColor = options.color || "#0f172a";
    const strokeWidth = options.strokeWidth || 3;

    this.line = new Line([0, 0, 0, 0], {
      stroke: strokeColor,
      strokeWidth,
      strokeLineCap: "round",
      selectable: false,
      evented: false,
    });

    this.head = new Polygon(
      [
        { x: 0, y: 0 },
        { x: -this.headSize, y: -this.headSize * 0.6 },
        { x: -this.headSize, y: this.headSize * 0.6 },
      ],
      {
        fill: strokeColor,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      },
    );

    this.update();
  }

  // Расчёт точки на краю bounding box объекта в направлении target
  private getEdgePoint(source: FabricObject, targetCenter: Point): Point {
    const center = this.getAbsoluteCenter(source);

    // Получаем актуальный размер объекта с учётом масштаба
    const halfW = (source.getScaledWidth()) / 2;
    const halfH = (source.getScaledHeight()) / 2;

    const dx = targetCenter.x - center.x;
    const dy = targetCenter.y - center.y;

    if (dx === 0 && dy === 0) return center;

    const scaleX = halfW / Math.abs(dx || 0.0001);
    const scaleY = halfH / Math.abs(dy || 0.0001);
    const scale = Math.min(scaleX, scaleY);

    return new Point(center.x + dx * scale, center.y + dy * scale);
  }
  public getAbsoluteCenter(obj: FabricObject): Point {
    return obj.getPointByOrigin("center", "center");
  }

  public update(): void {
    const fromCenter = this.getAbsoluteCenter(this.fromObj);
      const toCenter = this.getAbsoluteCenter(this.toObj);

    const start = this.getEdgePoint(this.fromObj, toCenter);
    const end = this.getEdgePoint(this.toObj, fromCenter);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    this.line.set({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    });
    this.line.setCoords();

    this.head.set({
      left: end.x,
      top: end.y,
      angle,
    });
    this.head.setCoords();
  }

  public addTo(canvas: Canvas): void {
    canvas.add(this.line, this.head);
    canvas.sendObjectToBack(this.line);
    canvas.sendObjectToBack(this.head);
    canvas.requestRenderAll();
  }

  public removeFrom(canvas: Canvas): void {
    canvas.remove(this.line, this.head);
  }
}


export class ArrowManager {
  private canvas: Canvas;
  private connectors: Map<string, ConnectorArrow> = new Map();

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.canvas.on("object:moving", (e) => this.handleObjectUpdate(e.target));
    this.canvas.on("object:scaling", (e) => this.handleObjectUpdate(e.target));
    this.canvas.on("object:rotating", (e) => this.handleObjectUpdate(e.target));
    this.canvas.on("object:removed", (e) => this.handleObjectRemoved(e.target));
  }

  private handleObjectUpdate(target?: FabricObject | null): void {
    if (!target) return;
    let needsRender = false;

    this.connectors.forEach((conn) => {
      if (conn.fromObj === target || conn.toObj === target) {
        conn.update();
        needsRender = true;
      }
    });

    if (needsRender) {
      this.canvas.requestRenderAll();
    }
  }

  private handleObjectRemoved(target?: FabricObject | null): void {
    if (!target) return;
    const toDelete: string[] = [];

    this.connectors.forEach((conn, id) => {
      if (conn.fromObj === target || conn.toObj === target) {
        conn.removeFrom(this.canvas);
        toDelete.push(id);
      }
    });

    toDelete.forEach((id) => this.connectors.delete(id));
  }

  public connect(fromObj: FabricObject, toObj: FabricObject): ConnectorArrow | null {
    if (fromObj === toObj) return null;

    const arrow = new ConnectorArrow(fromObj, toObj);
    arrow.addTo(this.canvas);
    this.connectors.set(arrow.id, arrow);
    this.canvas.requestRenderAll();
    return arrow;
  }

  public clear(): void {
    this.connectors.forEach((conn) => conn.removeFrom(this.canvas));
    this.connectors.clear();
  }
}
