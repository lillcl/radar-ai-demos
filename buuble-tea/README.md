# AETHEL HOROLOGIE

> A premium single-prompt animated website for **AETHEL HOROLOGIE**, a fictional Swiss haute-horlogerie maison based in La Chaux-de-Fonds.

A four-section editorial showcase with GSAP scroll-bound motion, Framer Motion state-driven UI, and a champagne-bronze / obsidian palette built on CSS variables.

## Sections

1. **Hero** — Live Geneva time, 3-watch product switcher with parallax + color wash, auto-cycling timepieces
2. **Atelier** — 3-step craftsmanship narrative (Caliber → Hand → Côtes de Genève) with a self-drawing connecting line
3. **Collections** — Horizontal pinned scroll showcasing 3 collections × 2 pieces, with a "Coming Soon" finale
4. **La Maison** — 50/50 split, grayscale-to-color atelier photograph, parallax image, heritage stats

Plus a scroll-aware Navbar with mobile drawer and a dark editorial Footer with newsletter form.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (CSS-variable theming, no hard-coded colors)
- **GSAP + ScrollTrigger** — scroll parallax, entrance reveals, pinned horizontal scroll, scroll-bound line draw
- **Framer Motion** — state cross-fade on product switch, mobile drawer
- **Lucide React** — icons

## Theming

The entire site can be re-skinned by editing the `--primary` / `--background` HSL values in `src/index.css`. No "AI blue," no green-500, no purple-500.

```css
:root {
  --background: 38 28% 94%;    /* aged ivory */
  --foreground: 28 14% 10%;    /* near-black ink */
  --primary:    32 45% 32%;    /* champagne bronze */
  --obsidian:   28 14% 8%;
  --champagne:  38 50% 65%;
  --font-serif: 'Playfair Display', serif;
  --font-sans:  'Inter', sans-serif;
  --font-mono:  'IBM Plex Mono', monospace;
}
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Design notes

- All animations use `transform` / `opacity` (no layout thrash)
- `gsap.context` cleanup on every animated component
- Pinned horizontal scroll uses `end: () => ...` + `invalidateOnRefresh: true` for resize safety
- `prefers-reduced-motion` honored globally
- All images use `aspect-[x/y]` containers (no CLS)
- Live Geneva time displayed in the hero (real clock)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
