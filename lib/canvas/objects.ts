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

  addRectangle() {
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: "#3b82f6",
      rx: 8,
      ry: 8,
    });
    this.addToCanvas(rect);
    return rect;
  }

  addCircle() {
    const circle = new Circle({
      left: 150,
      top: 150,
      radius: 75,
      fill: "#ef4444",
    });
    this.addToCanvas(circle);
    return circle;
  }

  addTriangle() {
    const triangle = new Triangle({
      left: 200,
      top: 200,
      width: 150,
      height: 150,
      fill: "#10b981",
    });
    this.addToCanvas(triangle);
    return triangle;
  }

  addArrow() {
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    const startX = width / 2 - 100;
    const startY = height / 2;
    const endX = width / 2 + 100;
    const endY = height / 2;

    const line = new Line([startX, startY, endX, endY], {
      stroke: "#000",
      strokeWidth: 4,
      strokeLineCap: "round",
    });

    const angle = Math.atan2(endY - startY, endX - startX);
    const headSize = 15;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const arrowHead = new Polygon(
      [
        { x: endX, y: endY },
        {
          x: endX - headSize * cos + headSize * sin,
          y: endY - headSize * sin - headSize * cos,
        },
        {
          x: endX - headSize * cos - headSize * sin,
          y: endY - headSize * sin + headSize * cos,
        },
      ],
      { fill: "#000" },
    );

    const group = new Group([line, arrowHead], {
      left: width / 2,
      top: height / 2,
      originX: "center",
      originY: "center",
    });

    this.addToCanvas(group);
    return group;
  }

  addText(text: string) {
    const textbox = new Textbox(text, {
      left: 100,
      top: 100,
      width: 300,
      fontSize: 32,
      fontFamily: "Inter",
      fill: "#000",
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
