import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';

const LINKS = [['Tools', '#tools'], ['Pricing', '#pricing'], ['Reviews', '#reviews']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const cta = (
    <>
      <SignedOut>
        <Link to="/sign-in" className="btn ghost sm">Sign in</Link>
        <Link to="/sign-up" className="btn primary sm">Start free</Link>
      </SignedOut>
      <SignedIn><Link to="/app" className="btn primary sm">Open workspace</Link></SignedIn>
    </>
  );

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-in">
        <Logo />
        <nav className="nav-links" aria-label="Primary">{LINKS.map(([l, h]) => <a key={h} href={h}>{l}</a>)}</nav>
        <div className="nav-cta">{cta}</div>
        <button className="icon-btn nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="nav-sheet glass" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
            <div className="row">{cta}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
