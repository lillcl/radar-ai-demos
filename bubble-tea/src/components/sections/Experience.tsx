import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Button } from '@blinkdotnew/ui';

const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -100,
        scale: 1.2,
      });

      gsap.from('.exp-text', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: -50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={containerRef} className="relative min-h-screen flex flex-col md:flex-row items-center overflow-hidden bg-background">
      {/* Visual Side */}
      <div className="relative w-full md:w-1/2 h-[60vh] md:h-screen overflow-hidden">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1777041097323-2f2ab6734a82?auto=format&fit=crop&w=1200&q=80"
          alt="LuxTea Boutique"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
      </div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
        <div className="max-w-md">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="exp-text text-primary uppercase tracking-[0.4em] text-xs font-bold mb-8 block"
          >
            The Boutique
          </motion.span>
          <h2 className="exp-text text-5xl md:text-8xl font-serif font-black tracking-tighter leading-none mb-12">
            A SPACE FOR THE SOUL
          </h2>
          <p className="exp-text text-muted-foreground text-xl leading-relaxed mb-12">
            Inspired by minimalist Japanese aesthetics and Wabi-Sabi philosophy, our flagship boutique is designed to be your urban sanctuary. 
          </p>
          
          <div className="exp-text grid grid-cols-2 gap-8 mb-16">
            <div>
              <h4 className="font-bold text-2xl font-serif mb-2 tracking-tight">Location</h4>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Aoyama, Tokyo</p>
            </div>
            <div>
              <h4 className="font-bold text-2xl font-serif mb-2 tracking-tight">Vibe</h4>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Zen Minimalist</p>
            </div>
          </div>

          <Button variant="default" className="exp-text rounded-full px-12 py-8 bg-primary hover:bg-primary/90 text-lg transition-all duration-500 hover:scale-105 shadow-xl">
            Book a Table
          </Button>
        </div>
      </div>

      {/* Background Decorative Type */}
      <div className="absolute bottom-0 right-0 p-12 pointer-events-none opacity-[0.03] select-none">
        <span className="text-[20vw] font-serif font-black tracking-tighter leading-none uppercase">Aura</span>
      </div>
    </section>
  );
};

export default Experience;
