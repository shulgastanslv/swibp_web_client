import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyFontToSlide,
  applyTextStyleToSlide,
  paletteFromHarmony,
  slidesFromLines,
  splitSlideLines,
  defaultDocument,
} from "./document";
import type { FabricCanvasJSON } from "@/lib/types";

test("splitSlideLines keeps one slide per non-empty line", () => {
  assert.deepEqual(splitSlideLines("  One  \n\nTwo\r\n  \nThree "), ["One", "Two", "Three"]);
});

test("slidesFromLines builds a styled slide per line and numbers the chrome", () => {
  const doc = defaultDocument();
  const slides = slidesFromLines({
    text: "Hook\nProof",
    styleId: "heading",
    style: doc.textStyles.heading,
    palette: doc.palette,
    chrome: [
      {
        role: "number",
        numberStyle: "01",
        object: { type: "IText", swibpRole: "number", swibpNumberStyle: "01", text: "01" },
      },
    ],
    width: 1080,
    height: 1350,
  });

  assert.equal(slides.length, 2);
  assert.equal(slides[0]?.canvasJSON.objects[0]?.text, "Hook");
  assert.equal(slides[0]?.canvasJSON.objects[0]?.swibpStyle, "heading");
  assert.equal(slides[0]?.canvasJSON.objects[1]?.text, "01");
  assert.equal(slides[1]?.canvasJSON.objects[1]?.text, "02");
  assert.equal(slides[0]?.canvasJSON.background, doc.palette.background);
});

test("paletteFromHarmony assigns light, dark, and a saturated accent", () => {
  const palette = paletteFromHarmony(["#0f172a", "#3b82f6", "#dbeafe", "#ffffff"], "#3b82f6");
  assert.equal(palette.background, "#ffffff");
  assert.equal(palette.text, "#0f172a");
  assert.equal(palette.accent, "#3b82f6");
  assert.notEqual(palette.card, palette.background);
});

test("applyFontToSlide changes every text face and keeps sizes", () => {
  const json: FabricCanvasJSON = {
    version: "6.0.0",
    objects: [
      { type: "Textbox", swibpStyle: "heading", fontSize: 80, text: "A" },
      { type: "Textbox", swibpStyle: "body", fontSize: 28, text: "B" },
      { type: "Rect", fill: "#111111" },
      {
        type: "Group",
        objects: [{ type: "IText", fontSize: 18, text: "01" }],
      },
    ],
  };
  const next = applyFontToSlide(json, "Manrope");
  assert.equal(next.objects[0]?.fontFamily, "Manrope");
  assert.equal(next.objects[0]?.fontSize, 80);
  assert.equal(next.objects[1]?.fontFamily, "Manrope");
  assert.equal(next.objects[1]?.fontSize, 28);
  assert.equal(next.objects[2]?.fontFamily, undefined);
  const group = next.objects[3] as { objects: Record<string, unknown>[] };
  assert.equal(group.objects[0]?.fontFamily, "Manrope");
  assert.equal(group.objects[0]?.fontSize, 18);
});

test("applyTextStyleToSlide updates only the matching style", () => {
  const json: FabricCanvasJSON = {
    version: "6.0.0",
    objects: [
      { type: "Textbox", swibpStyle: "heading", fontSize: 80, text: "A" },
      { type: "Textbox", swibpStyle: "body", fontSize: 28, text: "B" },
    ],
  };
  const next = applyTextStyleToSlide(json, "heading", {
    fontFamily: "Georgia",
    fontSize: 96,
    fontWeight: "bold",
    lineHeight: 0.9,
  });
  assert.equal(next.objects[0]?.fontFamily, "Georgia");
  assert.equal(next.objects[0]?.fontSize, 96);
  assert.equal(next.objects[1]?.fontSize, 28);
});
