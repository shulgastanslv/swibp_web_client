import { Canvas } from "fabric";
import type { CanvasState } from "./types"; // Ваш тип

export class HistoryManager {
  private history: CanvasState[] = [];
  private historyIndex = -1;
  private maxHistory = 50;
  private canvas: Canvas;
  private isLocked = false;

  constructor(canvas: Canvas) {
    this.canvas = canvas;

    this.canvas.on("object:added", () => this.saveState());
    this.canvas.on("object:modified", () => this.saveState());
    this.canvas.on("object:removed", () => this.saveState());
  }

  saveState() {
    if (this.isLocked) return;

    const json = this.canvas.toJSON() as unknown as CanvasState;

    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(json);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  async undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      await this.loadState(this.history[this.historyIndex]);
    }
  }

  async redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      await this.loadState(this.history[this.historyIndex]);
    }
  }

  private async loadState(state: CanvasState) {
    this.isLocked = true;
    await this.canvas.loadFromJSON(state);
    this.canvas.renderAll();
    this.isLocked = false;
  }
}
