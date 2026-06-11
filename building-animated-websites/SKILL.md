---
name: building-animated-websites
description: Use when building premium animated scroll websites from a single prompt, or when user wants a luxury F&B/SaaS/portfolio site with parallax, pinned scroll, and state-driven transitions. Triggers on "build me a website", "animated landing page", "premium product showcase", "GSAP horizontal scroll", "luxury product site", "scroll-driven design". Also use when the user provides a minimal brief and expects a production-grade multi-section site with image generation, theming, and motion.
---

# Building Premium Animated Websites from a Single Prompt

## Overview

A "single prompt" website is a **constrained creative output** where the agent fills in 95% of the design decisions from a pre-built scaffold. The user supplies a brief; the agent supplies brand identity, copy, palette, section structure, animations, and image strategy.

**Core principle:** The prompt is not the work. The prompt is the *steering wheel*. The scaffold is the *engine*.

```
Single-Prompt Site = Pre-installed libs + CSS-variable theming
                   + AI image pipeline + Documented conventions
                   + Inline editor safety net
```

## When to Use

- User types a one-line brief like "build me a premium animated website for X"
- User wants a luxury F&B, SaaS, portfolio, or hospitality site
- User expects scroll-bound motion (parallax, pinned scroll, entrance reveals)
- User expects state-driven UI (product switchers, mobile menus, tabs)
- User expects a coherent palette + typography system
- User expects AI-generated product imagery to match

**Do NOT use for:** Multi-page apps, dashboards, e-commerce with checkout, content sites with CMS, anything requiring user auth/accounts.

## The 10-Stage Agent Pipeline

When the agent receives a prompt, it executes this sequence. Every stage is a **decision point with a constrained output** — not free design.

### Stage 1: ANALYZE the prompt
Parse signals from keywords:
- "premium" → high design quality, editorial layout
- "animated" → GSAP + Framer, scroll-bound motion
- "luxury" → serif typography, muted palette, generous whitespace
- "artisanal" → hand-crafted feel, mono-font labels, process story
- "[product]" → food/beverage/product → 3-tier menu structure

**Output:** A brief (type, tone, structure, animation, content, audience).

### Stage 2: INFER the brand
Pattern-match from training on thousands of sites in the category.

| Decision | Default | Reasoning |
|---|---|---|
| Brand name | Combine prefix + product | "LUXTEA" = luxury + tea |
| Geography | Real-but-aspirational city | Aoyama, Tokyo; Williamsburg, Brooklyn |
| Philosophy | Borrow a design movement | Wabi-Sabi, Bauhaus, Mid-Century |
| Price range | Tiered ladder with gap | $8–9 base, $10–12 premium |
| Differentiator | Specific technique | Slow-cooked pearls, ceremonial grade |

### Stage 3: SELECT the style
**Palette decision (constrained by CSS comment rules):**

| Mood | Hue | Saturation |
|---|---|---|
| Luxury, food, warm | 28° (bronze) | 40–60% |
| Tech, bold | 348° (crimson) | 83% |
| Creative, feminine | 330° (magenta) | 81% |
| Calm, professional | 151° (pine) | 55% |
| Friendly, casual | 24° (orange) | 95% |
| **FORBIDDEN** | 221° (AI blue), green-500, purple-500 | — |

**Typography decision:**

| Mood | Serif | Sans |
|---|---|---|
| Editorial luxury | Playfair Display | Geist / Inter |
| Modern tech | Space Grotesk | Geist |
| Brutalist | Instrument Serif | JetBrains Mono |
| Soft/warm | Fraunces | Inter |

