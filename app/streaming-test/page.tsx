"use client";

import Link from "next/link";
import { useState } from "react";

export default function StreamingTestPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [firstChunkTime, setFirstChunkTime] = useState<number | null>(null);
  const [doneTime, setDoneTime] = useState<number | null>(null);

  async function runStream(speed: "fast" | "medium" | "slow") {
    setOutput("");
    setLoading(true);
    setStartTime(Date.now());
    setFirstChunkTime(null);
    setDoneTime(null);

    try {
      const res = await fetch(`/api/stream?speed=${speed}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setOutput("No response body stream available");
        setLoading(false);
        return;
      }

      let firstChunkReceived = false;
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (!firstChunkReceived) {
          setFirstChunkTime(Date.now());
          firstChunkReceived = true;
        }

        fullText += chunk;
        setOutput(fullText);
      }

      setDoneTime(Date.now());
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "700px", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "24px" }}>
        <Link href="/">Home</Link> |{" "}
        <Link href="/large-response-test">Large Response Test</Link>
      </nav>

      <h1>Transfer-Encoding: Chunked Streaming Test</h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        This replicates the iODigital customer use case. Click a button below.
        <strong> If streaming works:</strong> text should appear word-by-word
        incrementally. <strong>If buffered (Launch issue):</strong> the full
        response appears all at once.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button
          onClick={() => runStream("fast")}
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Stream (Fast)
        </button>
        <button
          onClick={() => runStream("medium")}
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Stream (Medium)
        </button>
        <button
          onClick={() => runStream("slow")}
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Stream (Slow)
        </button>
      </div>

      {loading && (
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
          Streaming…
        </p>
      )}

      {output && (
        <>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              minHeight: "80px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              marginBottom: "16px",
            }}
          >
            {output}
          </div>

          {(startTime || firstChunkTime || doneTime) && (
            <div style={{ fontSize: "13px", color: "#666" }}>
              {startTime && (
                <p>Request started: {new Date(startTime).toISOString()}</p>
              )}
              {firstChunkTime && startTime && (
                <p>
                  First chunk delay: <strong>{firstChunkTime - startTime}ms</strong>{" "}
                  (low = streaming; high = likely buffered)
                </p>
              )}
              {doneTime && startTime && (
                <p>
                  Total time: <strong>{doneTime - startTime}ms</strong>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
