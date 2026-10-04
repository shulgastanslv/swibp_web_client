import { Point, type Canvas, type FabricObject, type TPointerEventInfo } from "fabric";
import { largestWindow, placeWindow, sourceDelta, windowAtZoom } from "./crop";

const MAX_ZOOM = 4;
const MIN_WINDOW = 8;

type CropImage = FabricObject & {
  cropX: number;
  cropY: number;
  getOriginalSize(): { width: number; height: number };
};

type Interaction = {
  lockMovementX: boolean;
  lockMovementY: boolean;
  lockScalingX: boolean;
  lockScalingY: boolean;
  lockRotation: boolean;
  hasControls: boolean;
  hoverCursor: string | undefined;
};

type Snapshot = Interaction & {
  cropX: number;
  cropY: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  clipScaleX: number;
  clipScaleY: number;
};

/**
 * Reframes the selected picture inside its current frame.
 * The frame stays put; dragging pans the photo and zoom tightens the window.
 */
export class ImageCropSession {
  image: CropImage | null = null;
  zoom = 1;
  maxZoom = MAX_ZOOM;

  private snapshot: Snapshot | null = null;
  private center = { x: 0, y: 0 };
  private frameCenter = new Point(0, 0);
  private cover = { width: 1, height: 1 };
  private visual = { w: 1, h: 1 };
  private natural = { width: 1, height: 1 };
  private clipBase: { scaleX: number; scaleY: number; width: number; height: number } | null = null;
  private dragging = false;
  private last: { x: number; y: number } | null = null;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly canvas: Canvas,
    private readonly onFinish: (changed: boolean) => void,
  ) {}

  get active() {
    return this.image != null;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  start(target: FabricObject | null) {
    if (!target || target.type !== "image") return false;
    if (this.image === target) return true;
    if (this.image) this.apply();

    const img = target as CropImage;
    const natural = img.getOriginalSize();
    if (!natural.width || !natural.height || !img.width || !img.height) return false;

    const clip = img.clipPath;
    this.snapshot = {
      cropX: img.cropX || 0,
      cropY: img.cropY || 0,
      width: img.width,
      height: img.height,
      scaleX: img.scaleX || 1,
      scaleY: img.scaleY || 1,
      lockMovementX: Boolean(img.lockMovementX),
      lockMovementY: Boolean(img.lockMovementY),
      lockScalingX: Boolean(img.lockScalingX),
      lockScalingY: Boolean(img.lockScalingY),
      lockRotation: Boolean(img.lockRotation),
      hasControls: img.hasControls !== false,
      hoverCursor: img.hoverCursor,
      clipScaleX: clip?.scaleX || 1,
      clipScaleY: clip?.scaleY || 1,
    };

    const ratio = img.width / img.height;
    this.cover = largestWindow(natural.width, natural.height, ratio);
    this.natural = natural;
    this.visual = {
      w: img.width * (img.scaleX || 1),
      h: img.height * (img.scaleY || 1),
    };
    this.center = {
      x: (img.cropX || 0) + img.width / 2,
      y: (img.cropY || 0) + img.height / 2,
    };
    const center = img.getCenterPoint();
    this.frameCenter = new Point(center.x, center.y);
    this.zoom = this.cover.width / img.width;
    this.maxZoom = Math.max(1, Math.min(MAX_ZOOM, this.cover.width / MIN_WINDOW));
    this.clipBase = clip
      ? { scaleX: clip.scaleX || 1, scaleY: clip.scaleY || 1, width: img.width, height: img.height }
      : null;

    this.image = img;
    img.set({
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasControls: false,
      hoverCursor: "grab",
    });
    this.canvas.setActiveObject(img);
    this.canvas.on("mouse:down", this.onDown);
    this.canvas.on("mouse:move", this.onMove);
    this.canvas.on("mouse:up", this.onUp);
    this.notify();
    return true;
  }

  setZoom(next: number) {
    if (!this.image) return;
    this.zoom = Math.min(this.maxZoom, Math.max(1, next));
    this.render();
    this.notify();
  }

  apply() {
    if (!this.image || !this.snapshot) return;
    const changed = this.changed();
    this.restoreInteraction();
    this.end();
    this.onFinish(changed);
  }

  cancel() {
    if (!this.image || !this.snapshot) return;
    const img = this.image;
    const snap = this.snapshot;
    img.set({
      cropX: snap.cropX,
      cropY: snap.cropY,
      width: snap.width,
      height: snap.height,
      scaleX: snap.scaleX,
      scaleY: snap.scaleY,
      dirty: true,
    });
    img.setPositionByOrigin(this.frameCenter, "center", "center");
    img.clipPath?.set({ scaleX: snap.clipScaleX, scaleY: snap.clipScaleY, dirty: true });
    img.setCoords();
    this.canvas.requestRenderAll();
    this.restoreInteraction();
    this.end();
    this.onFinish(false);
  }

  private onDown = (event: TPointerEventInfo) => {
    if (!this.image) return;
    if (event.target !== this.image) {
      this.apply();
      return;
    }
    this.dragging = true;
    this.last = { x: event.scenePoint.x, y: event.scenePoint.y };
  };

  private onMove = (event: TPointerEventInfo) => {
    if (!this.dragging || !this.image || !this.last) return;
    const point = event.scenePoint;
    const dx = point.x - this.last.x;
    const dy = point.y - this.last.y;
    this.last = { x: point.x, y: point.y };
    const delta = sourceDelta(
      dx,
      dy,
      this.image.angle || 0,
      this.image.scaleX || 1,
      this.image.scaleY || 1,
      Boolean(this.image.flipX),
      Boolean(this.image.flipY),
    );
    this.center.x -= delta.x;
    this.center.y -= delta.y;
    this.render();
  };

  private onUp = () => {
    this.dragging = false;
    this.last = null;
  };

  private render() {
    const img = this.image;
    if (!img) return;
    const size = windowAtZoom(this.cover, this.zoom);
    const placed = placeWindow(
      this.center.x,
      this.center.y,
      size.width,
      size.height,
      this.natural.width,
      this.natural.height,
    );
    this.center = {
      x: placed.cropX + placed.width / 2,
      y: placed.cropY + placed.height / 2,
    };
    img.set({
      cropX: placed.cropX,
      cropY: placed.cropY,
      width: placed.width,
      height: placed.height,
      scaleX: this.visual.w / placed.width,
      scaleY: this.visual.h / placed.height,
      dirty: true,
    });
    img.setPositionByOrigin(this.frameCenter, "center", "center");
    if (this.clipBase) {
      this.image?.clipPath?.set({
        scaleX: this.clipBase.scaleX * (placed.width / this.clipBase.width),
        scaleY: this.clipBase.scaleY * (placed.height / this.clipBase.height),
        dirty: true,
      });
    }
    img.setCoords();
    this.canvas.requestRenderAll();
  }

  private restoreInteraction() {
    const snap = this.snapshot;
    if (!this.image || !snap) return;
    this.image.set({
      lockMovementX: snap.lockMovementX,
      lockMovementY: snap.lockMovementY,
      lockScalingX: snap.lockScalingX,
      lockScalingY: snap.lockScalingY,
      lockRotation: snap.lockRotation,
      hasControls: snap.hasControls,
      hoverCursor: snap.hoverCursor,
    });
  }

  private changed() {
    const img = this.image;
    const snap = this.snapshot;
    if (!img || !snap) return false;
    return (
      Math.abs((img.cropX || 0) - snap.cropX) > 0.5 ||
      Math.abs((img.cropY || 0) - snap.cropY) > 0.5 ||
      Math.abs(img.width - snap.width) > 0.5 ||
      Math.abs(img.height - snap.height) > 0.5
    );
  }

  private end() {
    this.canvas.off("mouse:down", this.onDown);
    this.canvas.off("mouse:move", this.onMove);
    this.canvas.off("mouse:up", this.onUp);
    this.image = null;
    this.snapshot = null;
    this.clipBase = null;
    this.dragging = false;
    this.last = null;
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }
}
