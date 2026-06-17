# Radar AI — Demos

A working gallery of spatial, interactive, and generative web demos.
Open [`index.html`](./index.html) to browse them.

## Run

```bash
# 1. Build the Vite/React demos that need a production bundle
npm run build:demos

# 2. Serve the gallery (Python's http.server would also work, but
#    our custom server has SPA fallback so client-side routers
#    resolve correctly)
npm run serve
# → http://127.0.0.1:8765/
```

You can also open `index.html` directly with `file://` — every demo
that doesn't depend on client-side routing will work, including all
the scrollytelling / WebGL / Next.js static exports. The Vite-built
apps (`bubble-tea`, `buuble-tea`, `IAL tutor`) need the static server
to resolve the relative asset paths correctly.

## QA

```bash
npm run qa
# → qa-out/  (screenshots + results.json)
```

The suite loads the index, exercises the search and filter controls,
visits a sample of demos, and asserts every demo entry point returns
HTTP 200.

## Structure

```
index.html        ← the gallery page (categorized grid of 21 demos)
landing.html      ← the previous marketing page (backup)
serve.mjs         ← small static server with SPA fallback
scripts/
  build-vite-demos.mjs   ← builds the three Vite apps + rewrites absolute paths
qa.mjs            ← Playwright QA harness
```
