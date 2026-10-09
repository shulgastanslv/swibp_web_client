import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractJsonObject, parseIdeasPayload } from "./ideas";

describe("carousel ideas", () => {
  it("parses themes and palettes with valid setIds", () => {
    const ideas = parseIdeasPayload({
      themes: [
        {
          title: "Cold email tips",
          prompt: "5 cold email tips that get replies",
          setId: "night",
          slides: 6,
        },
        { title: "Bad", prompt: "x", setId: "nope", slides: 2 },
      ],
      palettes: [
        { setId: "butter", reason: "Warm" },
        { setId: "night", reason: "Dark" },
        { setId: "butter", reason: "dup" },
      ],
    });
    assert.equal(ideas.themes.length, 1);
    assert.equal(ideas.themes[0]!.setId, "night");
    assert.equal(ideas.palettes.length, 2);
    assert.equal(ideas.palettes[0]!.setId, "butter");
  });

  it("extracts JSON from fenced model text", () => {
    const raw = extractJsonObject('```json\n{"themes":[],"palettes":[]}\n```');
    assert.deepEqual(raw, { themes: [], palettes: [] });
  });
});
