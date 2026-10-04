import { test } from "node:test";
import assert from "node:assert/strict";
import {
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
