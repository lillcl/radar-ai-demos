import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Lock, Plus } from 'lucide-react';
import Watch, { type WatchVariant } from '@/components/hero/Watch';

gsap.registerPlugin(ScrollTrigger);

type Product = {
  variant: WatchVariant;
  subtitle: string;
  note: string;
};

const HERITAGE: Product[] = [
  {
    subtitle: 'The Foundation',
    note: 'Three-hand automatic · 38mm',
    variant: {
      id: 'heritage-meridian',
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
      notes: ['Velvet', 'Cognac'],
      description: '',
    },
  },
  {
    subtitle: 'The Annual',
    note: 'Complete calendar · 40mm',
    variant: {
      id: 'heritage-annuaire',
      name: 'Annuaire',
      collection: 'Heritage',
      reference: 'AETH.HE-008',
      price: 'CHF 9,800',
      color: 'hsl(32 45% 32%)',
      caseColor: '#b8a888',
      dialColor: '#f0e4d0',
      strapColor: '#4a2f1a',
      handColor: '#3a2418',
      subDials: false,
      skeleton: false,
      notes: ['Ivory', 'Tobacco'],
      description: '',
    },
  },
];

const SIGNATURE: Product[] = [
  {
    subtitle: 'The Chronograph',
    note: 'Manual-wind · 41mm',
    variant: {
      id: 'signature-cote',
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
      notes: ['Onyx', 'Steel'],
      description: '',
    },
  },
  {
    subtitle: 'The Réserve',
    note: '8-day power · 38mm',
    variant: {
      id: 'signature-reserve',
      name: 'Réserve de Marche',
      collection: 'Signature',
      reference: 'AETH.SI-022',
      price: 'CHF 21,200',
      color: 'hsl(28 14% 18%)',
      caseColor: '#a89a82',
      dialColor: '#2a2218',
      strapColor: '#1a1a1a',
      handColor: '#c8b888',
      subDials: false,
      skeleton: false,
      notes: ['Bronze', 'Black'],
      description: '',
    },
  },
];

const LIMITED: Product[] = [
  {
    subtitle: 'The Tourbillon',
    note: '28 pieces · 39mm',
    variant: {
      id: 'limited-etoile',
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
      notes: ['Bronze', 'Skeleton'],
      description: '',
    },
  },
  {
    subtitle: 'The Quantième',
    note: '12 pieces · 38mm',
    variant: {
      id: 'limited-perpetuelle',
      name: 'Perpétuelle',
      collection: 'Limited',
      reference: 'AETH.LI-003',
      price: 'CHF 58,000',
      color: 'hsl(28 35% 22%)',
      caseColor: '#d4c5a0',
      dialColor: '#1a1410',
      strapColor: '#2a1a10',
      handColor: '#e8d8b8',
      subDials: true,
      skeleton: false,
      notes: ['Platinum', 'Perpetual'],
      description: '',
    },
  },
];

const COLLECTIONS = [
  { id: 'heritage', name: 'Heritage', tagline: 'The foundation · Since 1887', products: HERITAGE, accent: 'hsl(32 45% 32%)' },
  { id: 'signature', name: 'Signature', tagline: 'Complications · In-house', products: SIGNATURE, accent: 'hsl(28 14% 18%)' },
  { id: 'limited', name: 'Limited', tagline: 'Twenty-eight pieces · Numbered', products: LIMITED, accent: 'hsl(28 35% 22%)' },
];

