import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ToolShell({ tool, locked, form, result }) {
  const Icon = tool.icon;
  return (
    <div className="tool">
      <header className="tool-head">
        <div className="tool-ico"><Icon size={22} /></div>
        <div>
          <h1>{tool.label}</h1>
          <p className="muted">{tool.blurb}</p>
        </div>
        {tool.premium && <span className="badge premium"><Crown size={13} /> Premium</span>}
      </header>
      {locked && (
        <Link to="/app/billing" className="lock-banner">
          <Lock size={16} /> This tool is on the Premium plan. <strong>Upgrade to unlock it</strong>
        </Link>
      )}
      <div className="tool-grid">
        <section className="glass panel">{form}</section>
        <section className="glass panel result" aria-live="polite">{result}</section>
      </div>
    </div>
  );
}
