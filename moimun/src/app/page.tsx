"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "@phosphor-icons/react";

const heroImages = [
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&q=85",
  "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&q=85",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&q=85",
];

const features = [
  {
    number: "01",
    title: "國際視野",
    titleEn: "International Perspective",
    description: "培養青年對全球議題的深度理解與跨文化溝通能力，促進國際交流與合作。",
  },
  {
    number: "02",
    title: "領導才能",
    titleEn: "Leadership",
    description: "透過實踐與指導，發展青年的領導力、團隊協作能力與創新解難思維。",
  },
  {
    number: "03",
    title: "外交能力",
    titleEn: "Diplomatic Ability",
    description: "提升演說、辯論、談判與協商技巧，培養解決複雜國際問題的能力。",
  },
];

const activities = [
  {
    image: "https://images.unsplash.com/photo-1561489401-fc2876ced162?w=800&q=80",
    title: "模擬聯合國大會",
    year: "2025",
    location: "香港",
  },
  {
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    title: "學術工作坊",
    year: "2025",
    location: "澳門",
  },
  {
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    title: "國際交流計劃",
    year: "2025",
    location: "大灣區",
  },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    // Re-observe all .reveal elements when route changes
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div ref={containerRef} className="relative bg-bg-cream">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background Image Grid */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-bg-cream/90 z-10" />
          <div className="grid grid-cols-3 h-full opacity-20">
            {heroImages.map((src, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.3 }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "sepia(30%) contrast(1.1)" }}
                />
              </motion.div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-cream)] via-transparent to-[var(--bg-cream)] z-20" />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 flex flex-col items-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Overline */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-px bg-navy hidden sm:block" />
              <span className="text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                澳門國際模擬聯合國青年協會
              </span>
              <div className="w-12 h-px bg-navy hidden sm:block" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="font-display mb-8 text-center"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="block text-navy">探索</span>
              <span className="block text-forest italic">國際事務</span>
              <span className="block text-navy">連結青年</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-[var(--text-body)] max-w-xl mb-10 leading-relaxed text-center"
              style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              透過模擬聯合國活動培養批判思維與外交能力，
              <br className="hidden md:block" />
              連結大灣區青年，培養國際視野與領導才能。
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link href="/about" className="btn-primary">
                了解更多
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/news" className="btn-secondary">
                最新消息
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t w-full max-w-lg mx-auto"
              style={{ borderColor: 'var(--border-warm)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="text-center">
                <p className="font-display text-3xl text-navy" style={{ fontSize: "2.5rem" }}>2018</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>成立年份</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl text-navy" style={{ fontSize: "2.5rem" }}>5000+</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>青年參與者</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl text-navy" style={{ fontSize: "2.5rem" }}>50+</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>合作機構</p>
              </div>
            </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>向下滾動</span>
              <ArrowDown size={16} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white relative overflow-hidden">
        {/* Section number */}
        <span className="section-number -top-8 left-4 md:-left-4">01</span>

        <div className="max-w-7xl mx-auto">
          {/* Section Header - Centered */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-[var(--gold)]" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>我們的價值</span>
              <div className="w-8 h-px bg-[var(--gold)]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-navy mb-6">核心價值</h2>
            <p className="text-[var(--text-body)] leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              透過專業的模擬聯合國會議與培訓，培育具有國際視野、領導才能與外交能力的青年人才。
            </p>
          </motion.div>

          {/* Feature Cards - Centered on mobile */}
          <div className="space-y-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group reveal text-center p-8 bg-bg-cream rounded-sm hover:shadow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <span className="font-display text-5xl text-navy opacity-20" style={{ fontSize: "3.5rem" }}>{feature.number}</span>
                <h3 className="font-display text-2xl text-navy mb-1">{feature.title}</h3>
                <p className="text-xs text-[var(--text-muted)] tracking-wider mb-4" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{feature.titleEn}</p>
                <p className="text-[var(--text-body)] leading-relaxed max-w-lg mx-auto" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[var(--bg-warm)] relative overflow-hidden">
        {/* Section number */}
        <span className="section-number -top-8 right-4 md:-right-4">02</span>

        <div className="max-w-7xl mx-auto">
          {/* Section Header - Centered */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-[var(--gold)]" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>活動內容</span>
              <div className="w-8 h-px bg-[var(--gold)]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-navy mb-6">精彩活動</h2>
            <p className="text-[var(--text-body)] leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              多元化的活動涵蓋模擬會議、工作坊、國際交流等，為青年提供全方位的學習與成長平台。
            </p>
          </motion.div>

          {/* Activity Cards - Centered on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {activities.map((activity, index) => (
              <motion.article
                key={activity.title}
                className="group reveal"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-6 img-reveal">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "sepia(25%) contrast(1.05)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Year badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm">
                    <span className="text-xs font-medium text-navy" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{activity.year}</span>
                  </div>
                </div>
                <h3 className="font-display text-xl text-navy mb-2 group-hover:text-forest transition-colors duration-300">{activity.title}</h3>
                <p className="text-sm text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{activity.location}</p>
              </motion.article>
            ))}
          </div>

          {/* View All Link */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/news" className="inline-flex items-center gap-2 text-navy font-medium hover:text-forest transition-colors duration-300" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              查看所有活動
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quote / Mission Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-navy relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase mb-8 block" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>我們的使命</span>

          <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed mb-8 italic">
            「連結大灣區青年，培養國際視野」
          </blockquote>

          <div className="w-16 h-px bg-[var(--gold)] mx-auto mb-8" />

          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            MIMUNYA 是一個位於澳門的非牟利組織，致力於透過模擬聯合國活動推動青年國際視野與領導能力的發展。
          </p>

          <Link href="/about" className="inline-flex items-center gap-2 mt-10 px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-navy transition-all duration-300" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            關於我們
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-px bg-[var(--gold)]" />
                <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>加入我們</span>
                <div className="w-8 h-px bg-[var(--gold)]" />
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-navy mb-6">準備好開始了嗎？</h2>
              <p className="text-[var(--text-body)] leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                熱烈歡迎充滿熱情的青年加入 MIMUNYA，共同探索國際事務，連結大灣區與世界。
              </p>
              <Link href="/contact" className="btn-primary">
                聯絡我們
                <ArrowRight size={16} weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
