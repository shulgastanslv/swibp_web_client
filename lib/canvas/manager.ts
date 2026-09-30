import { Canvas, FabricObject, PencilBrush } from "fabric";
import type { BackgroundConfig, CanvasState } from "./types";
import { CanvasCore } from "./core";
import { GridManager } from "./grid";
import { HistoryStack } from "./history";
import { ImportExportManager } from "./import_export";
import { ObjectFactory } from "./objects";
import { EffectsManager } from "./effects";
import { LayoutManager } from "./layouts";
import { ArrowManager, ConnectorArrow } from "./arrow";
import { Emitter } from "./events";

const DEFAULT_BACKGROUND = "#ffffff";

export interface CanvasManagerEvents {
  /** The document was changed by the user or by undo/redo and should be persisted. */
  change: CanvasState;
  /** The whole document was replaced via `loadState` (e.g. slide switch). */
  load: CanvasState;
  selection: FabricObject | null;
}

/**
 * Facade over a single Fabric canvas.
 *
 * Feature modules are exposed as-is (`manager.objects.addCircle()`), the manager itself
 * only owns what spans the whole document: state load/save, history, events, selection.
 *
 * Any mutation that does not fire Fabric's `object:added|modified|removed`
 * (background, reordering, etc.) must be followed by `commit()`.
 */
export class CanvasManager {
  readonly canvas: Canvas;
  readonly core: CanvasCore;
  readonly grid: GridManager;
  readonly objects: ObjectFactory;
  readonly io: ImportExportManager;
  readonly effects: EffectsManager;
  readonly layouts: LayoutManager;
  readonly arrows: ArrowManager;

  private readonly history = new HistoryStack<CanvasState>();
  private readonly events = new Emitter<CanvasManagerEvents>();
  private silentDepth = 0;

  constructor(canvasElement: HTMLCanvasElement) {
    this.core = new CanvasCore(canvasElement);
    this.canvas = this.core.canvas;
    this.grid = new GridManager(this.canvas);
    this.objects = new ObjectFactory(this.canvas);
    this.io = new ImportExportManager(this.canvas);
    this.effects = new EffectsManager(this.canvas);
    this.layouts = new LayoutManager(this.canvas);
    this.arrows = new ArrowManager(this.canvas);
    this.grid.setLayoutManager(this.layouts);

    this.history.reset(this.getState());
    this.bindCanvasEvents();
  }

  on<K extends keyof CanvasManagerEvents>(
    event: K,
    handler: (payload: CanvasManagerEvents[K]) => void,
  ): () => void {
    return this.events.on(event, handler);
  }

  getState(): CanvasState {
    return this.io.toJSON();
  }

  /** Replaces the document without recording history or emitting `change`. */
  async loadState(state: CanvasState | null): Promise<void> {
    await this.replaceContent(state);
    const loaded = this.getState();
    this.history.reset(loaded);
    this.events.emit("load", loaded);
  }

  /** Records the current document as a new history step and notifies subscribers. */
  commit(): void {
    if (this.silentDepth > 0) return;
    const state = this.getState();
    this.history.push(state);
    this.events.emit("change", state);
  }

  async undo(): Promise<void> {
    const state = this.history.undo();
    if (state) await this.restoreFromHistory(state);
  }

  async redo(): Promise<void> {
    const state = this.history.redo();
    if (state) await this.restoreFromHistory(state);
  }

  get canUndo(): boolean {
    return this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.history.canRedo;
  }

  getActiveObject(): FabricObject | null {
    return this.canvas.getActiveObject() ?? null;
  }

  updateActiveObject(updates: Partial<FabricObject>): FabricObject | null {
    const active = this.getActiveObject();
    if (!active) return null;

    active.set(updates);
    active.setCoords();
    this.canvas.requestRenderAll();
    this.commit();
    this.events.emit("selection", active);
    return active;
  }

  selectObject(obj: FabricObject): void {
    this.canvas.setActiveObject(obj);
    this.canvas.requestRenderAll();
  }

  removeObject(obj: FabricObject): void {
    this.canvas.remove(obj);
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  moveObjectTo(obj: FabricObject, index: number): void {
    this.canvas.moveObjectTo(obj, index);
    this.canvas.requestRenderAll();
    this.commit();
  }

  async setBackground(config: BackgroundConfig): Promise<void> {
    await this.io.setBackground(config);
    this.commit();
  }

  connectSelectedObjects(): ConnectorArrow | null {
    const [from, to] = this.canvas.getActiveObjects();
    if (!from || !to) return null;
    return this.arrows.connect(from, to);
  }

  /** Fits the logical canvas (nativeW × nativeH) into the screen at `scale`. */
  setViewportScale(scale: number, nativeW: number, nativeH: number): void {
    this.core.setZoom(scale, nativeW, nativeH);
  }

  exportThumbnail(multiplier = 1): string {
    const canvas = this.canvas;
    const currentZoom = canvas.getZoom();
    const nativeW = (canvas.width || 1080) / currentZoom;
    const nativeH = (canvas.height || 1080) / currentZoom;

    canvas.setZoom(1);
    canvas.setDimensions({ width: nativeW, height: nativeH });
    canvas.renderAll();

    const dataURL = canvas.toDataURL({ format: "png", multiplier, quality: 1 });

    canvas.setZoom(currentZoom);
    canvas.setDimensions({
      width: Math.round(nativeW * currentZoom),
      height: Math.round(nativeH * currentZoom),
    });
    canvas.renderAll();

    return dataURL;
  }

  enableDrawingMode(): void {
    this.canvas.isDrawingMode = true;
    const brush = new PencilBrush(this.canvas);
    brush.width = 5;
    brush.color = "#000000";
    this.canvas.freeDrawingBrush = brush;
  }

  disableDrawingMode(): void {
    this.canvas.isDrawingMode = false;
  }

  dispose(): void {
    this.events.clear();
    this.core.dispose();
  }

  private async restoreFromHistory(state: CanvasState): Promise<void> {
    await this.replaceContent(state);
    this.events.emit("change", this.getState());
  }

  private async replaceContent(state: CanvasState | null): Promise<void> {
    this.silentDepth++;
    try {
      this.canvas.discardActiveObject();
      this.arrows.clear();
      if (state) {
        await this.canvas.loadFromJSON(state);
      } else {
        this.canvas.clear();
      }
      if (!this.canvas.backgroundColor) {
        this.canvas.backgroundColor = DEFAULT_BACKGROUND;
      }
      this.grid.redraw();
      this.canvas.requestRenderAll();
    } finally {
      this.silentDepth--;
    }
    this.events.emit("selection", null);
  }

  private bindCanvasEvents(): void {
    // Callers also fire "object:modified" manually without a payload.
    const onMutation = (e?: { target?: FabricObject }) => {
      if (e?.target?.excludeFromExport) return;
      this.commit();
    };
    const onSelection = () => {
      if (this.silentDepth > 0) return;
      this.events.emit("selection", this.getActiveObject());
    };

    this.canvas.on("object:added", onMutation);
    this.canvas.on("object:removed", onMutation);
    this.canvas.on("object:modified", onMutation);
    this.canvas.on("selection:created", onSelection);
    this.canvas.on("selection:updated", onSelection);
    this.canvas.on("selection:cleared", onSelection);
  }
}
