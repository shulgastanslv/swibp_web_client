import { test } from "node:test";
import assert from "node:assert/strict";
import { parseImportedTemplate, parseTemplateCanvasJSON, templateSlidesToItems } from "./parse";

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

test("imported carousel JSON keeps title, ratio, and slide thumbnails", () => {
  const parsed = parseImportedTemplate(
    JSON.stringify({
      title: "Quiet set",
      aspectRatio: "9:16",
      slides: [slide("a"), { canvasJSON: slide("b"), thumbnail: "thumb-b" }],
      thumbnails: ["thumb-a"],
      previewUrl: "preview",
    }),
  );

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.template.title, "Quiet set");
  assert.equal(parsed.template.aspectRatio, "9:16");
  assert.equal(parsed.template.slides.length, 2);
  assert.deepEqual(parsed.template.thumbnails, ["thumb-a", "thumb-b"]);
  assert.equal(parsed.template.previewUrl, "preview");
});

test("imported JSON accepts one canvas or a nested canvasJSON carousel", () => {
  const single = parseImportedTemplate(slide("only"));
  assert.equal(single.ok, true);
  if (single.ok) assert.equal(single.template.slides.length, 1);

  const nested = parseImportedTemplate({
    name: "Wrapped",
    canvasJSON: { aspectRatio: "1:1", slides: [slide("a"), slide("b")] },
  });
  assert.equal(nested.ok, true);
  if (!nested.ok) return;
  assert.equal(nested.template.title, "Wrapped");
  assert.equal(nested.template.aspectRatio, "1:1");
  assert.equal(nested.template.slides.length, 2);
});

test("imported JSON rejects files that are not a template", () => {
  assert.equal(parseImportedTemplate("{").ok, false);
  assert.equal(parseImportedTemplate({ hello: "world" }).ok, false);
  const broken = parseImportedTemplate({ slides: [slide("a"), { nope: true }] });
  assert.equal(broken.ok, false);
  if (!broken.ok) assert.match(broken.error, /Slide 2/);
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
