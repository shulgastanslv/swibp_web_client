import type { Canvas, FabricObject } from "fabric";

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function animateValues(
  duration: number,
  onTick: (t: number) => void,
  ease: (t: number) => number = easeOutCubic,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      onTick(ease(raw));
      if (raw < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Stitch-like entrance: objects spring up from soft blur/scale with stagger —
 * closer to Google Stitch assembling UI than a plain fade.
 */
export async function animateSlideEntrance(canvas: Canvas): Promise<void> {
  const objects = canvas.getObjects().filter((obj) => !obj.excludeFromExport);
  if (objects.length === 0) {
    canvas.requestRenderAll();
    return;
  }

  type Snapshot = {
    obj: FabricObject;
    top: number;
    left: number;
    scaleX: number;
    scaleY: number;
  };

  const snaps: Snapshot[] = objects.map((obj) => ({
    obj,
    top: obj.top ?? 0,
    left: obj.left ?? 0,
    scaleX: obj.scaleX ?? 1,
    scaleY: obj.scaleY ?? 1,
  }));

  for (const snap of snaps) {
    snap.obj.set({
      opacity: 0,
      top: snap.top + 28,
      scaleX: snap.scaleX * 0.92,
      scaleY: snap.scaleY * 0.92,
    });
    snap.obj.setCoords();
  }
  canvas.requestRenderAll();

  await Promise.all(
    snaps.map(async (snap, index) => {
      await new Promise((r) => setTimeout(r, 70 + index * 70));
      await animateValues(
        520,
        (t) => {
          snap.obj.set({
            opacity: t,
            top: snap.top + 28 * (1 - t),
            scaleX: snap.scaleX * (0.92 + 0.08 * t),
            scaleY: snap.scaleY * (0.92 + 0.08 * t),
          });
          snap.obj.setCoords();
          canvas.requestRenderAll();
        },
        easeOutBack,
      );
      snap.obj.set({
        opacity: 1,
        top: snap.top,
        left: snap.left,
        scaleX: snap.scaleX,
        scaleY: snap.scaleY,
      });
      snap.obj.setCoords();
      canvas.requestRenderAll();
    }),
  );
}
