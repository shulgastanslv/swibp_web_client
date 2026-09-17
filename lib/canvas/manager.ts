import { PencilBrush } from "fabric";

import type { BackgroundConfig, CanvasState, ExportOptions } from "./types";
import { CanvasCore } from "./core";
import { GridManager } from "./grid";
import { HistoryManager } from "./history";
import { ImportExportManager } from "./import_export";
import { ObjectFactory } from "./objects";
import { EffectsManager } from "./effects";
import { LayoutManager, LayoutTemplate } from "./layouts";

export class CanvasManager {
  private core: CanvasCore;
  private history: HistoryManager;
  private grid: GridManager;
  private factory: ObjectFactory;
  private io: ImportExportManager;
  private effects: EffectsManager;
  private layoutManager: LayoutManager;

  constructor(canvasElement: HTMLCanvasElement) {
    this.core = new CanvasCore(canvasElement);
    this.history = new HistoryManager(this.core.canvas);
    this.grid = new GridManager(this.core.canvas);
    this.factory = new ObjectFactory(this.core.canvas);
    this.io = new ImportExportManager(this.core.canvas);
    this.effects = new EffectsManager(this.core.canvas);
    this.layoutManager = new LayoutManager(this.core.canvas);
    this.grid.setLayoutManager(this.layoutManager);
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
  public clear() {
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
  public addImage(url : string, x?: number, y?: number) {
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
}
