import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { JsonlParser, parseCarouselEvent, SseParser } from "@/lib/ai/carousel-parse";
import { kimiApiKey, streamKimiCarousel } from "@/lib/ai/kimi";
import type { CarouselStreamEvent } from "@/lib/ai/carousel-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function encodeEvent(event: CarouselStreamEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!kimiApiKey()) {
    return Response.json({ error: "KIMI_API_KEY is not configured" }, { status: 500 });
  }

  let body: { theme?: unknown; slides?: unknown; setId?: unknown };
  try {
    body = (await request.json()) as { theme?: unknown; slides?: unknown; setId?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const theme = typeof body.theme === "string" ? body.theme.trim() : "";
  const slides = Math.min(20, Math.max(1, Math.round(Number(body.slides) || 6)));
  const setId = typeof body.setId === "string" ? body.setId.trim() : undefined;
  if (theme.length < 2) {
    return Response.json({ error: "Theme is required" }, { status: 400 });
  }

  const upstreamAbort = new AbortController();
  request.signal.addEventListener("abort", () => upstreamAbort.abort(), { once: true });

  let kimiResponse: Response;
  try {
    kimiResponse = await streamKimiCarousel({
      theme,
      slides,
      setId,
      signal: upstreamAbort.signal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kimi request failed";
    return Response.json({ error: message }, { status: 502 });
  }

  const upstream = kimiResponse.body;
  if (!upstream) {
    return Response.json({ error: "Empty Kimi stream" }, { status: 502 });
  }

  const jsonl = new JsonlParser();
  const sse = new SseParser();
  let sawSlide = false;
  let sawDone = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encodeEvent({ type: "meta", slides, theme }));

      const reader = upstream.getReader();
      const decoder = new TextDecoder();

      const emitRaw = (raw: unknown) => {
        const event = parseCarouselEvent(raw);
        if (!event) return;
        if (event.type === "slide") sawSlide = true;
        if (event.type === "done") sawDone = true;
        controller.enqueue(encodeEvent(event));
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          for (const delta of sse.push(text)) {
            for (const item of jsonl.push(delta)) emitRaw(item);
          }
        }
        for (const item of jsonl.flush()) emitRaw(item);

        if (!sawSlide) {
          controller.enqueue(
            encodeEvent({
              type: "error",
              message: "Kimi returned no slides. Try a clearer theme.",
            }),
          );
        } else if (!sawDone) {
          controller.enqueue(encodeEvent({ type: "done", title: theme.slice(0, 48) }));
        }
        controller.close();
      } catch (error) {
        if (upstreamAbort.signal.aborted) {
          controller.close();
          return;
        }
        const message = error instanceof Error ? error.message : "Stream failed";
        try {
          controller.enqueue(encodeEvent({ type: "error", message }));
          controller.close();
        } catch {
          controller.error(error);
        }
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      upstreamAbort.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
