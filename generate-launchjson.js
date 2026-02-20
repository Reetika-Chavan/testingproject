const fs = require('fs');
const path = require('path');

function findPageFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPageFiles(fullPath));
    } else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function pagePathToUrl(filePath) {
  const appDir = path.join(__dirname, 'app');
  const relative = path.relative(appDir, filePath);
  const dir = path.dirname(relative);
  return dir === '.' ? '/' : `/${dir.replace(/\\/g, '/')}`;
}

const appDir = path.join(__dirname, 'app');
const pageFiles = findPageFiles(appDir);

const urls = [];
for (const filePath of pageFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (/export\s+const\s+cachePrimingEnabled\s*=\s*true/.test(content)) {
    urls.push(pagePathToUrl(filePath));
  }
}

const launchJson = {
  cache: {
    cachePriming: {
      urls,
    },
  },
};

const outputPath = path.join(__dirname, 'launch.json');
fs.writeFileSync(outputPath, JSON.stringify(launchJson, null, 2) + '\n');
console.log(`Generated launch.json with ${urls.length} URL(s):`, urls);
