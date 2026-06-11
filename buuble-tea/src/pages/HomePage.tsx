import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/hero/Hero';
import Atelier from '@/components/sections/Atelier';
import Collections from '@/components/sections/Collections';
import Maison from '@/components/sections/Maison';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Atelier />
        <Collections />
        <Maison />
      </main>
      <Footer />
    </div>
  );
}
