"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Diamond, ForkKnife, Knife, SealCheck } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

type ScrollState = {
  at: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
};

const scrollStates: ScrollState[] = [
  { at: 0, x: -31, y: 10, rotation: -12, scale: 0.74, opacity: 0.35 },
  { at: 0.22, x: -12, y: -7, rotation: 19, scale: 1.02, opacity: 0.78 },
  { at: 0.45, x: 8, y: 4, rotation: 64, scale: 1.28, opacity: 1 },
  { at: 0.68, x: 29, y: -11, rotation: 116, scale: 0.94, opacity: 0.82 },
  { at: 1, x: 2, y: 0, rotation: 180, scale: 1.08, opacity: 0.48 }
];

const courses = [
  ["01", "Arrival", "Hinoki, chilled brass, a single warm towel folded with ceremony."],
  ["02", "Knife Work", "A slow technical disassembly of texture, temperature, and intention."],
  ["03", "Nigiri", "Rice held at body warmth, brushed once, served in absolute silence."],
  ["04", "Afterglow", "Amber tea, charcoal sweets, the room returning to a lower register."]
];

const easeState = gsap.parseEase("power2.inOut");
const frameSources = Array.from(
  { length: 18 },
  (_, index) => `/media/frames/frame-${String(index).padStart(2, "0")}.jpg`
);

function drawImageCover(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const canvas = context.canvas;
  const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, x, y, width, height);
}

function interpolate(states: ScrollState[], progress: number) {
  const p = gsap.utils.clamp(0, 1, progress);
  const nextIndex = states.findIndex((state) => state.at >= p);

  if (nextIndex <= 0) return states[0];
  if (nextIndex === -1) return states[states.length - 1];

  const start = states[nextIndex - 1];
  const end = states[nextIndex];
  const local = (p - start.at) / (end.at - start.at);
  const eased = easeState(local);

  return {
    at: p,
    x: gsap.utils.interpolate(start.x, end.x, eased),
    y: gsap.utils.interpolate(start.y, end.y, eased),
    rotation: gsap.utils.interpolate(start.rotation, end.rotation, eased),
    scale: gsap.utils.interpolate(start.scale, end.scale, eased),
    opacity: gsap.utils.interpolate(start.opacity, end.opacity, eased)
  };
}

