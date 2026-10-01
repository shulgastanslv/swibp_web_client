import { NextRequest, NextResponse } from "next/server";

function isAllowedPixabayHost(hostname: string): boolean {
  return hostname === "pixabay.com" || hostname.endsWith(".pixabay.com");
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (!/^https?:$/i.test(parsed.protocol) || !isAllowedPixabayHost(parsed.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 400 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: { Accept: "image/*,*/*" },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `upstream ${upstream.status}` },
        { status: upstream.status === 429 ? 429 : 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "not an image" }, { status: 502 });
    }

    const bytes = await upstream.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("pixabay proxy:", err);
    return NextResponse.json({ error: "proxy failed" }, { status: 502 });
  }
}
