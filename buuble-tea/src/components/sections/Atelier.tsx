import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cog, Hand, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    icon: Cog,
    title: 'The Caliber',
    kicker: 'Architecture',
    description:
      'Our master watchmakers design each movement from a single brass plate. Three hundred and twelve components, hand-assembled over nineteen days. No shortcuts, no robotics — only the human hand, the loupe, and steady breath.',
    detail: '312 components · 19 days',
  },
  {
    number: '02',
    icon: Hand,
    title: 'The Hand',
    kicker: 'Finishing',
    description:
      'Every bridge, every plate, every screw is hand-finished with techniques passed down across four generations. Anglage is cut with a wooden peg charged with diamond paste. Surfaces are given their final polish by fingertip.',
    detail: '400 hours per piece',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'The Signature',
    kicker: 'Côtes de Genève',
    description:
      'The final flourish: parallel stripes of light, machine-engraved in a pattern unique to our atelier. The rotor spins; the stripes catch the day. A finishing flourish that no photograph truly captures.',
    detail: 'AETHEL stripe pattern · 7 lines per mm',
  },
];

export default function Atelier() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title reveal
      gsap.from('.atelier-eyebrow', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%' },
        opacity: 0, y: 30, duration: 1, ease: 'power3.out',
      });
      gsap.from('.atelier-title', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 70%' },
        opacity: 0, y: 60, duration: 1.2, ease: 'power3.out',
      });

      // Connecting line that draws itself
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.atelier-steps',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );

      // Each step
      gsap.utils.toArray<HTMLElement>('.atelier-step').forEach((step, i) => {
        gsap.from(step, {
          scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none reverse' },
          opacity: 0,
          y: 80,
          duration: 1.1,
          delay: i * 0.1,
          ease: 'power3.out',
        });

        // Hover: number scales
        const num = step.querySelector('.step-number');
        const icon = step.querySelector('.step-icon');
        const underline = step.querySelector('.step-underline');

        step.addEventListener('mouseenter', () => {
          gsap.to(num, { scale: 1.1, color: 'hsl(32 45% 32%)', duration: 0.4, ease: 'power2.out' });
          gsap.to(icon, { scale: 1.15, rotate: 5, duration: 0.4, ease: 'back.out(2)' });
          gsap.to(underline, { scaleX: 1, duration: 0.5, ease: 'power3.out' });
        });
        step.addEventListener('mouseleave', () => {
          gsap.to(num, { scale: 1, color: 'hsl(28 14% 10%)', duration: 0.4, ease: 'power2.out' });
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.4, ease: 'power2.out' });
          gsap.to(underline, { scaleX: 0, duration: 0.5, ease: 'power3.out' });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="atelier"
      ref={containerRef}
      className="relative py-32 md:py-48 bg-obsidian text-foreground overflow-hidden"
      style={{ backgroundColor: 'hsl(28 14% 8%)' }}
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 grain opacity-30" />

      <div className="max-w-[1500px] mx-auto px-6 md:px-10 relative">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 mb-20 md:mb-32">
          <div className="col-span-12 lg:col-span-7">
            <p className="atelier-eyebrow font-mono text-[10px] tracking-[0.4em] text-champagne uppercase mb-6" style={{ color: 'hsl(38 50% 65%)' }}>
              The Atelier · 1887
            </p>
            <h2 className="atelier-title font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              <span className="block">Four hundred hours,</span>
              <span className="block italic font-light" style={{ color: 'hsl(38 50% 65%)' }}>
                one quiet object.
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 self-end">
            <p className="text-foreground/60 text-base md:text-lg max-w-md text-pretty">
              A timepiece is the only luxury object whose value lies in the patient attention of the hand. The following is the work, in three movements.
            </p>
          </div>
        </div>

        {/* Steps with connecting line */}
        <div className="atelier-steps relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-[88px] left-0 right-0 h-px bg-border/10">
            <div
              ref={lineRef}
              className="h-full origin-left"
              style={{ background: 'linear-gradient(to right, hsl(32 45% 32%) 0%, hsl(38 50% 65%) 100%)' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="atelier-step group cursor-default">
                  {/* Number + Icon row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="step-number font-serif text-7xl md:text-8xl leading-none tracking-tighter transition-colors">
                      {step.number}
                    </div>
                    <div
                      className="step-icon w-14 h-14 rounded-full border border-border/30 flex items-center justify-center text-foreground/70 group-hover:border-champagne group-hover:text-champagne transition-colors"
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.25} />
                    </div>
                  </div>

                  {/* Kicker */}
                  <p
                    className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
                    style={{ color: 'hsl(38 50% 65%)' }}
                  >
                    {step.kicker}
                  </p>

                  {/* Title */}
                  <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-foreground/65 text-sm md:text-base leading-relaxed mb-6 text-pretty">
                    {step.description}
                  </p>

                  {/* Detail */}
                  <div className="pt-4 border-t border-border/10">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/50">
                      {step.detail}
                    </p>
                  </div>

                  {/* Hover underline (decorative) */}
                  <div
                    className="step-underline h-px mt-4 origin-left scale-x-0"
                    style={{ background: 'hsl(32 45% 32%)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing line */}
        <div className="mt-24 md:mt-32 pt-12 border-t border-border/10 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className="font-serif text-2xl md:text-3xl leading-snug max-w-3xl text-balance italic font-light">
              “We do not measure hours. We try to deserve them.”
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/50">
              — Théodore Aethel, founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
