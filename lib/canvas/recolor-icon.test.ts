import assert from "node:assert/strict";
import { test } from "node:test";
import { iconFill, recolorIcon } from "./recolor-icon";

test("recoloring an icon paints child paths and leaves the group unfilled", () => {
  const icon = {
    type: "group",
    fill: "",
    swibpSlot: "",
    getObjects: () => [
      { type: "path", fill: "#ff0000", swibpSlot: "" },
      { type: "path", fill: "none", strokeWidth: 2, stroke: "#111111", swibpSlot: "" },
    ],
  };

  recolorIcon(icon, "#00aa88", "accent");

  assert.equal(icon.fill, "");
  assert.equal(icon.swibpSlot, "");
  const [filled, stroked] = icon.getObjects();
  assert.equal(filled.fill, "#00aa88");
  assert.equal(filled.swibpSlot, "accent");
  assert.equal(stroked.stroke, "#00aa88");
  assert.equal(stroked.fill, "none");
  assert.equal(iconFill(icon), "#00aa88");
});
