"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import type { Group } from "three";

type Scene = {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  align: "left" | "right" | "center";
};

const scenes: Scene[] = [
  {
    id: "foundation",
    eyebrow: "01 / FOUNDATION",
    headline: "FOUNDATIONS OF EXCELLENCE",
    subheadline: "Every extraordinary space begins with precision.",
    align: "left",
  },
  {
    id: "structure",
    eyebrow: "02 / STRUCTURE",
    headline: "ENGINEERED TO ENDURE",
    subheadline: "Strength hidden within elegance.",
    align: "left",
  },
  {
    id: "form",
    eyebrow: "03 / FORM",
    headline: "SHAPED WITH PURPOSE",
    subheadline: "Every line serves a function.",
    align: "right",
  },
  {
    id: "transparency",
    eyebrow: "04 / TRANSPARENCY",
    headline: "OPEN TO POSSIBILITY",
    subheadline: "Designed to connect space, light, and life.",
    align: "right",
  },
  {
    id: "materiality",
    eyebrow: "05 / MATERIALITY",
    headline: "CRAFTED IN EVERY DETAIL",
    subheadline: "Natural materials. Timeless character.",
    align: "left",
  },
  {
    id: "light",
    eyebrow: "06 / LIGHT",
    headline: "WHERE LIGHT BECOMES ARCHITECTURE",
    subheadline: "Atmosphere is part of the design.",
    align: "center",
  },
  {
    id: "completion",
    eyebrow: "07 / COMPLETION",
    headline: "THE FUTURE OF LIVING",
    subheadline: "Architecture designed beyond expectations.",
    align: "center",
  },
];

const frameCount = 122;
const frameSrc = (frame: number) =>
  `/frames/villa/frame_${String(frame).padStart(4, "0")}.jpg`;

const particleField = Array.from({ length: 42 }, (_, index) => {
  const a = Math.sin(index * 12.9898) * 43758.5453;
  const b = Math.sin(index * 78.233) * 19341.8792;
  const c = Math.sin(index * 37.719) * 9182.1376;
  const fx = a - Math.floor(a);
  const fy = b - Math.floor(b);
  const fz = c - Math.floor(c);

  return {
    x: (fx - 0.5) * 12,
    y: (fy - 0.5) * 6,
    z: -2 - fz * 7,
    scale: 0.01 + ((fx + fy) % 1) * 0.025,
    key: index,
  };
});

function splitWords(text: string) {
  return text.split(" ").map((word, index) => (
    <span className="split-word" key={`${word}-${index}`}>
      <span>{word}</span>
      {index < text.split(" ").length - 1 ? "\u00a0" : null}
    </span>
  ));
}

function AmbientArchitecture() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.08;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.12) * 0.14;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight color="#d4aa63" intensity={1.1} position={[4, 3, 2]} />
      <Float speed={0.65} rotationIntensity={0.12} floatIntensity={0.24}>
        <group ref={groupRef}>
          {particleField.map((particle) => (
            <mesh
              key={particle.key}
              position={[particle.x, particle.y, particle.z]}
              scale={particle.scale}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#d0ad72" transparent opacity={0.48} />
            </mesh>
          ))}
        </group>
      </Float>
    </>
  );
}

function MagneticCta() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 18, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 160, damping: 18, mass: 0.45 });
  const iconX = useTransform(springX, [-24, 24], [-3, 3]);
  const iconY = useTransform(springY, [-18, 18], [-2, 2]);

  return (
    <motion.a
      href="mailto:private.viewing@example.com?subject=Private%20Villa%20Viewing"
      className="cta-button group inline-flex items-center gap-5 rounded-full px-4 py-3 pl-7 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#120f0a] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
      initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.7 }}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      Schedule A Private Viewing
      <motion.span
        className="grid size-9 place-items-center rounded-full bg-[#130f08]/12 text-lg transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        style={{ x: iconX, y: iconY }}
        aria-hidden="true"
      >
        <span className="-mt-0.5">→</span>
      </motion.span>
    </motion.a>
  );
}

