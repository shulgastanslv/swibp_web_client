import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Textbox,
  Polygon,
  Group,
  Object as FabricObject,
  Image,
} from "fabric";

export class ObjectFactory {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  private getPosition(x?: number, y?: number) {
    if (x !== undefined && y !== undefined) {
      return { left: x, top: y, originX: "center", originY: "center" };
    }
    return { left: 100, top: 100, originX: "left", originY: "top" };
  }

   addLine(x?: number, y?: number): Line {
    const pos = this.getPosition(x, y);
    const length = 200;
    const startX = -length / 2;
    const endX = length / 2;

    const line = new Line([startX, 0, endX, 0], {
      stroke: "#000000",
      strokeWidth: 3,
      left: pos.left,
      top: pos.top,
    });

    this.addToCanvas(line);
    return line;
    return line;
  }

  async addImage(url: string): Promise<void> {
    const img = await Image.fromURL(url);
    const width = this.canvas.width || 1080;
    const height = this.canvas.height || 1080;
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
  }

  addRectangle(x?: number, y?: number) {
    const pos = this.getPosition(x, y);
    const rect = new Rect({
      width: 200,
      height: 150,
      fill: "#3b82f6",
      rx: 8,
      ry: 8,
      left: pos.left,
      top: pos.top,
      originX: "center",
      originY: "center",
    });
    this.addToCanvas(rect);
    return rect;
  }

  addCircle(x?: number, y?: number) {
    const pos = this.getPosition(x, y);
    const circle = new Circle({
      radius: 75,
      fill: "#ef4444",
      left: pos.left,
      top: pos.top,
    });
    this.addToCanvas(circle);
    return circle;
  }

  addTriangle(x?: number, y?: number) {
    const pos = this.getPosition(x, y);
    const triangle = new Triangle({
      width: 150,
      height: 150,
      fill: "#10b981",
      left: pos.left,
      top: pos.top,
    });
    this.addToCanvas(triangle);
    return triangle;
  }

  addArrow(x?: number, y?: number) {
    const pos = this.getPosition(x, y);

    const length = 200;
    const headSize = 15;

    const line = new Line([-length / 2, 0, length / 2, 0], {
      stroke: "#000",
      strokeWidth: 4,
      strokeLineCap: "round",
    });

    const arrowHead = new Polygon(
      [
        { x: length / 2, y: 0 },
        { x: length / 2 - headSize, y: -headSize },
        { x: length / 2 - headSize, y: headSize },
      ],
      { fill: "#000" },
    );

    const group = new Group([line, arrowHead], {
      left: pos.left,
      top: pos.top,
    });

    this.addToCanvas(group);
    return group;
  }

  addText(text: string, x?: number, y?: number) {
    const pos = this.getPosition(x, y);
    const textbox = new Textbox(text, {
      width: 300,
      fontSize: 32,
      fontFamily: "Inter",
      fill: "#000",
      left: pos.left,
      top: pos.top,
    });
    this.addToCanvas(textbox);
    return textbox;
  }

  private addToCanvas(obj: FabricObject) {
    this.canvas.add(obj);
    this.canvas.setActiveObject(obj);
    this.canvas.renderAll();
  }

  deleteSelected() {
    const activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach((obj) => this.canvas.remove(obj));
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  duplicateSelected() {
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
}
