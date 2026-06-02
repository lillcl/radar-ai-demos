"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarBlank, ArrowRight, Clock } from "@phosphor-icons/react";

const newsItems = [
  {
    id: 1,
    date: "2025.03.17",
    category: "活動通知",
    title: "2025香港升學體驗日暨粵港澳大灣區國際模擬聯合國大會",
    excerpt: "香港升學體驗日暨粵港澳大灣區國際模擬聯合國大會將於今年舉行，歡迎青年踴躍報名參加。",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    date: "2025.03.12",
    category: "國際議題",
    title: "聯合國人權報告：以色列軍隊對巴勒斯坦人使用性暴力",
    excerpt: "最新調查報告揭示了令人震驚的事實，呼籲國際社會關注並采取行動。",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&q=80",
    featured: false,
  },
  {
    id: 3,
    date: "2025.03.09",
    category: "全球事務",
    title: "世界最大婦女會議呼籲平等對待",
    excerpt: "會議在全球女性的期待中召開，共同探討性別平等與女性權益保障的未來方向。",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80",
    featured: false,
  },
  {
    id: 4,
    date: "2025.03.09",
    category: "地區動態",
    title: "聯合國特使呼籲塔利班正視現實",
    excerpt: "阿富汗局勢持續緊張，聯合國特使呼吁塔利班與國際社會建立建設性對話。",
    image: "https://images.unsplash.com/photo-1561489401-fc2876ced162?w=800&q=80",
    featured: false,
  },
  {
    id: 5,
    date: "2025.02.28",
    category: "合作夥伴",
    title: "與香港大學建立深度合作關係",
    excerpt: "MIMUNYA 與香港大學正式簽署合作備忘錄，共同舉辦年度模擬聯合國會議。",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    featured: false,
  },
  {
    id: 6,
    date: "2025.02.15",
    category: "青年培育",
    title: "冬季工作坊圓滿結束",
    excerpt: "為期三天的領袖培訓工作坊吸引了來自大灣區近百名青年參加，反應熱烈。",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    featured: false,
  },
];

export default function NewsPage() {
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

  const featuredItem = newsItems[0];
  const regularItems = newsItems.slice(1);

  return (
    <div ref={containerRef} className="relative bg-bg-cream">
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-white relative overflow-hidden">
        <span className="section-number -top-8 -left-4">03</span>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>資訊中心</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy mb-6">
              最新消息
            </h1>

            <p className="text-lg text-text-body max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              追蹤 MIMUNYA 的最新動態，了解模擬聯合國活動、國際事務與青年發展的最新資訊。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.article
            className="group reveal cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid lg:grid-cols-2 gap-0 bg-bg-cream rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredItem.image}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "sepia(20%) contrast(1.05)" }}
                />
                {/* Category badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-navy text-white text-xs tracking-wider" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                    {featuredItem.category}
                  </span>
                </div>
              </div>
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6 text-sm text-text-muted">
                  <span className="flex items-center gap-2">
                    <CalendarBlank size={16} />
                    {featuredItem.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    2-3 分鐘閱讀
                  </span>
                </div>

                <h2 className="font-display text-2xl lg:text-3xl text-navy mb-4 leading-snug group-hover:text-forest transition-colors duration-300">
                  {featuredItem.title}
                </h2>

                <p className="text-text-body leading-relaxed mb-8" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  {featuredItem.excerpt}
                </p>

                <div className="flex items-center gap-2 text-navy font-medium group-hover:gap-3 transition-all duration-300" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  閱讀更多
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Divider */}
      <div className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-px" style={{ background: 'var(--border-warm)' }} />
        </div>
      </div>

      {/* News Grid */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularItems.map((item, index) => (
              <motion.article
                key={item.id}
                className="group reveal cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-5 img-reveal">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "sepia(25%) contrast(1.05)" }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-navy text-xs font-medium" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted mb-3" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  <CalendarBlank size={14} />
                  {item.date}
                </div>

                <h3 className="font-display text-xl text-navy mb-2 leading-snug group-hover:text-forest transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-sm text-text-body leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  {item.excerpt}
                </p>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              className="btn-secondary"
              style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
            >
              載入更多消息
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
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
