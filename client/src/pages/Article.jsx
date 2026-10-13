import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, FileText, Sparkles } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import ResultPane from '../components/ResultPane.jsx';
import CopyButton from '../components/CopyButton.jsx';
import { useGenerate } from '../lib/useGenerate.js';
import { useLocked } from '../lib/me.jsx';
import { TOOLS } from '../lib/tools.js';

const TOOL = TOOLS.find((t) => t.id === 'article');
const LENGTHS = [['short', 'Short · ~500 words'], ['medium', 'Medium · ~900 words'], ['long', 'Long · ~1500 words']];
const TONES = ['professional', 'conversational', 'persuasive', 'witty', 'academic'];

export function downloadText(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click(); URL.revokeObjectURL(url);
}

export default function Article() {
  const locked = useLocked(TOOL);
  const gen = useGenerate('/ai/article');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('professional');

  const form = (
    <form onSubmit={(e) => { e.preventDefault(); gen.run({ topic, length, tone }); }}>
      <label className="label" htmlFor="topic">Topic</label>
      <textarea id="topic" className="input" rows={4} maxLength={500} required minLength={5} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="The future of remote work, and what it means for small teams" />
      <p className="label">Length</p>
      <div className="chips" role="radiogroup" aria-label="Article length">
        {LENGTHS.map(([v, l]) => <button type="button" role="radio" aria-checked={length === v} key={v} className={`chip ${length === v ? 'on' : ''}`} onClick={() => setLength(v)}>{l}</button>)}
      </div>
      <p className="label">Tone</p>
      <div className="chips" role="radiogroup" aria-label="Tone">
        {TONES.map((v) => <button type="button" role="radio" aria-checked={tone === v} key={v} className={`chip cap ${tone === v ? 'on' : ''}`} onClick={() => setTone(v)}>{v}</button>)}
      </div>
      <button className="btn primary block" disabled={gen.loading || locked}><Sparkles size={17} /> {gen.loading ? 'Writing…' : 'Write article'}</button>
    </form>
  );

  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'article';
  return (
    <ToolShell tool={TOOL} locked={locked} form={form} result={
      <ResultPane {...gen} emptyIcon={FileText} emptyText="Your article will appear here." loadingText="Writing your article. Longer pieces can take up to 30 seconds.">
        {gen.data && (
          <>
            <div className="result-actions"><CopyButton text={gen.data.content} /><button className="btn ghost sm" onClick={() => downloadText(`${slug}.md`, gen.data.content)}><Download size={15} /> Download .md</button></div>
            <article className="prose"><ReactMarkdown>{gen.data.content}</ReactMarkdown></article>
          </>
        )}
      </ResultPane>
    } />
  );
}
