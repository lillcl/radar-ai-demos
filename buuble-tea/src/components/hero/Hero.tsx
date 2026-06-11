import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Award, Sparkles } from 'lucide-react';
import Watch, { type WatchVariant } from './Watch';

const WATCHES: WatchVariant[] = [
  {
    id: 'meridian',
    name: 'Meridian',
    collection: 'Heritage',
    reference: 'AETH.HE-001',
    price: 'CHF 8,500',
    color: 'hsl(32 45% 32%)',
    caseColor: '#a08465',
    dialColor: '#e8dcc4',
    strapColor: '#5c3a21',
    handColor: '#2b1810',
    subDials: false,
    skeleton: false,
    notes: ['Velvet', 'Cognac', 'Patina'],
    description:
      'A study in restraint. The Meridian pairs a champagne sun-ray dial with a hand-stitched cognac alligator strap, driven by our in-house HE-01 caliber.',
  },
  {
    id: 'cote',
    name: 'Côte de Genève',
    collection: 'Signature',
    reference: 'AETH.SI-014',
    price: 'CHF 18,500',
    color: 'hsl(28 14% 18%)',
    caseColor: '#c8c2b8',
    dialColor: '#1a1410',
    strapColor: '#3a3a3a',
    handColor: '#d4cdb8',
    subDials: true,
    skeleton: false,
    notes: ['Onyx', 'Steel', 'Mercury'],
    description:
      'Three sub-dials track the cosmos: small seconds, chronograph minutes, twelve-hour counter. The Côte de Genève striping on the rotor reveals itself through the sapphire caseback.',
  },
  {
    id: 'etoile',
    name: 'Étoile Tourbillon',
    collection: 'Limited',
    reference: 'AETH.LI-007',
    price: 'CHF 42,000',
    color: 'hsl(28 35% 22%)',
    caseColor: '#6b4a2b',
    dialColor: '#2a1f15',
    strapColor: '#3a2818',
    handColor: '#c89a5b',
    subDials: false,
    skeleton: true,
    notes: ['Bronze', 'Skeleton', 'Tourbillon'],
    description:
      'Twenty-eight pieces. A flying tourbillon visible from the dial side, framed by a hand-finished bronze case that will patina with the wearer’s life.',
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [time, setTime] = useState(new Date());
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // Live time (Geneva)
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Parallax on scroll
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (imageRef.current) {
          imageRef.current.style.transform = `translateY(${y * 0.18}px) scale(${1 + y * 0.0001})`;
        }
        if (orbRef.current) {
          orbRef.current.style.transform = `translate(${y * 0.04}px, ${-y * 0.05}px)`;
        }
        frame = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-cycle the watches
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % WATCHES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const current = WATCHES[active];
  const genevaTime = time.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Zurich',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] pt-32 md:pt-40 pb-16 overflow-hidden grain"
    >
      {/* Color wash */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: `radial-gradient(circle at 50% 30%, ${current.color}25 0%, transparent 60%)`,
        }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Decorative orb */}
      <div
        ref={orbRef}
        className="absolute -top-20 right-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl -z-10 will-change-transform"
        style={{ background: `radial-gradient(circle, ${current.color}30 0%, transparent 60%)` }}
      />

      <div className="max-w-[1500px] mx-auto px-6 md:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 mb-8 md:mb-12"
        >
          <span className="w-12 h-px bg-primary/50" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-foreground/70 uppercase">
            La Chaux-de-Fonds · Established 1887
          </span>
        </motion.div>

        {/* Headline */}
        <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
          <div className="col-span-12 lg:col-span-9">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-serif text-[clamp(2.75rem,8.5vw,8.5rem)] leading-[0.92] tracking-[-0.04em] font-medium text-balance"
            >
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="block italic font-light text-foreground/70 text-[0.55em] tracking-tight"
              >
                The measure of
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                a quiet life.
              </motion.span>
            </motion.h1>
          </div>
          <div className="col-span-12 lg:col-span-3 lg:pt-12 flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-foreground/70 text-base md:text-lg max-w-sm text-pretty"
            >
              Three timepieces, hand-finished over four hundred hours.
              No marketing rhetoric. No annual novelties. Just the hours, kept.
            </motion.p>
          </div>
        </div>

        {/* Product switcher */}
        <div className="grid grid-cols-12 gap-6 items-end">
          {/* Left: thumbnails */}
          <div className="col-span-12 md:col-span-3 order-2 md:order-1">
            <div className="space-y-3">
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/50 mb-6">
                The Collection — 0{active + 1}/03
              </p>
              {WATCHES.map((w, i) => (
                <button
                  key={w.id}
                  onClick={() => setActive(i)}
                  className={`group block w-full text-left p-4 rounded-sm border transition-all duration-500 ${
                    i === active
                      ? 'border-primary/50 bg-background/60 shadow-md'
                      : 'border-border/40 hover:border-border bg-background/30'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span
                      className={`font-mono text-[10px] tracking-[0.32em] uppercase ${
                        i === active ? 'text-primary' : 'text-foreground/50'
                      }`}
                    >
                      {w.collection}
                    </span>
                    <span className="font-mono text-[9px] text-foreground/40">
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    className={`font-serif text-xl md:text-2xl tracking-tight mb-1 ${
                      i === active ? 'text-foreground' : 'text-foreground/60'
                    }`}
                  >
                    {w.name}
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] text-foreground/50">{w.reference}</span>
                    <span className="font-mono text-[11px] text-foreground/70">{w.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: hero watch */}
          <div className="col-span-12 md:col-span-6 order-1 md:order-2 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                ref={imageRef}
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative will-change-transform"
              >
                <Watch variant={current} className="max-w-md mx-auto" />

                {/* Floating specs */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="hidden md:block absolute left-0 top-1/4 -translate-x-1/3 text-right"
                >
                  <p className="font-mono text-[9px] tracking-[0.32em] text-foreground/50 uppercase mb-1">
                    Movement
                  </p>
                  <p className="font-serif text-base italic">HE-01 · 312 components</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="hidden md:block absolute right-0 top-1/3 translate-x-1/3"
                >
                  <p className="font-mono text-[9px] tracking-[0.32em] text-foreground/50 uppercase mb-1">
                    Power Reserve
                  </p>
                  <p className="font-serif text-base italic">72 hours</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: details */}
          <div className="col-span-12 md:col-span-3 order-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div>
                  <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {current.notes.map((n) => (
                      <span
                        key={n}
                        className="px-3 py-1 border border-border rounded-full font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/70"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-foreground/70 text-sm leading-relaxed text-pretty">
                  {current.description}
                </p>

                <a
                  href="#"
                  className="group inline-flex items-center gap-3 pt-4 border-t border-border/60"
                >
                  <span className="font-mono text-[11px] tracking-[0.32em] uppercase">
                    Discover {current.name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/60"
        >
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] text-foreground/50 uppercase mb-2">
              Atelier Time
            </p>
            <p className="font-serif text-2xl md:text-3xl tabular-nums">{genevaTime}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] text-foreground/50 uppercase mb-2">
              Hand-finished
            </p>
            <p className="font-serif text-2xl md:text-3xl">400 hours</p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] text-foreground/50 uppercase mb-2">
              Caliber
            </p>
            <p className="font-serif text-2xl md:text-3xl italic">In-house HE-01</p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] text-foreground/50 uppercase mb-2">
              Certificate
            </p>
            <p className="font-serif text-2xl md:text-3xl flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> COSC
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-foreground/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
