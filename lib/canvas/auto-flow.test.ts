import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  flowRectOntoSlide,
  PLACE_PADDING,
  rectIsOutOfBounds,
} from "./auto-flow";

describe("rectIsOutOfBounds", () => {
  it("keeps objects fully inside the slide", () => {
    assert.equal(
      rectIsOutOfBounds({ left: 10, top: 10, width: 100, height: 80 }, 1080, 1350),
      false,
    );
  });

  it("detects overflow without depending on viewport zoom", () => {
    // Scene coords already match logical slide size — dividing by zoom would
    // falsely flag large in-bounds objects when the viewport is scaled down.
    assert.equal(
      rectIsOutOfBounds({ left: 140, top: 275, width: 800, height: 800 }, 1080, 1350),
      false,
    );
    assert.equal(
      rectIsOutOfBounds({ left: 1000, top: 10, width: 200, height: 100 }, 1080, 1350),
      true,
    );
  });

  it("allows a small edge tolerance", () => {
    assert.equal(
      rectIsOutOfBounds({ left: -4, top: 0, width: 50, height: 50 }, 1080, 1350),
      false,
    );
    assert.equal(
      rectIsOutOfBounds({ left: -20, top: 0, width: 50, height: 50 }, 1080, 1350),
      true,
    );
  });
});

describe("flowRectOntoSlide", () => {
  it("rebrings an object that left through the right edge", () => {
    const placed = flowRectOntoSlide(
      { left: 1100, top: 200, width: 120, height: 80 },
      1080,
      1350,
    );
    assert.equal(placed.left, PLACE_PADDING);
    assert.equal(placed.top, 200);
  });

  it("rebrings an object that left through the left edge", () => {
    const placed = flowRectOntoSlide(
      { left: -150, top: 200, width: 120, height: 80 },
      1080,
      1350,
    );
    assert.equal(placed.left, 1080 - PLACE_PADDING - 120);
    assert.equal(placed.top, 200);
  });

  it("centers oversized objects", () => {
    const placed = flowRectOntoSlide(
      { left: -50, top: -50, width: 1200, height: 1400 },
      1080,
      1350,
    );
    assert.equal(placed.left, (1080 - 1200) / 2);
    assert.equal(placed.top, (1350 - 1400) / 2);
  });
});
