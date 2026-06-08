import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@blinkdotnew/ui';
import { ChevronRight } from 'lucide-react';

const FLAVORS = [
  {
    id: 'classic',
    name: 'Classic Pearl',
    description: 'Slow-cooked brown sugar pearls in organic black tea.',
    image: 'https://storage.googleapis.com/blink-core-storage/projects/luxtea-animated-web-ch1pflcc/ai-images/1780851697514-ee32a494-75fa-4b13-bb05-b532799ff622.png',
    color: 'hsl(28, 60%, 42%)',
  },
  {
    id: 'matcha',
    name: 'Matcha Cloud',
    description: 'Ceremonial grade matcha whisked with velvety sea salt foam.',
    image: 'https://storage.googleapis.com/blink-core-storage/projects/luxtea-animated-web-ch1pflcc/ai-images/1780851698074-5cff38f7-e92e-44b0-aee9-8514e0154041.png',
    color: 'hsl(142, 45%, 35%)',
  },
  {
    id: 'taro',
    name: 'Taro Velvet',
    description: 'Hand-mashed taro root blended with house-made oat milk.',
    image: 'https://storage.googleapis.com/blink-core-storage/projects/luxtea-animated-web-ch1pflcc/ai-images/1780851699238-38bd583c-7278-45f8-89ed-d101022c021b.png',
    color: 'hsl(270, 40%, 45%)',
  },
];

const Hero: React.FC = () => {
  const [activeFlavor, setActiveFlavor] = useState(FLAVORS[0]);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power4.out',
      });

      // Scroll-driven parallax for the image
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 150,
        scale: 1.1,
      });

      // Background fade on scroll
      gsap.to('.hero-overlay', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0.8,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[120vh] flex flex-col items-center justify-start pt-32 px-6 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFlavor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 transition-colors duration-1000"
            style={{ backgroundColor: `${activeFlavor.color}15` }}
          />
        </AnimatePresence>
        <div className="hero-overlay absolute inset-0 bg-background/20 z-1" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center max-w-5xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary uppercase tracking-[0.4em] text-xs font-bold mb-6"
        >
          Artisanal Craftsmanship
        </motion.span>
        
        <h1 
          ref={titleRef}
          className="text-6xl md:text-9xl font-serif font-black tracking-tighter leading-[0.8] mb-8"
        >
          <span className="block italic font-light text-foreground/40 text-4xl md:text-6xl mb-4">Experience the</span>
          LUXTEA REVEAL
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-12 mt-12 w-full">
          {/* Controls - Look Toggle */}
          <div className="flex flex-row md:flex-col gap-4 order-2 md:order-1">
            {FLAVORS.map((flavor) => (
              <button
                key={flavor.id}
                onClick={() => setActiveFlavor(flavor)}
                className={`relative group p-1 rounded-full transition-all duration-500 ${
                  activeFlavor.id === flavor.id ? 'scale-110 ring-2 ring-primary ring-offset-4 ring-offset-background' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border shadow-2xl"
                >
                  <img src={flavor.image} alt={flavor.name} className="w-full h-full object-cover" />
                </div>
                {activeFlavor.id === flavor.id && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:block"
                  >
                    <div className="w-1 h-12 bg-primary rounded-full" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Main Product Display */}
          <div className="relative flex-1 order-1 md:order-2">
            <div ref={imageRef} className="relative aspect-[3/4] max-w-md mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFlavor.id}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
                >
                  <img 
                    src={activeFlavor.image} 
                    alt={activeFlavor.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Glass Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 backdrop-blur-3xl rounded-full z-[-1]"
            />
          </div>

          {/* Flavor Details */}
          <div className="flex-1 text-left order-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFlavor.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-serif font-bold mb-4">{activeFlavor.name}</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-xs">
                  {activeFlavor.description}
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm font-mono tracking-widest uppercase">
                    <span className="text-primary">Notes:</span>
                    <span>Velvet, Honey, Smoke</span>
                  </div>
                  <Button variant="outline" className="group w-fit rounded-full px-8 py-6 border-primary/20 hover:border-primary transition-all duration-500">
                    Discover Collection
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-foreground" />
      </motion.div>
    </section>
  );
};

export default Hero;
