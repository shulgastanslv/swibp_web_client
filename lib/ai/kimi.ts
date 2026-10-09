import { carouselSystemPrompt, carouselUserPrompt } from "./carousel-prompt";
import { extractJsonObject, ideasSystemPrompt, ideasUserPrompt } from "./ideas";

const KIMI_BASE_URL = process.env.KIMI_BASE_URL ?? "https://api.moonshot.ai/v1";
const KIMI_MODEL = process.env.KIMI_MODEL ?? "kimi-k2.6";
const KIMI_USER_ID = process.env.KIMI_USER_ID ?? "db35suna0hfvrsju5rkg";

export function kimiApiKey(): string | null {
  const key = process.env.KIMI_API_KEY?.trim() || process.env.MOONSHOT_API_KEY?.trim();
  return key || null;
}

async function kimiChat(input: {
  messages: { role: string; content: string }[];
  stream?: boolean;
  signal?: AbortSignal;
  jsonObject?: boolean;
}): Promise<Response> {
  const apiKey = kimiApiKey();
  if (!apiKey) {
    throw new Error("KIMI_API_KEY is not configured");
  }

  const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      user: KIMI_USER_ID,
      stream: Boolean(input.stream),
      temperature: 1,
      ...(input.jsonObject ? { response_format: { type: "json_object" } } : {}),
      messages: input.messages,
    }),
    signal: input.signal,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      detail
        ? `Kimi API ${response.status}: ${detail.slice(0, 240)}`
        : `Kimi API request failed (${response.status})`,
    );
  }

  return response;
}

export async function streamKimiCarousel(input: {
  theme: string;
  slides: number;
  setId?: string;
  signal?: AbortSignal;
}): Promise<Response> {
  return kimiChat({
    stream: true,
    signal: input.signal,
    messages: [
      { role: "system", content: carouselSystemPrompt() },
      {
        role: "user",
        content: carouselUserPrompt(input.theme, input.slides, input.setId),
      },
    ],
  });
}

export async function completeKimiIdeas(input: {
  seed: string;
  signal?: AbortSignal;
}): Promise<unknown> {
  const response = await kimiChat({
    stream: false,
    jsonObject: true,
    signal: input.signal,
    messages: [
      { role: "system", content: ideasSystemPrompt() },
      { role: "user", content: ideasUserPrompt(input.seed) },
    ],
  });

  const json = (await response.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Empty Kimi ideas response");
  }
  return extractJsonObject(content);
}
