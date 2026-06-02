"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const values = [
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

const team = [
  {
    name: "陳偉明",
    role: "創會主席",
    bio: "前聯合國青年代表，擁有豐富的國際事務經驗",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "林雅琪",
    role: "執行總監",
    bio: "資深教育工作者，專注青年發展與培訓",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "周浩然",
    role: "學術總監",
    bio: "國際關係學者，曾於多個智庫擔任研究員",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

const stats = [
  { value: "2018", label: "成立年份" },
  { value: "5000+", label: "青年參與者" },
  { value: "50+", label: "合作機構" },
  { value: "100+", label: "模擬會議" },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div ref={containerRef} className="relative bg-bg-cream">
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-white relative overflow-hidden">
        <span className="section-number -top-8 -right-4">04</span>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>關於我們</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy mb-6">
              關於<br /><span className="text-forest italic">MIMUNYA</span>
            </h1>

            <p className="text-lg text-text-body max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              MIMUNYA 是一個位於澳門的非牟利組織，致力於透過模擬聯合國活動推動青年國際視野與領導能力的發展。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 md:px-12 bg-bg-cream relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              className="reveal p-10 lg:p-14 bg-white rounded-sm relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-display text-8xl text-navy opacity-5 absolute top-4 right-6" style={{ fontSize: "6rem" }}>01</span>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>使命</span>
                </div>
                <h2 className="font-display text-3xl text-navy mb-6">我們的使命</h2>
                <div className="w-12 h-px mb-8" style={{ background: 'var(--border-warm)' }} />
                <p className="font-display text-xl text-navy leading-relaxed italic mb-6">
                  「透過模擬聯合國活動培養批判思維與外交能力」
                </p>
                <p className="text-text-body leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  我們致力於為青年提供專業的培訓與交流平台，透過模擬聯合國會議、工作坊及國際交流計劃，培育具有國際視野的新一代領袖。
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              className="reveal p-10 lg:p-14 bg-navy text-white rounded-sm relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="font-display text-8xl text-white opacity-5 absolute top-4 right-6" style={{ fontSize: "6rem" }}>02</span>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>願景</span>
                </div>
                <h2 className="font-display text-3xl mb-6">我們的願景</h2>
                <div className="w-12 h-px bg-white/20 mb-8" />
                <p className="font-display text-xl leading-relaxed italic mb-6 text-white/90">
                  「連結大灣區青年，培養國際視野」
                </p>
                <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  我們期望成為大灣區青年與國際社會的重要橋樑，促進跨區域合作與文化交流，讓青年在全球化的時代中發揮積極作用。
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="reveal text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="font-display text-4xl md:text-5xl text-navy mb-2" style={{ fontSize: "3rem" }}>{stat.value}</p>
                <p className="text-sm text-text-muted tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 md:px-12 bg-bg-warm relative overflow-hidden">
        <span className="section-number -top-8 -left-4">03</span>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-2xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>核心價值</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-navy mb-6">我們的價值觀</h2>
          </motion.div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="reveal group grid md:grid-cols-12 gap-6 p-8 bg-white rounded-sm hover:shadow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="md:col-span-2">
                  <span className="font-display text-5xl text-navy opacity-20" style={{ fontSize: "3.5rem" }}>{value.number}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl text-navy mb-1">{value.title}</h3>
                  <p className="text-xs text-text-muted tracking-wider" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{value.titleEn}</p>
                </div>
                <div className="md:col-span-6">
                  <p className="text-text-body leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Collaboration */}
      <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="reveal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gold" />
                <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>區域合作</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-navy mb-6">大灣區<br />合作網絡</h2>
              <div className="w-12 h-px bg-[var(--border-warm)] mb-8" />
              <p className="text-text-body leading-relaxed mb-6" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                MIMUNYA 積極推動粵港澳大灣區的跨區域合作，與區內多家機構建立緊密合作關係，包括香港大學等多所知名學府，共同舉辦模擬聯合國會議、學術論壇及青年交流計劃。
              </p>
              <p className="text-text-muted leading-relaxed mb-8" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                我們的網絡覆蓋大灣區主要城市，為青年提供豐富的學習與交流機會。
              </p>
              <button
                className="btn-secondary"
                style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
              >
                了解更多合作夥伴
                <ArrowRight size={16} />
              </button>
            </motion.div>

            <motion.div
              className="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 -top-4 -left-4 border-2 border-gold -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80"
                  alt="Regional collaboration"
                  className="w-full h-full object-cover rounded-sm"
                  style={{ filter: "sepia(20%) contrast(1.05)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 md:px-12 bg-bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-2xl mx-auto mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>團隊成員</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-navy mb-6">核心團隊</h2>
            <p className="text-text-body leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              由經驗豐富的專業人士組成的團隊，引領 MIMUNYA 不斷前行。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.article
                key={member.name}
                className="reveal group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-6 img-reveal">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    style={{ filter: "sepia(20%) contrast(1.05)" }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--navy) 40%, transparent 100%)' }} />
                </div>
                <h3 className="font-display text-xl text-navy mb-1">{member.name}</h3>
                <p className="text-sm text-[var(--gold)] mb-3" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{member.role}</p>
                <p className="text-sm text-text-muted leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{member.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 bg-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

        <motion.div
          className="max-w-3xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
            歡迎加入<br /><span className="text-[var(--gold)]">MIMUNYA</span>
          </h2>
          <p className="text-white/60 leading-relaxed mb-10" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            熱烈歡迎充滿熱情的青年加入我們，共同探索國際事務，連結大灣區與世界。
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-semibold transition-all duration-300"
            style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', color: 'var(--navy)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
          >
            聯絡我們
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>

      {/* CSS for reveal animations */}
      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
