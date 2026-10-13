import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Crown, Quote } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import HeroPreview from '../components/HeroPreview.jsx';
import Reveal from '../components/Reveal.jsx';
import { TOOLS } from '../lib/tools.js';

const PRICE = import.meta.env.VITE_PREMIUM_PRICE || '₹99';
const FREE_LIMIT = 10;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } } };

function Mock({ id }) {
  switch (id) {
    case 'article':
      return <div className="mock"><div className="m-line h" /><div className="m-line" /><div className="m-line" /><div className="m-line w70" /><div className="m-line h sm" /><div className="m-line" /><div className="m-line w50" /></div>;
    case 'titles':
      return <div className="mock">{['Why most onboarding fails in week one', '7 habits of teams that ship weekly', 'Is your stand-up costing you an hour?', 'The quiet case for shorter meetings'].map((t) => <div key={t} className="m-title">{t}</div>)}</div>;
    case 'resume':
      return <div className="mock mock-row"><div className="m-ring"><strong>82</strong></div><div className="grow"><div className="m-line" /><div className="m-line w70" /><div className="m-chips"><i /><i /><i /></div></div></div>;
    case 'image':
      return <div className="mock"><div className="m-art" /></div>;
    case 'background':
      return <div className="mock mock-row"><div className="m-photo" /><div className="m-photo cut" /></div>;
    default:
      return <div className="mock mock-row"><div className="m-photo obj" /><div className="m-photo" /></div>;
  }
}

function Showcase() {
  const [active, setActive] = useState(TOOLS[0]);
  return (
    <section id="tools" className="section">
      <div className="container">
        <Reveal><h2 className="h2">Six tools, one workspace</h2><p className="lede">Pick a tool to see what it produces. Everything you make is saved to your history.</p></Reveal>
        <Reveal delay={0.1} className="show glass">
          <div className="show-tabs" role="tablist" aria-label="Tools">
            {TOOLS.map((t) => (
              <button key={t.id} role="tab" aria-selected={active.id === t.id} className={active.id === t.id ? 'on' : ''} onClick={() => setActive(t)}>
                <t.icon size={18} />
                <span><strong>{t.label}</strong><small>{t.short}</small></span>
                {active.id === t.id && <motion.i layoutId="tab-glow" className="tab-glow" />}
              </button>
            ))}
          </div>
          <div className="show-panel">
            <AnimatePresence mode="wait">
              <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <Mock id={active.id} />
                <p className="show-cap">{active.blurb}</p>
                {active.premium && <span className="badge premium"><Crown size={13} /> Premium</span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Plan({ name, price, note, items, cta, featured }) {
  return (
    <motion.div className={`plan glass ${featured ? 'featured' : ''}`} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      {featured && <span className="badge premium"><Crown size={13} /> Most popular</span>}
      <h3>{name}</h3>
      <p className="price"><strong>{price}</strong><span className="muted"> {note}</span></p>
      <ul>{items.map((i) => <li key={i}><Check size={16} />{i}</li>)}</ul>
      {cta}
    </motion.div>
  );
}

const REVIEWS = [
  { q: 'I draft the outline myself and let the article writer fill in sections. It saves me an hour on every post, and the history tab means I never lose a draft.', n: 'Aanya Rao', r: 'Content lead, sample review' },
  { q: 'The resume analyzer pointed out that my bullet points had no numbers in them. Rewriting them took one evening and my callback rate changed.', n: 'Marcus Webb', r: 'Software engineer, sample review' },
  { q: 'Background removal is clean enough that I stopped opening a photo editor for product shots. Object removal handles the rest.', n: 'Priya Nair', r: 'Shop owner, sample review' },
];

export default function Landing() {
  return (
    <div className="landing">
      <NeuralBackground />
      <div className="aurora" aria-hidden="true"><i /><i /></div>
      <Navbar />
      <main>
        <section className="hero container">
          <motion.div className="hero-copy" variants={container} initial="hidden" animate="show">
            <motion.h1 variants={rise}>Write it, draw it, fix it.<br /><span className="grad">One AI workspace.</span></motion.h1>
            <motion.p variants={rise} className="lede">Nexus brings article writing, image generation, background and object removal, and resume review into a single fast workspace. Start free, upgrade when you need more.</motion.p>
            <motion.div variants={rise} className="row">
              <SignedOut><Link to="/sign-up" className="btn primary lg">Start free <ArrowRight size={18} /></Link></SignedOut>
              <SignedIn><Link to="/app" className="btn primary lg">Open workspace <ArrowRight size={18} /></Link></SignedIn>
              <a href="#tools" className="btn ghost lg">See the tools</a>
            </motion.div>
            <motion.p variants={rise} className="muted small">{FREE_LIMIT} free generations every month. No card needed.</motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
            <HeroPreview />
          </motion.div>
        </section>

        <Showcase />

        <section id="pricing" className="section">
          <div className="container">
            <Reveal><h2 className="h2">Pricing that stays simple</h2><p className="lede">Start on Free. Move to Premium when you want unlimited writing and the image tools.</p></Reveal>
            <Reveal delay={0.1} className="plans">
              <Plan name="Free" price="₹0" note="forever" items={[`${FREE_LIMIT} generations per month`, 'Article writer and title generator', 'Resume analyzer', 'Full creation history']}
                cta={<><SignedOut><Link to="/sign-up" className="btn ghost block">Create free account</Link></SignedOut><SignedIn><Link to="/app" className="btn ghost block">Open workspace</Link></SignedIn></>} />
              <Plan featured name="Premium" price={PRICE} note="per month" items={['Unlimited generations', 'Image generator', 'Background remover', 'Object remover', 'Everything in Free']}
                cta={<><SignedOut><Link to="/sign-up" className="btn primary block">Get Premium</Link></SignedOut><SignedIn><Link to="/app/billing" className="btn primary block">Upgrade in billing</Link></SignedIn></>} />
            </Reveal>
          </div>
        </section>

        <section id="reviews" className="section">
          <div className="container">
            <Reveal><h2 className="h2">What people use it for</h2></Reveal>
            <div className="reviews">
              {REVIEWS.map((r, i) => (
                <Reveal key={r.n} delay={i * 0.1}>
                  <motion.figure className="review glass" whileHover={{ y: -5, rotate: i === 1 ? 0.4 : -0.4 }}>
                    <Quote size={22} className="q" /><blockquote>{r.q}</blockquote>
                    <figcaption><strong>{r.n}</strong><span className="muted small">{r.r}</span></figcaption>
                  </motion.figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <Reveal className="container cta glass">
            <h2 className="h2">Your first ten generations are on us</h2>
            <p className="lede">Create an account, open a tool and have a result in under a minute.</p>
            <SignedOut><Link to="/sign-up" className="btn primary lg">Create free account <ArrowRight size={18} /></Link></SignedOut>
            <SignedIn><Link to="/app" className="btn primary lg">Open workspace <ArrowRight size={18} /></Link></SignedIn>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
