"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EnvelopeSimple, ArrowUpRight } from "@phosphor-icons/react";

const footerLinks = [
  { href: "/", label: "首頁" },
  { href: "/news", label: "最新消息" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy text-white">
      {/* Decorative top border */}
      <div className="h-1" style={{ background: 'linear-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)]' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <svg viewBox="0 0 48 48" className="w-12 h-12">
                <circle cx="24" cy="24" r="22" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
                <circle cx="24" cy="24" r="10" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
                <ellipse cx="24" cy="24" rx="22" ry="8" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
                <line x1="24" y1="2" x2="24" y2="46" stroke="white" strokeWidth="1" opacity="0.5" />
                <line x1="2" y1="24" x2="46" y2="24" stroke="white" strokeWidth="1" opacity="0.5" />
              </svg>
              <div>
                <p className="text-lg font-semibold tracking-wide text-white" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                  MIMUNYA
                </p>
                <p className="text-[10px] text-white/50 tracking-widest uppercase">Macau International MUN</p>
              </div>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-8" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              透過模擬聯合國活動培養青年的國際視野與領導能力，連結大灣區青年，促進國際交流與合作。
            </p>

            {/* Decorative element */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-[var(--gold)]" />
              <span className="text-gold text-xs tracking-widest">EST. 2018</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-6" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              快速鏈接
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '18px' }}
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-gold"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-6" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              聯絡方式
            </h4>
            <a
              href="mailto:info@moimun.org"
              className="inline-flex items-center gap-3 text-white/80 hover:text-gold transition-colors duration-300 mb-6"
              style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
            >
              <EnvelopeSimple size={20} weight="regular" />
              info@moimun.org
            </a>

            <p className="text-white/40 text-sm" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              澳門特別行政區
            </p>

            <p className="text-white/40 text-sm mt-4" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              一般情況下 2-3 個工作天內回覆
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-20 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              © {year} 澳門國際模擬聯合國青年協會. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gold text-xs tracking-widest">MIMUNYA</span>
              <span className="text-white/20">|</span>
              <span className="text-white/40 text-xs">Macau, China</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