export default function VillaScrollExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const frameImage = frameRef.current;
    const root = rootRef.current;
    const stage = stageRef.current;
    const glow = glowRef.current;
    if (!frameImage || !root || !stage || !glow) {
      return () => {
        lenis.destroy();
        gsap.ticker.remove(raf);
      };
    }

    let rafId = 0;
    let pendingFrame = 1;
    let currentFrame = 1;
    let lastScrollProgress = 0;
    let lenisFrameHandler:
      | ((event: { progress?: number; scroll?: number; limit?: number }) => void)
      | undefined;
    let frameTicker: (() => void) | undefined;
    let nativeFrameHandler: (() => void) | undefined;
    let framePollId: number | undefined;
    const preloadedFrames = new Set<number>();

    const ctx = gsap.context(() => {
      const preloadFrame = (frame: number) => {
        const boundedFrame = Math.min(frameCount, Math.max(1, frame));
        if (preloadedFrames.has(boundedFrame)) return;
        preloadedFrames.add(boundedFrame);
        const image = new Image();
        image.src = frameSrc(boundedFrame);
      };

      const preloadFrames = () => {
        let frame = 1;
        const loadChunk = () => {
          for (let count = 0; count < 8 && frame <= frameCount; count += 1) {
            preloadFrame(frame);
            frame += 1;
          }

          if (frame <= frameCount) {
            window.setTimeout(loadChunk, 24);
          }
        };

        loadChunk();
      };

      const requestFrame = (progress: number) => {
        lastScrollProgress = Math.min(1, Math.max(0, progress));
        pendingFrame = Math.min(
          frameCount,
          Math.max(1, Math.round(lastScrollProgress * (frameCount - 1)) + 1),
        );

        const renderPendingFrame = () => {
          if (currentFrame === pendingFrame) return;

          currentFrame = pendingFrame;
          frameImage.src = frameSrc(currentFrame);
          frameImage.dataset.frame = String(currentFrame);
          preloadFrame(currentFrame + 1);
          preloadFrame(currentFrame + 2);
          preloadFrame(currentFrame - 1);
        };

        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          renderPendingFrame();
        });
      };

      const syncFrameFromNativeScroll = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        pendingFrame = Math.min(
          frameCount,
          Math.max(1, Math.round(progress * (frameCount - 1)) + 1),
        );

        if (currentFrame === pendingFrame) return;
        currentFrame = pendingFrame;
        frameImage.src = frameSrc(currentFrame);
        frameImage.dataset.frame = String(currentFrame);
        preloadFrame(currentFrame + 1);
        preloadFrame(currentFrame + 2);
        preloadFrame(currentFrame - 1);
      };

      const buildTimeline = () => {
        const state = {
          frame: 0,
          scale: 1.08,
          x: 0,
          y: -2,
          rotate: 0,
        };

        const applyState = () => {
          requestFrame(state.frame);
          gsap.set(stage, {
            scale: state.scale,
            xPercent: state.x,
            yPercent: state.y,
            rotateY: state.rotate,
          });
        };

        const main = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              lastScrollProgress = self.progress;
              applyState();
            },
          },
        });

        main
          .to(state, { frame: 0.15, scale: 1.08, x: 0, y: -2, rotate: 0, duration: 15, onUpdate: applyState }, 0)
          .to(state, { frame: 0.3, scale: 1.1, x: -4, y: -1.4, rotate: 5, duration: 15, ease: "power2.inOut", onUpdate: applyState }, 15)
          .to(state, { frame: 0.5, scale: 1.05, x: 0, y: -1, rotate: 0, duration: 20, ease: "power2.inOut", onUpdate: applyState }, 30)
          .to(state, { frame: 0.7, scale: 1.08, x: 4, y: -0.5, rotate: -5, duration: 20, ease: "power2.inOut", onUpdate: applyState }, 50)
          .to(state, { frame: 0.9, scale: 0.96, x: 0, y: 0.5, rotate: 0, duration: 15, ease: "power2.inOut", onUpdate: applyState }, 70)
          .to(state, { frame: 1, scale: 0.9, x: 0, y: 1, rotate: 0, duration: 15, ease: "power2.inOut", onUpdate: applyState }, 85)
          .to(glow, { opacity: 0.42, scale: 1.16, duration: 14 }, 2)
          .to(glow, { opacity: 0.15, scale: 1.04, duration: 12 }, 16)
          .to(glow, { opacity: 0.35, xPercent: 18, duration: 20 }, 52)
          .to(glow, { opacity: 0.5, xPercent: 0, scale: 1.28, duration: 15 }, 85);

        scenes.forEach((scene, index) => {
          const el = root.querySelector(`[data-scene-copy="${scene.id}"]`);
          if (!el) return;
          const words = el.querySelectorAll(".split-word span");
          const start = index === 0 ? 0.4 : index * 12.2 + 1.4;
          const activeDuration = index === scenes.length - 1 ? 6.4 : 8.8;

          main
            .to(
              el,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 2.8,
              },
              start,
            )
            .to(
              words,
              {
                y: 0,
                duration: 2.4,
                stagger: 0.08,
              },
              start + 0.35,
            )
            .to(
              el.querySelector("[data-subheadline]"),
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 2.2,
              },
              start + 1.8,
            );

          main.to(
            el,
            {
              opacity: 0,
              y: -34,
              scale: 1.02,
              filter: "blur(10px)",
              duration: 2.2,
            },
            start + activeDuration,
          );
        });

        applyState();
      };

      frameImage.src = frameSrc(1);
      frameImage.dataset.frame = "1";
      preloadFrames();
      nativeFrameHandler = syncFrameFromNativeScroll;
      window.addEventListener("scroll", nativeFrameHandler, { passive: true });
      framePollId = window.setInterval(syncFrameFromNativeScroll, 80);
      frameTicker = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        requestFrame(window.scrollY / maxScroll);
      };
      gsap.ticker.add(frameTicker);
      lenisFrameHandler = (event) => {
        const progress =
          typeof event.progress === "number"
            ? event.progress
            : typeof event.scroll === "number" && event.limit
              ? event.scroll / event.limit
              : lastScrollProgress;

        requestFrame(progress);
      };
      lenis.on("scroll", lenisFrameHandler);
      buildTimeline();
    }, root);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisFrameHandler) {
        lenis.off("scroll", lenisFrameHandler);
      }
      if (frameTicker) {
        gsap.ticker.remove(frameTicker);
      }
      if (nativeFrameHandler) {
        window.removeEventListener("scroll", nativeFrameHandler);
      }
      if (framePollId) {
        window.clearInterval(framePollId);
      }
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative bg-[#050505] text-[#f3efe7]"
      style={{ height: "900dvh" }}
    >
      <div className="villa-grain" />
      <section className="sticky top-0 min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            className="opacity-55"
          >
            <AmbientArchitecture />
          </Canvas>
        </div>

        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c6a15b]/20 blur-[92px]"
        />

        <div
          ref={stageRef}
          className="absolute inset-0 grid place-items-center will-change-transform"
          style={{ perspective: 1200 }}
        >
          <div className="relative aspect-video w-[min(118rem,128vw)] max-w-none overflow-hidden">
            <img
              ref={frameRef}
              className="scrub-frame h-full w-full object-cover opacity-90 saturate-[0.92]"
              src={frameSrc(1)}
              alt="Luxury villa assembly animation frame"
              draggable={false}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_36%,rgba(5,5,5,0.12)_58%,rgba(5,5,5,0.84)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#050505]/80 to-transparent" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 mx-auto grid max-w-[1520px] grid-cols-12 px-5 py-8 md:px-10 lg:px-14">
          <div className="col-span-12 flex items-start justify-between text-[0.64rem] uppercase tracking-[0.2em] text-[#e7d0a1]/62">
            <span>Villa Assembly Study</span>
            <span className="hidden md:inline">Scroll-Controlled Architectural Film</span>
          </div>

          {scenes.map((scene) => {
            const alignment =
              scene.align === "left"
                ? "left-[5vw] text-left items-start md:max-w-[46rem]"
                : scene.align === "right"
                  ? "right-[5vw] text-right items-end md:max-w-[44rem]"
                  : "left-1/2 -translate-x-1/2 text-center items-center md:max-w-[62rem]";

            return (
              <article
                className={`scene-copy absolute top-[31dvh] flex flex-col ${alignment}`}
                data-scene-copy={scene.id}
                key={scene.id}
              >
                <p className="scene-kicker mb-5 text-[0.68rem] font-medium uppercase text-[#c6a15b] md:text-[0.74rem]">
                  {scene.eyebrow}
                </p>
                <h1 className="max-w-[12ch] text-balance text-[clamp(2.35rem,6.2vw,7.6rem)] font-semibold leading-[0.88] tracking-normal text-[#fff8ea]">
                  {splitWords(scene.headline)}
                </h1>
                <p
                  data-subheadline
                  className="mt-7 max-w-[34rem] translate-y-8 text-base leading-7 text-[#f3efe7]/72 opacity-0 blur-md md:text-xl"
                >
                  {scene.subheadline}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="absolute inset-x-0 bottom-0 z-10 flex min-h-[100dvh] items-end px-5 pb-10 md:px-10 md:pb-16 lg:px-14">
        <div className="mx-auto grid w-full max-w-[1520px] grid-cols-12 items-end gap-8">
          <div className="col-span-12 md:col-span-8 lg:col-span-7">
            <motion.p
              className="scene-kicker mb-5 text-[0.68rem] font-medium uppercase text-[#c6a15b]"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.6 }}
            >
              Private Commission
            </motion.p>
            <motion.h2
              className="max-w-[11ch] text-[clamp(3rem,8vw,8.5rem)] font-semibold leading-[0.88] tracking-normal text-[#fff8ea]"
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
              viewport={{ once: true, amount: 0.55 }}
            >
              YOUR NEXT CHAPTER BEGINS HERE
            </motion.h2>
          </div>
          <div className="col-span-12 flex flex-col items-start gap-8 md:col-span-4 md:items-end md:text-right lg:col-span-5">
            <motion.p
              className="max-w-[27rem] text-lg leading-8 text-[#f3efe7]/72 md:text-xl"
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.32, 0.72, 0, 1] }}
              viewport={{ once: true, amount: 0.7 }}
            >
              Experience a new standard of luxury living.
            </motion.p>
            <MagneticCta />
          </div>
        </div>
      </section>
    </main>
  );
}
