# Full Implementation Guide: Building Animated Websites from a Single Prompt

The complete playbook — every library, every config file, every animation pattern, every prompt template. Use this as the heavy reference when [SKILL.md](SKILL.md) tells you to dive deeper.

---

## Table of Contents
1. [The Core Insight](#1-the-core-insight)
2. [Complete Stack — Every Library](#2-complete-stack--every-library)
3. [Project Architecture](#3-project-architecture)
4. [Theming System (CSS Variables)](#4-theming-system-css-variables)
5. [Vite Config — The Hidden Glue](#5-vite-config--the-hidden-glue)
6. [Animation Patterns — Full Code](#6-animation-patterns--full-code)
7. [Image Generation Strategy](#7-image-generation-strategy)
8. [Content Generation Patterns](#8-content-generation-patterns)
9. [The Inline Editor Runtime](#9-the-inline-editor-runtime)
10. [The Single-Prompt Templates](#10-the-single-prompt-templates)
11. [Build It Yourself — Step by Step](#11-build-it-yourself--step-by-step)
12. [Cheat Sheet: Common Pitfalls & Fixes](#12-cheat-sheet-common-pitfalls--fixes)
13. [The Complete File Manifest](#13-the-complete-file-manifest)

---

## 1. The Core Insight

**The single prompt is the last 5% of the work.** The other 95% is a pre-built scaffold.

```
User Prompt (5%)
    │
    ▼
┌──────────────────────────────────────┐
│  THE SCAFFOLD                        │
│  • Pre-installed libraries           │
│  • Themed CSS variables              │
│  • Inline editor runtime             │
│  • AI image generation               │
│  • Documented conventions            │
│  • Build-time validation             │
└──────────────────────────────────────┘
    │
    ▼
Working, editable, animated site
```

**Three pillars make this possible:**
1. **Pre-loaded library graph** — no decision paralysis
2. **CSS-variable theming** with self-documenting rules
3. **Inline editor runtime** — user can correct what the agent gets wrong

---

## 2. Complete Stack — Every Library

### Core Build
| Library | Purpose |
|---|---|
| `vite` | Build tool, fast HMR |
| `typescript` | Type safety |
| `@vitejs/plugin-react` | React Fast Refresh |
| `autoprefixer`, `postcss` | CSS pipeline |

### Styling
| Library | Purpose |
|---|---|
| `tailwindcss` | Utility-first CSS |
| `tailwindcss-animate` | Animation utilities (fade-in, slide-up, accordion) |
| `tailwind-merge` | Merge Tailwind classes without conflicts |
| `clsx` | Conditional class names |

### Animation (the heart of "premium")
| Library | Purpose |
|---|---|
| `gsap` | Scroll-bound animation, parallax, pinned scroll |
| `@gsap/react` | React integration for GSAP |
| `framer-motion` | State-driven motion, AnimatePresence, layout animations |

### UI & Components
| Library | Purpose |
|---|---|
| `@blinkdotnew/ui` | Pre-built component kit (Button, Toaster, AppShell) |
| `lucide-react` | Tree-shakable icon set |
| `react-responsive` | Media query hooks |

### Data & Routing
| Library | Purpose |
|---|---|
| `@tanstack/react-router` | Type-safe routing |
| `@tanstack/react-query` | Async state |
| `zod` | Schema validation |
| `react-hook-form` | Form state |
| `@hookform/resolvers` | Zod resolver |

### 3D & Advanced (available, not always used)
| Library | Purpose |
|---|---|
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers for R3F |
| `recharts` | Charts |
| `@dnd-kit/core` | Drag-and-drop |

### Platform
| Library | Purpose |
|---|---|
| `@blinkdotnew/sdk` | Hosting, auth, image generation, inline editor |
| `react-hot-toast` | Toast notifications |
| `date-fns` | Date utilities |

**The principle:** Pre-install *more* than you need. The agent picks from a curated set.

---

## 3. Project Architecture

```
my-site/
├── .env.local                    # Platform credentials
├── index.html                    # Entry HTML + inline editor
├── package.json                  # Dependencies
├── vite.config.ts                # Vite + React dedupe
├── tailwind.config.cjs           # Tailwind theme (maps to CSS vars)
├── postcss.config.cjs            # PostCSS pipeline
├── tsconfig.json                 # TypeScript config
├── public/                       # Static assets
└── src/
    ├── main.tsx                  # React entry + providers
    ├── App.tsx                   # Router setup
    ├── Shell.tsx                 # AppShell wrapper (optional)
    ├── index.css                 # Global CSS + CSS variables
    ├── blink/client.ts           # Platform SDK
    ├── pages/
    │   └── HomePage.tsx          # Composes sections
    ├── components/
    │   ├── hero/Hero.tsx
    │   ├── sections/Process.tsx
    │   ├── sections/Flavors.tsx
    │   ├── sections/Experience.tsx
    │   └── layout/Navbar.tsx
    │   └── layout/Footer.tsx
    ├── lib/
    │   └── utils.ts              # cn() helper
    └── assets/                   # Local images
```

### Entry Point
```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkUIProvider theme="linear" darkMode="system">
        <Toaster />
        <div className="flex w-full flex-1 flex-col min-h-0">
          <App />
        </div>
      </BlinkUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

### Page Composition
```tsx
// src/pages/HomePage.tsx
const HomePage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans
                    selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Process />
        <Flavors />
        <Experience />
      </main>
      <Footer />
    </div>
  );
};
```

---

## 4. Theming System (CSS Variables)

The entire site is re-skinnable by editing **6 HSL values**.

### Master CSS File
```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Geist:wght@100..900&display=swap');
@import '@blinkdotnew/ui/styles';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  html { height: 100%; }
  #root { min-height: 100dvh; display: flex; flex-direction: column; }
  body {
    min-height: 100dvh;
    @apply bg-background text-foreground;
    font-family: var(--font-sans), 'Inter', -apple-system, sans-serif;
  }
}

:root {
  /* ═══════════════════════════════════════════
     PALETTE — change these to re-skin the site
     ═══════════════════════════════════════════ */
  --background: 36 22% 95%;        /* Warm cream */
  --foreground: 24 12% 14%;        /* Dark ink */
  --primary: 28 60% 42%;           /* Dark bronze */
  --primary-foreground: 36 22% 96%;
  --secondary: 36 14% 90%;
  --accent: 36 40% 55%;            /* Champagne */
  --muted: 36 14% 92%;
  --muted-foreground: 26 8% 38%;
  --border: 32 14% 86%;
  --ring: 28 60% 42%;

  /* Fonts */
  --font-sans: 'Geist', sans-serif;
  --font-serif: 'Playfair Display', serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Shadows */
  --shadow-md: 0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10);

  /* Misc */
  --radius: 0.5rem;
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

:root.dark {
  --background: 30 6% 6%;
  --foreground: 36 14% 94%;
  --primary: 28 60% 55%;
  /* ... full dark palette ... */
}
```

### Tailwind Config Bridge
```js
// tailwind.config.cjs
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@blinkdotnew/ui/dist/index.mjs",
  ],
  theme: {
    extend: {
      borderRadius: {
        sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)', full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)', DEFAULT: 'var(--shadow-md)', md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)', xl: 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: 'var(--font-sans)', heading: 'var(--font-serif)',
        mono: 'var(--font-mono)', serif: 'var(--font-serif)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### PostCSS Config
```js
// postcss.config.cjs
module.exports = {
  plugins: { tailwindcss: require('tailwindcss'), autoprefixer: require('autoprefixer') }
};
```

### The Palette Rules (in CSS comments)
```css
/*
  RULES:
  (1) Pick exactly ONE palette and use BOTH its values
  (2) Replace --background too
  (3) NEVER use "AI blue" (221 83% 53%), green-500, or purple-500
  
  EXAMPLE PALETTES:
  Modern SaaS:    primary 220 10% 20%  /  accent 220 10% 30%
  Bold Tech:      primary 348 83% 47%  /  accent 348 83% 57%
  Quantum Rose:   primary 330 81% 50%  /  accent 330 81% 70%
  Rich Forest:    primary 151 55% 25%  /  accent 151 55% 35%
  Sunset Warmth:  primary 24 95% 53%   /  accent 24 95% 63%
*/
```

---

## 5. Vite Config — The Hidden Glue

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
    // CRITICAL: @blinkdotnew/ui + framer-motion + R3F must share one React
    // instance or hooks crash with: Cannot read properties of null (reading 'useRef')
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'framer-motion'],
  },
  server: { port: 3000, strictPort: true, host: true, allowedHosts: true },
});
```

**Why `dedupe` matters:** Multiple libraries depending on React can install **multiple React copies**. Each has its own `useRef`/`useState`/etc. — hooks from one copy can't see state from another. `dedupe` forces a single instance.

---

## 6. Animation Patterns — Full Code

### GSAP: Scroll Parallax
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 150, scale: 1.1,
    });
  }, heroRef);
  return () => ctx.revert();
}, []);
```

### GSAP: Entrance Reveal
```tsx
gsap.from('.process-step', {
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0, y: 100,
  stagger: 0.3,
  duration: 1.2,
  ease: 'power3.out',
});
```

### GSAP: Scroll-Bound Line Draw
```tsx
gsap.from('.process-line', {
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top 50%',
    scrub: 1,
  },
  scaleX: 0,
  transformOrigin: 'left',
});
```

### GSAP: Pinned Horizontal Scroll (signature trick)
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    const totalWidth = horizontalRef.current.scrollWidth - window.innerWidth;
    gsap.to(horizontalRef.current, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${horizontalRef.current?.scrollWidth}`,
        invalidateOnRefresh: true,  // recalculate on resize
      },
    });
  }, containerRef);
  return () => ctx.revert();
}, []);
```

### Framer: State Cross-Fade
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeFlavor.id}
    initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
  >
    <img src={activeFlavor.image} />
  </motion.div>
</AnimatePresence>
```

### Framer: Layout Morph (shared element)
```tsx
{activeFlavor.id === flavor.id && (
  <motion.div
    layoutId="active-indicator"  // same ID = animated between elements
    className="absolute -right-2 top-1/2 -translate-y-1/2"
  >
    <div className="w-1 h-12 bg-primary rounded-full" />
  </motion.div>
)}
```

### Framer: Continuous Motion
```tsx
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20
             backdrop-blur-3xl rounded-full z-[-1]"
/>
```

### Framer: While-In-View Entrance
```tsx
<motion.span
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  className="text-primary uppercase tracking-[0.4em] text-xs font-bold mb-6 block"
>
  The Ritual
</motion.span>
```

### CSS: Scroll-Aware Navbar
```tsx
const [isScrolled, setIsScrolled] = useState(false);
useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 50);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

<nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
  isScrolled ? 'py-4 bg-background/80 backdrop-blur-md border-b border-border' : 'py-8 bg-transparent'
}`}>
```

---

## 7. Image Generation Strategy

### Two-Source Strategy

| Slot | Source | Why |
|---|---|---|
| Hero products (3) | AI-generated | Visual consistency |
| Collection items (6) | First 3 = AI, last 3 = Unsplash | Brand consistency + variety |
| Atmospheric/space | Unsplash | Real photography |
| Backgrounds | CSS gradients | No image needed |

### AI Image URL Pattern
```
https://storage.googleapis.com/blink-core-storage/projects/{projectId}/ai-images/{unix-ms-timestamp}-{uuid}.png
```

### HSL Color Mapping
```tsx
const FLAVORS = [
  { id: 'classic', name: 'Classic Pearl', color: 'hsl(28, 60%, 42%)' },
  { id: 'matcha',  name: 'Matcha Cloud',  color: 'hsl(142, 45%, 35%)' },
  { id: 'taro',    name: 'Taro Velvet',   color: 'hsl(270, 40%, 45%)' },
];

// Hero background cross-fades between ${color}15 (15% alpha)
<motion.div
  animate={{ backgroundColor: `${activeFlavor.color}15` }}
  transition={{ duration: 1.5 }}
/>
```

### Unsplash URL Pattern
```
https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w={width}&q=80
```

---

## 8. Content Generation Patterns

### Brand Identity Template
- **Name**: `[Prefix] + [Product]` (LUXTEA = luxury + tea)
- **Tagline**: "Experience the [BRAND] [REVEAL/METHOD/STORY]"
- **Positioning**: "Artisanal," "Craftsmanship," "The Ritual," "The Boutique"
- **Geography**: Real-but-aspirational city (Aoyama, Tokyo; Williamsburg, Brooklyn)
- **Philosophy**: Borrow from a design movement (Wabi-Sabi, Bauhaus, Mid-Century)

### Product Naming Formula
`[Ingredient/Origin] + [Texture/Descriptor]`
- Brown Sugar Deerioca
- Matcha Sea Salt
- Lavender Taro
- Rose Oolong

### Pricing Strategy
Tiered ladder: $8.50 → $9.20 → $9.50 → $10.50 → $12.00
- Signature: $8–9
- Botanical: $9–10
- Reserve: $10–12

### Copywriting Patterns
- Italicized lead-in above huge headline
- Tracking-wide uppercase labels (`tracking-[0.4em]`)
- Mono-font micro-labels
- Imperative CTAs
- Scarcity/FOMO closes

### 3-Act Process Structure
1. **Method/Temperature** — technical foundation
2. **Material/Texture** — craft element
3. **Signature/Secret** — unique differentiator

---

## 9. The Inline Editor Runtime

Platforms like Blink ship a `BLINK_PICKER_RUNTIME` script that enables click-to-edit on the live site.

### What It Does
- Detects clickable text elements
- Single-click enters caret-edit mode
- Has `COMPUTED_KEYS` for every styleable property
- `INLINE_EDIT_DENY` blocks: `<input>`, `<textarea>`, `<script>`, `<style>`, `<svg>`, `<img>`, `<code>`, `<pre>`
- `INLINE_EDIT_SINGLE_LINE` allows: `<h1>-<h6>`, `<button>`, `<a>`, `<label>`, `<summary>`
- `SKIP_TAGS`: `<script>`, `<style>`, `<link>`, `<meta>`, `<head>`, `<noscript>`, `<template>`

### Why This Matters
The agent only ships a **good default**. The user can:
- Click any headline → type to replace
- Click any description → edit inline
- Save → site updates

The prompt can be vague because the system assumes iteration.

---

## 10. The Single-Prompt Templates

### Template A: Premium F&B / Product
```
Build a premium animated scroll website for [BRAND NAME], a luxury 
artisanal [PRODUCT TYPE] brand in [CITY]. The aesthetic should be 
editorial and minimal — use [PALETTE WORDS] colors with [SERIF FONT] 
for headlines and [SANS FONT] for body.

Include these sections:
1. Hero with a [NUMBER]-flavor product switcher, parallax product 
   image, and animated color wash on selection
2. "[PROCESS TITLE]" — a 3-step ritual section with a connecting 
   line that draws itself on scroll
3. "[COLLECTIONS TITLE]" — horizontal pinned-scroll showcase with 
   3 collections, 2 products each
4. "[BOUTIQUE TITLE]" — split section with grayscale-to-color 
   boutique image and parallax

Animation requirements: Use GSAP ScrollTrigger for scroll-bound 
motion (parallax, pinned scroll, entrance reveals), Framer Motion 
for state-driven UI (flavor switching, mobile menu), and CSS for 
hover states. Use gsap.context for proper cleanup. Respect 
prefers-reduced-motion.
```

### Template B: SaaS / Tech
```
Build a premium animated scroll website for [PRODUCT NAME], a 
[B2B/B2C] [CATEGORY] tool. The aesthetic should be [MODERN/BOLD/QUIET] 
— use [PALETTE] with [SANS FONT] for headlines.

Sections:
1. Hero with animated product UI mockup (typing animation, cursor blink)
2. Feature grid with scroll-triggered stagger
3. Horizontal "Integrations" scroll (logos)
4. Pricing comparison with animated toggle
5. Testimonial carousel
6. CTA footer with gradient
```

### Template C: Portfolio / Agency
```
Build a premium animated scroll portfolio for [NAME/AGENCY], a 
[DESIGN/DEV/BRANDING] studio. The aesthetic should be [BRUTALIST/
EDITORIAL/MINIMAL] with strong typography.

Sections:
1. Hero with name + role + rotating project count
2. Horizontal "Selected Work" scroll with project cards
3. About split section with bio + skills
4. Horizontal "Clients" logo strip
5. Contact CTA with animated marquee
```

### Template D: Restaurant / Hospitality
```
Build a premium animated scroll website for [RESTAURANT NAME], a 
[CUISINE] restaurant in [CITY]. The aesthetic should be [MOOD: 
warm/cool/dark/bright] — use [PALETTE] with [SERIF FONT].

Sections:
1. Hero with rotating signature dish
2. "Our Philosophy" — 3-step process
3. Horizontal menu scroll with dish cards
4. "The Space" — split section with interior photography
5. Reservation CTA
```

### The Variables That Matter Most
1. **Product/brand type** — determines section structure
2. **Aesthetic mood** — determines palette + typography
3. **Specific section count** — 4 is the sweet spot
4. **Animation libraries** — mention GSAP + Framer explicitly
5. **Cleanup requirements** — mention `gsap.context`

---

## 11. Build It Yourself — Step by Step

### Step 1: Initialize
```bash
npm create vite@latest my-site -- --template react-ts
cd my-site
```

### Step 2: Install Dependencies
```bash
npm install gsap @gsap/react framer-motion lucide-react \
  @tanstack/react-router @tanstack/react-query \
  tailwindcss@3.3.5 tailwindcss-animate tailwind-merge clsx
npm install -D @vitejs/plugin-react autoprefixer postcss
```

### Step 3: Configure Tailwind
Create `tailwind.config.cjs` with CSS-variable mapping. Create `postcss.config.cjs` with tailwind+autoprefixer plugins.

### Step 4: Create CSS Theming
Create `src/index.css` with:
- Google Fonts import
- `:root` CSS variables for colors, fonts, shadows
- `tailwindcss-animate` keyframes
- Dark mode override

### Step 5: Configure Vite
```ts
resolve: { alias: { '@': ... }, dedupe: ['react', 'react-dom'] }
optimizeDeps: { include: ['react', 'react-dom', 'framer-motion'] }
```

### Step 6: Build the 4 Sections
Copy the structure from [SKILL.md](SKILL.md) "4-Section Template."

### Step 7: Generate Images
- 3 AI-generated product images (or Unsplash for now)
- Store URLs in a data array
- Map each to HSL color for background wash

### Step 8: Register GSAP Plugin
In each component that uses ScrollTrigger:
```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### Step 9: Test Animations
- Verify parallax feels smooth
- Verify pinned horizontal scroll survives window resize
- Verify `gsap.context` cleanup works (check for duplicate triggers on hot-reload)

### Step 10: Add Inline Editor (Optional)
Inject the Blink Picker runtime into `index.html` if on the Blink platform.

---

## 12. Cheat Sheet: Common Pitfalls & Fixes

| Pitfall | Cause | Fix |
|---|---|---|
| `Cannot read properties of null (reading 'useRef')` | Multiple React instances | Add `dedupe: ['react', 'react-dom']` to Vite |
| ScrollTrigger fires multiple times on hot-reload | Missing cleanup | Wrap in `gsap.context()`, return `ctx.revert()` |
| Horizontal scroll breaks on window resize | `end` calculated once | Use `end: () => \`+=${ref.scrollWidth}\`` + `invalidateOnRefresh: true` |
| Tailwind classes don't apply | CSS variable not defined | Run `check:css-vars` script; add to `index.css` |
| Animations feel janky | Animating `width`/`height`/`top`/`left` | Animate `transform`/`opacity` only |
| Fonts flash on load (FOUT) | Web fonts load after CSS | `font-display: swap` (in Google Fonts URL) + preload |
| Images cause layout shift (CLS) | No aspect ratio | Use `aspect-[3/4]`, `aspect-[4/5]`, `aspect-video` |
| `AnimatePresence` doesn't animate exit | Missing `key` or `mode` | Add `key={active.id}` and `mode="wait"` |
| `gsap.from` plays immediately on mount | Missing `scrollTrigger` | Always pair with `scrollTrigger: { trigger, start }` |
| Color wash doesn't change | Tailwind purging dynamic class | Use inline `style={{ backgroundColor: ... }}` |

---

## 13. The Complete File Manifest

For reference, here's every file in the LuxTea case study project:

| File | Lines | Purpose |
|---|---|---|
| `package.json` | 51 | Dependencies + scripts |
| `vite.config.ts` | 24 | Build config + React dedupe |
| `tailwind.config.cjs` | 145 | Theme + CSS variable mapping |
| `postcss.config.cjs` | 6 | CSS pipeline |
| `tsconfig.json` | 30 | TypeScript config |
| `index.html` | 700+ | Entry HTML + Blink Picker runtime |
| `src/main.tsx` | 22 | React entry + providers |
| `src/App.tsx` | 28 | Router setup |
| `src/Shell.tsx` | 52 | AppShell wrapper (optional) |
| `src/index.css` | 200 | Global CSS + CSS variables |
| `src/blink/client.ts` | 9 | Platform SDK client |
| `src/lib/utils.ts` | 6 | `cn()` helper |
| `src/pages/HomePage.tsx` | 34 | Page composition |
| `src/components/hero/Hero.tsx` | 214 | Product switcher + parallax |
| `src/components/sections/Process.tsx` | 112 | 3-step ritual |
| `src/components/sections/Flavors.tsx` | 112 | Horizontal pinned scroll |
| `src/components/sections/Experience.tsx` | 96 | Boutique split section |
| `src/components/layout/Navbar.tsx` | 96 | Scroll-aware nav |
| `src/components/layout/Footer.tsx` | 70 | Editorial footer |

**Total: ~1,400 lines of code** for a 4-section animated site with parallax, horizontal scroll, state-driven transitions, and full theming.

---

## Final Formula

```
Single-Prompt Animated Website
=
  Pre-installed library graph (GSAP + Framer + Tailwind)
+ CSS-variable theming with palette rules
+ AI image generation pipeline
+ 4-section template (Hero + Process + Collections + About)
+ Animation decision tree (GSAP for scroll, Framer for state)
+ Inline editor runtime (user fixes what the agent gets wrong)
+ Documented conventions (gsap.context, AnimatePresence, aspect ratios)
```

The prompt sets the mood. The scaffold does the work. The user fills the gaps.

**That's how "one prompt" ships a production-grade animated website.**
