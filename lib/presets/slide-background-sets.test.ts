import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  generateSlideBackgrounds,
  SLIDE_BACKGROUND_SETS,
} from "./slide-background-sets";

describe("generateSlideBackgrounds", () => {
  it("returns one color per requested slide", () => {
    for (const set of SLIDE_BACKGROUND_SETS) {
      const colors = generateSlideBackgrounds(set, 5);
      assert.equal(colors.length, 5);
      for (const color of colors) {
        assert.match(color, /^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("clamps extreme counts", () => {
    const set = SLIDE_BACKGROUND_SETS[0]!;
    assert.equal(generateSlideBackgrounds(set, 0).length, 1);
    assert.equal(generateSlideBackgrounds(set, 99).length, 12);
  });

  it("keeps story ends stable when resampling", () => {
    const dawn = SLIDE_BACKGROUND_SETS.find((set) => set.id === "dawn")!;
    const colors = generateSlideBackgrounds(dawn, dawn.stops!.length);
    assert.equal(colors[0]!.toLowerCase(), dawn.stops![0]!.toLowerCase());
    assert.equal(
      colors[colors.length - 1]!.toLowerCase(),
      dawn.stops![dawn.stops!.length - 1]!.toLowerCase(),
    );
  });
});
