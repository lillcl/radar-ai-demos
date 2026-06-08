import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Button } from '@blinkdotnew/ui';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    id: 1,
    title: 'The Signature',
    items: [
      { name: 'Brown Sugar Deerioca', price: '$8.50', image: 'https://storage.googleapis.com/blink-core-storage/projects/luxtea-animated-web-ch1pflcc/ai-images/1780851697514-ee32a494-75fa-4b13-bb05-b532799ff622.png' },
      { name: 'Matcha Sea Salt', price: '$9.20', image: 'https://storage.googleapis.com/blink-core-storage/projects/luxtea-animated-web-ch1pflcc/ai-images/1780851698074-5cff38f7-e92e-44b0-aee9-8514e0154041.png' },
    ],
  },
  {
    id: 2,
    title: 'Botanical Blends',
    items: [
      { name: 'Lavender Taro', price: '$8.80', image: 'https://storage.googleapis.com/blink-core-storage/projects/luxtea-animated-web-ch1pflcc/ai-images/1780851699238-38bd583c-7278-45f8-89ed-d101022c021b.png' },
      { name: 'Rose Oolong', price: '$9.50', image: 'https://images.unsplash.com/photo-1587473555771-96aef0d968cc?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    id: 3,
    title: 'Limited Reserve',
    items: [
      { name: 'Golden Leaf Brew', price: '$12.00', image: 'https://images.unsplash.com/photo-1602904761432-f9ad96133982?auto=format&fit=crop&w=800&q=80' },
      { name: 'White Peach Cloud', price: '$10.50', image: 'https://images.unsplash.com/photo-1684595011788-d7ac732cd6e0?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];

const Flavors: React.FC = () => {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!horizontalRef.current || !containerRef.current) return;

      const totalWidth = horizontalRef.current.scrollWidth - window.innerWidth;

      gsap.to(horizontalRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${horizontalRef.current?.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="flavors" ref={containerRef} className="h-screen bg-background overflow-hidden">
      <div className="absolute top-24 left-12 z-10">
        <h2 className="text-4xl font-serif font-black tracking-tighter text-foreground/20 uppercase">Collections</h2>
      </div>

      <div ref={horizontalRef} className="flex items-center h-full px-[10vw] gap-32">
        {COLLECTIONS.map((collection) => (
          <div key={collection.id} className="flex-shrink-0 flex items-center gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-mono text-xs tracking-widest uppercase">Series 0{collection.id}</span>
              <h3 className="text-6xl font-serif font-black whitespace-nowrap tracking-tighter uppercase">{collection.title}</h3>
              <div className="w-24 h-px bg-primary/40 mt-4" />
            </div>

            <div className="flex gap-12">
              {collection.items.map((item, idx) => (
                <div key={idx} className="group relative w-[350px] aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/60 text-xs font-mono tracking-widest uppercase mb-2">{item.price}</p>
                    <h4 className="text-white text-3xl font-serif font-bold mb-6">{item.name}</h4>
                    <Button variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black transition-all">
                      Details <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex-shrink-0 w-[50vw] flex flex-col items-center justify-center text-center px-12">
          <h3 className="text-7xl font-serif font-black tracking-tighter uppercase mb-8 opacity-20">Full Menu Coming Soon</h3>
          <p className="text-muted-foreground text-xl max-w-md">
            Our full reserve collection is being curated for the summer season. Join the waiting list for early access.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Flavors;
