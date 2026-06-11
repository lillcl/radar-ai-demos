// Wraps an ESM bundle in an async IIFE so it loads as a classic <script>.
//   Input : a self-contained .js file (no remaining import/export statements).
//           top-level `await` is allowed because the browser will treat the
//           whole thing as a module otherwise; wrapping moves the await into
//           an async function body.
//   Output: the same file with `(async()=>{` prepended and `})();` appended.

import { readFile, writeFile } from "node:fs/promises";

const path = process.argv[2];
if (!path) {
  console.error("usage: node iife-wrap.mjs <bundle.js>");
  process.exit(1);
}

const src = await readFile(path, "utf8");

// strip any existing top-level imports/exports just in case
const cleaned = src.replace(/^\s*(import|export)\s.+$/gm, "");

const wrapped = `(async()=>{\n${cleaned}\n})();\n`;
await writeFile(path, wrapped, "utf8");
console.log(`wrapped ${path}  (${(wrapped.length / 1024).toFixed(1)} KB)`);
