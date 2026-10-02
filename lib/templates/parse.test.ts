import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTemplateCanvasJSON, templateSlidesToItems } from "./parse";

const slide = (label: string) => ({ version: "6.0.0", objects: [{ label }] });

test("published templates keep per-slide thumbnails aligned with slides", () => {
  const parsed = parseTemplateCanvasJSON({
    aspectRatio: "1:1",
    slides: [slide("a"), { version: "6.0.0" }, slide("c")],
    thumbnails: ["thumb-a", "skipped", "thumb-c"],
  });

  assert.equal(parsed.aspectRatio, "1:1");
  assert.equal(parsed.slides.length, 2);
  assert.deepEqual(parsed.thumbnails, ["thumb-a", "thumb-c"]);
});

test("legacy single-canvas templates have one empty thumbnail slot", () => {
  const parsed = parseTemplateCanvasJSON(slide("only"));
  assert.equal(parsed.slides.length, 1);
  assert.deepEqual(parsed.thumbnails, [null]);
});

test("applying a template uses the card preview when the first thumb is missing", () => {
  const items = templateSlidesToItems(
    [slide("a"), slide("b")],
    [null, "thumb-b"],
    "preview",
  );

  assert.equal(items[0]?.thumbnail, "preview");
  assert.equal(items[1]?.thumbnail, "thumb-b");
  assert.deepEqual(
    items.map((item) => item.id),
    [1, 2],
  );
});
