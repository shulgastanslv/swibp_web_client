"use server";

import {
  parseGeneratedCarousel,
  parseGeneratedLines,
  parseGeneratedPalette,
  sanitizeIconSvg,
  type GeneratedCarousel,
} from "@/lib/canvas/generated-carousel";
import type { ProjectPalette } from "@/lib/canvas/document";

export type GenerateKind = "slides" | "text" | "image" | "background" | "icons" | "palette";

export interface GenerateInput {
  kind: GenerateKind;
  prompt: string;
  width: number;
  height: number;
  /** Existing slide copy, so a rewrite can follow the open carousel. */
  context?: string;
}

export type GenerateResult =
  | { ok: true; kind: "slides"; carousel: GeneratedCarousel }
  | { ok: true; kind: "text"; lines: string[] }
  | { ok: true; kind: "palette"; palette: ProjectPalette }
  | { ok: true; kind: "icons"; svg: string }
  | { ok: true; kind: "image" | "background"; dataUrl: string }
  | { ok: false; error: string };

const MODEL = "deepseek-v4-flash";
const ENDPOINT = "https://api.deepseek.com/chat/completions";

function publicError(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Generation failed";
  const message = raw.replace(/sk-[\w-]+/gi, "").trim();
  if (/API key|permission|unauth|401|403/i.test(message)) return "DeepSeek rejected the API key";
  if (/402|insufficient balance/i.test(message)) return "DeepSeek account has no balance";
  if (/429|quota|rate limit/i.test(message)) return "DeepSeek is busy. Try again in a moment";
  if (/empty response|couldn't read|no icon/i.test(message)) return message;
  return message.slice(0, 160) || "Generation failed";
}

function readJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1)) as unknown;
    throw new Error("Couldn't read the result");
  }
}

function brief(input: GenerateInput): string {
  const prompt = input.prompt.trim().slice(0, 1500);
  const context = input.context?.trim().slice(0, 1500);
  return context ? `Current carousel:\n${context}\n\nRequest:\n${prompt}` : prompt;
}

async function generateJson(instructions: string, example: string, user: string, temperature: number): Promise<unknown> {
  const apiKey = process.env.DEEP_SEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEP_SEEK_API_KEY is not set");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `${instructions}\n\nReply with json only, matching this shape:\n${example}`,
        },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature,
      max_tokens: 2000,
      thinking: { type: "disabled" },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(publicError(new Error(`${response.status} ${body}`)));
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response");
  return readJson(content);
}

export async function generateDesign(input: GenerateInput): Promise<GenerateResult> {
  const prompt = input.prompt.trim();
  if (prompt.length < 2) return { ok: false, error: "Write a short brief first" };
  if (input.kind === "image" || input.kind === "background") {
    return { ok: false, error: "DeepSeek doesn't generate images" };
  }

  try {
    if (input.kind === "slides") {
      const json = await generateJson(
        [
          "Write a hyper-minimal carousel, like a quiet Pinterest pin.",
          "Use the same language as the request.",
          "4 to 7 slides unless the request gives a count. Never more than 8.",
          "One idea per slide. Lots of empty space. No emoji, hashtags, exclamation marks, or the word swipe.",
          "kicker: 1 or 2 words. title: 2 to 5 words. body: one short line, at most 8 words, or empty.",
          "Slide 1 is a still hook. The last slide is a quiet close.",
          "palette: almost monochrome. Off-white or near-black background, matching text, one muted accent. No neon.",
          "If a current carousel is included, follow the request: rewrite it or replace it.",
        ].join("\n"),
        '{"palette":{"background":"#f6f4f1","text":"#1c1917","accent":"#a8a29e","card":"#efece7"},"slides":[{"kicker":"Quiet","title":"One clear idea","body":"Leave the rest empty"}]}',
        brief(input),
        0.8,
      );
      const carousel = parseGeneratedCarousel(json);
      if (!carousel) return { ok: false, error: "Couldn't read the slides" };
      return { ok: true, kind: "slides", carousel };
    }

    if (input.kind === "text") {
      const json = await generateJson(
        [
          "Rewrite one slide in a hyper-minimal Pinterest voice.",
          "Same language as the request. No hashtags, emoji, or exclamation marks.",
          "1 to 3 lines: a short label, a 2 to 5 word headline, then one quiet line.",
        ].join("\n"),
        '{"lines":["Quiet","One clear idea","Leave the rest empty"]}',
        brief(input),
        0.7,
      );
      const lines = parseGeneratedLines(json);
      if (!lines) return { ok: false, error: "Couldn't read the text" };
      return { ok: true, kind: "text", lines };
    }

    if (input.kind === "palette") {
      const json = await generateJson(
        [
          "Pick four hex colors for a hyper-minimal Pinterest pin.",
          "Almost monochrome. Off-white or near-black background. Text must contrast. One muted accent. Card is barely different from the background. No neon.",
        ].join("\n"),
        '{"background":"#f6f4f1","text":"#1c1917","accent":"#a8a29e","card":"#efece7"}',
        brief(input),
        0.4,
      );
      const palette = parseGeneratedPalette(json);
      if (!palette) return { ok: false, error: "Couldn't read the palette" };
      return { ok: true, kind: "palette", palette };
    }

    const json = await generateJson(
      [
        "Draw one simple icon as SVG.",
        "viewBox 0 0 24 24. Use only path, circle, rect, line, polyline, polygon, ellipse.",
        "fill currentColor. No text, no script, no filters.",
      ].join("\n"),
      '{"svg":"<svg viewBox=\\"0 0 24 24\\"><path d=\\"M4 12h16\\"/></svg>"}',
      brief(input),
      0.4,
    );
    const svg = sanitizeIconSvg(
      json && typeof json === "object" ? (json as { svg?: unknown }).svg : null,
    );
    if (!svg) return { ok: false, error: "Couldn't read the icon" };
    return { ok: true, kind: "icons", svg };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}
