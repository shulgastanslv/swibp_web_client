import assert from "node:assert/strict";
import test from "node:test";
import { carouselTextHits, replaceInText, replaceTextInJSON } from "./find-text";

test("replace is case-insensitive and counts every hit", () => {
  const replaced = replaceInText("Hello hello", undefined, "hello", "hi", false);
  assert.equal(replaced.text, "hi hi");
  assert.equal(replaced.count, 2);
  assert.equal(replaceInText("Hello", undefined, "hello", "hi", true).count, 0);
});

test("serialized style ranges move when the word gets longer", () => {
  const replaced = replaceInText(
    "Hello",
    [{ start: 1, end: 2, style: { fontWeight: "bold" } }],
    "H",
    "HH",
    true,
  );
  assert.equal(replaced.text, "HHello");
  assert.deepEqual(replaced.styles, [{ start: 2, end: 3, style: { fontWeight: "bold" } }]);
});

test("replace walks text inside groups and reports the slides", () => {
  const hits = carouselTextHits({
    query: "go",
    matchCase: false,
    slides: [
      { id: 1, objects: [{ type: "Textbox", text: "Go now" }] },
      { id: 2, objects: [{ type: "Group", objects: [{ type: "Textbox", text: "stay" }] }] },
      { id: 3, objects: [{ type: "IText", text: "go", swibpRole: "number" }] },
    ],
  });
  assert.equal(hits.count, 2);
  assert.deepEqual(hits.slides, [1, 3]);

  const next = replaceTextInJSON(
    { objects: [{ type: "Group", objects: [{ type: "Textbox", text: "Go now" }] }] },
    "go",
    "stop",
    false,
  );
  const group = next.json.objects[0] as { objects: { text: string }[] };
  assert.equal(group.objects[0]?.text, "stop now");
  assert.equal(next.count, 1);
});
