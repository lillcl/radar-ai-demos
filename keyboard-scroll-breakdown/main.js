import { animate as motionAnimate } from "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const video = document.querySelector(".scrub-video");
  const scrubSection = document.querySelector("#scrub");
  const progressLine = document.querySelector(".progress-line");
  const dotRail = document.querySelector(".dot-rail");
  const wordLines = gsap.utils.toArray(".word-line");
  const railLabels = {
    0: "Idle",
    2: "Lift",
    4: "Reveal",
    6: "Break",
    8: "Settle",
    10: "Done"
  };
  let videoLoaded = false;
  let rafId = 0;
  let pendingTime = 0;
  let lastScrubProgress = 0;
  let activeWordIndex = -1;

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

  function loadVideo() {
    if (videoLoaded || !video) return;
    videoLoaded = true;
    const onMetadata = () => {
      video.pause();
      video.classList.add("is-ready");
      if (isMobile || prefersReduced) {
        video.currentTime = 0;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        requestFrameTime(lastScrubProgress);
      }
      ScrollTrigger.refresh();
    };
    video.addEventListener("loadedmetadata", onMetadata, { once: true });
    video.preload = "auto";
    const assignSrc = (src) => {
      video.src = src;
      video.load();
      if (video.readyState >= 1) {
        video.removeEventListener("loadedmetadata", onMetadata);
        onMetadata();
      }
    };

    fetch("video/explode.mp4")
      .then((response) => {
        if (!response.ok) throw new Error("Video request failed");
        return response.blob();
      })
      .then((blob) => assignSrc(URL.createObjectURL(blob)))
      .catch(() => assignSrc("video/explode.mp4"));
  }

  function initLazyVideo() {
    const isNearScrub = () => {
      const rect = scrubSection.getBoundingClientRect();
      const margin = window.innerHeight * 0.3;
      return rect.top < window.innerHeight + margin && rect.bottom > -margin;
    };

    if (isNearScrub()) {
      loadVideo();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      loadVideo();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadVideo();
        observer.disconnect();
      }
    }, { rootMargin: "30% 0px" });
    observer.observe(scrubSection);
  }

  function requestFrameTime(progress) {
    if (!video || !video.duration) return;
    pendingTime = gsap.utils.clamp(0, Math.max(0, video.duration - 0.04), progress * video.duration);
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      if (Math.abs(video.currentTime - pendingTime) > 0.025) video.currentTime = pendingTime;
    });
  }

  function setCamera(progress) {
    const ease = gsap.parseEase("power2.inOut")(progress);
    const scale = gsap.utils.interpolate(1.08, 1.52, ease);
    const x = gsap.utils.interpolate(-13, 12, ease);
    const y = gsap.utils.interpolate(4, -2.6, progress);
    const rotate = gsap.utils.interpolate(-0.7, 0.45, ease);
    video.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale}) rotate(${rotate}deg)`;
  }

  function hideWordLine(line) {
    if (!line) return;
    gsap.killTweensOf([line, line.querySelectorAll(".word")]);
    gsap.to(line.querySelectorAll(".word"), {
      opacity: 0,
      y: -12,
      duration: 0.22,
      ease: "power2.out"
    });
    gsap.to(line, { opacity: 0, duration: 0.2, ease: "power2.out" });
  }

  function showWordLine(line) {
    if (!line) return;
    const words = line.querySelectorAll(".word");
    gsap.killTweensOf([line, words]);
    gsap.set(words, { opacity: 0, y: 24, scale: 0.9 });
    gsap.set(line, { opacity: 1 });
    gsap.to(words, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power4.out",
      stagger: 0.06
    });
  }

  function updateWords(progress) {
    const nextIndex = wordLines.findIndex((line) => {
      const start = Number(line.dataset.start);
      const end = Number(line.dataset.end);
      return progress >= start && progress <= end;
    });
    if (nextIndex === activeWordIndex) return;
    hideWordLine(wordLines[activeWordIndex]);
    activeWordIndex = nextIndex;
    if (activeWordIndex >= 0) showWordLine(wordLines[activeWordIndex]);
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
    if (!video || !scrubSection) return;

    if (isMobile || prefersReduced) {
      loadVideo();
      gsap.set(".word-line .word", { opacity: 0 });
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: scrubSection,
        start: "top top",
        end: "+=500%",
        pin: ".scrub-stage",
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => gsap.set([progressLine, dotRail], { autoAlpha: 1 }),
        onEnterBack: () => gsap.set([progressLine, dotRail], { autoAlpha: 1 }),
        onLeave: () => gsap.set([progressLine, dotRail], { autoAlpha: 0 }),
        onLeaveBack: () => gsap.set([progressLine, dotRail], { autoAlpha: 0 }),
        onUpdate: (self) => {
          const progress = self.progress;
          lastScrubProgress = progress;
          requestFrameTime(progress);
          setCamera(progress);
          updateWords(progress);
          progressLine.style.height = `${progress * 100}vh`;
          setRail(progress);
        }
      }
    });

    timeline.to({}, { duration: 1 });
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
  initLazyVideo();
  initScrubTimeline();
  initCallouts();
  initSpecRows();
  initCta();
})();
