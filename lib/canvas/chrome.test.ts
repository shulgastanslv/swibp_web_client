import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyChrome,
  chromeTemplatesFrom,
  formatSlideNumber,
  sameChrome,
  type ChromeTemplate,
} from "./chrome";
import type { FabricCanvasJSON } from "@/lib/types";

const slide = (objects: Record<string, unknown>[]): FabricCanvasJSON => ({
  version: "6.0.0",
  objects,
});

test("formatSlideNumber follows the chosen style and the series length", () => {
  assert.equal(formatSlideNumber("1", 0, 8), "1");
  assert.equal(formatSlideNumber("01", 3, 8), "04");
  assert.equal(formatSlideNumber("1 / 8", 1, 5), "2 / 5");
});

test("applyChrome stamps one copy per role and rewrites the counter", () => {
  const templates: ChromeTemplate[] = [
    {
      role: "number",
      numberStyle: "1 / 8",
      object: { type: "IText", text: "1 / 1", swibpRole: "number", swibpNumberStyle: "1 / 8", left: 64 },
    },
    {
      role: "handle",
      object: { type: "Group", swibpRole: "handle", left: 900 },
    },
  ];

  const first = applyChrome(slide([{ type: "Textbox", text: "Hello" }]), templates, 0, 3);
  const third = applyChrome(slide([{ type: "Textbox", text: "End" }]), templates, 2, 3);

  assert.equal(first.objects[1]?.text, "1 / 3");
  assert.equal(third.objects[1]?.text, "3 / 3");
  assert.equal(third.objects.filter((obj) => obj.swibpRole === "handle").length, 1);
  assert.equal(third.objects[0]?.text, "End");
});

test("a removed role disappears from the other slides", () => {
  const json = slide([
    { type: "IText", swibpRole: "number", text: "1" },
    { type: "IText", swibpRole: "swipe", text: "->" },
  ]);
  const next = applyChrome(json, chromeTemplatesFrom(slide([{ swibpRole: "number", text: "2" }])), 1, 4);
  assert.deepEqual(
    next.objects.map((obj) => obj.swibpRole),
    ["number"],
  );
  assert.equal(next.objects[0]?.text, "2");
});

test("sameChrome ignores the counter text and notices a moved handle", () => {
  const number = (text: string): ChromeTemplate => ({
    role: "number",
    numberStyle: "1",
    object: { swibpRole: "number", text, left: 10 },
  });
  assert.equal(sameChrome([number("1")], [number("4")]), true);

  const moved: ChromeTemplate = {
    role: "handle",
    object: { swibpRole: "handle", left: 20 },
  };
  const parked: ChromeTemplate = {
    role: "handle",
    object: { swibpRole: "handle", left: 80 },
  };
  assert.equal(sameChrome([moved], [parked]), false);
});
