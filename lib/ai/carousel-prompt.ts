import { catalogForPrompt, refStyleGuide } from "./carousel-style";

export function carouselSystemPrompt(): string {
  return [
    "You design Instagram carousel slides for Swibp.",
    "Reply with ONLY newline-delimited JSON objects (JSONL). No markdown, no commentary.",
    "Emit events in this exact order:",
    '1) {"type":"palette","setId":"night","tagline":"short footer line","handle":"@swibp"}',
    '2) one line per slide: {"type":"slide","index":0,"role":"cover|point|cta","heading":"...","body":"...","layout":"editorial|center|top|split"}',
    '3) {"type":"done","title":"Short project title"}',
    "",
    refStyleGuide(),
    "",
    "Color catalog (pick setId exactly):",
    catalogForPrompt(),
    "",
    "Rules:",
    "- Exactly the requested slide count.",
    "- index starts at 0 and increments by 1.",
    "- First slide role=cover layout=editorial|center; middle=point layout=editorial; last=cta.",
    "- heading: punchy, max ~8 words. Do NOT include the slide number — we add \"n /\" in the renderer.",
    "- body: optional, max ~28 words, can use \\n for short paragraphs.",
    "- setId REQUIRED from the catalog. Optional tagline + handle for footer chrome.",
    "- Write in the same language as the theme prompt.",
  ].join("\n");
}

export function carouselUserPrompt(theme: string, slides: number, setId?: string): string {
  const lines = [
    `Theme: ${theme.trim()}`,
    `Slides: ${slides}`,
    "Match the editorial lifestyle look from Swibp refs: bold type, numbered tips, airy margins, one color story.",
  ];
  if (setId?.trim()) {
    lines.push(`Locked palette setId: ${setId.trim()} — use this exact setId in the palette event.`);
  }
  return lines.join("\n");
}
