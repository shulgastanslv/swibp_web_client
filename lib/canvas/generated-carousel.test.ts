import assert from "node:assert/strict";
import { test } from "node:test";
import { defaultDocument } from "./document";
import {
  collectSlideText,
  imageAspectRatio,
  parseGeneratedCarousel,
  parseGeneratedLines,
  sanitizeIconSvg,
  slidesFromGenerated,
} from "./generated-carousel";

test("parseGeneratedCarousel keeps a short deck and normalizes colors", () => {
  const carousel = parseGeneratedCarousel({
    palette: { background: "111111", text: "#fff", accent: "#f59e0b", card: "#1f2937" },
    slides: [
      { kicker: "Hook", title: "  Start here  ", body: "One line" },
      { title: "" },
      { title: "Second" },
    ],
  });

  assert.equal(carousel?.palette.background, "#111111");
  assert.equal(carousel?.palette.text, "#ffffff");
  assert.equal(carousel?.slides.length, 2);
  assert.equal(carousel?.slides[0]?.title, "Start here");
  assert.equal(carousel?.slides[1]?.body, "");
});

test("slidesFromGenerated lays out copy and keeps chrome numbers", () => {
  const doc = defaultDocument();
  const slides = slidesFromGenerated({
    carousel: {
      palette: doc.palette,
      slides: [
        { kicker: "01", title: "Hook", body: "Why it matters" },
        { kicker: "", title: "Close", body: "" },
      ],
    },
    textStyles: doc.textStyles,
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
  assert.equal(slides[0]?.canvasJSON.background, doc.palette.background);
  assert.ok((slides[0]?.canvasJSON.objects[0]?.width as number) < 80);
  assert.ok((slides[0]?.canvasJSON.objects[2]?.top as number) > 1350 * 0.4);
  assert.equal(slides[0]?.canvasJSON.objects[2]?.text, "Hook");
  assert.equal(slides[0]?.canvasJSON.objects[2]?.swibpStyle, "heading");
  assert.equal(slides[0]?.canvasJSON.objects[2]?.fontWeight, "500");
  assert.equal(slides[0]?.canvasJSON.objects.at(-1)?.text, "01");
  assert.equal(slides[1]?.canvasJSON.objects[1]?.text, "02");
  assert.equal(slides[1]?.canvasJSON.objects.at(-1)?.text, "02");
  assert.equal(slides[1]?.canvasJSON.objects.some((object) => object.swibpStyle === "body"), false);
});

test("parseGeneratedLines drops blanks and caps the list", () => {
  assert.deepEqual(parseGeneratedLines({ lines: ["  One ", "", "Two"] }), ["One", "Two"]);
  assert.equal(parseGeneratedLines({ lines: [] }), null);
});

test("collectSlideText skips chrome and keeps copy", () => {
  const lines = collectSlideText([
    { type: "Textbox", text: "Title" },
    { type: "IText", text: "01", swibpRole: "number" },
    { type: "Rect", fill: "#fff" },
  ]);
  assert.deepEqual(lines, ["Title"]);
});

test("sanitizeIconSvg accepts a plain mark and rejects scripts", () => {
  const svg = `<svg viewBox="0 0 24 24"><path d="M4 12h16"/></svg>`;
  assert.equal(sanitizeIconSvg(svg), svg);
  assert.equal(sanitizeIconSvg(`<svg><script>alert(1)</script></svg>`), null);
  assert.equal(sanitizeIconSvg(`<svg><path onclick="x()" d="M0 0"/></svg>`), null);
});

test("imageAspectRatio maps carousel ratios onto Gemini sizes", () => {
  assert.equal(imageAspectRatio(1080, 1350), "3:4");
  assert.equal(imageAspectRatio(1080, 1080), "1:1");
  assert.equal(imageAspectRatio(1080, 1920), "9:16");
  assert.equal(imageAspectRatio(1920, 1080), "16:9");
});
