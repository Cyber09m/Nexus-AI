import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Search, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadUrl, errorMessage, useApi } from '../lib/api.js';
import { TOOLS, TYPE_LABEL, timeAgo, toolFor } from '../lib/tools.js';
import CopyButton from '../components/CopyButton.jsx';
import ResumeReport from '../components/ResumeReport.jsx';

const PAGE = 12;
const isImg = (t) => ['image', 'background', 'object'].includes(t);

function Detail({ c, onClose, onDelete }) {
  let body;
  if (c.type === 'article') body = <article className="prose"><ReactMarkdown>{c.content}</ReactMarkdown></article>;
  else if (c.type === 'titles') body = <ul className="titles">{c.content.split('\n').map((t) => <li key={t}><span>{t}</span><CopyButton text={t} label="" className="icon-btn" /></li>)}</ul>;
  else if (c.type === 'resume') { try { body = <ResumeReport a={JSON.parse(c.content)} />; } catch { body = <p className="muted">This report can't be displayed.</p>; } }
  else body = <div className={c.type === 'background' ? 'checker' : ''}><img className="out-img" src={c.content} alt={c.prompt} /></div>;

  return (
    <motion.div className="modal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal glass" role="dialog" aria-modal="true" aria-label={c.prompt} initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        <div className="between">
          <div><span className="badge">{TYPE_LABEL[c.type]}</span><h2 className="h3 trunc-2">{c.prompt}</h2></div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="result-actions">
          {(c.type === 'article') && <CopyButton text={c.content} />}
          {isImg(c.type) && <a className="btn ghost sm" href={downloadUrl(c.content)}><Download size={15} /> Download</a>}
          <button className="btn danger sm" onClick={() => onDelete(c)}><Trash2 size={15} /> Delete</button>
        </div>
        <div className="modal-body">{body}</div>
      </motion.div>
    </motion.div>
  );
}

export default function History() {
  const api = useApi();
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => { const t = setTimeout(() => setQuery(q), 350); return () => clearTimeout(t); }, [q]);

  const load = useCallback(async (offset = 0) => {
    setBusy(true); setError(null);
    try {
      const { data } = await api.get('/user/creations', { params: { limit: PAGE, offset, ...(type && { type }), ...(query && { q: query }) } });
      setItems((prev) => (offset ? [...prev, ...data.creations] : data.creations));
      setTotal(data.total);
    } catch (e) { setError(errorMessage(e)); setItems((p) => p || []); }
    setBusy(false);
  }, [api, type, query]);

  useEffect(() => { setItems(null); load(0); }, [load]);

  const remove = async (c) => {
    if (!window.confirm('Delete this creation? This cannot be undone.')) return;
    try {
      await api.delete(`/user/creations/${c.id}`);
      setItems((p) => p.filter((x) => x.id !== c.id)); setTotal((t) => t - 1); setOpen(null);
      toast.success('Deleted');
    } catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <div>
      <header className="page-head"><h1>History</h1><p className="muted">Everything you've generated, newest first.</p></header>
      <div className="filters">
        <div className="search"><Search size={16} /><input className="input" aria-label="Search history" placeholder="Search by prompt or file name" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="chips">
          <button className={`chip ${type === '' ? 'on' : ''}`} onClick={() => setType('')}>All</button>
          {TOOLS.map((t) => <button key={t.id} className={`chip ${type === t.id ? 'on' : ''}`} onClick={() => setType(t.id)}>{TYPE_LABEL[t.id]}</button>)}
        </div>
      </div>
      {error && <div className="banner-err" role="alert">{error} <button className="link" onClick={() => load(0)}>Retry</button></div>}
      {!items ? (
        <div className="hist-grid">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skel card" />)}</div>
      ) : items.length === 0 ? (
        <div className="empty glass"><p>{query || type ? 'No creations match those filters.' : "You haven't created anything yet."}</p></div>
      ) : (
        <>
          <div className="hist-grid">
            {items.map((c) => { const T = toolFor(c.type); return (
              <motion.button layout key={c.id} className="hist-card glass" onClick={() => setOpen(c)} whileHover={{ y: -4 }}>
                {isImg(c.type) ? <img src={c.content} alt="" loading="lazy" className={c.type === 'background' ? 'checker-bg' : ''} /> : <div className="hist-ico"><T.icon size={26} /></div>}
                <span className="badge">{TYPE_LABEL[c.type]}</span>
                <strong className="trunc-2">{c.prompt}</strong>
                <span className="muted small">{timeAgo(c.created_at)}</span>
              </motion.button>); })}
          </div>
          {items.length < total && <div className="center-row"><button className="btn ghost" disabled={busy} onClick={() => load(items.length)}>{busy ? 'Loading…' : `Load more (${total - items.length} left)`}</button></div>}
        </>
      )}
      <AnimatePresence>{open && <Detail c={open} onClose={() => setOpen(null)} onDelete={remove} />}</AnimatePresence>
    </div>
  );
}
