import assert from "node:assert/strict";
import { test } from "node:test";
import { traceImageData } from "./raster-to-svg";

test("a solid bitmap traces to an SVG with a filled path", () => {
  const width = 8;
  const height = 8;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = 220;
    data[i * 4 + 1] = 40;
    data[i * 4 + 2] = 60;
    data[i * 4 + 3] = 255;
  }

  const svg = traceImageData({ width, height, data });
  assert.match(svg, /<svg\b/);
  assert.match(svg, /<path\b/);
  assert.match(svg, /viewBox=/);
});
