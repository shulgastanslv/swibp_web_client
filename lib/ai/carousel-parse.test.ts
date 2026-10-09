import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { JsonlParser, parseCarouselEvent, SseParser } from "./carousel-parse";

describe("carousel stream parsers", () => {
  it("parses JSONL slide lines as they complete", () => {
    const parser = new JsonlParser();
    const first = parser.push('{"type":"palette","setId":"night","tagline":"hi","handle":"@swibp"}\n{"type":"slid');
    assert.equal(first.length, 1);
    const palette = parseCarouselEvent(first[0]);
    assert.equal(palette?.type, "palette");
    if (palette?.type === "palette") {
      assert.equal(palette.setId, "night");
      assert.equal(palette.background.toLowerCase(), "#1c2b4a");
    }

    const second = parser.push('e","index":0,"role":"cover","heading":"Hello","layout":"editorial"}\n');
    assert.equal(second.length, 1);
    const slide = parseCarouselEvent(second[0]);
    assert.equal(slide?.type, "slide");
    if (slide?.type === "slide") {
      assert.equal(slide.heading, "Hello");
      assert.equal(slide.layout, "editorial");
    }
  });

  it("keeps SSE data across chunk boundaries", () => {
    const sse = new SseParser();
    const a = sse.push('data: {"choices":[{"delta":{"content":"{\\"type\\""}}]}\n');
    assert.deepEqual(a, ['{"type"']);
    const b = sse.push('data: {"choices":[{"delta":{"content":":\\"slide\\"}"}}]}\n\n');
    assert.deepEqual(b, [':"slide"}']);
  });
});
