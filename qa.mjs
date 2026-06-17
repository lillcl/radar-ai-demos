// QA harness for the demos index. Drives the page with a real browser,
// checks for console errors, exercises the controls, and visits a sample
// of demos to make sure they actually load.
//
// Run:  node qa.mjs
// Requires:  node serve.mjs already running on http://127.0.0.1:8765/

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT  = './qa-out';

const results = [];
const findings = [];
const consoleErrors = [];
const failedRequests = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const tag = ok ? '✅' : '❌';
  console.log(`${tag} ${name}${detail ? '  — ' + detail : ''}`);
}

function note(severity, msg) {
  findings.push({ severity, msg });
  const tag = severity === 'warn' ? '⚠️ ' : '• ';
  console.log(`   ${tag}${msg}`);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

page.on('console', m => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', e => consoleErrors.push('pageerror: ' + e.message));
page.on('requestfailed', r => failedRequests.push(`${r.url()}  ${r.failure()?.errorText || ''}`));
page.on('response', r => {
  if (r.status() >= 400) failedRequests.push(`${r.status()}  ${r.url()}`);
});

await mkdir(OUT, { recursive: true });

// ---- 1. Load index.html ---------------------------------------------
{
  const resp = await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  record('Load index.html', resp?.ok() ?? false, `status ${resp?.status()}`);
  await page.screenshot({ path: join(OUT, '01-index-top.png'), fullPage: false });
}

// ---- 2. Page title and brand ----------------------------------------
{
  const title = await page.title();
  record('Title set', title === 'Radar AI — Demos', `"${title}"`);
  const logoText = await page.locator('.logo-meta').first().textContent();
  record('Brand visible', !!logoText && /Radar AI/.test(logoText), logoText?.trim().slice(0, 60));
}

// ---- 3. All 21 demo cards rendered ----------------------------------
{
  const cardCount = await page.locator('.card').count();
  record('21 demo cards rendered', cardCount === 21, `count ${cardCount}`);

  const visibleCards = await page.locator('.card:not(.hidden)').count();
  record('All 21 visible by default', visibleCards === 21, `visible ${visibleCards}`);

  // Every card must have a working <a class="card-link">
  const cardsWithLinks = await page.locator('.card:has(.card-link)').count();
  record('All cards have a link', cardsWithLinks === 21, `${cardsWithLinks}/21`);
}

// ---- 4. Hero stats present -----------------------------------------
{
  const total = await page.locator('#stat-total').textContent();
  record('Hero stat shows 21', total === '21', `"${total}"`);
  const visible = await page.locator('#visible-count').textContent();
  record('Status pill count', visible === '21', `"${visible}"`);
}

// ---- 5. Filter buttons ----------------------------------------------
{
  const filters = await page.locator('.filter').allTextContents();
  record('5 filter buttons', filters.length === 5, `${filters.length}`);
  for (const expected of ['All', 'Scrollytelling', '3D / WebGL', 'Brand', 'Editorial']) {
    const present = filters.some(f => f.includes(expected));
    if (!present) record(`Filter "${expected}" present`, false, '');
  }

  // Click each filter and verify card count matches expected
  const expectations = { all: 21, scrollytelling: 10, '3d': 2, brand: 4, editorial: 5 };
  for (const [cat, expected] of Object.entries(expectations)) {
    await page.locator(`.filter[data-filter="${cat}"]`).click();
    await page.waitForTimeout(120);
    const count = await page.locator('.card:not(.hidden)').count();
    record(`Filter "${cat}" → ${expected} cards`, count === expected, `got ${count}`);
  }
  // Reset to all
  await page.locator('.filter[data-filter="all"]').click();
  await page.waitForTimeout(120);
}

// ---- 6. Search box --------------------------------------------------
{
  await page.locator('#search').fill('voxel');
  await page.waitForTimeout(200);
  const count = await page.locator('.card:not(.hidden)').count();
  record('Search "voxel" filters down', count > 0 && count < 21, `${count} cards`);

  await page.locator('#search').fill('zzzzzzzz');
  await page.waitForTimeout(200);
  const empty = await page.locator('#empty-section').isVisible();
  record('Empty state shows when no match', empty, '');
  const emptyCard = await page.locator('.card:not(.hidden)').count();
  record('Zero visible cards on no match', emptyCard === 0, `${emptyCard} visible`);

  // Reset
  await page.locator('#reset').click();
  await page.waitForTimeout(200);
  const restored = await page.locator('.card:not(.hidden)').count();
  record('Reset restores all 21', restored === 21, `${restored}`);
}

// ---- 7. Section meta counts update ---------------------------------
{
  const metaScroll = await page.locator('#meta-scrollytelling').textContent();
  record('Scrollytelling meta count', /10/.test(metaScroll || ''), metaScroll);
  const metaBrand = await page.locator('#meta-brand').textContent();
  record('Brand meta count', /4/.test(metaBrand || ''), metaBrand);
}

// ---- 8. Notes badge on flagged demos -------------------------------
{
  const noteCount = await page.locator('.card-status.note').count();
  record('Two cards flagged with Notes', noteCount === 2, `${noteCount}`);
  const titles = await page.locator('.card-status.note').evaluateAll(els =>
    els.map(e => e.closest('.card')?.querySelector('.card-title')?.textContent)
  );
  console.log(`   flagged: ${JSON.stringify(titles)}`);
}

// ---- 9. Click into a few demos, verify they render -----------------
{
  // Pick a representative sample: HTML, Next.js out, Vite dist
  const samples = [
    { name: 'earth',                href: '/earth/index.html' },
    { name: 'moimun',               href: '/moimun/index.html' },
    { name: 'payment-crypto',       href: '/payment-crypto/index.html' },
    { name: 'japanes-restaurant',   href: '/japanes%20restaurant/out/index.html' },
    { name: 'IAL-tutor',            href: '/IAL%20tutor/dist/index.html' },
    { name: 'buuble-tea',           href: '/buuble-tea/dist/' },
    { name: 'voxel-morph-guitar',   href: '/voxel-morph-guitar/index.html' },
    { name: 'real-estate',          href: '/real-estate/index.html' },
    { name: 'basement-build',       href: '/basement-build/out/index.html' },
    { name: 'sushi-demo-2',         href: '/sushi%20demo%202/out/index.html' },
  ];
  for (const s of samples) {
    const resp = await page.goto(BASE + s.href, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000); // let scenes boot
    const status = resp?.status();
    // Check for rendered content: real text, or visible canvas/SVG, or a real screenshot diff
    const hasContent = await page.evaluate(() => {
      const body = document.body;
      const text = (body.innerText || '').trim();
      const visibleEls = [...body.querySelectorAll('canvas, svg, img, video, section, header, main, article, h1, h2, h3, p, a, button')]
        .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
      return text.length > 5 || visibleEls.length >= 1;
    });
    const screenshotName = `09-demo-${s.name}.png`;
    await page.screenshot({ path: join(OUT, screenshotName), fullPage: false });
    record(`Demo loads: ${s.name}`,
      status === 200 && hasContent,
      `status ${status}, hasContent=${hasContent}`
    );
  }
}

// ---- 10. All 21 demos respond 200 via direct HTTP ------------------
{
  const links = await fetch(BASE + '/').then(r => r.text()).then(html => {
    // Extract demo hrefs from the JS DEMOS array
    const matches = [...html.matchAll(/href:\s*'([^']+)'/g)].map(m => m[1]);
    return matches.filter(h => h.startsWith('./') && h.endsWith('index.html') || h.endsWith('/'));
  });
  console.log(`\n   Found ${links.length} demo links in index\n`);
  const unique = [...new Set(links)];
  for (const href of unique) {
    const url = BASE + '/' + href.replace(/^\.\//, '');
    const resp = await fetch(url);
    record(`HTTP ${href}`, resp.status === 200, `status ${resp.status}`);
  }
}

// ---- Console / network findings -------------------------------------
console.log('\n=== Console errors ===');
if (consoleErrors.length === 0) {
  console.log('  none');
} else {
  for (const e of consoleErrors.slice(0, 20)) console.log('  • ' + e.slice(0, 200));
}
console.log('\n=== Failed requests ===');
if (failedRequests.length === 0) {
  console.log('  none');
} else {
  for (const e of failedRequests.slice(0, 20)) console.log('  • ' + e);
}

// ---- Summary --------------------------------------------------------
const pass = results.filter(r => r.ok).length;
const fail = results.filter(r => !r.ok).length;
console.log(`\n=== Summary: ${pass} pass, ${fail} fail (of ${results.length}) ===`);

await writeFile(join(OUT, 'results.json'),
  JSON.stringify({ results, findings, consoleErrors, failedRequests }, null, 2));

await browser.close();
process.exit(fail === 0 ? 0 : 1);
