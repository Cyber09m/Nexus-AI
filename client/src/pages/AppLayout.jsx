import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, CreditCard, History, LayoutDashboard, Menu, UserCircle, X } from 'lucide-react';
import { MeProvider, useMe } from '../lib/me.jsx';
import { TOOLS } from '../lib/tools.js';
import Logo from '../components/Logo.jsx';
import UsageMeter from '../components/UsageMeter.jsx';

const item = ({ isActive }) => `side-link ${isActive ? 'on' : ''}`;

function Sidebar({ onNav }) {
  return (
    <>
      <div className="side-top"><Logo to="/app" /></div>
      <nav className="side-nav" onClick={onNav} aria-label="Workspace">
        <NavLink to="/app" end className={item}><LayoutDashboard size={18} /> Dashboard</NavLink>
        <p className="side-h">Tools</p>
        {TOOLS.map((t) => (
          <NavLink key={t.id} to={`/app/${t.path}`} className={item}>
            <t.icon size={18} /> {t.label}{t.premium && <Crown size={12} className="pro" />}
          </NavLink>
        ))}
        <p className="side-h">Account</p>
        <NavLink to="/app/history" className={item}><History size={18} /> History</NavLink>
        <NavLink to="/app/billing" className={item}><CreditCard size={18} /> Plan and billing</NavLink>
        <NavLink to="/app/account" className={item}><UserCircle size={18} /> Profile</NavLink>
      </nav>
      <div className="side-bottom"><UsageMeter compact /></div>
    </>
  );
}

function Shell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { me, error } = useMe();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="app">
      <div className="aurora dim" aria-hidden="true"><i /><i /></div>
      <aside className="side glass-flat"><Sidebar /></aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="side drawer" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
              <button className="icon-btn drawer-x" aria-label="Close menu" onClick={() => setOpen(false)}><X size={18} /></button>
              <Sidebar onNav={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="main">
        <header className="topbar">
          <button className="icon-btn burger" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div className="grow" />
          {me && <span className={`badge ${me.premium ? 'premium' : ''}`}>{me.premium ? <><Crown size={13} /> Premium</> : 'Free plan'}</span>}
          <UserButton />
        </header>
        {error && <div className="banner-err" role="alert">{error}</div>}
        <motion.main key={pathname} className="page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

export default function AppLayout() {
  return <MeProvider><Shell /></MeProvider>;
}
