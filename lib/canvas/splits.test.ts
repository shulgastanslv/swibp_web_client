import { test } from "node:test";
import assert from "node:assert/strict";
import { CANVAS_SPLITS, splitFrame } from "./splits";

const size = { width: 1080, height: 1350 };
const margin = 64;

test("top image fills the first half inside the grid margin", () => {
  const frame = splitFrame(CANVAS_SPLITS[0]!, size, margin);
  assert.equal(frame.left, 64);
  assert.equal(frame.top, 64);
  assert.equal(frame.width, 952);
  assert.equal(frame.height, 611);
});

test("bottom image starts on the same midline", () => {
  const top = splitFrame(CANVAS_SPLITS[0]!, size, margin);
  const bottom = splitFrame(CANVAS_SPLITS[1]!, size, margin);
  assert.equal(bottom.top, top.top + top.height);
  assert.equal(bottom.height, top.height);
  assert.equal(bottom.left, top.left);
});

test("left and right images share the center column line", () => {
  const left = splitFrame(CANVAS_SPLITS[2]!, size, margin);
  const right = splitFrame(CANVAS_SPLITS[3]!, size, margin);
  assert.equal(right.left, left.left + left.width);
  assert.equal(left.height, right.height);
});

test("short and tall images tile three row tracks without a gap", () => {
  const short = splitFrame(CANVAS_SPLITS[4]!, size, margin);
  const tall = splitFrame(CANVAS_SPLITS[5]!, size, margin);
  assert.equal(short.top, 64);
  assert.equal(tall.height, short.height * 2);
  assert.equal(tall.top, short.top);
});
