import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { parseIdeasPayload } from "@/lib/ai/ideas";
import { completeKimiIdeas, kimiApiKey } from "@/lib/ai/kimi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!kimiApiKey()) {
    return Response.json({ error: "KIMI_API_KEY is not configured" }, { status: 500 });
  }

  let body: { seed?: unknown };
  try {
    body = (await request.json()) as { seed?: unknown };
  } catch {
    body = {};
  }

  const seed = typeof body.seed === "string" ? body.seed.trim() : "";

  try {
    const raw = await completeKimiIdeas({ seed, signal: request.signal });
    const ideas = parseIdeasPayload(raw);
    if (ideas.themes.length === 0) {
      return Response.json({ error: "No themes returned. Try another seed." }, { status: 502 });
    }
    return Response.json(ideas);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ideas request failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
