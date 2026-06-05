import { animate as motionAnimate } from "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const frameEl = document.querySelector(".scrub-frame");
  const scrubSection = document.querySelector("#scrub");
  const progressLine = document.querySelector(".progress-line");
  const dotRail = document.querySelector(".dot-rail");
  const wordLines = gsap.utils.toArray(".word-line");
  const totalFrames = 49;
  const framePath = (index) => `video/frames/frame_${String(index).padStart(4, "0")}.jpg`;
  const railLabels = {
    0: "Idle",
    2: "Lift",
    4: "Reveal",
    6: "Break",
    8: "Settle",
    10: "Done"
  };
  let rafId = 0;
  let pendingFrame = 1;
  let currentFrame = 1;
  let lastScrubProgress = 0;
  const frameCache = new Map();

  gsap.registerPlugin(ScrollTrigger);

  // hero
  function initHero() {
    const letters = gsap.utils.toArray(".hero-title span");
    if (prefersReduced) {
      gsap.set(letters, { opacity: 1, y: 0 });
      return;
    }
    gsap.to(letters, {
      opacity: 1,
      y: 0,
      duration: 0.72,
      ease: "power4.out",
      stagger: 0.04,
      delay: 0.12
    });
  }

  function splitWords() {
    wordLines.forEach((line) => {
      const words = line.textContent.trim().split(/\s+/);
      line.innerHTML = words.map((word) => `<span class="word">${word}</span>`).join(" ");
    });
  }

  function preloadFrame(index) {
    const clamped = gsap.utils.clamp(1, totalFrames, index);
    if (frameCache.has(clamped)) return;
    const img = new Image();
    img.decoding = "async";
    img.src = framePath(clamped);
    frameCache.set(clamped, img);
  }

  function preloadAround(index, radius = 4) {
    for (let i = index - radius; i <= index + radius; i += 1) preloadFrame(i);
  }

  function loadFrames() {
    if (!frameEl) return;
    frameEl.classList.add("is-ready");
    preloadAround(1, 8);
    requestFrameTime(lastScrubProgress);
    ScrollTrigger.refresh();
  }

  function initLazyFrames() {
    const isNearScrub = () => {
      const rect = scrubSection.getBoundingClientRect();
      const margin = window.innerHeight * 0.3;
      return rect.top < window.innerHeight + margin && rect.bottom > -margin;
    };

    if (isNearScrub()) {
      loadFrames();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      loadFrames();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadFrames();
        observer.disconnect();
      }
    }, { rootMargin: "30% 0px" });
    observer.observe(scrubSection);
  }

  function requestFrameTime(progress) {
    pendingFrame = Math.round(gsap.utils.clamp(0, 1, progress) * (totalFrames - 1)) + 1;
    preloadAround(pendingFrame);
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      if (!frameEl || pendingFrame === currentFrame) return;
      currentFrame = pendingFrame;
      frameEl.src = framePath(currentFrame);
    });
  }

  function setCamera(state) {
    frameEl.style.transform = `translate3d(${state.x}vw, ${state.y}vh, 0) scale(${state.scale}) rotate(${state.rotate}deg)`;
  }

  function setRail(progress) {
    if (!dotRail) return;
    const bucket = Math.min(10, Math.floor(progress * 10.999));
    dotRail.querySelectorAll(".rail-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === bucket);
    });
  }

  function buildRail() {
    if (!dotRail) return;
    dotRail.innerHTML = Array.from({ length: 11 }, (_, index) => {
      const label = railLabels[index] || "";
      return `<span class="rail-dot"><span>${label}</span></span>`;
    }).join("");
  }

  // scrubTimeline
  function initScrubTimeline() {
    if (!frameEl || !scrubSection) return;

    if (isMobile || prefersReduced) {
      loadFrames();
      gsap.set(".word-line .word", { opacity: 0 });
      return;
    }

    gsap.set(wordLines, { autoAlpha: 0 });
    gsap.set(".word-line .word", { opacity: 0, y: 24, scale: 0.92 });

    const state = { frame: 0, scale: 1.02, x: -18, y: 5, rotate: -0.8 };
    const applyState = () => {
      requestFrameTime(state.frame);
      setCamera(state);
    };
    const revealWords = (line, at) => {
      const words = line.querySelectorAll(".word");
      timeline.set(wordLines, { autoAlpha: 0 }, at);
      timeline.set(line, { autoAlpha: 1 }, at);
      timeline.fromTo(words,
        { opacity: 0, y: 24, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power4.out", stagger: 0.06 },
        at + 0.04
      );
      timeline.to(words, { opacity: 0, y: -14, duration: 0.32, ease: "power2.in", stagger: 0.015 }, at + 1.22);
      timeline.to(line, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }, at + 1.42);
    };

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scrubSection,
        start: "top top",
        end: "+=1200%",
        pin: ".scrub-stage",
        scrub: 1.45,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => gsap.set([progressLine, dotRail], { autoAlpha: 1 }),
        onEnterBack: () => gsap.set([progressLine, dotRail], { autoAlpha: 1 }),
        onLeave: () => gsap.set([progressLine, dotRail, wordLines], { autoAlpha: 0 }),
        onLeaveBack: () => gsap.set([progressLine, dotRail, wordLines], { autoAlpha: 0 }),
        onUpdate: (self) => {
          const progress = self.progress;
          lastScrubProgress = progress;
          progressLine.style.height = `${progress * 100}vh`;
          setRail(progress);
        }
      }
    });

    timeline
      .to(state, { frame: 0.12, scale: 1.1, x: -17, y: 5.2, rotate: -0.7, duration: 1.2, onUpdate: applyState }, 0)
      .to(state, { frame: 0.24, scale: 1.24, x: -9, y: 2.5, rotate: -0.35, duration: 1.4, ease: "power2.inOut", onUpdate: applyState }, 1.2)
      .to(state, { frame: 0.43, scale: 1.38, x: -1.5, y: 0.4, rotate: 0, duration: 1.7, ease: "power2.inOut", onUpdate: applyState }, 2.6)
      .to(state, { frame: 0.64, scale: 1.48, x: 7.5, y: -1.2, rotate: 0.28, duration: 1.9, ease: "power2.inOut", onUpdate: applyState }, 4.3)
      .to(state, { frame: 0.84, scale: 1.6, x: 14, y: -2.2, rotate: 0.48, duration: 1.7, ease: "power2.inOut", onUpdate: applyState }, 6.2)
      .to(state, { frame: 1, scale: 1.42, x: 0, y: 0, rotate: 0, duration: 1.6, ease: "power2.inOut", onUpdate: applyState }, 7.9);

    wordLines.forEach((line, index) => revealWords(line, 0.8 + index * 1.65));
  }

  // callouts
  function initCallouts() {
    const callouts = gsap.utils.toArray(".callout");
    if (!callouts.length || isMobile || prefersReduced) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".callout-section",
        start: "top 62%",
        once: true
      }
    });

    callouts.forEach((callout, index) => {
      const labelX = callout.classList.contains("left") ? -24 : 24;
      timeline
        .to(callout.querySelector(".callout-dot"), {
          scale: 1,
          duration: 0.32,
          ease: "power4.out"
        }, index * 0.2)
        .to(callout.querySelector(".callout-line"), {
          scaleX: 1,
          duration: 0.42,
          ease: "power2.inOut"
        }, index * 0.2 + 0.08)
        .fromTo(callout.querySelector(".callout-label"),
          { opacity: 0, x: labelX },
          { opacity: 1, x: 0, duration: 0.42, ease: "power4.out" },
          index * 0.2 + 0.18
        );
    });
  }

  // spec
  function initSpecRows() {
    ScrollTrigger.batch(".spec-row", {
      start: "top 86%",
      once: true,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.06
      })
    });
  }

  // cta
  function initCta() {
    const button = document.querySelector(".reserve-button");
    if (button && !prefersReduced) {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
        motionAnimate(button, { x, y, scale: 1.025 }, { type: "spring", stiffness: 520, damping: 32 });
      });
      button.addEventListener("pointerleave", () => {
        motionAnimate(button, { x: 0, y: 0, scale: 1 }, { type: "spring", stiffness: 420, damping: 28 });
      });
    }

    if (prefersReduced) return;
    gsap.to(".cta h2", {
      backgroundPosition: "100% 50%",
      ease: "none",
      scrollTrigger: {
        trigger: ".cta",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }

  splitWords();
  buildRail();
  initHero();
  initLazyFrames();
  initScrubTimeline();
  initCallouts();
  initSpecRows();
  initCta();
})();
