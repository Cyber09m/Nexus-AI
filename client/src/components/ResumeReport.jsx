import { motion } from 'framer-motion';
import { CheckCircle2, TriangleAlert } from 'lucide-react';

function Ring({ score }) {
  const r = 46, c = 2 * Math.PI * r;
  const tone = score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171';
  return (
    <div className="ring" aria-label={`Score ${score} out of 100`}>
      <svg viewBox="0 0 110 110" width="120" height="120">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="9" />
        <motion.circle cx="55" cy="55" r={r} fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round" transform="rotate(-90 55 55)"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - score / 100) }} transition={{ duration: 1.1, ease: 'easeOut' }} />
      </svg>
      <div className="ring-n"><strong>{score}</strong><span>/ 100</span></div>
    </div>
  );
}

export default function ResumeReport({ a }) {
  return (
    <div className="report">
      <div className="report-top"><Ring score={a.score} /><p>{a.summary}</p></div>
      <div className="two">
        <div><h3 className="good"><CheckCircle2 size={16} /> Strengths</h3><ul>{a.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
        <div><h3 className="warn"><TriangleAlert size={16} /> Weaknesses</h3><ul>{a.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
      </div>
      <h3>Suggested improvements</h3>
      <div className="sugg">{a.suggestions.map((s, i) => <div key={i}><strong>{s.area}</strong><p>{s.advice}</p></div>)}</div>
      <h3>Keywords</h3>
      <div className="chips">
        {a.keywords.present.map((k) => <span key={k} className="chip on">{k}</span>)}
        {a.keywords.missing.map((k) => <span key={k} className="chip miss">+ {k}</span>)}
      </div>
    </div>
  );
}
