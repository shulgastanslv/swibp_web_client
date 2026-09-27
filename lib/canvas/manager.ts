import { FabricImage, FabricObject, PencilBrush } from "fabric";
import type { BackgroundConfig, CanvasState, ExportOptions } from "./types";
import { CanvasCore } from "./core";
import { GridManager } from "./grid";
import { HistoryManager } from "./history";
import { ImportExportManager } from "./import_export";
import { ObjectFactory } from "./objects";
import { EffectsManager } from "./effects";
import { LayoutManager, LayoutTemplate } from "./layouts";
import { removeBackground } from "@imgly/background-removal";
import { ArrowManager, ConnectorArrow } from "./arrow";

export class CanvasManager {
  private core: CanvasCore;
  private history: HistoryManager;
  private grid: GridManager;
  private factory: ObjectFactory;
  private io: ImportExportManager;
  private effects: EffectsManager;
  private layoutManager: LayoutManager;
  private arrowManager: ArrowManager;

  constructor(canvasElement: HTMLCanvasElement) {
    this.core = new CanvasCore(canvasElement);
    this.history = new HistoryManager(this.core.canvas);
    this.grid = new GridManager(this.core.canvas);
    this.factory = new ObjectFactory(this.core.canvas);
    this.io = new ImportExportManager(this.core.canvas);
    this.effects = new EffectsManager(this.core.canvas);
    this.layoutManager = new LayoutManager(this.core.canvas);
    this.grid.setLayoutManager(this.layoutManager);
    this.arrowManager = new ArrowManager(this.core.canvas);
  }

  public connectSelectedObjects(): ConnectorArrow | null {
    const active = this.core.canvas.getActiveObjects();
    if (active.length >= 2) {
      return this.arrowManager.connect(active[0], active[1]);
    }
    return null;
  }

  public connectObjects(
    from: FabricObject,
    to: FabricObject,
  ): ConnectorArrow | null {
    return this.arrowManager.connect(from, to);
  }

  public setVignette(intensity: number) {
    this.effects.setVignette(intensity);
  }
  public applyLayout(template: LayoutTemplate) {
    this.layoutManager.applyLayout(template);
  }
  public clearLayout() {
    this.layoutManager.clearLayout();
  }
  public isLayoutActive(): boolean {
    return this.layoutManager.getIsLayoutActive();
  }
  public getLayoutFrames() {
    return this.layoutManager.getFrames();
  }
  public setNoise(intensity: number) {
    this.effects.setNoise(intensity);
  }
  public setBlur(amount: number) {
    this.effects.setBlur(amount);
  }
  public clearEffects() {
    this.effects.clearAll();
  }
  public getCanvas() {
    return this.core.canvas;
  }
  public setRatio(w: number, h: number) {
    this.core.resize(w, h);
  }
  public setZoom(scale: number, nativeW: number, nativeH: number) {
    this.core.setZoom(scale, nativeW, nativeH);
  }
  public clear() {
    this.arrowManager?.clear();
    this.core.clear();
  }
  public dispose() {
    this.core.dispose();
  }
  public getDimensions() {
    return this.core.getDimensions();
  }
  public undo() {
    return this.history.undo();
  }
  public redo() {
    return this.history.redo();
  }
  public toggleGrid() {
    this.grid.toggleGrid();
  }
  public isGridEnabled() {
    return this.grid["isGridVisible"];
  }
  public addRectangle(x?: number, y?: number) {
    return this.factory.addRectangle(x, y);
  }
  public addCircle(x?: number, y?: number) {
    return this.factory.addCircle(x, y);
  }
  public addTriangle(x?: number, y?: number) {
    return this.factory.addTriangle(x, y);
  }
  public addLine(x?: number, y?: number) {
    return this.factory.addLine(x, y);
  }
  public addArrow(x?: number, y?: number) {
    return this.factory.addArrow(x, y);
  }
  public addText(text: string, x?: number, y?: number) {
    return this.factory.addText(text, x, y);
  }
  public addImage(url: string, x?: number, y?: number) {
    return this.factory.addImage(url);
  }
  public deleteSelected() {
    this.factory.deleteSelected();
  }
  public duplicateSelected() {
    this.factory.duplicateSelected();
  }
  public addSVG(content: string) {
    return this.io.addSVG(content);
  }
  public setGridSize(size: number) {
    this.grid.setGridSize(size);
  }
  public setGridColor(color: string) {
    this.grid.setGridColor(color);
  }
  public setBackground(config: BackgroundConfig) {
    this.io.setBackground(config);
  }
  public exportAsImage(opts: ExportOptions) {
    return this.io.exportAsImage(opts);
  }
  public exportAsJSON() {
    return this.io.exportAsJSON();
  }

  public exportThumbnail(multiplier = 1): string {
    const canvas = this.core.canvas;
    const currentZoom = canvas.getZoom();
    const nativeW = (canvas.width || 1080) / currentZoom;
    const nativeH = (canvas.height || 1080) / currentZoom;

    // Reset to native resolution
    canvas.setZoom(1);
    canvas.setDimensions({ width: nativeW, height: nativeH });
    canvas.renderAll();

    const dataURL = canvas.toDataURL({ format: "png", multiplier, quality: 1 });

    // Restore zoomed size
    canvas.setZoom(currentZoom);
    canvas.setDimensions({
      width: Math.round(nativeW * currentZoom),
      height: Math.round(nativeH * currentZoom),
    });
    canvas.renderAll();

    return dataURL;
  }
  public enableDrawingMode() {
    this.core.canvas.isDrawingMode = true;
    this.core.canvas.freeDrawingBrush = new PencilBrush(this.core.canvas);
    if (this.core.canvas.freeDrawingBrush) {
      this.core.canvas.freeDrawingBrush.width = 5;
      this.core.canvas.freeDrawingBrush.color = "#000000";
    }
  }
  public disableDrawingMode() {
    this.core.canvas.isDrawingMode = false;
  }
  public toJSON() {
    return this.core.canvas.toJSON();
  }
  public loadFromJSON(json: CanvasState | string) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    this.core.canvas.loadFromJSON(data).then(() => {
      this.core.canvas.renderAll();
    });
  }

  // ── NEW ELEMENT METHODS ──
  public addHeading(text?: string, x?: number, y?: number) {
    return this.factory.addHeading(text, x, y);
  }
  public addSubtitle(text?: string, x?: number, y?: number) {
    return this.factory.addSubtitle(text, x, y);
  }
  public addParagraph(text?: string, x?: number, y?: number) {
    return this.factory.addParagraph(text, x, y);
  }
  public addQuote(text?: string, x?: number, y?: number) {
    return this.factory.addQuote(text, x, y);
  }
  public addCodeBlock(code?: string, x?: number, y?: number) {
    return this.factory.addCodeBlock(code, x, y);
  }
  public addTag(label?: string, x?: number, y?: number) {
    return this.factory.addTag(label, x, y);
  }
  public addStarRating(text?: string, x?: number, y?: number) {
    return this.factory.addStarRating(text, x, y);
  }
  public addSwipeTag(label?: string, x?: number, y?: number) {
    return this.factory.addSwipeTag(label, x, y);
  }
  public addCTAButton(label?: string, x?: number, y?: number) {
    return this.factory.addCTAButton(label, x, y);
  }
  public addBadge(label?: string, x?: number, y?: number) {
    return this.factory.addBadge(label, x, y);
  }
  public addHandle(username?: string, x?: number, y?: number) {
    return this.factory.addHandle(username, x, y);
  }
  public addDividerLine(x?: number, y?: number) {
    return this.factory.addDividerLine(x, y);
  }
}
