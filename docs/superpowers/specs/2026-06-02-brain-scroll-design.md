# Brain Scroll Demo — Design Spec
**Date:** 2026-06-02
**Status:** Approved

---

## Overview

Single-page scroll demo showcasing the `brain.mp4` video with GSAP ScrollTrigger. The page serves as a visual proof-of-concept — no product context, just the effect.

---

## Scroll Stages

| Stage | Scroll % | Video Scale | Video X Position | Words State |
|-------|----------|-------------|------------------|-------------|
| 1 | 0–30% | 1.0 (natural) | center (50%) | Stagger fade in |
| 2 | 30–65% | 1.0 → 1.5 (zoom in) | center → left (30%) | Visible |
| 3 | 65–100% | 1.5 → 1.0 (zoom out) | left → right (70%) | Stagger fade out |

---

## Words

**Word list (stagger-animated on scroll):**
`think` → `recall` → `synapse` → `memory` → `neural` → `cognition`

Words are white (`#fff`), large (`clamp(4vw, 8vw, 10vw)`), centered in the remaining viewport space alongside the video.

**Entry animation (Stage 1):** each word fades in + translates up, 100ms stagger, `scrub: false` (plays once on initial scroll into Stage 1).

**Exit animation (Stage 3):** each word fades out + translates down, 100ms stagger in reverse, `scrub: false`.

---

## Technical

- **Single HTML file** — `brain-scroll/index.html`
- **GSAP 3 + ScrollTrigger** via CDN (cdnjs)
- **Video:** `brain.mp4` at `object-fit: cover`, centered in viewport
- **Video transforms:** CSS `transform: scale() translateX()` driven by GSAP scrub
- **Words container:** absolute/fixed positioning, centered in viewport, fills remaining space
- **No build step** — runs directly in browser

---

## File Structure

```
brain-scroll/
  index.html   ← the demo page
  brain.mp4   ← the video asset
```

---

## Success Criteria

- [ ] Video stays pinned to viewport during scroll
- [ ] Stage 1: video centered, natural size
- [ ] Stage 2: video zooms in + slides left
- [ ] Stage 3: video zooms out + slides right
- [ ] Words stagger in at Stage 1
- [ ] Words stagger out at Stage 3
- [ ] No layout jank or flicker