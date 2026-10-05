import assert from "node:assert/strict";
import test from "node:test";
import { continuationKeepCount, linesThatFit, paragraphIndex, splitStyledText } from "./text-flow";

test("lines stop at the first one that does not fit", () => {
  assert.equal(linesThatFit([20, 20, 20], 50), 2);
  assert.equal(linesThatFit([80], 40), 0);
  assert.equal(linesThatFit([20, 20], 80), 2);
});

test("continuation keeps a prefix of the lines", () => {
  assert.equal(continuationKeepCount([20, 20, 20], 50), 2);
  assert.equal(continuationKeepCount([20, 20], 80), null);
  assert.equal(continuationKeepCount([80, 20], 40), null);
});

test("a mid-line cut keeps styles on both sides", () => {
  const split = splitStyledText("abcd", { 0: { 0: { fontWeight: "bold" }, 3: { fontStyle: "italic" } } }, 2);
  assert.ok(split);
  assert.equal(split.keptText, "ab");
  assert.equal(split.restText, "cd");
  assert.equal(split.keptStyles[0]?.[0]?.fontWeight, "bold");
  assert.equal(split.restStyles[0]?.[1]?.fontStyle, "italic");
});

test("a cut on the next paragraph drops the break", () => {
  const split = splitStyledText("ab\ncd", { 0: { 1: { underline: true } }, 1: { 0: { fontWeight: "bold" } } }, 3);
  assert.ok(split);
  assert.equal(split.keptText, "ab");
  assert.equal(split.restText, "cd");
  assert.equal(split.keptStyles[0]?.[1]?.underline, true);
  assert.equal(split.restStyles[0]?.[0]?.fontWeight, "bold");
  assert.equal(paragraphIndex("ab\ncd", 1, 0), 3);
});
