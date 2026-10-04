import assert from "node:assert/strict";
import test from "node:test";
import { attentionZones, contrastRatio, scoreEngagement, signalsFromSlide } from "./insights";

test("attention on a tall slide sits lower than on a 4:5 slide", () => {
  const feed = attentionZones("Instagram", "4:5");
  const story = attentionZones("Instagram", "9:16");
  assert.equal(feed.length, 3);
  assert.ok(story[0]!.y > feed[0]!.y);
  assert.match(feed[0]!.hint, /headline/i);
});

test("black on white is a strong contrast", () => {
  const ratio = contrastRatio("#0f172a", "#ffffff");
  assert.ok(ratio != null && ratio >= 7);
});

test("a readable carousel in the usual length scores strong", () => {
  const slide = {
    characters: 80,
    textColors: ["#0f172a"],
    backgrounds: ["#ffffff"],
    patterned: false,
  };
  const report = scoreEngagement("Instagram", Array.from({ length: 7 }, () => slide));
  assert.equal(report.label, "Strong");
  assert.ok(report.score >= 75);
  assert.equal(report.notes.length, 3);
});

test("one faint slide scores low", () => {
  const report = scoreEngagement("Instagram", [
    { characters: 0, textColors: ["#e5e5e5"], backgrounds: ["#ffffff"], patterned: false },
  ]);
  assert.equal(report.label, "Low");
  assert.ok(report.score < 50);
});

test("signals skip chrome and include text inside groups", () => {
  const signals = signalsFromSlide({
    background: "#ffffff",
    objects: [
      { type: "Textbox", text: "Hello", fill: "#111111" },
      { type: "IText", text: "01", fill: "#111111", swibpRole: "number" },
      { type: "Group", objects: [{ type: "Textbox", text: "Inside", fill: "#222222" }] },
    ],
  });
  assert.equal(signals.characters, "Hello".length + "Inside".length);
  assert.deepEqual(signals.textColors, ["#111111", "#222222"]);
  assert.deepEqual(signals.backgrounds, ["#ffffff"]);
});
