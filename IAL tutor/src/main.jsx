import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import {
  ArrowRight,
  BookOpenText,
  Brain,
  CalendarCheck,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Clock,
  Exam,
  FileText,
  FunnelSimple,
  Lightning,
  MagnifyingGlass,
  PaperPlaneTilt,
  Path,
  Sparkle,
  Target,
} from '@phosphor-icons/react';
import mascotImage from './assets/ial-mascot.png';
import './styles.css';

const topicSteps = [
  { label: 'Choose subject', detail: 'Pure Maths, Stats, Mechanics, Chemistry' },
  { label: 'Pick topic', detail: 'Differentiation, vectors, rates, energetics' },
  { label: 'Practise set', detail: 'Question queue with marks and answers' },
];

const planWeeks = [
  { week: 'Week 1', focus: 'Pure 2 gaps', load: '3 sessions' },
  { week: 'Week 2', focus: 'Stats timing', load: '2 sessions' },
  { week: 'Week 3', focus: 'Chemistry paper', load: '1 mock' },
];

const suggestionSignals = ['Mistakes', 'Timing', 'Topic confidence'];

function App() {
  return (
    <main className="app-shell">
      <NavBar />
      <HeroSection />
      <GsapLearningRoute />
      <FeatureSection
        id="questions"
        number="01"
        eyebrow="Past questions and papers"
        title="Find the exact questions you need without digging through PDFs."
        body="Students can browse full papers, then break them down by topic. The page explains where each question came from, what marks it is worth, and what skill it trains."
        bullets={['Filter by subject, unit, paper, topic, and difficulty', 'Open full papers when the student wants mock exam practice', 'Save weak questions into a personal retry list']}
        graphic={<QuestionsGraphic />}
      />
      <FeatureSection
        id="plan"
        number="02"
        eyebrow="Study plan"
        title="Turn exam dates into a weekly revision route."
        body="The student enters exam dates, available study days, and weak topics. IAL Tutor turns that into a realistic plan with short practice blocks, mock days, and review sessions."
        bullets={['Balances weak topics with upcoming exams', 'Keeps sessions short enough to actually finish', 'Adjusts the plan when practice scores change']}
        graphic={<PlanGraphic />}
        reverse
      />
      <FeatureSection
        id="suggest"
        number="03"
        eyebrow="AI suggested questions"
        title="Recommend the next useful question, not a random one."
        body="The AI looks at recent mistakes, time spent, skipped topics, and confidence. Then it suggests a question that is just uncomfortable enough to help the student improve."
        bullets={['Uses recent answers as signals', 'Explains why a question was suggested', 'Mixes quick wins with harder exam-style practice']}
        graphic={<SuggestionGraphic />}
      />
      <ComponentSystem />
      <FinalCta />
    </main>
  );
}

function NavBar() {
  return (
    <header className="nav-shell">
      <a className="brand-lockup" href="#top" aria-label="IAL Tutor home">
        <span className="brand-mark">IT</span>
        <span>IAL Tutor</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#questions">Questions</a>
        <a href="#plan">Plan</a>
        <a href="#suggest">AI suggestions</a>
      </nav>
      <MagneticButton compact>Start free</MagneticButton>
    </header>
  );
}

function HeroSection() {
  return (
    <section id="top" className="hero-section">
      <motion.div
        className="hero-copy"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div className="eyebrow-pill" variants={fadeUp}>
          <span className="pulse-dot" />
          Built for IAL revision
        </motion.div>
        <motion.h1 variants={fadeUp}>Practise the right paper question next.</motion.h1>
        <motion.p variants={fadeUp}>
          IAL Tutor helps students move from messy past papers to clear topic practice, a study plan, and AI-picked next questions.
        </motion.p>
        <motion.div className="hero-actions" variants={fadeUp}>
          <MagneticButton>
            Build my revision route
            <ArrowRight weight="bold" />
          </MagneticButton>
          <a className="secondary-link" href="#questions">
            See how it works
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="hero-stage" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={springy}>
        <MascotStage />
      </motion.div>
    </section>
  );
}

