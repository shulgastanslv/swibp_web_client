import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  backgroundsForSet,
  snapToSolidPreset,
  suggestedSetById,
} from "./carousel-style";

describe("carousel-style", () => {
  it("resolves suggested sets by id", () => {
    const set = suggestedSetById("butter");
    assert.ok(set);
    assert.equal(set!.label, "Butter");
  });

  it("snaps free hex to solid presets", () => {
    assert.equal(snapToSolidPreset("#ffffff"), "#ffffff");
    assert.match(snapToSolidPreset("#fefefe"), /^#[0-9a-f]{6}$/i);
  });

  it("builds a background story from a set", () => {
    const set = suggestedSetById("night")!;
    const colors = backgroundsForSet(set, 5);
    assert.equal(colors.length, 5);
  });
});
