import { test } from "node:test";
import assert from "node:assert/strict";
import { captureCanvasThumbnail } from "./thumbnail";

test("captureCanvasThumbnail returns a jpeg and ignores a disposed canvas", () => {
  const calls: unknown[] = [];
  const canvas = {
    width: 480,
    lowerCanvasEl: {},
    getZoom: () => 0.5,
    toDataURL: (options: unknown) => {
      calls.push(options);
      return "data:image/jpeg,abc";
    },
  };

  assert.equal(captureCanvasThumbnail(canvas, true), null);
  assert.equal(captureCanvasThumbnail(canvas), "data:image/jpeg,abc");
  assert.deepEqual(calls, [{ format: "jpeg", quality: 0.92, multiplier: 1 }]);
});

test("captureCanvasThumbnail returns null when the canvas is tainted", () => {
  const canvas = {
    width: 100,
    lowerCanvasEl: {},
    getZoom: () => 1,
    toDataURL: () => {
      throw new Error("tainted");
    },
  };

  assert.equal(captureCanvasThumbnail(canvas), null);
});
