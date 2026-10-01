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

  async addImage(
    url: string,
    options?: { maxSize?: number },
  ): Promise<void> {
    const isRemote = /^https?:\/\//i.test(url);
    const img = await Image.fromURL(
      url,
      isRemote ? { crossOrigin: "anonymous" } : undefined,
    );
    const zoom = this.canvas.getZoom() || 1;
    const width = (this.canvas.width || 1080) / zoom;
    const height = (this.canvas.height || 1080) / zoom;
    const scale = options?.maxSize
      ? Math.min(
          options.maxSize / (img.width || 1),
          options.maxSize / (img.height || 1),
          1,
        )
      : Math.min(
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

  /** Topic: title + subtitle text block. */
  addTag(
    title = "Your topic title",
    x?: number,
    y?: number,
  ): Group {
    const pos = this.getPosition(x, y);
    const w = 820;

    const heading = new Textbox(title, {
      left: -w / 2,
      top: -70,
      width: w,
      fontSize: 64,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fill: "#111111",
      lineHeight: 1.1,
    });

    const subtitle = new Textbox("Your subtitle goes here", {
      left: -w / 2,
      top: 20,
      width: w,
      fontSize: 32,
      fontFamily: "Inter, sans-serif",
      fontWeight: "400",
      fill: "#737373",
      lineHeight: 1.35,
    });

    const group = new Group([heading, subtitle], pos);
    this.addToCanvas(group);
    return group;
  }

  addStarRating(text = "★★★★★  5.0", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);
    const tb = new Textbox(text, {
      ...pos,
      fontSize: 52,
      fontFamily: "Inter, sans-serif",
      fill: "#111111",
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

  /** Swipe cue: label + right arrow. */
  addSwipeTag(label = "Swipe", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);

   

    const shaft = new Line([-28, 0, 36, 0], {
      stroke: "#111111",
      strokeWidth: 4,
      strokeLineCap: "round",
    });

    const head = new Polygon(
      [
        { x: 36, y: 0 },
        { x: 18, y: -14 },
        { x: 18, y: 14 },
      ],
      { fill: "#111111" },
    );

    const group = new Group([shaft, head], pos);
    this.addToCanvas(group);
    return group;
  }

  /** CTA: subscribe title + social icons row. */
  addCTAButton(
    label = "Подписаться",
    x?: number,
    y?: number,
  ): Group {
    const pos = this.getPosition(x, y);
    const w = 720;
    const socials = [
      { key: "IG", name: "Instagram" },
      { key: "TT", name: "TikTok" },
      { key: "YT", name: "YouTube" },
      { key: "X", name: "X" },
    ] as const;

    const title = new Textbox(label, {
      left: -w / 2,
      top: -90,
      width: w,
      fontSize: 48,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fill: "#111111",
      textAlign: "center",
    });

    const hint = new Textbox("в соцсетях", {
      left: -w / 2,
      top: -28,
      width: w,
      fontSize: 24,
      fontFamily: "Inter, sans-serif",
      fontWeight: "400",
      fill: "#737373",
      textAlign: "center",
    });

    const iconSize = 56;
    const gap = 20;
    const rowW = socials.length * iconSize + (socials.length - 1) * gap;
    const startX = -rowW / 2;

    const socialObjects: FabricObject[] = [];
    socials.forEach((social, i) => {
      const cx = startX + i * (iconSize + gap) + iconSize / 2;
      const cy = 48;

      const circle = new Circle({
        left: cx,
        top: cy,
        originX: "center",
        originY: "center",
        radius: iconSize / 2,
        fill: "#111111",
      });

      const letter = new Textbox(social.key, {
        left: cx - iconSize / 2,
        top: cy - 11,
        width: iconSize,
        fontSize: social.key.length > 1 ? 16 : 20,
        fontFamily: "Inter, sans-serif",
        fontWeight: "600",
        fill: "#ffffff",
        textAlign: "center",
      });

      const name = new Textbox(social.name, {
        left: cx - 48,
        top: cy + iconSize / 2 + 12,
        width: 96,
        fontSize: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        fill: "#737373",
        textAlign: "center",
      });

      socialObjects.push(circle, letter, name);
    });

    const group = new Group([title, hint, ...socialObjects], pos);
    this.addToCanvas(group);
    return group;
  }

  /** Step number for carousel sequences. */
  addBadge(step = "01", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);

    const number = new Textbox(step, {
      left: -80,
      top: -70,
      width: 160,
      fontSize: 120,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fill: "#111111",
      textAlign: "center",
      lineHeight: 1,
    });

    const caption = new Textbox("STEP", {
      left: -80,
      top: 60,
      width: 160,
      fontSize: 22,
      fontFamily: "Inter, sans-serif",
      fontWeight: "500",
      fill: "#737373",
      textAlign: "center",
      charSpacing: 200,
    });

    const group = new Group([number, caption], pos);
    this.addToCanvas(group);
    return group;
  }

  /** Handle: @username + channel label. */
  addHandle(username = "@username", x?: number, y?: number): Group {
    const pos = this.getPosition(x, y);
    const w = 480;

    const handle = new Textbox(username, {
      left: -w / 2,
      top: -36,
      width: w,
      fontSize: 36,
      fontFamily: "Inter, sans-serif",
      fontWeight: "600",
      fill: "#111111",
      textAlign: "center",
    });

    const channel = new Textbox("Your channel", {
      left: -w / 2,
      top: 16,
      width: w,
      fontSize: 24,
      fontFamily: "Inter, sans-serif",
      fontWeight: "400",
      fill: "#737373",
      textAlign: "center",
    });

    const group = new Group([handle, channel], pos);
    this.addToCanvas(group);
    return group;
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
