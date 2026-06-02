"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeSimple, MapPin, Clock, PaperPlaneTilt, Check, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

const contactInfo = [
  {
    icon: EnvelopeSimple,
    label: "電子郵件",
    value: "info@moimun.org",
    href: "mailto:info@moimun.org",
  },
  {
    icon: MapPin,
    label: "地址",
    value: "澳門特別行政區",
    href: null,
  },
  {
    icon: Clock,
    label: "回覆時間",
    value: "一般情況下 2-3 個工作天內回覆",
    href: null,
  },
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = "請輸入您的姓名";
    if (!formState.email.trim()) {
      newErrors.email = "請輸入您的電子郵件";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "請輸入有效的電子郵件地址";
    }
    if (!formState.subject.trim()) newErrors.subject = "請輸入主題";
    if (!formState.message.trim()) newErrors.message = "請輸入訊息內容";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div ref={containerRef} className="relative bg-bg-cream">
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-white relative overflow-hidden">
        <span className="section-number -top-8 -right-4">05</span>

        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>聯絡我們</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy mb-6">
              與我們<br /><span className="text-forest italic">聯繫</span>
            </h1>

            <p className="text-lg text-text-body max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              有任何問題或合作意向？我們期待聽到您的聲音。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 md:px-12 bg-bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                className="reveal"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-2xl text-navy mb-4">聯絡方式</h2>
                <p className="text-text-body leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  我們歡迎任何關於合作、咨詢或參與活動的查詢。請透過以下方式與我們聯絡。
                </p>
              </motion.div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    className="reveal flex items-start gap-4 p-6 bg-white rounded-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-cream)' }}>
                      <info.icon size={22} weight="duotone" style={{ color: 'var(--navy)' }} />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1 tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-navy hover:text-forest transition-colors duration-300"
                          style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-navy" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Links */}
              <motion.div
                className="reveal pt-8 border-t"
                style={{ borderColor: 'var(--border-warm)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-xs text-text-muted mb-4 tracking-wide" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>快速鏈接</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/news"
                    className="px-4 py-2 text-sm bg-white border text-text-body transition-all duration-300"
                    style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', borderColor: 'var(--border-warm)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.color = 'var(--navy)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-warm)'; e.currentTarget.style.color = 'var(--text-body)'; }}
                  >
                    最新消息
                  </Link>
                  <Link
                    href="/about"
                    className="px-4 py-2 text-sm bg-white border text-text-body transition-all duration-300"
                    style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', borderColor: 'var(--border-warm)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.color = 'var(--navy)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-warm)'; e.currentTarget.style.color = 'var(--text-body)'; }}
                  >
                    關於我們
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white p-8 lg:p-12 rounded-sm relative">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-gold rounded-tl-full opacity-30" />

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        <Check size={40} weight="bold" className="text-forest" />
                      </motion.div>
                      <h3 className="font-display text-2xl text-navy mb-3">訊息已發送</h3>
                      <p className="text-text-body mb-8" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>感謝您的來信，我們會盡快回覆您</p>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormState({ name: "", email: "", subject: "", message: "" });
                        }}
                        className="btn-secondary"
                        style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
                      >
                        再次發送
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-navy mb-2" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                            姓名 <span className="text-forest">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border text-navy focus:outline-none transition-colors duration-300`}
                            style={{
                              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                              background: 'var(--bg-cream)',
                              borderColor: errors.name ? '#f87171' : 'var(--border-warm)',
                              color: 'var(--navy)',
                              '--tw-placeholder-color': 'var(--text-muted)',
                            } as React.CSSProperties}
                            placeholder="請輸入您的姓名"
                          />
                          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-navy mb-2" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                            電子郵件 <span className="text-forest">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border text-navy focus:outline-none transition-colors duration-300`}
                            style={{
                              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                              background: 'var(--bg-cream)',
                              borderColor: errors.email ? '#f87171' : 'var(--border-warm)',
                              color: 'var(--navy)',
                            }}
                            placeholder="example@email.com"
                          />
                          {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-navy mb-2" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                          主題 <span className="text-forest">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border text-navy focus:outline-none transition-colors duration-300`}
                          style={{
                            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                            background: 'var(--bg-cream)',
                            borderColor: errors.subject ? '#f87171' : 'var(--border-warm)',
                            color: 'var(--navy)',
                          }}
                        >
                          <option value="">請選擇查詢類別</option>
                          <option value="合作">合作咨詢</option>
                          <option value="活動">活動查詢</option>
                          <option value="參與">參與報名</option>
                          <option value="其他">其他問題</option>
                        </select>
                        {errors.subject && <p className="mt-2 text-sm text-red-500">{errors.subject}</p>}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-navy mb-2" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                          訊息內容 <span className="text-forest">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          rows={6}
                          className={`w-full px-4 py-3 border text-navy focus:outline-none transition-colors duration-300 resize-none`}
                          style={{
                            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                            background: 'var(--bg-cream)',
                            borderColor: errors.message ? '#f87171' : 'var(--border-warm)',
                            color: 'var(--navy)',
                          }}
                          placeholder="請輸入您的訊息..."
                        />
                        {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message}</p>}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-navy text-white font-medium rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', background: 'var(--navy)' }}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = 'var(--navy-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--navy)'; }}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            發送中...
                          </>
                        ) : (
                          <>
                            發送訊息
                            <PaperPlaneTilt size={18} weight="fill" />
                          </>
                        )}
                      </motion.button>

                      <p className="text-xs text-text-muted text-center" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                        點擊發送即表示您同意我們的隱私政策。
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
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
