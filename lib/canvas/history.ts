export class HistoryStack<T> {
  private states: T[] = [];
  private index = -1;

  constructor(private readonly limit = 50) {}

  reset(initial: T): void {
    this.states = [initial];
    this.index = 0;
  }

  /** Rewrites every saved step in place. `current` replaces the active step. */
  rewrite(fn: (state: T) => T, current: T): void {
    this.states = this.states.map((state, index) => (index === this.index ? current : fn(state)));
  }

  push(state: T): void {
    this.states = this.states.slice(0, this.index + 1);
    this.states.push(state);
    if (this.states.length > this.limit) {
      this.states.shift();
    }
    this.index = this.states.length - 1;
  }

  undo(): T | null {
    if (!this.canUndo) return null;
    this.index--;
    return this.states[this.index];
  }

  redo(): T | null {
    if (!this.canRedo) return null;
    this.index++;
    return this.states[this.index];
  }

  get canUndo(): boolean {
    return this.index > 0;
  }

  get canRedo(): boolean {
    return this.index < this.states.length - 1;
  }
}
