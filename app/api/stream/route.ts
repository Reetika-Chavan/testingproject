import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Chunked transfer encoding streaming API.
 * Sends response in small chunks with delays - if streaming works,
 * the frontend will display content incrementally. If buffered (e.g. Launch),
 * the full response will appear at once.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const speed = searchParams.get("speed") || "medium"; // fast, medium, slow

  const delayMs = speed === "fast" ? 50 : speed === "slow" ? 300 : 150;
  const words = [
    "Hello",
    "from",
    "the",
    "streaming",
    "API!",
    "Each",
    "word",
    "should",
    "appear",
    "incrementally",
    "as",
    "it",
    "arrives.",
    "If",
    "you",
    "see",
    "this",
    "all",
    "at",
    "once,",
    "streaming",
    "may",
    "be",
    "buffered",
    "at",
    "the",
    "edge.",
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
      // Explicitly NOT setting Content-Length - enables Transfer-Encoding: chunked
    },
  });
}
