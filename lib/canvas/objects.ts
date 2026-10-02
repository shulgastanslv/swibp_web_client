import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Textbox,
  Text,
  IText,
  Polygon,
  Group,
  Object as FabricObject,
  Image,
} from "fabric";

const CODE_BLOCK_BG_4K =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=3840&h=2160&q=80";

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type Side = "left" | "right";
export type SlideNumberStyle = "1" | "01" | "1 / 8";

const CORNER_MARGIN = 64;
const CORNER_FONT = "Inter, sans-serif";
const CORNER_MUTED = "#64748b";
const CORNER_INK = "#0f172a";

export function formatSlideNumber(
  style: SlideNumberStyle,
  index: number,
  total: number,
): string {
  const n = index + 1;
  switch (style) {
    case "01":
      return String(n).padStart(2, "0");
    case "1 / 8":
      return `${n} / ${total}`;
    default:
      return String(n);
  }
}

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

  /** Logical (unzoomed) slide size. */
  private getLogicalSize() {
    const zoom = this.canvas.getZoom() || 1;
    return {
      width: (this.canvas.width || 1080) / zoom,
      height: (this.canvas.height || 1080) / zoom,
    };
  }

  /** Position + origin so an object hugs the given corner with CORNER_MARGIN inset. */
  private getCornerPosition(corner: Corner) {
    const { width, height } = this.getLogicalSize();
    const isRight = corner.endsWith("right");
    const isBottom = corner.startsWith("bottom");
    return {
      left: isRight ? width - CORNER_MARGIN : CORNER_MARGIN,
      top: isBottom ? height - CORNER_MARGIN : CORNER_MARGIN,
      originX: (isRight ? "right" : "left") as "left" | "right",
      originY: (isBottom ? "bottom" : "top") as "top" | "bottom",
    };
  }

  // ── CORNER BLOCKS ──────────────────────────────────────────────────

  /** Slide counter pinned to a corner (default: top-left). */
  addSlideNumber(
    style: SlideNumberStyle,
    index: number,
    total: number,
    corner: Corner = "top-left",
  ): IText {
    const text = new IText(formatSlideNumber(style, index, total), {
      ...this.getCornerPosition(corner),
      fontSize: 25,
      fontFamily: CORNER_FONT,
      fontWeight: "400",
      fill: CORNER_MUTED,
    });
    this.addToCanvas(text);
    return text;
  }

  /**
   * Author handle at the top edge, aligned left or right.
   * Optional platform label (Telegram, Threads…) sits in a muted line above the handle.
   */
  addCornerHandle(
    handle = "@username",
    side: Side = "right",
    platform?: string,
  ): Group {
    const corner: Corner = side === "right" ? "top-right" : "top-left";
    const pos = this.getCornerPosition(corner);
    const align = side === "right" ? "right" : "left";

    const parts: FabricObject[] = [];
    let cursorY = 0;

    if (platform) {
      const label = new IText(platform, {
        originX: align,
        originY: "top",
        left: 0,
        top: cursorY,
        fontSize: 22,
        fontFamily: CORNER_FONT,
        fontWeight: "500",
        fill: CORNER_MUTED,
        textAlign: align,
      });
      parts.push(label);
      cursorY += label.height + 6;
    }

    parts.push(
      new IText(handle, {
        originX: align,
        originY: "top",
        left: 0,
        top: cursorY,
        fontSize: 32,
        fontFamily: CORNER_FONT,
        fontWeight: "600",
        fill: CORNER_INK,
        textAlign: align,
      }),
    );

    const group = new Group(parts, {
      ...pos,
      subTargetCheck: true,
      interactive: true,
    });
    this.addToCanvas(group);
    return group;
  }

  /** Text swipe cue (e.g. "->") pinned bottom-right. */
  addSwipeArrow(text = "->", corner: Corner = "bottom-right"): IText {
    const arrow = new IText(text, {
      ...this.getCornerPosition(corner),
      fontSize: 56,
      fontFamily: "Consolas, 'Courier New', monospace",
      fontWeight: "700",
      fill: CORNER_INK,
    });
    this.addToCanvas(arrow);
    return arrow;
  }

  /** Bottom-left "// info" caption plus a bottom-right swipe arrow. */
  addSwipeInfo(
    info = "info",
    arrowText = "->",
  ): { info: IText; arrow: IText } {
    const caption = new IText(`// ${info}`, {
      ...this.getCornerPosition("bottom-left"),
      fontSize: 28,
      fontFamily: "Consolas, 'Courier New', monospace",
      fontWeight: "500",
      fill: CORNER_MUTED,
    });
    this.canvas.add(caption);
    const arrow = this.addSwipeArrow(arrowText);
    return { info: caption, arrow };
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


  addHeading(text = "New Heading", x?: number, y?: number): Textbox {
    const pos = this.getPosition(x, y);

    const tb = new Textbox(text, {
      ...pos,
      fontSize: 80,
      fontWeight: "bold",
      fontFamily: "Inter, sans-serif",
      fill: "#0f172a",
      lineHeight: 0.8,
    });

    tb.initDimensions();

    const actualWidth = Math.ceil(tb.calcTextWidth()) + 4;

    tb.set({ width: actualWidth });
    tb.setCoords();

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
      lineHeight: 0.8,
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
      lineHeight: 0.8,
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

  addCodeBlock(
    code = "// Paste your code",
    x?: number,
    y?: number,
  ): Group {
    const pos = this.getPosition(x, y);
    const textW = 760;
    const padX = 36;
    const padTop = 52;
    const padBottom = 28;
    const radius = 16;
    const totalW = textW + padX * 2;
    const minH = 200;

    const codeText = new Textbox(code, {
      width: textW,
      fontSize: 26,
      fontFamily: "Consolas, 'Courier New', monospace",
      fill: "#f8fafc",
      lineHeight: 1.45,
      splitByGrapheme: true,
      editable: true,
      originX: "left",
      originY: "top",
    });

    const contentHeight = () =>
      Math.max(minH, codeText.calcTextHeight() + padTop + padBottom);

    let totalH = contentHeight();

    const pinTopLeft = (obj: FabricObject, height: number) => {
      obj.set({
        left: -totalW / 2,
        top: -height / 2,
        originX: "left",
        originY: "top",
      });
    };

    let photo: FabricObject = new Rect({
      width: totalW,
      height: totalH,
      fill: "#0d1117",
      rx: radius,
      ry: radius,
      evented: false,
      selectable: false,
    });
    pinTopLeft(photo, totalH);

    let naturalW = totalW;
    let naturalH = totalH;

    const coverPhoto = (img: Image, height: number) => {
      const scale = Math.max(totalW / naturalW, height / naturalH);
      const cropW = totalW / scale;
      const cropH = height / scale;
      img.set({
        cropX: Math.max(0, (naturalW - cropW) / 2),
        cropY: Math.max(0, (naturalH - cropH) / 2),
        width: cropW,
        height: cropH,
        scaleX: scale,
        scaleY: scale,
      });
      pinTopLeft(img, height);
    };

    const scrim = new Rect({
      width: totalW,
      height: totalH,
      rx: radius,
      ry: radius,
      fill: "rgba(6, 10, 18, 0.58)",
      evented: false,
      selectable: false,
    });
    pinTopLeft(scrim, totalH);

    const dots = ["#ff5f57", "#febc2e", "#28c840"].map((fill, i) => {
      const dot = new Circle({
        radius: 6,
        fill,
        originX: "left",
        originY: "top",
        evented: false,
        selectable: false,
      });
      dot.set({
        left: -totalW / 2 + 22 + i * 20,
        top: -totalH / 2 + 18,
      });
      return dot;
    });

    codeText.set({
      left: -textW / 2,
      top: -totalH / 2 + padTop,
    });

    const clip = new Rect({
      width: totalW,
      height: totalH,
      rx: radius,
      ry: radius,
      originX: "center",
      originY: "center",
    });

    const group = new Group([photo, scrim, ...dots, codeText], {
      ...pos,
      subTargetCheck: true,
      interactive: true,
      clipPath: clip,
    });

    const syncFrame = () => {
      const nextH = contentHeight();
      if (Math.abs(nextH - totalH) < 1) return;
      totalH = nextH;

      if (photo.type === "image") coverPhoto(photo as Image, totalH);
      else {
        photo.set({ height: totalH });
        pinTopLeft(photo, totalH);
      }

      scrim.set({ height: totalH });
      pinTopLeft(scrim, totalH);
      dots.forEach((dot, i) => {
        dot.set({
          left: -totalW / 2 + 22 + i * 20,
          top: -totalH / 2 + 18,
        });
      });
      codeText.set({ top: -totalH / 2 + padTop });
      clip.set({ height: totalH });
      relayout();
    };

    const relayout = () => {
      const originY = group.originY ?? "center";
      const topBefore = group.top ?? 0;
      const heightBefore = group.getScaledHeight();
      const topEdge =
        originY === "center" ? topBefore - heightBefore / 2 : topBefore;

      group.set({ dirty: true });
      group.triggerLayout();

      const heightAfter = group.getScaledHeight();
      if (originY === "center") {
        group.set({ top: topEdge + heightAfter / 2 });
      }
      group.setCoords();
      this.canvas.requestRenderAll();
    };

    codeText.on("changed", syncFrame);
    this.addToCanvas(group);
    codeText.enterEditing();
    codeText.selectAll();
    this.canvas.requestRenderAll();

    void Image.fromURL(CODE_BLOCK_BG_4K, { crossOrigin: "anonymous" })
      .then((img) => {
        if (!group.canvas) return;
        naturalW = img.width || totalW;
        naturalH = img.height || totalH;
        coverPhoto(img, totalH);
        img.set({ evented: false, selectable: false });
        const index = group.getObjects().indexOf(photo);
        group.remove(photo);
        group.insertAt(Math.max(index, 0), img);
        photo = img;
        relayout();
      })
      .catch((err) => {
        console.error("Code block background failed:", err);
      });

    return group;
  }

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


  private addToCanvas(obj: FabricObject) {
    this.canvas.add(obj);
    this.canvas.setActiveObject(obj);
    this.canvas.renderAll();
  }
}
