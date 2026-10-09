import assert from "node:assert/strict";
import test from "node:test";
import { applyList, applySelectionStyle } from "./text-format";

test("bullet list toggles and numbered list renumbers", () => {
  const bulleted = applyList("one\ntwo", undefined, "bullet");
  assert.equal(bulleted.text, "• one\n• two");
  assert.equal(applyList(bulleted.text, undefined, "bullet").text, "one\ntwo");

  const numbered = applyList("one\n\ntwo", undefined, "number");
  assert.equal(numbered.text, "1. one\n\n2. two");
  assert.equal(applyList(numbered.text, undefined, "number").text, "one\n\ntwo");
});

test("list prefixes move character styles with the letter", () => {
  const next = applyList("Hi", { 0: { 0: { fontWeight: "bold" } } }, "bullet");
  assert.equal(next.text, "• Hi");
  assert.equal(next.styles[0]?.[2]?.fontWeight, "bold");

  const back = applyList(next.text, next.styles, "bullet");
  assert.equal(back.text, "Hi");
  assert.equal(back.styles[0]?.[0]?.fontWeight, "bold");
});

test("selection styles apply only while a range is selected", () => {
  let applied: Record<string, unknown> | null = null;
  const editing = {
    isEditing: true,
    selectionStart: 1,
    selectionEnd: 4,
    dirty: false,
    setSelectionStyles(style: Record<string, unknown>) {
      applied = style;
    },
  };
  assert.equal(applySelectionStyle(editing, { fontWeight: "bold" }), true);
  assert.deepEqual(applied, { fontWeight: "bold" });
  assert.equal(applySelectionStyle({ ...editing, selectionStart: 2, selectionEnd: 2 }, { fontWeight: "bold" }), false);
  assert.equal(applySelectionStyle({ ...editing, isEditing: false }, { fontWeight: "bold" }), false);
});