function MascotStage() {
  return (
    <div className="mascot-stage" aria-label="IAL Tutor mascot and product preview">
      <div className="mascot-orbit orbit-one" />
      <div className="mascot-orbit orbit-two" />
      <motion.img
        src={mascotImage}
        alt="IAL Tutor mascot"
        className="mascot-image"
        animate={{ y: [0, -12, 0], rotate: [-1.4, 1.2, -1.4] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="mini-panel topic-panel" animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}>
        <BookOpenText weight="duotone" />
        <span>Topic queue</span>
        <strong>Vectors next</strong>
      </motion.div>
      <motion.div className="mini-panel score-panel" animate={{ y: [0, 7, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
        <Target weight="duotone" />
        <span>Study block</span>
        <strong>35 min</strong>
      </motion.div>
    </div>
  );
}

function GsapLearningRoute() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(pathRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.out', delay: 0.25 });
      gsap.to(dotRef.current, { xPercent: 570, duration: 8, ease: 'power1.inOut', repeat: -1, yoyo: true });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="route-strip" aria-label="IAL Tutor workflow">
      <div className="route-line" ref={pathRef} />
      <div className="route-dot" ref={dotRef} />
      <RouteItem icon={<FunnelSimple weight="duotone" />} title="Filter" text="Choose subject and topic" />
      <RouteItem icon={<CalendarCheck weight="duotone" />} title="Plan" text="Place practice into the week" />
      <RouteItem icon={<Brain weight="duotone" />} title="Suggest" text="Pick the next useful question" />
    </section>
  );
}

function RouteItem({ icon, title, text }) {
  return (
    <div className="route-item">
      <span>{icon}</span>
      <strong>{title}</strong>
      <small>{text}</small>
    </div>
  );
}

function FeatureSection({ id, number, eyebrow, title, body, bullets, graphic, reverse = false }) {
  return (
    <section id={id} className={`product-section ${reverse ? 'section-reverse' : ''}`}>
      <div className="section-copy">
        <span className="section-number">{number}</span>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="section-body">{body}</p>
        <ul className="section-bullets">
          {bullets.map((bullet) => (
            <li key={bullet}>
              <CheckCircle weight="fill" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section-graphic">{graphic}</div>
    </section>
  );
}

function QuestionsGraphic() {
  return (
    <div className="graphic-shell questions-graphic">
      <div className="graphic-topbar">
        <span>IAL Question Library</span>
        <MagnifyingGlass weight="bold" />
      </div>
      <div className="filter-rail">
        {['Maths', 'Chemistry', 'Biology'].map((item, index) => (
          <motion.button key={item} className={index === 0 ? 'active' : ''} whileTap={{ scale: 0.98 }}>
            {item}
          </motion.button>
        ))}
      </div>
      <div className="topic-flow">
        {topicSteps.map((step, index) => (
          <React.Fragment key={step.label}>
            <motion.div className="flow-card" animate={{ y: [0, index % 2 ? 5 : -5, 0] }} transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}>
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </motion.div>
            {index < topicSteps.length - 1 && <CaretRight className="flow-arrow" weight="bold" />}
          </React.Fragment>
        ))}
      </div>
      <div className="paper-preview">
        <FileText weight="duotone" />
        <div>
          <strong>WMA13 Jan 2025 Q7</strong>
          <span>Vectors, 6 marks, mark scheme attached</span>
        </div>
      </div>
    </div>
  );
}

function PlanGraphic() {
  return (
    <div className="graphic-shell plan-graphic">
      <div className="calendar-head">
        <CalendarCheck weight="duotone" />
        <div>
          <strong>Revision plan</strong>
          <span>Built from exam dates and weak topics</span>
        </div>
      </div>
      <div className="plan-timeline">
        {planWeeks.map((week) => (
          <div
            className="week-block"
            key={week.week}
          >
            <span>{week.week}</span>
            <strong>{week.focus}</strong>
            <small>{week.load}</small>
            <i />
          </div>
        ))}
      </div>
      <div className="plan-callout">
        <Clock weight="duotone" />
        <span>Next session: 35 min topic practice before a full paper on Saturday.</span>
      </div>
    </div>
  );
}

function SuggestionGraphic() {
  return (
    <div className="graphic-shell suggestion-graphic">
      <div className="ai-command">
        <Sparkle weight="duotone" />
        <span>Suggest my next question</span>
      </div>
      <div className="signal-grid">
        {suggestionSignals.map((signal, index) => (
          <motion.div key={signal} className="signal-card" animate={{ y: [0, -5, 0] }} transition={{ duration: 3.4 + index, repeat: Infinity, ease: 'easeInOut' }}>
            <ChartLineUp weight="duotone" />
            <strong>{signal}</strong>
            <small>{['2 repeated slips', 'Slow by 4 min', 'Needs review'][index]}</small>
          </motion.div>
        ))}
      </div>
      <div className="recommendation-card">
        <Lightning weight="fill" />
        <div>
          <strong>Recommended: WST01 Q4</strong>
          <span>Because hypothesis testing is improving, but timing is still weak.</span>
        </div>
      </div>
    </div>
  );
}

function ComponentSystem() {
  const tokens = [
    { icon: <ClipboardText weight="duotone" />, label: 'Question filters' },
    { icon: <Exam weight="duotone" />, label: 'Paper preview rows' },
    { icon: <Path weight="duotone" />, label: 'Study route blocks' },
    { icon: <PaperPlaneTilt weight="duotone" />, label: 'AI suggestion panels' },
  ];

  return (
    <section className="component-preview">
      <div>
        <span className="section-kicker">Reusable frontend pieces</span>
        <h2>Designed as app components, not one-off decoration.</h2>
        <p>These sections can become the real app screens later: filters, paper rows, timeline blocks, and AI recommendation panels.</p>
      </div>
      <div className="component-list">
        {tokens.map((token) => (
          <motion.div key={token.label} className="component-token" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            {token.icon}
            <span>{token.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div>
        <span className="section-kicker">Slogan</span>
        <h2>Less hunting. More practising.</h2>
        <p>Give students a clear next step every time they open the app.</p>
      </div>
      <MagneticButton>
        Start with topic practice
        <ArrowRight weight="bold" />
      </MagneticButton>
    </section>
  );
}

function MagneticButton({ children, compact = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 18 });
  const springY = useSpring(y, { stiffness: 160, damping: 18 });
  const rotate = useTransform(springX, [-10, 10], [-1.2, 1.2]);

  function handleMove(event) {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.18);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      className={`magnetic-button ${compact ? 'button-compact' : ''}`}
      style={{ x: springX, y: springY, rotate }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const springy = { type: 'spring', stiffness: 100, damping: 20 };

createRoot(document.getElementById('root')).render(<App />);
