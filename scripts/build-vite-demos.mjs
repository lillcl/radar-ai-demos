// Build the Vite/React demos so they have a working dist/ that the
// index.html can link to. Each demo's node_modules is installed
// on first run, then vite build is invoked. After each build, the
// absolute `/assets/...` and `/favicon.svg` paths Vite emits are
// rewritten to relative `./...` so the page works from any subpath.
//
// Usage:  node scripts/build-vite-demos.mjs

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DEMOS = [
  { name: 'bubble-tea', cwd: 'bubble-tea' },
  { name: 'buuble-tea', cwd: 'buuble-tea' },
  { name: 'IAL tutor', cwd: 'IAL tutor' },
];

function run(cmd, args, cwd) {
  console.log(`  $ ${cmd} ${args.join(' ')}  (cwd ${cwd})`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: true });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd}`);
}

function fixAbsolutePaths(dir) {
  if (!existsSync(dir)) return;
  const indexFile = join(dir, 'index.html');
  if (existsSync(indexFile)) {
    let html = readFileSync(indexFile, 'utf8');
    let changed = false;
    if (/(href|src)="\//.test(html)) {
      html = html.replace(/(href|src)="\//g, '$1="./');
      changed = true;
    }
    if (!/<base\s/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, '<head$1><base href="./">');
      changed = true;
    }
    if (changed) writeFileSync(indexFile, html);
  }
  // Also fix absolute paths inside JS bundles (some apps reference
  // /assets/... inside the runtime code, e.g. IAL tutor's mascot)
  const assets = join(dir, 'assets');
  if (existsSync(assets)) {
    for (const f of readdirSync(assets)) {
      if (!f.endsWith('.js')) continue;
      const p = join(assets, f);
      let s = readFileSync(p, 'utf8');
      const before = s;
      s = s.replace(/(['"\\\(])\/assets\//g, '$1./assets/');
      s = s.replace(/(['"\\\(])\/favicon\./g, '$1./favicon.');
      if (s !== before) {
        writeFileSync(p, s);
        console.log(`    patched ${p}`);
      }
    }
  }
}

for (const d of DEMOS) {
  console.log(`\n=== ${d.name} ===`);
  const dist = join(d.cwd, 'dist');
  const hasDist = existsSync(dist) && existsSync(join(dist, 'index.html'));
  const hasModules = existsSync(join(d.cwd, 'node_modules'));
  if (!hasModules) {
    console.log('  installing dependencies…');
    run('npm', ['install'], d.cwd);
  } else {
    console.log('  node_modules present, skipping install');
  }
  console.log('  building…');
  run('npm', ['run', 'build'], d.cwd);
  console.log('  rewriting absolute paths for subpath serving…');
  fixAbsolutePaths(dist);
  console.log(`  ✓ ${d.name} ready at ${dist}/`);
}

console.log('\nAll Vite demos built and patched.');
