import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Collections', href: '#collections' },
  { label: 'Atelier', href: '#atelier' },
  { label: 'La Maison', href: '#maison' },
  { label: 'Boutique', href: '#' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-700',
          scrolled
            ? 'py-3 bg-background/85 backdrop-blur-xl border-b border-border/60'
            : 'py-6 bg-transparent'
        )}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-baseline gap-2 group">
            <span className="font-serif text-xl md:text-2xl tracking-[0.2em] font-medium">
              AETHEL
            </span>
            <span className="hidden md:inline-block w-12 h-px bg-primary/40 group-hover:w-16 transition-all duration-500" />
            <span className="hidden md:inline-block font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              Horologie
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onMouseEnter={() => setActiveLink(link.label)}
                  onMouseLeave={() => setActiveLink('')}
                  className="relative font-mono text-[11px] tracking-[0.32em] uppercase text-foreground/70 hover:text-foreground transition-colors"
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-px bg-primary transition-all duration-500',
                      activeLink === link.label ? 'w-full' : 'w-0'
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              aria-label="Search"
              className="hidden md:flex w-9 h-9 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.32em] uppercase text-foreground/80 hover:text-primary transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Reserve
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="md:hidden w-10 h-10 flex items-center justify-center"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-obsidian/60 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-16">
                <span className="font-serif text-xl tracking-[0.2em]">AETHEL</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close"
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <ul className="space-y-6 flex-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="font-serif text-3xl tracking-tight"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="pt-8 border-t border-border">
                <p className="font-mono text-[10px] tracking-[0.32em] text-muted-foreground uppercase mb-3">
                  La Chaux-de-Fonds · Suisse
                </p>
                <p className="text-sm text-foreground/70">
                  +41 32 123 45 67
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
