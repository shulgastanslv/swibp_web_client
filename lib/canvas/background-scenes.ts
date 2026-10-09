export type SceneGroup = "style" | "scene";

export interface ScenePreset {
  id: string;
  label: string;
  group: SceneGroup;
}

type RGB = [number, number, number];

interface ShaderScene extends ScenePreset {
  kind: "shader";
  freq: number;
  angle: number;
  seed: number;
  colors: RGB[];
}

interface MarkScene extends ScenePreset {
  kind: "style" | "scene";
}

type SceneDef = ShaderScene | MarkScene;

const PAPER = "#F6F1E8";
const BLUSH = "#F3D6D0";
const INK = "#141414";
const WINE = "#6B2430";
const QUIET = "#FAFAF8";

const C = (r: number, g: number, b: number): RGB => [r, g, b];

const SCENES: SceneDef[] = [
  { kind: "style", id: "style-default", label: "Default", group: "style" },
  { kind: "style", id: "style-glass-light", label: "Glass Light", group: "style" },
  { kind: "style", id: "style-glass-dark", label: "Glass Dark", group: "style" },
  {
    kind: "shader",
    id: "style-liquid",
    label: "Liquid",
    group: "style",
    freq: 5.2,
    angle: 0.42,
    seed: 3,
    colors: [C(92, 36, 6), C(214, 96, 18), C(255, 196, 110)],
  },
  { kind: "style", id: "style-inset-light", label: "Inset Light", group: "style" },
  { kind: "style", id: "style-inset-dark", label: "Inset Dark", group: "style" },
  { kind: "style", id: "style-outline", label: "Outline", group: "style" },
  { kind: "style", id: "style-border", label: "Border", group: "style" },
  { kind: "style", id: "style-retro", label: "Retro", group: "style" },
  { kind: "style", id: "style-card", label: "Card", group: "style" },
  { kind: "style", id: "style-stack", label: "Stack", group: "style" },
  { kind: "style", id: "style-stack-2", label: "Stack 2", group: "style" },

  { kind: "scene", id: "scene-paper", label: "Paper", group: "scene" },
  { kind: "scene", id: "scene-blush", label: "Blush", group: "scene" },
  { kind: "scene", id: "scene-ink", label: "Ink", group: "scene" },
  { kind: "scene", id: "scene-wine", label: "Wine", group: "scene" },
  { kind: "scene", id: "scene-pause", label: "Pause", group: "scene" },
  { kind: "scene", id: "scene-bar", label: "Bar", group: "scene" },
  { kind: "scene", id: "scene-footer", label: "Footer", group: "scene" },
  { kind: "scene", id: "scene-split", label: "Split", group: "scene" },
  { kind: "scene", id: "scene-aside", label: "Aside", group: "scene" },
  { kind: "scene", id: "scene-third", label: "Third", group: "scene" },
  { kind: "scene", id: "scene-frame", label: "Frame", group: "scene" },
  { kind: "scene", id: "scene-rule", label: "Rule", group: "scene" },
  { kind: "scene", id: "scene-sticker", label: "Sticker", group: "scene" },
  { kind: "scene", id: "scene-brackets", label: "Brackets", group: "scene" },
];

export const SCENE_PRESETS: ScenePreset[] = SCENES.map(({ id, label, group }) => ({ id, label, group }));

const BY_ID = new Map(SCENES.map((scene) => [scene.id, scene]));

export function scenesIn(group: SceneGroup): ScenePreset[] {
  return SCENE_PRESETS.filter((scene) => scene.group === group);
}

export function sampleScene(id: string, x: number, y: number): RGB | null {
  const scene = BY_ID.get(id);
  if (!scene || scene.kind !== "shader") return null;
  return shadeGlass(scene, x, y);
}

const thumbCache = new Map<string, string>();

export function sceneThumbUrl(id: string, width = 96, height = 120): string {
  const key = `${id}:${width}x${height}`;
  const cached = thumbCache.get(key);
  if (cached) return cached;
  const url = renderSceneDataUrl(id, width, height);
  thumbCache.set(key, url);
  return url;
}

export function renderSceneDataUrl(id: string, width: number, height: number): string {
  if (!BY_ID.has(id)) return "";
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  paintBase(ctx, canvas.width, canvas.height, id);
  return canvas.toDataURL("image/jpeg", 0.92);
}

