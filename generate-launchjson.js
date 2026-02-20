const fs = require("fs");
const path = require("path");

const CACHE_FLAG = /export\s+const\s+cachePrimingEnabled\s*=\s*true/;
const DYNAMIC_SEGMENT = /\[.+?\]/;

function findFiles(dir, match) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? findFiles(full, match) : match(entry.name) ? [full] : [];
  });
}

function pagePathToUrl(filePath) {
  const dir = path.dirname(path.relative(path.join(__dirname, "app"), filePath));
  return dir === "." ? "/" : `/${dir.replace(/\\/g, "/")}`;
}

function resolveUrlsFromBuildOutput(routePattern) {
  const routeRegex = new RegExp(
    "^" + routePattern.replace(/\[(?:\.\.\.)?\w+\]/g, "[^/]+") + "$"
  );
  const seen = new Set();
  return [
    path.join(__dirname, ".next", "server", "app"),   // App Router
    path.join(__dirname, ".next", "server", "pages"),  // Pages Router
  ].flatMap((buildDir) =>
    findFiles(buildDir, (name) => name.endsWith(".html")).reduce((acc, file) => {
      let url = "/" + path.relative(buildDir, file).replace(/\\/g, "/").replace(/\.html$/, "");
      if (url.endsWith("/index")) url = url.slice(0, -6) || "/";
      if (routeRegex.test(url) && !seen.has(url)) { seen.add(url); acc.push(url); }
      return acc;
    }, [])
  );
}

const urls = findFiles(path.join(__dirname, "app"), (name) => /^page\.(tsx|ts|jsx|js)$/.test(name))
  .filter((file) => CACHE_FLAG.test(fs.readFileSync(file, "utf8")))
  .flatMap((file) => {
    const url = pagePathToUrl(file);
    if (!DYNAMIC_SEGMENT.test(url)) return [url];
    const resolved = resolveUrlsFromBuildOutput(url);
    if (resolved.length === 0) console.warn(`No pre-rendered pages found for ${url} — ensure generateStaticParams is exported.`);
    return resolved;
  });

fs.writeFileSync(
  path.join(__dirname, "launch.json"),
  JSON.stringify({ cache: { cachePriming: { urls } } }, null, 2) + "\n"
);
console.log(`Generated launch.json with ${urls.length} URL(s):`, urls);
