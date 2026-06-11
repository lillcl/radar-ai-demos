// Rewrites absolute asset paths in a Next.js `out/` folder so the
// static export works when opened from `file://` (or any non-root path).
//   /_next/...   ->  ./_next/...
//   /assets/...  ->  ./assets/...
//   href="/foo"  ->  href="./foo"
//   src="/bar"   ->  src="./bar"
//
// Usage:  node scripts/fix-static-paths.mjs <out-folder>

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("usage: node fix-static-paths.mjs <out-folder>");
  process.exit(1);
}

const SKIP_DIRS = new Set(["node_modules", ".git", ".next"]);

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let total = 0;
let htmlHits = 0;
for await (const file of walk(root)) {
  if (extname(file) !== ".html") continue;
  const before = await readFile(file, "utf8");
  const after = before
    // /_next/... -> ./_next/...
    .replaceAll('"/_next/', '"./_next/')
    // href="/path"  ->  href="./path"
    .replaceAll('href="/', 'href="./')
    // src="/path"   ->  src="./path"
    .replaceAll('src="/', 'src="./')
    // /assets/... -> ./assets/...
    .replaceAll('"/assets/', '"./assets/')
    // /public/... -> ./public/...
    .replaceAll('"/public/', '"./public/');
  if (after !== before) {
    await writeFile(file, after, "utf8");
    htmlHits++;
  }
  total++;
}
console.log(`rewrote ${htmlHits}/${total} html files under ${root}`);