function hash2(ix: number, iy: number): number {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function shadeGlass(scene: ShaderScene, x: number, y: number): RGB {
  const cos = Math.cos(scene.angle);
  const sin = Math.sin(scene.angle);
  const rx = x * cos - y * sin;
  const ry = x * sin + y * cos;
  const wobble = Math.sin(rx * scene.freq * 0.55 + scene.seed) * 0.12;
  const wave = Math.sin((ry + wobble) * scene.freq * Math.PI * 2);
  const ridge = 1 - Math.abs(wave);
  const shine = Math.pow(Math.max(0, wave), 4);
  const [shadow, mid, hi] = scene.colors;
  let color = mix(shadow!, mid!, Math.pow(ridge, 1.35));
  color = mix(color, hi!, shine * 0.9);
  const grain = (hash2(Math.floor(x * 220), Math.floor(y * 220) + scene.seed) - 0.5) * 16;
  return [clampByte(color[0] + grain), clampByte(color[1] + grain), clampByte(color[2] + grain)];
}

function paintBase(ctx: CanvasRenderingContext2D, w: number, h: number, id: string) {
  const scene = BY_ID.get(id);
  if (!scene) return;
  if (scene.kind === "shader") paintShader(ctx, w, h, scene);
  else if (scene.kind === "scene") paintCarousel(ctx, w, h, scene.id);
  else paintStyle(ctx, w, h, scene.id);
}

function paintShader(ctx: CanvasRenderingContext2D, w: number, h: number, scene: ShaderScene) {
  const sw = Math.max(32, Math.min(w, 360));
  const sh = Math.max(32, Math.round((sw * h) / w));
  const src = document.createElement("canvas");
  src.width = sw;
  src.height = sh;
  const source = src.getContext("2d");
  if (!source) return;
  const image = source.createImageData(sw, sh);
  const data = image.data;
  for (let y = 0; y < sh; y++) {
    const v = sh === 1 ? 0 : y / (sh - 1);
    for (let x = 0; x < sw; x++) {
      const u = sw === 1 ? 0 : x / (sw - 1);
      const [r, g, b] = shadeGlass(scene, u, v);
      const index = (y * sw + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }
  }
  source.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, w, h);
}

function fill(ctx: CanvasRenderingContext2D, color: string, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
}

function paintCarousel(ctx: CanvasRenderingContext2D, w: number, h: number, id: string) {
  if (id === "scene-blush") return fill(ctx, BLUSH, w, h);
  if (id === "scene-ink") return fill(ctx, INK, w, h);
  if (id === "scene-wine") return fill(ctx, WINE, w, h);
  if (id === "scene-pause") return fill(ctx, QUIET, w, h);
  if (id === "scene-bar") {
    fill(ctx, PAPER, w, h);
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, w, h * 0.055);
    return;
  }
  if (id === "scene-footer") {
    fill(ctx, PAPER, w, h);
    ctx.fillStyle = INK;
    ctx.fillRect(0, h * 0.9, w, h * 0.1);
    return;
  }
  if (id === "scene-split") {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h * 0.62);
    ctx.fillStyle = INK;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);
    return;
  }
  if (id === "scene-aside") {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, w * 0.34, h);
    ctx.fillStyle = PAPER;
    ctx.fillRect(w * 0.34, 0, w * 0.66, h);
    return;
  }
  if (id === "scene-third") {
    fill(ctx, PAPER, w, h);
    ctx.fillStyle = INK;
    ctx.fillRect(0, h * 0.74, w, h * 0.26);
    return;
  }
  if (id === "scene-frame") {
    fill(ctx, PAPER, w, h);
    const margin = Math.min(w, h) * 0.06;
    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(1, w * 0.004);
    ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
    return;
  }
  if (id === "scene-rule") {
    fill(ctx, PAPER, w, h);
    ctx.fillStyle = INK;
    const x = w * 0.08;
    ctx.fillRect(x, h * 0.16, w - x * 2, Math.max(2, h * 0.004));
    return;
  }
  if (id === "scene-sticker") {
    fill(ctx, PAPER, w, h);
    const x = w * 0.08;
    const y = h * 0.07;
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.roundRect(x, y, w * 0.34, h * 0.045, h * 0.01);
    ctx.fill();
    return;
  }
  if (id === "scene-brackets") {
    fill(ctx, PAPER, w, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(1.5, w * 0.006);
    const inset = Math.min(w, h) * 0.07;
    const arm = Math.min(w, h) * 0.045;
    const corners: Array<[number, number, number, number]> = [
      [inset, inset, 1, 1],
      [w - inset, inset, -1, 1],
      [inset, h - inset, 1, -1],
      [w - inset, h - inset, -1, -1],
    ];
    for (const [x, y, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x + dx * arm, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * arm);
      ctx.stroke();
    }
    return;
  }
  fill(ctx, PAPER, w, h);
}

function roundPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function roundFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
) {
  roundPath(ctx, x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
}

function paintStyle(ctx: CanvasRenderingContext2D, w: number, h: number, id: string) {
  if (id === "style-glass-light" || id === "style-glass-dark") {
    paintGlassFrame(ctx, w, h, id === "style-glass-dark");
    return;
  }
  if (id === "style-inset-light" || id === "style-inset-dark") {
    paintInset(ctx, w, h, id === "style-inset-dark");
    return;
  }
  if (id === "style-outline") {
    ctx.fillStyle = "#f4f4f6";
    ctx.fillRect(0, 0, w, h);
    strokeRound(ctx, w * 0.12, h * 0.12, w * 0.76, h * 0.76, w * 0.12, "#1c1c1e", Math.max(1.5, w * 0.012));
    return;
  }
  if (id === "style-border") {
    ctx.fillStyle = "#f7f7f8";
    ctx.fillRect(0, 0, w, h);
    strokeRound(ctx, w * 0.1, h * 0.1, w * 0.8, h * 0.8, w * 0.1, "#111111", Math.max(2, w * 0.035));
    return;
  }
  if (id === "style-retro") {
    ctx.fillStyle = "#ececee";
    ctx.fillRect(0, 0, w, h);
    const margin = w * 0.08;
    const radius = w * 0.1;
    roundFill(ctx, margin, margin, w - margin * 2, h - margin * 2, radius, "#111111");
    const inset = w * 0.075;
    roundFill(
      ctx,
      margin + inset,
      margin + inset,
      w - (margin + inset) * 2,
      h - (margin + inset) * 2,
      radius * 0.65,
      "#f5f5f3",
    );
    return;
  }
  if (id === "style-card") {
    ctx.fillStyle = "#e7e7ea";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = w * 0.05;
    ctx.shadowOffsetY = w * 0.02;
    roundFill(ctx, w * 0.14, h * 0.16, w * 0.72, h * 0.68, w * 0.1, "#ffffff");
    ctx.restore();
    return;
  }
  if (id === "style-stack" || id === "style-stack-2") {
    paintStack(ctx, w, h, id === "style-stack" ? 2 : 3);
    return;
  }
  ctx.fillStyle = "#f3f3f5";
  ctx.fillRect(0, 0, w, h);
  strokeRound(ctx, w * 0.16, h * 0.16, w * 0.68, h * 0.68, w * 0.12, "rgba(0,0,0,0.12)", Math.max(1, w * 0.01));
}

function paintGlassFrame(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean) {
  ctx.fillStyle = dark ? "#2a2a2e" : "#e4e4e8";
  ctx.fillRect(0, 0, w, h);
  const margin = w * 0.1;
  const radius = w * 0.16;
  ctx.save();
  ctx.shadowColor = dark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.14)";
  ctx.shadowBlur = w * 0.06;
  ctx.shadowOffsetY = w * 0.02;
  roundFill(ctx, margin, margin, w - margin * 2, h - margin * 2, radius, dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.62)");
  ctx.restore();
  strokeRound(
    ctx,
    margin,
    margin,
    w - margin * 2,
    h - margin * 2,
    radius,
    dark ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.95)",
    Math.max(1, w * 0.015),
  );
  ctx.save();
  roundPath(ctx, margin, margin, w - margin * 2, h - margin * 2, radius);
  ctx.clip();
  const sheen = ctx.createLinearGradient(0, margin, 0, h * 0.55);
  sheen.addColorStop(0, dark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.75)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function paintInset(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean) {
  ctx.fillStyle = dark ? "#3a3a3e" : "#f2f2f4";
  ctx.fillRect(0, 0, w, h);
  const margin = w * 0.12;
  const radius = w * 0.14;
  roundFill(ctx, margin, margin, w - margin * 2, h - margin * 2, radius, dark ? "#141418" : "#d5d5da");
  ctx.save();
  roundPath(ctx, margin, margin, w - margin * 2, h - margin * 2, radius);
  ctx.clip();
  const shade = ctx.createLinearGradient(0, margin, 0, margin + h * 0.32);
  shade.addColorStop(0, "rgba(0,0,0,0.38)");
  shade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function strokeRound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
  width: number,
) {
  roundPath(ctx, x, y, w, h, r);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function paintStack(ctx: CanvasRenderingContext2D, w: number, h: number, layers: number) {
  ctx.fillStyle = "#ececee";
  ctx.fillRect(0, 0, w, h);
  const margin = w * 0.16;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const radius = w * 0.1;
  const offset = w * (layers === 2 ? 0.045 : 0.07);
  for (let layer = layers - 1; layer >= 0; layer -= 1) {
    const shift = layer * offset;
    ctx.save();
    if (layer === 0) {
      ctx.shadowColor = "rgba(0,0,0,0.16)";
      ctx.shadowBlur = w * 0.04;
      ctx.shadowOffsetY = w * 0.015;
    }
    roundFill(
      ctx,
      margin + shift * 0.15,
      margin - shift,
      cardW,
      cardH,
      radius,
      layer === 0 ? "#ffffff" : layer === 1 ? "#f7f7f8" : "#efeff2",
    );
    ctx.restore();
  }
}
