import { motion } from 'framer-motion';
import { AlertTriangle, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResultPane({ loading, error, code, data, emptyIcon: Icon = Sparkles, emptyText, loadingText = 'Working on it…', skeleton, children }) {
  if (loading) {
    return (
      <div className="result-state" role="status" aria-live="polite">
        <p className="muted small">{loadingText}</p>
        {skeleton || (<><div className="skel h2" /><div className="skel" /><div className="skel" /><div className="skel w70" /><div className="skel" /><div className="skel w50" /></>)}
      </div>
    );
  }
  if (error) {
    const upsell = code === 'PREMIUM_REQUIRED' || code === 'LIMIT_REACHED';
    return (
      <div className="result-state center" role="alert">
        <AlertTriangle className="err-ico" />
        <p className="err-text">{error}</p>
        {upsell && <Link to="/app/billing" className="btn primary sm"><Crown size={15} /> See plans</Link>}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="result-state center muted">
        <Icon size={34} strokeWidth={1.4} />
        <p>{emptyText}</p>
      </div>
    );
  }
  return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>{children}</motion.div>;
}
