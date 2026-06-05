"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const moments = [
  {
    id: "origin",
    eyebrow: "Kintsugi Omakase",
    headline: "Every Piece Begins With Perfection",
    copy: "An elevated omakase experience crafted with precision.",
    align: "items-center text-center",
  },
  {
    id: "sources",
    eyebrow: "Selection",
    headline: "Selected From The Finest Sources",
    copy: "Seasonal fish, warm rice, and quiet restraint chosen at the edge of freshness.",
    align: "items-start text-left",
  },
  {
    id: "mastery",
    eyebrow: "Technique",
    headline: "Crafted With Generations Of Mastery",
    copy: "Each movement is measured, each garnish placed with intent, each course paced by the room.",
    align: "items-end text-right",
  },
  {
    id: "omakase",
    eyebrow: "The Counter",
    headline: "The Art Of Omakase",
    copy: "A composed tasting journey of texture, temperature, and silence.",
    align: "items-center text-center",
  },
  {
    id: "reserve",
    eyebrow: "Evening Service",
    headline: "Reserve Your Experience",
    copy: "Twelve seats. Two seatings nightly. One chef-led progression.",
    align: "items-center text-center",
  },
];

const cards = ["Shari", "Neta", "Yakumi", "Sake"];

export default function OmakaseJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const media = mediaRef.current;

    if (!root || !stage || !video || !media) {
      return;
    }

    let destroyed = false;
    document.documentElement.dataset.omakaseReady = "true";
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    let masterTimeline: gsap.core.Timeline | undefined;

    const buildTimeline = () => {
      if (destroyed) {
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(copyRefs.current, { autoAlpha: 0, y: 50 });
        gsap.set(cardRefs.current, { autoAlpha: 0, y: 58, rotateX: 9 });
        gsap.set(media, { scale: 1.38, yPercent: 0, filter: "saturate(1.08) contrast(1.06)" });
        gsap.set(midRef.current, { scale: 1.12, yPercent: 12, autoAlpha: 0.44 });
        gsap.set(foregroundRef.current, { yPercent: 24 });
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(copyRefs.current[0], { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
        masterTimeline = tl;

        tl.to(progressRef.current, { scaleX: 1, duration: 5 }, 0)
          .to(media, { scale: 1.18, yPercent: -2, duration: 1 }, 0)
          .to(copyRefs.current[0], { autoAlpha: 0, y: -38, duration: 0.7 }, 0.82)
          .to(media, { scale: 1.04, yPercent: -5, duration: 1 }, 1)
          .to(midRef.current, { scale: 1.04, yPercent: -6, autoAlpha: 0.72, duration: 1.5 }, 0.85)
          .fromTo(copyRefs.current[1], { x: -84 }, { autoAlpha: 1, x: 0, y: 0, duration: 1 }, 1.04)
          .to(copyRefs.current[1], { autoAlpha: 0, y: -42, duration: 0.7 }, 1.86)
          .to(media, { scale: 0.96, yPercent: -7, duration: 1 }, 2)
          .to(foregroundRef.current, { yPercent: -8, duration: 1.2 }, 1.88)
          .fromTo(copyRefs.current[2], { x: 84 }, { autoAlpha: 1, x: 0, y: 0, duration: 1 }, 2.05)
          .to(copyRefs.current[2], { autoAlpha: 0, y: -42, duration: 0.7 }, 2.84)
          .to(media, { scale: 0.9, yPercent: -8.5, duration: 1 }, 3)
          .to(copyRefs.current[3], { autoAlpha: 1, y: 0, duration: 1 }, 3.04)
          .to(cardRefs.current, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.09 }, 3.2)
          .to(copyRefs.current[3], { autoAlpha: 0, y: -36, duration: 0.65 }, 3.78)
          .to(cardRefs.current, { autoAlpha: 0, y: -26, duration: 0.55, stagger: 0.04 }, 3.84)
          .to(media, { scale: 0.86, yPercent: -10, filter: "saturate(0.98) contrast(1.12)", duration: 1 }, 4)
          .to(midRef.current, { scale: 0.94, autoAlpha: 0.34, yPercent: -18, duration: 1 }, 4)
          .to(foregroundRef.current, { yPercent: -18, duration: 1 }, 4)
          .to(copyRefs.current[4], { autoAlpha: 1, y: 0, duration: 1 }, 4.08);
      }, root);

      return ctx;
    };

    let playhead = 0;
    let rafId = 0;
    let targetProgress = 0;

    const smoothScrub = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      targetProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      masterTimeline?.progress(targetProgress);

      const videoDuration = Number.isFinite(video.duration) ? video.duration : 0;
      const target = videoDuration > 0 ? targetProgress * Math.max(videoDuration - 0.08, 0) : 0;
      playhead += (target - playhead) * 0.2;

      if (video.readyState >= 2 && Number.isFinite(video.duration)) {
        const drift = Math.abs((video.currentTime || 0) - playhead);
        if (drift > 0.012) {
          video.currentTime = Math.min(Math.max(playhead, 0), Math.max(video.duration - 0.04, 0));
        }
      }

      rafId = window.requestAnimationFrame(smoothScrub);
    };

    let ctx: gsap.Context | undefined = buildTimeline();

    const onLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0.001;
    };

    video.load();
    rafId = window.requestAnimationFrame(smoothScrub);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });

      return () => {
        destroyed = true;
        window.cancelAnimationFrame(rafId);
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.pause();
        ctx?.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    }

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.pause();
      ctx?.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={rootRef} className="relative min-h-[6200px] bg-charcoal text-rice">
      <section
        ref={stageRef}
        className="sticky top-0 flex min-h-[100dvh] items-center justify-center overflow-hidden"
        aria-label="Kintsugi Omakase cinematic scroll story"
      >
        <div
          ref={mediaRef}
          className="camera-media cinematic-layer absolute inset-0 origin-center"
          style={{ transform: "scale(1.38)" }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/assets/omakase-dolly.mp4"
            muted
            playsInline
            preload="auto"
            aria-label="Slow cinematic camera pullback from a luxury sushi platter"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,7,6,0)_0%,rgba(8,7,6,0.22)_42%,rgba(8,7,6,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.46)_0%,rgba(8,7,6,0.08)_42%,rgba(8,7,6,0.72)_100%)]" />

        <div
          ref={midRef}
          className="cinematic-layer pointer-events-none absolute inset-x-0 top-[18dvh] mx-auto h-[46dvh] max-w-[72rem] border-y border-ambered/15"
        />
        <div
          ref={foregroundRef}
          className="cinematic-layer pointer-events-none absolute bottom-0 left-0 right-0 h-[38dvh] bg-[linear-gradient(180deg,rgba(8,7,6,0)_0%,rgba(8,7,6,0.74)_78%,#080706_100%)]"
        />

        <header className="fixed left-1/2 top-5 z-20 flex w-[calc(100%-2rem)] max-w-[58rem] -translate-x-1/2 items-center justify-between rounded-full border border-rice/10 bg-charcoal/52 px-4 py-3 text-[0.66rem] uppercase tracking-[0.24em] text-rice/72 shadow-[inset_0_1px_1px_rgba(246,239,226,0.12)] backdrop-blur-xl md:px-6">
          <span>Kintsugi</span>
          <span className="hidden text-ambered/80 sm:inline">Omakase Atelier</span>
          <span>Tokyo Room</span>
        </header>

        <div className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center px-5 py-28 md:px-12">
          {moments.map((moment, index) => (
            <div
              key={moment.id}
              ref={(node) => {
                copyRefs.current[index] = node;
              }}
              className={`story-copy pointer-events-none absolute mx-auto flex w-[min(88vw,54rem)] flex-col ${moment.align}`}
              style={index === 0 ? { opacity: 1, transform: "translate3d(0, 0, 0)" } : undefined}
            >
              <p className="mb-4 rounded-full border border-ambered/25 bg-charcoal/36 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-ambered/90 shadow-[inset_0_1px_1px_rgba(246,239,226,0.10)]">
                {moment.eyebrow}
              </p>
              <h1 className="max-w-[12ch] font-display text-[clamp(3.2rem,8vw,8.6rem)] font-medium leading-[0.86] tracking-[0.01em] text-rice text-balance">
                {moment.headline}
              </h1>
              <p className="mt-7 max-w-[31rem] text-sm leading-7 text-rice/72 md:text-base">
                {moment.copy}
              </p>

              {moment.id === "omakase" && (
                <div className="mt-9 grid w-full max-w-[42rem] grid-cols-2 gap-3 perspective-1000 md:grid-cols-4">
                  {cards.map((card, cardIndex) => (
                    <div
                      key={card}
                      ref={(node) => {
                        cardRefs.current[cardIndex] = node;
                      }}
                      className="rounded-[1.3rem] border border-ambered/18 bg-rice/[0.055] p-1.5 shadow-[inset_0_1px_1px_rgba(246,239,226,0.12)]"
                    >
                      <div className="rounded-[calc(1.3rem-0.375rem)] bg-charcoal/54 px-4 py-5 text-center shadow-[inset_0_1px_1px_rgba(246,239,226,0.10)]">
                        <span className="block font-display text-2xl text-rice">{card}</span>
                        <span className="mt-2 block text-[0.62rem] uppercase tracking-[0.22em] text-ambered/70">
                          Course {cardIndex + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {moment.id === "reserve" && (
                <div className="pointer-events-auto mt-10 flex flex-col items-center gap-5">
                  <a
                    href="mailto:reservations@kintsugi.example?subject=Omakase%20Reservation"
                    className="group flex items-center gap-4 rounded-full bg-rice px-3 py-3 pl-7 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
                  >
                    Reserve Now
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-charcoal transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                      <span className="h-px w-4 bg-ambered" />
                      <span className="absolute h-2 w-2 translate-x-[5px] rotate-45 border-r border-t border-ambered" />
                    </span>
                  </a>
                  <p className="text-xs uppercase tracking-[0.22em] text-rice/48">
                    Seating at 18:10 and 20:45
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-5 left-1/2 z-20 h-px w-[min(34rem,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-full bg-rice/12">
          <div ref={progressRef} className="h-full w-full origin-left bg-ambered" />
        </div>
      </section>
    </main>
  );
}
