import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CANVAS_CLIPBOARD_MARKER,
  classifyClipboardText,
  imageFilesFromClipboard,
  imageUrlFromHtml,
} from "./clipboard-content";

test("canvas marker is an object clipboard", () => {
  assert.deepEqual(classifyClipboardText(CANVAS_CLIPBOARD_MARKER, false), { kind: "objects" });
  assert.deepEqual(classifyClipboardText("anything", true), { kind: "objects" });
});

test("blank clipboard text is empty", () => {
  assert.deepEqual(classifyClipboardText("  \n", false), { kind: "empty" });
});

test("a lone http(s) or data url is treated as an image", () => {
  assert.deepEqual(classifyClipboardText("https://example.com/a.png", false), {
    kind: "image-url",
    url: "https://example.com/a.png",
  });
  assert.deepEqual(classifyClipboardText("data:image/png;base64,aaaa", false), {
    kind: "image-url",
    url: "data:image/png;base64,aaaa",
  });
});

test("other text stays text", () => {
  assert.deepEqual(classifyClipboardText("Hello\nslide", false), {
    kind: "text",
    text: "Hello\nslide",
  });
});

test("html image src is read only when it is a usable url", () => {
  assert.equal(
    imageUrlFromHtml('<p><img alt="x" src="https://cdn.example/pic.webp"></p>'),
    "https://cdn.example/pic.webp",
  );
  assert.equal(imageUrlFromHtml('<img src="blob:https://local/1">'), null);
  assert.equal(imageUrlFromHtml("<p>no image</p>"), null);
});

test("image files come from clipboard items, ignoring non-images", () => {
  const image = new File(["img"], "shot.png", { type: "image/png" });
  const note = new File(["txt"], "note.txt", { type: "text/plain" });
  const files = imageFilesFromClipboard([note, image], [
    { kind: "string", type: "text/plain", getAsFile: () => null },
    { kind: "file", type: "image/png", getAsFile: () => image },
  ]);
  assert.deepEqual(files, [image]);
});

test("falls back to the files list when items have no image", () => {
  const image = new File(["img"], "shot.png", { type: "image/png" });
  const files = imageFilesFromClipboard([image], []);
  assert.deepEqual(files, [image]);
});
