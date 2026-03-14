import { NextRequest } from "next/server";

const ALLOWED_HOSTS = new Set([
  "i.ibb.co",
]);

export async function GET(req: NextRequest) {
  try {
    const imageUrl = req.nextUrl.searchParams.get("url");

    if (!imageUrl) {
      return new Response("Missing url", { status: 400 });
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return new Response("Invalid url", { status: 400 });
    }

    if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
      return new Response("Host not allowed", { status: 403 });
    }

    const upstream = await fetch(parsedUrl.toString(), {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!upstream.ok) {
      return new Response("Upstream image not found", { status: upstream.status });
    }

    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";

    const buffer = await upstream.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}