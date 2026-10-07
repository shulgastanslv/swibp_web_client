import assert from "node:assert/strict";
import test from "node:test";

import { rememberIcon, readRecentIcons, type RecentIcon } from "./iconscout-recent";

const arrow: RecentIcon = {
  id: "a",
  name: "Arrow",
  previewUrl: "https://cdn.iconscout.com/arrow.png",
  asset: "icon",
};

test("rememberIcon moves a repeat to the front and caps the list", () => {
  const first = rememberIcon([], arrow);
  const second = rememberIcon(first, { ...arrow, id: "b", name: "Box" });
  const again = rememberIcon(second, arrow);
  assert.deepEqual(
    again.map((item) => item.id),
    ["a", "b"],
  );
});

test("readRecentIcons drops malformed rows", () => {
  const raw = JSON.stringify([arrow, { id: "x" }, { ...arrow, id: "c", asset: "poster" }]);
  assert.deepEqual(readRecentIcons(raw), [arrow]);
});
