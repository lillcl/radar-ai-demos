import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MapPin, Calendar, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Maison() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax image
      gsap.to(imageRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Staggered text reveal
      gsap.from(textRef.current?.querySelectorAll('[data-stagger]') ?? [], {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        opacity: 0,
        y: 50,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      // Stats
      gsap.utils.toArray<HTMLElement>('.stat').forEach((stat) => {
        gsap.from(stat, {
          scrollTrigger: { trigger: stat, start: 'top 80%' },
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="maison"
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-background overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Image side */}
          <div className="col-span-12 lg:col-span-6 order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm group">
              <div
                ref={imageRef}
                className="absolute inset-0 -top-12 -bottom-12 will-change-transform"
              >
                <picture>
                  <img
                    src="https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1400&q=80"
                    alt="The AETHEL atelier in La Chaux-de-Fonds, Switzerland"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    loading="lazy"
                  />
                </picture>
              </div>
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-obsidian/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-border/40 pointer-events-none rounded-sm" />

              {/* Floating label */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div className="bg-background/85 backdrop-blur-md px-4 py-3 rounded-sm">
                  <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-foreground/60 mb-1">
                    The Atelier
                  </p>
                  <p className="font-serif text-base">Rue du Parc 14, Suisse</p>
                </div>
                <div className="bg-background/85 backdrop-blur-md px-3 py-3 rounded-full">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div ref={textRef} className="col-span-12 lg:col-span-6 order-2 lg:pl-8">
            <p
              data-stagger
              className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-primary/50" />
              La Maison
            </p>

            <h2
              data-stagger
              className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em] mb-8 text-balance"
            >
              <span className="block">A small house,</span>
              <span className="block italic font-light text-foreground/70">a long memory.</span>
            </h2>

            <div data-stagger className="space-y-5 text-foreground/75 text-base md:text-lg leading-relaxed text-pretty max-w-xl">
              <p>
                In 1887, Théodore Aethel opened a workshop on the slopes above La Chaux-de-Fonds with three intentions: build movements that outlive their wearers, never use a single piece of plastic, and refuse to advertise.
              </p>
              <p>
                We have, against all commercial sense, kept to those intentions. Twelve watchmakers. One bench per maker. A single in-house caliber, refined across five generations.
              </p>
              <p>
                The result is not a brand. It is a continuation of attention, patient and unperformative — the same quiet conversation between hand and timepiece that Théodore began at his bench one hundred and thirty-eight years ago.
              </p>
            </div>

            {/* Stats */}
            <div data-stagger className="mt-12 grid grid-cols-3 gap-6 pt-10 border-t border-border/60">
              <div className="stat">
                <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-foreground/50 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Founded
                </p>
                <p className="font-serif text-3xl md:text-4xl tracking-tighter">1887</p>
              </div>
              <div className="stat">
                <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-foreground/50 mb-2 flex items-center gap-1.5">
                  <Compass className="w-3 h-3" /> Calibers
                </p>
                <p className="font-serif text-3xl md:text-4xl tracking-tighter">5 <span className="text-foreground/50 text-xl">in-house</span></p>
              </div>
              <div className="stat">
                <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-foreground/50 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Makers
                </p>
                <p className="font-serif text-3xl md:text-4xl tracking-tighter">12</p>
              </div>
            </div>

            <a
              data-stagger
              href="#"
              className="group mt-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.32em] uppercase border-b border-foreground/30 pb-2 hover:border-primary hover:text-primary transition-colors"
            >
              Visit the Atelier
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Decorative background type */}
      <div
        aria-hidden
        className="absolute -bottom-10 -right-10 font-serif text-[clamp(8rem,20vw,18rem)] text-foreground/[0.03] leading-none tracking-tighter pointer-events-none select-none"
      >
        AETHEL
      </div>
    </section>
  );
}
