import { test } from "node:test";
import assert from "node:assert/strict";
import { SCENE_PRESETS, sampleScene, scenesIn } from "./background-scenes";

const SCENE_LABELS = [
  "Paper",
  "Blush",
  "Ink",
  "Wine",
  "Pause",
  "Bar",
  "Footer",
  "Split",
  "Aside",
  "Third",
  "Frame",
  "Rule",
  "Sticker",
  "Brackets",
];

test("carousel scenes stay minimal and wallpapers are gone", () => {
  const ids = SCENE_PRESETS.map((scene) => scene.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(
    [...new Set(SCENE_PRESETS.map((scene) => scene.group))],
    ["style", "scene"],
  );
  for (const label of SCENE_LABELS) {
    assert.ok(scenesIn("scene").some((scene) => scene.label === label));
  }
  assert.equal(
    SCENE_PRESETS.some((scene) => /^(glass|cosmic|mystic|desktop|abstract|earth|radiant|texture|vintage|shadow|shape)-/.test(scene.id)),
    false,
  );
});

test("liquid style samples stay inside a byte color", () => {
  for (const [x, y] of [
    [0, 0],
    [0.5, 0.5],
    [1, 1],
  ] as const) {
    const sample = sampleScene("style-liquid", x, y);
    assert.ok(sample);
    for (const channel of sample) {
      assert.ok(channel >= 0 && channel <= 255);
      assert.equal(channel, Math.round(channel));
    }
  }
  assert.equal(sampleScene("scene-paper", 0.5, 0.5), null);
});
