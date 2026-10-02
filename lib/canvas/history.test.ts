import { test } from "node:test";
import assert from "node:assert/strict";
import { HistoryStack } from "./history";

test("undo and redo walk through pushed states", () => {
  const history = new HistoryStack<string>();
  history.reset("a");
  history.push("b");
  history.push("c");

  assert.equal(history.undo(), "b");
  assert.equal(history.undo(), "a");
  assert.equal(history.undo(), null);
  assert.equal(history.redo(), "b");
  assert.equal(history.redo(), "c");
  assert.equal(history.redo(), null);
});

test("pushing after undo drops the redo branch", () => {
  const history = new HistoryStack<string>();
  history.reset("a");
  history.push("b");
  history.undo();
  history.push("c");

  assert.equal(history.canRedo, false);
  assert.equal(history.undo(), "a");
});

test("the oldest states are dropped past the limit", () => {
  const history = new HistoryStack<number>(3);
  history.reset(0);
  [1, 2, 3, 4].forEach((n) => history.push(n));

  assert.equal(history.undo(), 3);
  assert.equal(history.undo(), 2);
  assert.equal(history.undo(), null);
});

test("reset starts a fresh history", () => {
  const history = new HistoryStack<string>();
  history.reset("a");
  history.push("b");
  history.reset("slide-2");

  assert.equal(history.canUndo, false);
  assert.equal(history.canRedo, false);
});
