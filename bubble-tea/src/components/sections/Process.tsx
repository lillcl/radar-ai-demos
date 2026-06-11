import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Precision Brewing',
    description: 'We steep our premium leaves at exact temperatures to extract the purest notes without bitterness.',
    icon: '🍵',
  },
  {
    number: '02',
    title: 'Artisanal Textures',
    description: 'Our house-made foams and oat milks are aerated to a velvet consistency that defines LuxTea.',
    icon: '🥛',
  },
  {
    number: '03',
    title: 'The Pearl Secret',
    description: 'Pearls are slow-cooked in small batches for 4 hours in organic brown sugar for the perfect chew.',
    icon: '🌑',
  },
];

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 100,
        stagger: 0.3,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Background line animation
      gsap.from('.process-line', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          scrub: 1,
        },
        scaleX: 0,
        transformOrigin: 'left',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="py-32 px-6 bg-secondary/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary uppercase tracking-[0.4em] text-xs font-bold mb-6 block"
            >
              The Ritual
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none">
              THE ART OF THE BREW
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-sm mb-4">
            A meticulous symphony of temperature, time, and texture. No shortcuts, only standards.
          </p>
        </div>

        <div ref={containerRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {/* Connecting Line */}
          <div className="process-line absolute top-12 left-0 w-full h-px bg-primary/20 hidden md:block" />
          
          {STEPS.map((step, idx) => (
            <div key={step.number} className="process-step relative group">
              <div className="mb-12 flex items-center justify-between">
                <span className="text-7xl font-serif font-black text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                  {step.number}
                </span>
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-6 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {/* Hover Decoration */}
              <div className="mt-8 w-12 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
