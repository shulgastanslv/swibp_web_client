import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Textbox,
  Text,
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

  private getCenter() {
    return {
      x: (this.canvas.width || 1080) / 2,
      y: (this.canvas.height || 1080) / 2,
    };
  }

  private getPosition(x?: number, y?: number) {
    if (x !== undefined && y !== undefined) {
      return { left: x, top: y, originX: "center" as const, originY: "center" as const };
    }
    const c = this.getCenter();
    return { left: c.x, top: c.y, originX: "center" as const, originY: "center" as const };
  }

  // ── EXISTING METHODS (keep exactly as before) ──────────────────────

  addLine(x?: number, y?: number): Line {
    const pos = this.getPosition(x, y);
    const length = 200;
    const line = new Line([-length / 2, 0, length / 2, 0], {
      stroke: "#000000",
      strokeWidth: 3,
      left: pos.left,
      top: pos.top,
    });
    this.addToCanvas(line);
    return line;
  }

  async addImage(url: string): Promise<void> {
    const isRemote = /^https?:\/\//i.test(url);
    const img = await Image.fromURL(
      url,
      isRemote ? { crossOrigin: "anonymous" } : undefined,
    );
    const zoom = this.canvas.getZoom() || 1;
    const width = (this.canvas.width || 1080) / zoom;
    const height = (this.canvas.height || 1080) / zoom;
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
      ...pos,
    });
    this.addToCanvas(rect);
    return rect;
  }

  addCircle(x?: number, y?: number) {
    const pos = this.getPosition(x, y);
    const circle = new Circle({
      radius: 75,
      fill: "#ef4444",
      ...pos,
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
      ...pos,
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
    const group = new Group([line, arrowHead], pos);
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
      ...pos,
    });
    this.addToCanvas(textbox);
    const actualWidth = textbox.calcTextWidth();
    if (actualWidth < textbox.width) {
      textbox.set({ width: actualWidth });
      this.canvas.renderAll();
    }
    return textbox;
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

  // ── NEW ELEMENT METHODS ────────────────────────────────────────────

  addHeading(text = "New Heading", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);

    const tb = new Textbox(text, {
      ...pos,
      fontSize: 80,
      fontWeight: "bold",
      fontFamily: "Inter, sans-serif",
      fill: "#0f172a",
      lineHeight: 1.1,
    });

    // Принудительно рассчитываем геометрию текста
    tb.initDimensions();

    // Получаем реальную ширину текста (с запасом 2-4px для предотвращения переноса)
    const actualWidth = Math.ceil(tb.calcTextWidth()) + 4;

    // Устанавливаем ширину ровно под текст
    tb.set({ width: actualWidth });
    tb.setCoords(); // Обязательно обновляем синюю рамку выделения

    this.addToCanvas(tb);
    this.canvas.renderAll();

    return tb;
  }

  addSubtitle(text = "Your subtitle goes here", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);
    const tb = new Textbox(text, {
      ...pos,
      fontSize: 40,
      fontFamily: "Inter, sans-serif",
      fill: "#64748b",
      width: 700,
      lineHeight: 1.4,
    });
    this.addToCanvas(tb);
    const actualWidth = tb.calcTextWidth();
    if (actualWidth < tb.width) {
      tb.set({ width: actualWidth });
      this.canvas.renderAll();
    }
    return tb;
  }

  addParagraph(text = "Your paragraph text goes here. Add supporting details and information.", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);
    const tb = new Textbox(text, {
      ...pos,
      fontSize: 28,
      fontFamily: "Inter, sans-serif",
      fill: "#334155",
      width: 700,
      lineHeight: 1.6,
    });
    this.addToCanvas(tb);
    const actualWidth = tb.calcTextWidth();
    if (actualWidth < tb.width) {
      tb.set({ width: actualWidth });
      this.canvas.renderAll();
    }
    return tb;
  }

  addQuote(text = "First impressions are everything.", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);
    const tb = new Textbox(`❝  ${text}`, {
      ...pos,
      fontSize: 44,
      fontStyle: "italic",
      fontFamily: "Georgia, serif",
      fill: "#475569",
      width: 700,
      lineHeight: 1.5,
    });
    this.addToCanvas(tb);
    const actualWidth = tb.calcTextWidth();
    if (actualWidth < tb.width) {
      tb.set({ width: actualWidth });
      this.canvas.renderAll();
    }
    return tb;
  }

  addCodeBlock(code = "const hello = 'world';", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);
    const textW = 760;
    const padX = 40;
    const padY = 32;
    const totalW = textW + padX * 2;
    const totalH = 120;


    const bg = new Rect({
      left: -totalW / 2,
      top: -totalH / 2,
      width: totalW,
      height: totalH,
      fill: "#0d1117",
      rx: 12,
      ry: 12,
    });

    const dot1 = new Circle({ left: -totalW / 2 + 20, top: -totalH / 2 + 18, radius: 7, fill: "#ff5f57" });
    const dot2 = new Circle({ left: -totalW / 2 + 40, top: -totalH / 2 + 18, radius: 7, fill: "#febc2e" });
    const dot3 = new Circle({ left: -totalW / 2 + 60, top: -totalH / 2 + 18, radius: 7, fill: "#28c840" });

    const codeText = new Textbox(code, {
      left: -textW / 2,
      top: -totalH / 2 + padY,
      width: textW,
      fontSize: 28,
      fontFamily: "'Courier New', Courier, monospace",
      fill: "#58a6ff",
    });

    const group = new Group([bg, dot1, dot2, dot3, codeText], pos);
    this.addToCanvas(group);
    return group;
  }

  addTag(label = "CATEGORY", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);
    const fontSize = 24;
    const padX = 36;
    const padY = 16;
    const estW = Math.max(label.length * fontSize * 0.58 + padX * 2, 120);
    const estH = fontSize + padY * 2;

    const bg = new Rect({
      left: -estW / 2,
      top: -estH / 2,
      width: estW,
      height: estH,
      fill: "#f1f5f9",
      rx: estH / 2,
      ry: estH / 2,
    });

    const text = new Textbox(label, {
      left: -estW / 2 + padX,
      top: -estH / 2 + padY,
      width: estW - padX * 2,
      fontSize,
      fontFamily: "Inter, sans-serif",
      fontWeight: "700",
      fill: "#0f172a",
      textAlign: "center",
    });

    const group = new Group([bg, text], pos);
    this.addToCanvas(group);
    return group;
  }

  addStarRating(text = "★★★★★  5.0", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);
    const tb = new Textbox(text, {
      ...pos,
      fontSize: 52,
      fontFamily: "Inter, sans-serif",
      fill: "#f59e0b",
      width: 500,
    });
    this.addToCanvas(tb);
    const actualWidth = tb.calcTextWidth();
    if (actualWidth < tb.width) {
      tb.set({ width: actualWidth });
      this.canvas.renderAll();
    }
    return tb;
  }

  addSwipeTag(label = "SWIPE ➔", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);
    const fontSize = 26;
    const padX = 32;
    const padY = 14;
    const estW = Math.max(label.length * fontSize * 0.55 + padX * 2, 140);
    const estH = fontSize + padY * 2;

    const bg = new Rect({
      left: -estW / 2,
      top: -estH / 2,
      width: estW,
      height: estH,
      fill: "#0f172a",
      rx: estH / 2,
      ry: estH / 2,
    });

    const text = new Textbox(label, {
      left: -estW / 2 + padX,
      top: -estH / 2 + padY,
      width: estW - padX * 2,
      fontSize,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fill: "#ffffff",
      textAlign: "center",
    });

    const group = new Group([bg, text], pos);
    this.addToCanvas(group);
    return group;
  }

  addCTAButton(label = "Follow for More →", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);
    const fontSize = 36;
    const padX = 72;
    const padY = 28;
    const estW = Math.max(label.length * fontSize * 0.5 + padX * 2, 300);
    const estH = fontSize + padY * 2;

    const bg = new Rect({
      left: -estW / 2,
      top: -estH / 2,
      width: estW,
      height: estH,
      fill: "#3b82f6",
      rx: estH / 2,
      ry: estH / 2,
    });

    const text = new Textbox(label, {
      left: -estW / 2 + padX,
      top: -estH / 2 + padY,
      width: estW - padX * 2,
      fontSize,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fill: "#ffffff",
      textAlign: "center",
    });

    const group = new Group([bg, text], pos);
    this.addToCanvas(group);
    return group;
  }

  addBadge(label = "NEW", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);
    const fontSize = 22;
    const padX = 24;
    const padY = 10;
    const estW = Math.max(label.length * fontSize * 0.6 + padX * 2, 80);
    const estH = fontSize + padY * 2;

    const bg = new Rect({
      left: -estW / 2,
      top: -estH / 2,
      width: estW,
      height: estH,
      fill: "#6366f1",
      rx: 8,
      ry: 8,
    });

    const text = new Textbox(label, {
      left: -estW / 2 + padX,
      top: -estH / 2 + padY,
      width: estW - padX * 2,
      fontSize,
      fontFamily: "Inter, sans-serif",
      fontWeight: "700",
      fill: "#ffffff",
      textAlign: "center",
    });

    const group = new Group([bg, text], pos);
    this.addToCanvas(group);
    return group;
  }

  addHandle(username = "@username", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);
    const tb = new Textbox(username, {
      ...pos,
      fontSize: 30,
      fontFamily: "Inter, sans-serif",
      fill: "#94a3b8",
      width: 400,
    });
    this.addToCanvas(tb);
    const actualWidth = tb.calcTextWidth();
    if (actualWidth < tb.width) {
      tb.set({ width: actualWidth });
      this.canvas.renderAll();
    }
    return tb;
  }

  addDividerLine(x?: number, y?: number): Line {
    const pos = this.getPosition(x, y);
    const w = (this.canvas.width || 1080) * 0.75;
    const line = new Line([0, 0, w, 0], {
      left: pos.left - w / 2,
      top: pos.top,
      stroke: "#cbd5e1",
      strokeWidth: 3,
    });
    this.addToCanvas(line);
    return line;
  }

  // ── Private helpers ────────────────────────────────────────────────

  private addToCanvas(obj: FabricObject) {
    this.canvas.add(obj);
    this.canvas.setActiveObject(obj);
    this.canvas.renderAll();
  }
}
