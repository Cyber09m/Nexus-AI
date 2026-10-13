import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Sparkles } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import ResultPane from '../components/ResultPane.jsx';
import CopyButton from '../components/CopyButton.jsx';
import { useGenerate } from '../lib/useGenerate.js';
import { useLocked } from '../lib/me.jsx';
import { TOOLS } from '../lib/tools.js';

const TOOL = TOOLS.find((t) => t.id === 'titles');
const CATEGORIES = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'];

export default function Titles() {
  const locked = useLocked(TOOL);
  const gen = useGenerate('/ai/titles');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('General');

  const form = (
    <form onSubmit={(e) => { e.preventDefault(); gen.run({ keyword, category }); }}>
      <label className="label" htmlFor="kw">Keyword or topic</label>
      <input id="kw" className="input" required minLength={2} maxLength={120} value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Remote team onboarding" />
      <p className="label">Category</p>
      <div className="chips" role="radiogroup" aria-label="Category">
        {CATEGORIES.map((c) => <button type="button" role="radio" aria-checked={category === c} key={c} className={`chip ${category === c ? 'on' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}
      </div>
      <button className="btn primary block" disabled={gen.loading || locked}><Sparkles size={17} /> {gen.loading ? 'Generating…' : 'Generate titles'}</button>
    </form>
  );

  return (
    <ToolShell tool={TOOL} locked={locked} form={form} result={
      <ResultPane {...gen} emptyIcon={Hash} emptyText="Your titles will appear here." loadingText="Brainstorming headlines…">
        {gen.data && (
          <ul className="titles">
            {gen.data.titles.map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <span>{t}</span><CopyButton text={t} label="" className="icon-btn" />
              </motion.li>
            ))}
          </ul>
        )}
      </ResultPane>
    } />
  );
}
