import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Crown } from 'lucide-react';
import { errorMessage, useApi } from '../lib/api.js';
import { useMe } from '../lib/me.jsx';
import { TOOLS, TYPE_LABEL, timeAgo, toolFor } from '../lib/tools.js';
import UsageMeter from '../components/UsageMeter.jsx';

function Activity({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.n));
  return (
    <div className="activity" role="img" aria-label="Generations over the last 14 days">
      {daily.map((d, i) => (
        <div key={d.day} className="act-col" title={`${d.day}: ${d.n}`}>
          <motion.i initial={{ height: 0 }} animate={{ height: `${Math.max(4, (d.n / max) * 100)}%` }} transition={{ delay: i * 0.03, duration: 0.5 }} className={d.n ? 'on' : ''} />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const api = useApi();
  const { user } = useUser();
  const { me } = useMe();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.get('/user/stats'), api.get('/user/creations', { params: { limit: 5 } })])
      .then(([s, c]) => { if (alive) { setStats(s.data); setRecent(c.data.creations); } })
      .catch((e) => alive && setError(errorMessage(e)));
    return () => { alive = false; };
  }, [api]);

  const top = stats && Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="dash">
      <header className="page-head">
        <h1>Welcome back{user?.firstName ? `, ${user.firstName}` : ''}</h1>
        <p className="muted">Pick up where you left off or start something new.</p>
      </header>

      <div className="stat-grid">
        <div className="glass stat"><span className="muted small">Total creations</span>{stats ? <strong>{stats.total}</strong> : <div className="skel h2" />}</div>
        <div className="glass stat"><span className="muted small">This month</span>{stats ? <strong>{stats.thisMonth}</strong> : <div className="skel h2" />}</div>
        <div className="glass stat"><span className="muted small">Most used tool</span>{stats ? <strong className="sm">{top ? TYPE_LABEL[top[0]] : 'None yet'}</strong> : <div className="skel h2" />}</div>
        <div className="glass stat"><UsageMeter /></div>
      </div>

      {error && <div className="banner-err" role="alert">{error}</div>}

      <div className="dash-grid">
        <section className="glass panel">
          <h2 className="h3">Last 14 days</h2>
          {stats ? <Activity daily={stats.daily} /> : <div className="skel" style={{ height: 120 }} />}
        </section>
        <section className="glass panel">
          <div className="between"><h2 className="h3">Recent creations</h2><Link to="/app/history" className="link">View all</Link></div>
          {!recent ? <><div className="skel" /><div className="skel" /><div className="skel w70" /></>
            : recent.length === 0 ? <p className="muted">Nothing here yet. Open a tool below and your results will show up here.</p>
            : <ul className="recent">{recent.map((c) => { const t = toolFor(c.type); return (
              <li key={c.id}><t.icon size={16} /><span className="grow trunc">{c.prompt}</span><span className="muted small">{timeAgo(c.created_at)}</span></li>); })}</ul>}
        </section>
      </div>

      <h2 className="h3 mt">Start something</h2>
      <div className="tool-cards">
        {TOOLS.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Link to={`/app/${t.path}`} className="tool-card glass">
              <div className="tool-ico"><t.icon size={20} /></div>
              <strong>{t.label}</strong>
              <span className="muted small">{t.short}</span>
              {t.premium && me && !me.premium && <span className="badge premium"><Crown size={12} /> Premium</span>}
              <ArrowUpRight className="go" size={18} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
