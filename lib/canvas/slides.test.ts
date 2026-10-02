import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore } from "zustand/vanilla";
import { createSlidesSlice, type SlidesSlice } from "@/store/slices/slidesSlice";
import { SlidesController, type SlideCanvas } from "./slides";
import type { CanvasState } from "./types";

const doc = (label: string): CanvasState => ({ version: "6.0.0", objects: [{ label }] });
const labelOf = (state: CanvasState | null | undefined) =>
  (state?.objects[0] as { label?: string } | undefined)?.label ?? "empty";

class FakeCanvas implements SlideCanvas {
  content: CanvasState = doc("empty");
  loads: string[] = [];
  captureThumbnail: (() => string | null) | undefined;

  getState() {
    return this.content;
  }

  async loadState(state: CanvasState | null) {
    await new Promise((resolve) => setTimeout(resolve, 1));
    this.content = state ?? doc("empty");
    this.loads.push(labelOf(state));
  }
}

function setup(labels: string[]) {
  const store = createStore<SlidesSlice>()((...a) => createSlidesSlice(...a));
  store.getState().setSlides(labels.map((label, i) => ({ id: i + 1, canvasJSON: doc(label) })));
  store.getState().setCurrentSlideId(1);

  const canvas = new FakeCanvas();
  canvas.content = doc(labels[0]);
  const controller = new SlidesController(canvas, store);
  const contentOf = (id: number) =>
    labelOf(store.getState().slides.find((s) => s.id === id)?.canvasJSON);

  return { store, canvas, controller, contentOf };
}

test("switchTo saves the edited slide and loads the target", async () => {
  const { store, canvas, controller, contentOf } = setup(["a", "b"]);
  canvas.content = doc("a-edited");

  await controller.switchTo(2);

  assert.equal(store.getState().currentSlideId, 2);
  assert.equal(labelOf(canvas.content), "b");
  assert.equal(contentOf(1), "a-edited");
});

test("switching to the current slide does nothing", async () => {
  const { canvas, controller } = setup(["a", "b"]);

  await controller.switchTo(1);

  assert.deepEqual(canvas.loads, []);
});

test("overlapping switches run in order and never mix slide contents", async () => {
  const { store, canvas, controller, contentOf } = setup(["a", "b", "c"]);

  await Promise.all([controller.switchTo(2), controller.switchTo(3), controller.switchTo(1)]);

  assert.deepEqual(canvas.loads, ["b", "c", "a"]);
  assert.equal(store.getState().currentSlideId, 1);
  assert.deepEqual([contentOf(1), contentOf(2), contentOf(3)], ["a", "b", "c"]);
});

test("next/prev move between neighbours and stop at the edges", async () => {
  const { store, controller } = setup(["a", "b"]);

  await controller.prev();
  assert.equal(store.getState().currentSlideId, 1);

  await controller.next();
  assert.equal(store.getState().currentSlideId, 2);

  await controller.next();
  assert.equal(store.getState().currentSlideId, 2);
});

test("add inserts an empty slide after the current one and opens it", async () => {
  const { store, canvas, controller, contentOf } = setup(["a", "b"]);
  canvas.content = doc("a-edited");

  await controller.add();

  const ids = store.getState().slides.map((s) => s.id);
  assert.deepEqual(ids, [1, 3, 2]);
  assert.equal(store.getState().currentSlideId, 3);
  assert.equal(contentOf(1), "a-edited");
  assert.equal(canvas.content.objects.length, 0);
});

test("duplicate clones the current slide after it and opens the copy", async () => {
  const { store, canvas, controller, contentOf } = setup(["a", "b"]);
  canvas.content = doc("a-edited");

  await controller.duplicate();

  const ids = store.getState().slides.map((s) => s.id);
  assert.deepEqual(ids, [1, 3, 2]);
  assert.equal(store.getState().currentSlideId, 3);
  assert.equal(contentOf(1), "a-edited");
  assert.equal(contentOf(3), "a-edited");
  assert.equal(labelOf(canvas.content), "a-edited");
});

test("duplicate of another slide leaves the canvas on the copy", async () => {
  const { store, canvas, controller, contentOf } = setup(["a", "b", "c"]);

  await controller.duplicate(2);

  assert.deepEqual(store.getState().slides.map((s) => s.id), [1, 2, 4, 3]);
  assert.equal(store.getState().currentSlideId, 4);
  assert.equal(contentOf(2), "b");
  assert.equal(contentOf(4), "b");
  assert.equal(labelOf(canvas.content), "b");
});

test("removing the current slide opens its neighbour without overwriting it", async () => {
  const { store, canvas, controller, contentOf } = setup(["a", "b", "c"]);
  await controller.switchTo(2);
  canvas.content = doc("b-edited");

  await controller.remove(2);

  assert.deepEqual(store.getState().slides.map((s) => s.id), [1, 3]);
  assert.equal(store.getState().currentSlideId, 1);
  assert.equal(labelOf(canvas.content), "a");
  assert.equal(contentOf(1), "a");
});

test("removing another slide keeps the canvas untouched", async () => {
  const { store, canvas, controller } = setup(["a", "b"]);

  await controller.remove(2);

  assert.deepEqual(store.getState().slides.map((s) => s.id), [1]);
  assert.deepEqual(canvas.loads, []);
});

test("the last slide cannot be removed", async () => {
  const { store, controller } = setup(["a"]);

  await controller.remove(1);

  assert.equal(store.getState().slides.length, 1);
});

test("updating slide JSON keeps its thumbnail", () => {
  const { store } = setup(["a"]);
  store.getState().updateSlideThumbnail(1, "thumb");
  store.getState().updateSlideJSONById(1, doc("a-edited"));
  assert.equal(store.getState().slides[0]?.thumbnail, "thumb");
  assert.equal(labelOf(store.getState().slides[0]?.canvasJSON), "a-edited");
});

test("saveCurrent stores a fresh thumbnail without dropping the previous one when capture fails", () => {
  const { store, canvas, controller } = setup(["a"]);
  store.getState().updateSlideThumbnail(1, "old");
  canvas.content = doc("a-edited");
  canvas.captureThumbnail = () => "new";

  controller.saveCurrent();

  assert.equal(store.getState().slides[0]?.thumbnail, "new");
  assert.equal(labelOf(store.getState().slides[0]?.canvasJSON), "a-edited");

  canvas.captureThumbnail = () => null;
  canvas.content = doc("a-again");
  controller.saveCurrent();

  assert.equal(store.getState().slides[0]?.thumbnail, "new");
  assert.equal(labelOf(store.getState().slides[0]?.canvasJSON), "a-again");
});

test("dispose cancels pending loads without changing the current slide", async () => {
  const { store, canvas, controller } = setup(["a", "b"]);
  let release!: () => void;
  canvas.loadState = () =>
    new Promise<void>((resolve) => {
      release = resolve;
    });

  const pending = controller.switchTo(2);
  await Promise.resolve();
  controller.dispose();
  release();
  await pending;

  assert.equal(store.getState().currentSlideId, 1);
});
