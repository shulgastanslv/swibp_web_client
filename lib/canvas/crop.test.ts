import { test } from "node:test";
import assert from "node:assert/strict";
import { largestWindow, placeWindow, sourceDelta, windowAtZoom } from "./crop";

test("cover window uses the shorter side of a wide photo", () => {
  const window = largestWindow(400, 200, 1);
  assert.equal(window.width, 200);
  assert.equal(window.height, 200);
});

test("placeWindow keeps the window inside the photo", () => {
  const placed = placeWindow(10, 100, 80, 80, 400, 200);
  assert.equal(placed.cropX, 0);
  assert.equal(placed.cropY, 60);
  assert.equal(placed.width, 80);
  assert.equal(placed.height, 80);
});

test("zoom 2 shows half of the cover window", () => {
  const next = windowAtZoom({ width: 200, height: 100 }, 2);
  assert.equal(next.width, 100);
  assert.equal(next.height, 50);
});

test("dragging right moves the source window toward the left", () => {
  const delta = sourceDelta(20, 0, 0, 2, 2, false, false);
  assert.equal(delta.x, 10);
  assert.equal(delta.y, 0);
});