export function CinematicOmakase() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const objectRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const targetFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const frameCacheRef = useRef(new Map<number, HTMLImageElement>());
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef({ active: false, startX: 0, rotation: 0, offset: 0 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const loadFrame = (index: number) => {
      const frameIndex = gsap.utils.clamp(0, frameSources.length - 1, index);
      const cached = frameCacheRef.current.get(frameIndex);
      if (cached) return cached;

      const image = new window.Image();
      image.decoding = "async";
      image.src = frameSources[frameIndex];
      image.onload = () => {
        if (frameIndex === targetFrameRef.current) {
          drawTargetFrame();
        }
      };
      frameCacheRef.current.set(frameIndex, image);
      return image;
    };

    const preloadNearbyFrames = (index: number) => {
      for (let offset = -4; offset <= 4; offset += 1) {
        loadFrame(index + offset);
      }
    };

    const drawTargetFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas || drawnFrameRef.current === targetFrameRef.current) return;

      const context = canvas.getContext("2d");
      const image = loadFrame(targetFrameRef.current);
      if (!context || !image.complete || image.naturalWidth === 0) return;

      drawImageCover(context, image);
      drawnFrameRef.current = targetFrameRef.current;
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        drawnFrameRef.current = -1;
        drawTargetFrame();
      }
    };

    loadFrame(0);
    preloadNearbyFrames(0);
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let progressiveFrame = 0;
    const progressivePreload = window.setInterval(() => {
      loadFrame(progressiveFrame);
      progressiveFrame += 1;
      if (progressiveFrame >= frameSources.length) {
        window.clearInterval(progressivePreload);
      }
    }, 90);

    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.82
    });

    const raf = (time: number) => {
      lenis.raf(time);
      drawTargetFrame();
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.set(".reveal", { y: 42, opacity: 0, filter: "blur(10px)" });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.to(element, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        });
      });

      gsap.to(".course-line", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: ".course-section",
          start: "top 68%",
          end: "bottom 68%",
          scrub: true
        }
      });

      ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: "+=4200",
        pin: true,
        scrub: 0.28,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${Math.round(p * 100).toString().padStart(2, "0")}%`;
          }

          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: p });
          }

          const nextFrame = Math.round(p * (frameSources.length - 1));
          targetFrameRef.current = nextFrame;
          preloadNearbyFrames(nextFrame);

          const object = objectRef.current;
          if (!object) return;

          const state = interpolate(scrollStates, p);
          const dragBlend = dragRef.current.active ? 1 : gsap.utils.clamp(0, 1, dragRef.current.offset);
          const dragRotation = dragRef.current.rotation + dragRef.current.offset * 0.16;
          const rotation = gsap.utils.interpolate(state.rotation, dragRotation, dragBlend);

          gsap.set(object, {
            xPercent: state.x,
            yPercent: state.y,
            rotate: rotation,
            scale: state.scale,
            opacity: state.opacity
          });
        }
      });

      gsap.to(".hero-copy", {
        yPercent: -22,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=2100",
          scrub: true
        }
      });

      gsap.to(".cinema-frame", {
        scale: 1.16,
        ease: "none",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=4200",
          scrub: true
        }
      });

      gsap.to(".gold-rule", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=4200",
          scrub: true
        }
      });
    }, rootRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      window.removeEventListener("resize", resizeCanvas);
      window.clearInterval(progressivePreload);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current.active = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.rotation = interpolate(scrollStates, progressRef.current).rotation;
    dragRef.current.offset = 1;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !objectRef.current) return;
    const delta = event.clientX - dragRef.current.startX;
    dragRef.current.offset = delta;
    gsap.set(objectRef.current, { rotate: dragRef.current.rotation + delta * 0.16 });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
    gsap.to(dragRef.current, {
      offset: 0,
      duration: 0.75,
      ease: "power3.out"
    });
  };

  return (
    <main ref={rootRef} className="min-h-[100dvh] overflow-hidden bg-[var(--sumi)] text-[var(--paper)]">
      <nav className="fixed left-1/2 top-5 z-20 flex w-[min(calc(100%-2rem),880px)] -translate-x-1/2 items-center justify-between rounded-full border border-[#e7cf91]/15 bg-[#080706]/68 px-4 py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl md:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7cf91] text-[#161006]">
            <ForkKnife size={18} weight="light" />
          </span>
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#e9d8aa]">Kurohana</span>
        </div>
        <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-[#a99676] md:flex">
          <a href="#ritual">Ritual</a>
          <a href="#counter">Counter</a>
          <a href="#reserve">Reserve</a>
        </div>
        <a
          href="#reserve"
          className="group flex items-center gap-2 rounded-full bg-[#f1dfaa] py-1.5 pl-4 pr-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#161006] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
        >
          Seat
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1208] text-[#f1dfaa] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
            <ArrowRight size={14} weight="light" />
          </span>
        </a>
      </nav>

      <section ref={stageRef} className="relative min-h-[100dvh]">
        <canvas
          ref={canvasRef}
          className="cinema-frame pointer-events-none absolute inset-0 h-full w-full transform-gpu opacity-80 will-change-transform"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_40%,transparent_0,rgba(8,7,6,0.16)_24%,rgba(8,7,6,0.88)_78%),linear-gradient(90deg,rgba(8,7,6,0.92),rgba(8,7,6,0.18)_52%,rgba(8,7,6,0.82))]" />
        <div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-[#e7cf91] gold-rule" />

        <div className="hero-copy relative z-[1] grid min-h-[100dvh] grid-cols-1 content-end px-5 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:px-12 md:pb-20 lg:px-20">
          <div className="max-w-[720px]">
            <div className="reveal mb-6 inline-flex rounded-full border border-[#e7cf91]/20 bg-[#120f0a]/42 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#e7cf91]">
              Ginza-tempo omakase
            </div>
            <h1 className="reveal font-display text-[clamp(3rem,7.4vw,8.8rem)] font-medium leading-[0.88] tracking-normal text-[#f6efe2]">
              Quiet theatre for twelve seats.
            </h1>
            <p className="reveal mt-7 max-w-[38rem] text-base leading-8 text-[#c8b892] md:text-lg">
              A luxury sushi counter built around patience, amber heat, and the technical ritual of taking apart the sea before returning it as a single bite.
            </p>
          </div>
          <div className="hidden items-end justify-end md:flex">
            <div className="reveal w-[300px] border-l border-[#e7cf91]/18 pl-8 text-[#a99676]">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#e7cf91]">Chef's counter cadence</p>
              <p className="mt-4 text-sm leading-7">
                Each course arrives with the patience of a blade, the warmth of rice, and a room held just above a whisper.
              </p>
            </div>
          </div>
        </div>

        <div
          ref={objectRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="absolute left-[54%] top-[48%] z-[2] hidden h-[28vw] max-h-[390px] min-h-[230px] w-[28vw] min-w-[230px] max-w-[390px] -translate-x-1/2 -translate-y-1/2 transform-gpu touch-none select-none items-center justify-center rounded-full border border-[#e7cf91]/20 bg-[#100b06]/16 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] will-change-transform md:flex"
          aria-label="Drag to inspect the scroll-driven gold object"
        >
          <div className="absolute inset-[9%] rounded-full border border-[#e7cf91]/12" />
          <div className="absolute h-[1px] w-[112%] bg-gradient-to-r from-transparent via-[#e7cf91]/78 to-transparent" />
          <div className="absolute h-[112%] w-[1px] bg-gradient-to-b from-transparent via-[#e7cf91]/54 to-transparent" />
          <div className="h-[38%] w-[38%] rounded-full border border-[#e7cf91]/34 bg-[radial-gradient(circle,#e7cf91_0,#9d7031_36%,#17100a_72%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.42)]" />
          <div className="absolute bottom-[18%] right-[11%] flex h-14 w-14 items-center justify-center rounded-full border border-[#e7cf91]/24 bg-[#080706]/70 text-[#e7cf91]">
            <Knife size={24} weight="light" />
          </div>
        </div>

        <div className="absolute bottom-7 left-5 right-5 z-[3] grid grid-cols-[auto_1fr_auto] items-center gap-4 md:left-12 md:right-12 lg:left-20 lg:right-20">
          <span ref={progressTextRef} className="font-mono text-[11px] text-[#e7cf91]">
            00%
          </span>
          <span className="h-px bg-[#e7cf91]/18">
            <span ref={progressBarRef} className="block h-px origin-left scale-x-0 bg-[#e7cf91]" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#a99676]">Service cadence</span>
        </div>
      </section>

      <section id="ritual" className="course-section px-5 py-28 md:px-12 md:py-36 lg:px-20">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-14 md:grid-cols-[0.78fr_1.22fr]">
          <div className="reveal md:pt-12">
            <div className="mb-7 h-px w-full origin-left scale-x-0 bg-[#e7cf91]/52 course-line" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#e7cf91]">The service arc</p>
            <h2 className="font-display mt-5 max-w-[540px] text-4xl font-medium leading-[0.96] tracking-normal md:text-6xl">
              Four movements, no excess.
            </h2>
          </div>

          <div className="grid gap-4">
            {courses.map(([number, title, copy]) => (
              <article
                key={number}
                className="reveal grid grid-cols-[4.5rem_1fr] gap-5 border-t border-[#e7cf91]/14 py-8 md:grid-cols-[7rem_0.8fr_1.2fr]"
              >
                <span className="font-mono text-xs text-[#e7cf91]">{number}</span>
                <h3 className="font-display text-2xl text-[#f6efe2]">{title}</h3>
                <p className="text-sm leading-7 text-[#a99676]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="counter" className="px-5 pb-28 md:px-12 md:pb-40 lg:px-20">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-5 md:grid-cols-[1.35fr_0.65fr]">
          <div className="reveal rounded-[2rem] border border-[#e7cf91]/12 bg-[#e7cf91]/6 p-1.5">
            <div className="min-h-[520px] rounded-[calc(2rem-0.375rem)] bg-[radial-gradient(circle_at_72%_24%,rgba(231,207,145,0.2),transparent_22rem),linear-gradient(135deg,rgba(246,239,226,0.08),rgba(12,9,6,0.94))] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)] md:p-12">
              <div className="max-w-[560px]">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#e7cf91]">Counter architecture</p>
                <h2 className="font-display mt-5 text-4xl leading-[0.96] md:text-6xl">Twelve seats facing the work.</h2>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <div className="reveal rounded-[2rem] border border-[#e7cf91]/12 bg-[#e7cf91]/6 p-1.5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#11100d] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                <Diamond className="text-[#e7cf91]" size={28} weight="light" />
                <p className="mt-12 font-mono text-4xl text-[#f6efe2]">18:40</p>
                <p className="mt-3 text-sm leading-7 text-[#a99676]">The first seating begins as the room moves from dusk into amber.</p>
              </div>
            </div>
            <div className="reveal rounded-[2rem] border border-[#e7cf91]/12 bg-[#e7cf91]/6 p-1.5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#11100d] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
                <SealCheck className="text-[#e7cf91]" size={28} weight="light" />
                <p className="mt-12 font-mono text-4xl text-[#f6efe2]">12</p>
                <p className="mt-3 text-sm leading-7 text-[#a99676]">Seats reserved nightly, with the menu changing by market cadence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reserve" className="px-5 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1380px] border-t border-[#e7cf91]/16 pt-12">
          <div className="reveal grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <h2 className="font-display max-w-[780px] text-5xl leading-[0.92] md:text-7xl">
              Reserve the counter while the market is still deciding.
            </h2>
            <div>
              <p className="max-w-[31rem] text-base leading-8 text-[#a99676]">
                Kurohana is a cinematic brand concept for a luxury omakase room: a restrained counter, a precise market menu, and a service that unfolds with launch-film patience.
              </p>
              <a
                href="mailto:concierge@kurohana.example"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#f1dfaa] py-2 pl-6 pr-2 text-sm font-medium uppercase tracking-[0.14em] text-[#161006] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
              >
                Request seating
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1208] text-[#f1dfaa] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                  <ArrowRight size={17} weight="light" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