### Stage 4: SELECT the libraries
**Pre-installed set (don't ask the user):**

| Need | Library |
|---|---|
| Build | Vite + React + TypeScript |
| Styling | Tailwind CSS + tailwindcss-animate |
| Scroll animation | GSAP + @gsap/react + ScrollTrigger |
| State animation | Framer Motion |
| Icons | Lucide React |
| Routing | TanStack Router |
| Async | TanStack Query |
| UI kit | @blinkdotnew/ui (or shadcn/ui) |
| 3D (optional) | @react-three/fiber + drei |
| Forms | react-hook-form + zod |
| Charts | recharts |

**Critical Vite config:**
```ts
resolve: { dedupe: ['react', 'react-dom'] }
```
Without this, multiple React instances cause `Cannot read properties of null (reading 'useRef')`.

### Stage 5: PLAN animations
**Decision tree:**

```
Tied to scroll position?
├─ YES → GSAP + ScrollTrigger
│   ├─ Parallax        → scrub: true
│   ├─ Entrance reveal → scrollTrigger: { start: 'top 80%' }
│   ├─ Pinned scroll   → pin: true, scrub: 1, invalidateOnRefresh: true
│   └─ Scroll-bound draw → scrub: 1
│
└─ NO → Is it React state?
    ├─ YES → Framer Motion
    │   ├─ State switch   → AnimatePresence mode="wait"
    │   ├─ Layout morph   → layoutId + layout
    │   └─ Continuous     → animate={{ y: [0, -10, 0] }}
    │
    └─ NO → Plain CSS transitions
```

**Easing vocabulary:**
- `power4.out` — hero entrance (slow, premium tail)
- `power3.out` — section reveals (snappier)
- `[0.22, 1, 0.36, 1]` — product morph (custom expo out)
- `ease: 'none'` — horizontal scroll (must track scrollbar 1:1)

### Stage 6: PLAN images
**Two-source strategy:**

| Slot | Source | Why |
|---|---|---|
| Hero products | AI-generated | Visual consistency across switcher |
| Supplementary products | Unsplash | Variety for premium tiers |
| Atmospheric/space | Unsplash | Real photography reads as "actual place" |
| Backgrounds | CSS gradients | No image needed |

**Generate 3 AI images max, reuse across components.** Map each to an HSL color used for background cross-fade.

### Stage 7: GENERATE content
**Product naming formula:** `[Ingredient] + [Texture/Descriptor]`
- Brown Sugar Deerioca
- Matcha Sea Salt
- Lavender Taro

**Copy patterns:**
- Italicized lead-in above huge headline ("*Experience the* / LUXTEA REVEAL")
- Tracking-wide uppercase labels (`tracking-[0.4em] text-xs`)
- Mono-font micro-labels ("Notes: Velvet, Honey, Smoke")
- Imperative CTAs ("Discover Collection", "Book a Table")
- Scarcity/FOMO ("Full Menu Coming Soon")

**3-act process structure:** Method/Temperature → Material/Texture → Signature/Secret.

### Stage 8: PLAN architecture
**Standard 4-section template:**

1. **Hero** — 3-column product switcher, parallax, color wash, scroll indicator
2. **Process** — 3-step ritual, connecting line that draws itself, hover states
3. **Collections** — Horizontal pinned scroll, 3 collections × 2 products, "Coming Soon" finale
4. **Boutique/About** — 50/50 split, grayscale-to-color image, staggered text

Plus: Navbar (scroll-aware, mobile drawer) + Footer (dark editorial, 4-col).

**File structure:**
```
src/
├── main.tsx              # React entry + providers
├── App.tsx               # Router
├── pages/HomePage.tsx    # Section composition
├── components/
│   ├── hero/Hero.tsx
│   ├── sections/[Name].tsx
│   └── layout/Navbar.tsx, Footer.tsx
├── lib/utils.ts          # cn() helper
├── index.css             # CSS variables
└── blink/client.ts       # Platform SDK (if applicable)
```

### Stage 9: EXECUTE
For each section:
1. Register GSAP plugins at top of file
2. Wrap animations in `gsap.context(() => {...}, ref)`
3. Return `ctx.revert()` from `useEffect`
4. Use `aspect-[3/4]` or `aspect-[4/5]` on image containers (no CLS)
5. Use `invalidateOnRefresh: true` on resize-sensitive triggers
6. Use `AnimatePresence mode="wait"` for state transitions
7. Use `layoutId` for shared element morphs

**Theming — the CSS variable bridge:**
```css
:root {
  --background: 36 22% 95%;
  --foreground: 24 12% 14%;
  --primary: 28 60% 42%;
  --accent: 36 40% 55%;
  /* ... */
}
```
```js
// tailwind.config.cjs
colors: {
  primary: 'hsl(var(--primary))',
  background: 'hsl(var(--background))',
  // ...
}
```

### Stage 10: QA
**Checklist before shipping:**

- [ ] `gsap.context` cleanup works (no duplicate triggers on hot-reload)
- [ ] Horizontal scroll survives window resize
- [ ] Animations use `transform`/`opacity`, never `width`/`height`
- [ ] `prefers-reduced-motion` disables non-essential motion
- [ ] Color contrast meets WCAG AA
- [ ] All images have `aspect-[x/y]` containers (no CLS)
- [ ] Mobile menu works (hamburger → drawer)
- [ ] Tailwind classes reference defined CSS variables (`npm run check:css-vars`)
- [ ] Fonts load with `font-display: swap`
- [ ] No "AI blue" or generic purple/green-500

## Quick Reference: Library Cheat Sheet

**GSAP patterns:**
```ts
// Scroll parallax
gsap.to(ref.current, {
  scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
  y: 150, scale: 1.1,
});

// Entrance reveal
gsap.from('.child', {
  scrollTrigger: { trigger: parent, start: 'top 80%', toggleActions: 'play none none reverse' },
  opacity: 0, y: 100, stagger: 0.3, duration: 1.2, ease: 'power3.out',
});

// Pinned horizontal scroll
gsap.to(track, {
  x: -totalWidth, ease: 'none',
  scrollTrigger: { trigger: container, pin: true, scrub: 1, start: 'top top',
    end: () => `+=${track.scrollWidth}`, invalidateOnRefresh: true },
});
```

**Framer patterns:**
```tsx
// State cross-fade
<AnimatePresence mode="wait">
  <motion.div key={active} initial={{...}} animate={{...}} exit={{...}} />
</AnimatePresence>

// Layout morph
<motion.div layoutId="shared-id" />

// Continuous
<motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} />
```

**Tailwind conventions:**
- `bg-primary`, `text-foreground` (semantic, not literal colors)
- `tracking-[0.4em]` for editorial uppercase
- `font-serif font-black tracking-tighter leading-none` for display
- `backdrop-blur-md bg-background/80` for glass nav
- `aspect-[3/4]`, `aspect-[4/5]`, `aspect-video` for image containers

## Common Mistakes

| Mistake | Fix |
|---|---|
| `Cannot read properties of null (reading 'useRef')` | Add `dedupe: ['react', 'react-dom']` to Vite |
| ScrollTrigger fires multiple times on hot-reload | Wrap in `gsap.context()`, return `ctx.revert()` |
| Horizontal scroll breaks on resize | Use `end: () => \`+=${ref.scrollWidth}\`` + `invalidateOnRefresh: true` |
| Tailwind classes don't apply | CSS variable not defined — run `check:css-vars` script |
| Animations feel janky | Animate `transform`/`opacity`, never `width`/`height`/`top`/`left` |
| Images cause layout shift (CLS) | Always use `aspect-[x/y]` on image containers |
| `AnimatePresence` doesn't animate exit | Add `key` prop and `mode="wait"` |
| `gsap.from` plays on mount | Always pair with `scrollTrigger: { trigger, start }` |
| Color wash doesn't change | Use inline `style={{ backgroundColor }}`, not dynamic Tailwind class |

## The 4-Section Template (Copy-Ready Structure)

```
┌─ Navbar (fixed, scroll-aware, mobile drawer)
├─ Hero
│   ├─ Eyebrow label (tracking-wide uppercase)
│   ├─ Italicized lead-in + huge serif headline
│   ├─ 3-column: thumbnails | main image | details
│   ├─ Floating decorative orb (continuous motion)
│   └─ Scroll indicator (pulsing)
├─ Process
│   ├─ Section title with eyebrow
│   ├─ 3 columns: number + icon + title + description
│   ├─ Connecting line that draws on scroll
│   └─ Hover: number deepens, icon un-grays, underline scales
├─ Collections
│   ├─ Full-viewport pinned section
│   ├─ Inner track translates leftward on scroll
│   ├─ 3 collections × 2 product cards
│   └─ Final "Coming Soon" slide (FOMO)
├─ Experience/About
│   ├─ 50/50 split: image left, text right
│   ├─ Image: grayscale → color on hover, parallax
│   ├─ Text: staggered fade-in
│   └─ Decorative background type (giant word, 3% opacity)
└─ Footer (dark, 4-col, social icons)
```

## For Full Implementation Details

See [full-guide.md](full-guide.md) for:
- The complete file-by-file walkthrough
- The prompt templates (F&B, SaaS, Portfolio, Restaurant)
- The Vite/Tailwind/PostCSS config
- The CSS variable system in full
- The image generation pipeline
- The inline editor runtime (Blink Picker)
- The 70+ file manifest of the LuxTea case study
