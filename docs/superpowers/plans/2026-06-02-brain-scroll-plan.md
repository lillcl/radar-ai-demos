# Brain Scroll Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single HTML file that showcases a brain.mp4 video with GSAP ScrollTrigger — the video starts centered, zooms in and slides left, then zooms out and slides right, with staggered white words appearing in the remaining space.

**Architecture:** Single HTML file with embedded CSS + JS. GSAP + ScrollTrigger via CDN. The page is 300vh tall to give ScrollTrigger room to work. The video is pinned center while the scroll controls its scale and x-position via GSAP timeline.

**Tech Stack:** HTML, CSS, vanilla JS, GSAP 3 + ScrollTrigger (cdnjs CDN)

---

## File Structure

```
brain-scroll/
  index.html   ← the demo (this file)
  brain.mp4   ← video asset (already exists)
```

---

## Tasks

### Task 1: Create `brain-scroll/index.html`

**Files:**
- Create: `brain-scroll/index.html`

- [ ] **Step 1: Write the HTML structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Brain Scroll Demo</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: #000;
      overflow-x: hidden;
      font-family: system-ui, sans-serif;
    }

    /* Page is 300vh to give ScrollTrigger scroll distance */
    .scroll-container {
      height: 300vh;
      position: relative;
    }

    /* Video layer — pinned by ScrollTrigger */
    .video-wrap {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50vw;
      height: 50vh;
      overflow: hidden;
      z-index: 1;
    }

    .video-wrap video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Words layer */
    .words-wrap {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40vw;
      height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      pointer-events: none;
    }

    .word {
      position: absolute;
      color: #fff;
      font-size: clamp(3vw, 6vw, 8vw);
      font-weight: 700;
      letter-spacing: -0.02em;
      opacity: 0;
      will-change: opacity, transform;
    }

    /* Word positions spread across the center area */
    .word:nth-child(1) { --angle: 0deg;   --r: 0vw;   }
    .word:nth-child(2) { --angle: 60deg;  --r: 8vw;   }
    .word:nth-child(3) { --angle: 120deg; --r: 8vw;   }
    .word:nth-child(4) { --angle: 180deg; --r: 8vw;   }
    .word:nth-child(5) { --angle: 240deg; --r: 8vw;   }
    .word:nth-child(6) { --angle: 300deg; --r: 8vw;   }

    .word {
      transform: translateX(var(--r)) rotate(var(--angle));
    }
  </style>
</head>
<body>

<section class="scroll-container">
  <div class="video-wrap">
    <video src="brain.mp4" autoplay muted loop playsinline></video>
  </div>
  <div class="words-wrap">
    <div class="word">think</div>
    <div class="word">recall</div>
    <div class="word">synapse</div>
    <div class="word">memory</div>
    <div class="word">neural</div>
    <div class="word">cognition</div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);

  const videoWrap = document.querySelector('.video-wrap');
  const words = document.querySelectorAll('.word');

  /* ---------------------------------------------------------------
   * Scroll-driven timeline
   * Stage 1 (0–30%):   video scale 1, x 50%   — words fade in stagger
   * Stage 2 (30–65%):  video scale 1→1.5, x 50%→30%  — words visible
   * Stage 3 (65–100%): video scale 1.5→1, x 30%→70%   — words fade out stagger
   * --------------------------------------------------------------- */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    }
  });

  /* Stage 1 → 2: zoom in + slide left */
  tl.to(videoWrap, {
    scale: 1.5,
    x: '-20vw',       /* shift left so right edge clears center */
    duration: 35,
    ease: 'none',
  }, 0);

  /* Stage 2 → 3: zoom out + slide right */
  tl.to(videoWrap, {
    scale: 1.0,
    x: '20vw',        /* shift right */
    duration: 35,
    ease: 'none',
  }, 35);

  /* ---------------------------------------------------------------
   * Word animations — NOT scrubbed (play on enter/exit once)
   * Stage 1 (0–30%):  fade + rise in, stagger 100ms
   * Stage 3 (65–100%): fade + sink out, stagger 100ms in reverse
   * --------------------------------------------------------------- */
  const wordTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-container',
      start: 'top top',
      end: '30% bottom',
      toggleActions: 'play none none reverse',
    }
  });

  wordTl.fromTo(words,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
  );

  const wordOutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-container',
      start: '65% top',
      end: 'bottom bottom',
      toggleActions: 'play none none reverse',
    }
  });

  wordOutTl.to(words, {
    opacity: 0,
    y: -30,
    stagger: { each: 0.1, from: 'end' },
    duration: 0.4,
    ease: 'power2.in'
  });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify the file exists and is valid**

Run: `ls -la brain-scroll/index.html`

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Video pinned during scroll | Task 1 (video fixed positioning + ScrollTrigger scrub) |
| Stage 1: centered, natural size | Task 1 (initial state) |
| Stage 2: zoom in + slide left | Task 1 (`scale: 1.5`, `x: '-20vw'`) |
| Stage 3: zoom out + slide right | Task 1 (`scale: 1.0`, `x: '20vw'`) |
| Words stagger in at Stage 1 | Task 1 (`wordTl` fromTo) |
| Words stagger out at Stage 3 | Task 1 (`wordOutTl` to) |
| White words, large, centered | Task 1 (CSS `.word` styles) |
| Single HTML file, GSAP CDN | Task 1 (cdnjs imports) |

---

## Self-Review

- No TBD/TODO placeholders ✓
- All code is complete (HTML, CSS, JS) ✓
- Spec requirements all mapped to Task 1 ✓
- File path is `brain-scroll/index.html` ✓
- `brain.mp4` path is relative (`brain.mp4`) matching existing file ✓