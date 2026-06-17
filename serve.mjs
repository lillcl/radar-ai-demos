// Tiny static server with SPA fallback so client-side router apps
// (TanStack Router, react-router, Next.js, etc.) work when opened
// from any subpath. Usage:  node serve.mjs [port]
//
// Behaviour:
//   - Serves files relative to the current directory.
//   - On 404, walks up the requested path looking for the nearest
//     index.html and serves that. This makes every URL under a
//     demo resolve to that demo's index — so React apps that read
//     window.location.pathname still land on their root route.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const PORT = Number(process.argv[2] || process.env.PORT || 8765);
const ROOT = resolve('.');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.txt':  'text/plain; charset=utf-8',
  '.map':  'application/json; charset=utf-8',
};

function safeJoin(root, urlPath) {
  // Strip query string, decode, and resolve relative to root.
  // Reject any path that tries to escape via '..' after normalize.
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const full = normalize(join(root, clean));
  if (!full.startsWith(root + sep) && full !== root) return null;
  return full;
}

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
    if (s.isDirectory()) return tryFile(join(p, 'index.html'));
  } catch { /* missing */ }
  return null;
}

async function findSpaFallback(p) {
  // Walk from `p` up to the root, looking for the deepest index.html
  // that contains this path.  e.g. /bubble-tea/dist/missing → fall
  // back to /bubble-tea/dist/index.html.
  let cur = p;
  while (cur.length > ROOT.length) {
    const candidate = await tryFile(join(cur, 'index.html'));
    if (candidate) return candidate;
    const parent = cur.split(sep).slice(0, -1).join(sep) || sep;
    if (parent === cur) break;
    cur = parent;
  }
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const target = safeJoin(ROOT, req.url || '/');
    if (!target) { res.writeHead(400); res.end('Bad request'); return; }

    let file = await tryFile(target);

    // SPA fallback: if the path itself doesn't have a file, see if
    // there's an index.html somewhere up the tree.
    if (!file) file = await findSpaFallback(target);

    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + req.url);
      return;
    }

    const body = await readFile(file);
    const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error: ' + (err && err.message || err));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}/  (SPA fallback enabled)`);
});
