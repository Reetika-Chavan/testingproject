import Link from "next/link";

export const dynamic = "force-dynamic";

const TARGET_SIZE_MB = 6;
const TARGET_CHARS = TARGET_SIZE_MB * 1024 * 1024;

export default async function LargeResponseTest() {
  const bigString = "X".repeat(TARGET_CHARS);

  return (
    <div>
      <nav style={{ padding: "24px" }}>
        <Link href="/">Home</Link> | <Link href="/ssr-demo">SSR Demo</Link>
      </nav>
      <main style={{ padding: "24px" }}>
        <h1>Large Response Test (~{TARGET_SIZE_MB} MB)</h1>
        <p>Target: ~{TARGET_SIZE_MB} MB | Characters: {TARGET_CHARS.toLocaleString()} | Rendered: {new Date().toISOString()}</p>
        <div style={{ maxHeight: "200px", overflow: "hidden", wordBreak: "break-all", fontSize: "10px", color: "#999" }}>
          {bigString}
        </div>
      </main>
    </div>
  );
}
