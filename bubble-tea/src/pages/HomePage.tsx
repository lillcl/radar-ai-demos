import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/hero/Hero';
import Process from '../components/sections/Process';
import Flavors from '../components/sections/Flavors';
import Experience from '../components/sections/Experience';
import Footer from '../components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  useEffect(() => {
    // Smooth scroll setup or global animations
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Process />
        <Flavors />
        <Experience />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
