import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sizeMB = parseFloat(searchParams.get("size") || "6");
  const clampedSize = Math.min(Math.max(sizeMB, 0.1), 20);
  const targetBytes = Math.ceil(clampedSize * 1024 * 1024);

  const chunk = "A".repeat(10000);
  const chunks: string[] = [];
  let totalBytes = 0;

  while (totalBytes < targetBytes) {
    chunks.push(chunk);
    totalBytes += chunk.length;
  }

  const payload = {
    meta: {
      requestedSizeMB: clampedSize,
      approximateBytes: totalBytes,
      timestamp: new Date().toISOString(),
      purpose:
        "CF1001 413 reproduction - response body exceeds Cloudflare 5MB origin limit",
    },
    data: chunks,
  };

  return NextResponse.json(payload);
}
