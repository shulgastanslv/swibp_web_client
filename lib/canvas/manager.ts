import {
  PencilBrush,
} from "fabric";

import type { BackgroundConfig, CanvasState, ExportOptions } from "./types";
import { CanvasCore } from "./core";
import { GridManager } from "./grid";
import { HistoryManager } from "./history";
import { ImportExportManager } from "./import_export";
import { ObjectFactory } from "./objects";

export class CanvasManager {
  private core: CanvasCore;
  private history: HistoryManager;
  private grid: GridManager;
  private factory: ObjectFactory;
  private io: ImportExportManager;

  constructor(canvasElement: HTMLCanvasElement) {
    this.core = new CanvasCore(canvasElement);
    this.history = new HistoryManager(this.core.canvas);
    this.grid = new GridManager(this.core.canvas);
    this.factory = new ObjectFactory(this.core.canvas);
    this.io = new ImportExportManager(this.core.canvas);
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

  public addRectangle() {
    return this.factory.addRectangle();
  }
  public addCircle() {
    return this.factory.addCircle();
  }
  public addTriangle() {
    return this.factory.addTriangle();
  }
  public addImage(url : string) {
    return this.factory.addImage(url);
  }
  public addArrow() {
    return this.factory.addArrow();
  }
  public addText(text: string) {
    return this.factory.addText(text);
  }
  public addLine() {
    return this.factory.addLine();
  }
  public deleteSelected() {
    this.factory.deleteSelected();
  }
  public duplicateSelected() {
    this.factory.duplicateSelected();
  }

  public addSVGFromContent(content: string) {
    return this.io.addSVGFromContent(content);
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
