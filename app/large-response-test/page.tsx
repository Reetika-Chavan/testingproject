import Link from "next/link";

export const dynamic = "force-dynamic";

const TARGET_SIZE_MB = 6;
const TARGET_BYTES = TARGET_SIZE_MB * 1024 * 1024;

export default async function LargeResponseTest() {
  const chunk = "X".repeat(1000);
  const repeatCount = Math.ceil(TARGET_BYTES / chunk.length);
  const paragraphs: string[] = [];
  for (let i = 0; i < repeatCount; i++) {
    paragraphs.push(chunk);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            TestApp
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/ssr-demo"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
            >
              SSR Demo
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Large Response Test ({TARGET_SIZE_MB} MB+)
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              CF1001 413 Reproduction - This page generates a response body
              exceeding {TARGET_SIZE_MB} MB to trigger Cloudflare&apos;s origin
              response size limit.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Test Details
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Target response size: ~{TARGET_SIZE_MB} MB</li>
              <li>Total chunks: {repeatCount.toLocaleString()}</li>
              <li>Characters per chunk: {chunk.length.toLocaleString()}</li>
              <li>
                Total content characters:{" "}
                {(repeatCount * chunk.length).toLocaleString()}
              </li>
              <li>Rendered at: {new Date().toISOString()}</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-mono text-xs break-all text-gray-500 dark:text-gray-500"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