export default function Collections() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      // Compute total scroll distance (track width minus viewport)
      const getDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Section heading reveal
      gsap.from('.collections-heading > *', {
        scrollTrigger: { trigger: container, start: 'top 70%' },
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={containerRef}
      className="relative bg-background overflow-hidden"
    >
      <div className="h-screen flex flex-col">
        {/* Heading */}
        <div className="px-6 md:px-10 pt-20 md:pt-24 pb-8">
          <div className="max-w-[1500px] mx-auto">
            <div className="collections-heading grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-8">
                <p className="font-mono text-[10px] tracking-[0.4em] text-foreground/60 uppercase mb-4">
                  The Collections
                </p>
                <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-balance">
                  <span className="block">Three lines,</span>
                  <span className="block italic font-light text-foreground/70">
                    one philosophy of time.
                  </span>
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4 md:text-right">
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-2">
                  Scroll →
                </p>
                <p className="text-sm text-foreground/60 max-w-xs md:ml-auto">
                  Six pieces, hand-finished. Drag horizontally or scroll the page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-full items-center will-change-transform"
            style={{ width: 'max-content' }}
          >
            {COLLECTIONS.map((collection, ci) => (
              <div
                key={collection.id}
                className="h-full flex-shrink-0 px-6 md:px-10"
                style={{ width: '100vw' }}
              >
                <div className="max-w-[1500px] mx-auto h-full flex flex-col">
                  {/* Collection header */}
                  <div className="flex items-end justify-between mb-8 md:mb-12 pt-2">
                    <div>
                      <p
                        className="font-mono text-[10px] tracking-[0.4em] uppercase mb-2"
                        style={{ color: collection.accent }}
                      >
                        Collection 0{ci + 1}
                      </p>
                      <h3 className="font-serif text-5xl md:text-7xl tracking-[-0.03em] leading-none">
                        {collection.name}
                      </h3>
                    </div>
                    <p className="hidden md:block font-serif italic text-foreground/60 text-lg">
                      {collection.tagline}
                    </p>
                  </div>

                  {/* Product cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 flex-1 pb-8">
                    {collection.products.map((product) => (
                      <article
                        key={product.variant.id}
                        className="group relative bg-gradient-to-br from-secondary/40 to-background border border-border/60 rounded-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-primary/50 hover:shadow-lg transition-all duration-700"
                      >
                        <div className="flex-1 flex flex-col justify-between order-2 md:order-1">
                          <div>
                            <p
                              className="font-mono text-[10px] tracking-[0.32em] uppercase mb-2"
                              style={{ color: collection.accent }}
                            >
                              {product.subtitle}
                            </p>
                            <h4 className="font-serif text-3xl md:text-4xl tracking-tight mb-1">
                              {product.variant.name}
                            </h4>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/50 mb-4">
                              {product.variant.reference} · {product.note}
                            </p>
                            <p className="text-sm text-foreground/70 leading-relaxed text-pretty">
                              A study in restraint and intention, finished by hand in our atelier.
                            </p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-border/40 flex items-end justify-between">
                            <div>
                              <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-foreground/50 mb-1">
                                From
                              </p>
                              <p className="font-serif text-2xl">{product.variant.price}</p>
                            </div>
                            <a
                              href="#"
                              className="group/link inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/70 hover:text-primary transition-colors"
                            >
                              Discover
                              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </a>
                          </div>
                        </div>
                        <div className="order-1 md:order-2 w-full md:w-44 lg:w-52 flex-shrink-0 self-center">
                          <Watch variant={product.variant} />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Coming Soon final slide */}
            <div
              className="h-full flex-shrink-0 px-6 md:px-10"
              style={{ width: '100vw' }}
            >
              <div className="max-w-[1500px] mx-auto h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center mb-8">
                  <Lock className="w-6 h-6 text-primary" strokeWidth={1.25} />
                </div>
                <p className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase mb-6">
                  Forthcoming · Spring 2026
                </p>
                <h3 className="font-serif text-6xl md:text-8xl tracking-[-0.03em] leading-[0.9] max-w-3xl text-balance">
                  <span className="block italic font-light text-foreground/70">A new</span>
                  <span className="block">complication.</span>
                </h3>
                <p className="mt-8 max-w-lg text-foreground/65 text-base md:text-lg text-pretty">
                  Our first minute-repeater, in eight pieces only. Reserved for those who have waited — and for those who have asked quietly.
                </p>
                <a
                  href="#"
                  className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.32em] uppercase border-b border-foreground/30 pb-2 hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Join the Waitlist
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="px-6 md:px-10 pb-6">
          <div className="max-w-[1500px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {COLLECTIONS.map((c, i) => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/50">
                    0{i + 1} {c.name}
                  </span>
                  {i < COLLECTIONS.length - 1 && (
                    <span className="w-8 h-px bg-border" />
                  )}
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/50">
              Six pieces · Hand-finished
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
