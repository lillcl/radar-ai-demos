"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/news", label: "最新消息" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg-cream/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-12 h-12 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <circle cx="24" cy="24" r="22" fill="none" stroke="var(--navy)" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="10" fill="none" stroke="var(--navy)" strokeWidth="1" />
                <ellipse cx="24" cy="24" rx="22" ry="8" fill="none" stroke="var(--navy)" strokeWidth="1" />
                <line x1="24" y1="2" x2="24" y2="46" stroke="var(--navy)" strokeWidth="1" />
                <line x1="2" y1="24" x2="46" y2="24" stroke="var(--navy)" strokeWidth="1" />
              </svg>
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-wide text-navy" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                MIMUNYA
              </p>
              <p className="text-[10px] text-muted tracking-widest uppercase">Macau</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-navy" : "text-text-body"
                    }`}
                    style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
                  >
                    {item.label}
                    {(isActive || hoveredIndex === index) && (
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-px bg-navy"
                        layoutId="nav-underline"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contact"
                className="btn-primary"
              >
                立即加入
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} weight="bold" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <List size={20} weight="bold" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Decorative line */}
        <div className="h-px" style={{ background: 'var(--border-warm)' }} />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-bg-cream" onClick={() => setIsOpen(false)} />
            <motion.nav
              className="absolute top-28 left-6 right-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-4 text-lg border-b last:border-0 ${
                        pathname === item.href ? "text-navy font-semibold" : "text-text-body"
                      }`}
                      style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '22px', borderColor: 'var(--border-warm)' }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-6">
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    立即加入
                  </Link>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
