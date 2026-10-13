import { motion } from 'framer-motion';
import { Infinity as Inf } from 'lucide-react';
import { useMe } from '../lib/me.jsx';

export default function UsageMeter({ compact = false }) {
  const { me } = useMe();
  if (!me) return <div className="skel" style={{ height: compact ? 34 : 64 }} />;
  const reset = new Date(me.resetsOn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (me.premium) {
    return <div className="meter"><div className="meter-top"><span>Generations this month</span><strong><Inf size={15} /> Unlimited</strong></div>{!compact && <p className="muted small">{me.used} used so far</p>}</div>;
  }
  const pct = Math.min(100, (me.used / me.limit) * 100);
  return (
    <div className="meter">
      <div className="meter-top"><span>Free generations</span><strong>{me.used} / {me.limit}</strong></div>
      <div className="bar" role="progressbar" aria-valuenow={me.used} aria-valuemin={0} aria-valuemax={me.limit}>
        <motion.i initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={pct >= 90 ? 'hot' : ''} />
      </div>
      {!compact && <p className="muted small">Resets on {reset}</p>}
    </div>
  );
}
