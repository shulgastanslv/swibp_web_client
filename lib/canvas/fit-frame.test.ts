import assert from "node:assert/strict";
import test from "node:test";
import { fitCanvasJSON, fitGeometry } from "./fit-frame";

const portrait = { width: 1080, height: 1350 };
const square = { width: 1080, height: 1080 };
const wide = { width: 1920, height: 1080 };

test("a centered object stays centered and keeps its proportions", () => {
  const fitted = fitGeometry(
    {
      type: "Textbox",
      left: 540,
      top: 675,
      width: 400,
      height: 120,
      scaleX: 1,
      scaleY: 1,
      originX: "center",
      originY: "center",
    },
    portrait,
    square,
  );

  assert.equal(fitted.left, 540);
  assert.equal(fitted.top, 540);
  assert.ok(Math.abs(fitted.scaleX - Math.sqrt(1080 / 1350)) < 1e-9);
  assert.equal(fitted.scaleX, fitted.scaleY);
});

test("switching ratio and back restores the object scale", () => {
  const start = {
    type: "Rect",
    left: 200,
    top: 300,
    width: 240,
    height: 160,
    scaleX: 1.5,
    scaleY: 1.5,
    originX: "left" as const,
    originY: "top" as const,
  };
  const squareFit = fitGeometry(start, portrait, square);
  const back = fitGeometry(
    { ...start, left: squareFit.left, top: squareFit.top, scaleX: squareFit.scaleX, scaleY: squareFit.scaleY },
    square,
    portrait,
  );
  assert.ok(Math.abs(back.scaleX - start.scaleX) < 1e-9);
  assert.ok(Math.abs(back.scaleY - start.scaleY) < 1e-9);
  assert.ok(Math.abs(back.left - start.left) < 1e-6);
  assert.ok(Math.abs(back.top - start.top) < 1e-6);
});

test("a full-frame rectangle stretches to the new frame", () => {
  const fitted = fitGeometry(
    {
      type: "Rect",
      left: 0,
      top: 0,
      width: 1080,
      height: 1350,
      scaleX: 1,
      scaleY: 1,
      originX: "left",
      originY: "top",
    },
    portrait,
    wide,
  );

  assert.ok(Math.abs(fitted.left) < 1e-6);
  assert.ok(Math.abs(fitted.top) < 1e-6);
  assert.ok(Math.abs(fitted.scaleX - wide.width / portrait.width) < 1e-9);
  assert.ok(Math.abs(fitted.scaleY - wide.height / portrait.height) < 1e-9);
});

test("a full-frame photo covers the new frame without stretching", () => {
  const fitted = fitGeometry(
    {
      type: "Image",
      left: 0,
      top: 0,
      width: 1080,
      height: 1350,
      scaleX: 1,
      scaleY: 1,
      originX: "left",
      originY: "top",
    },
    portrait,
    wide,
  );

  assert.equal(fitted.scaleX, fitted.scaleY);
  assert.ok(fitted.scaleX >= wide.width / portrait.width);
  assert.ok(fitted.scaleY >= wide.height / portrait.height);
});

test("a wide text box keeps proportional side margins", () => {
  const fitted = fitGeometry(
    {
      type: "Textbox",
      left: 80,
      top: 200,
      width: 920,
      height: 200,
      scaleX: 1,
      scaleY: 1,
      originX: "left",
      originY: "top",
    },
    portrait,
    wide,
  );

  const scale = Math.sqrt((wide.width / portrait.width) * (wide.height / portrait.height));
  const marginL = 80 * (wide.width / portrait.width);
  assert.ok(Math.abs(fitted.scaleX - scale) < 1e-9);
  assert.ok(Math.abs(fitted.left - marginL) < 1e-6);
  assert.ok(fitted.width != null && fitted.width * fitted.scaleX > 920);
});

test("saved slides and their background photo are rewritten together", () => {
  const next = fitCanvasJSON(
    {
      version: "6.0.0",
      background: "#ffffff",
      backgroundImage: {
        type: "image",
        left: 0,
        top: 0,
        width: 1000,
        height: 1000,
        scaleX: 1.08,
        scaleY: 1.35,
      },
      objects: [
        {
          type: "Rect",
          left: 100,
          top: 100,
          width: 200,
          height: 80,
          scaleX: 1,
          scaleY: 1,
          originX: "left",
          originY: "top",
          strokeWidth: 4,
        },
      ],
    },
    portrait,
    square,
  );

  const bg = next.backgroundImage as { scaleX: number; scaleY: number; left: number; top: number };
  assert.equal(bg.scaleX, bg.scaleY);
  assert.ok(bg.scaleX >= square.width / 1000);
  assert.ok(bg.left <= 0 && bg.top <= 0);
  const rect = next.objects[0] as { scaleX: number; strokeWidth: number };
  const scale = Math.sqrt(1080 / 1350);
  assert.ok(Math.abs(rect.scaleX - scale) < 1e-9);
  assert.ok(Math.abs(rect.strokeWidth - 4 * scale) < 1e-9);
});
