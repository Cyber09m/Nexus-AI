import { useState } from 'react';
import { Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import ResultPane from '../components/ResultPane.jsx';
import { useGenerate } from '../lib/useGenerate.js';
import { useLocked } from '../lib/me.jsx';
import { downloadUrl } from '../lib/api.js';
import { TOOLS } from '../lib/tools.js';

const TOOL = TOOLS.find((t) => t.id === 'image');
const STYLES = ['Realistic', 'Ghibli', 'Anime', 'Cartoon', 'Fantasy', '3D', 'Portrait'];

export default function Images() {
  const locked = useLocked(TOOL);
  const gen = useGenerate('/ai/image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic');

  const form = (
    <form onSubmit={(e) => { e.preventDefault(); gen.run({ prompt, style }); }}>
      <label className="label" htmlFor="ip">Describe your image</label>
      <textarea id="ip" className="input" rows={4} required minLength={5} maxLength={700} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A lighthouse on a cliff at dusk, waves crashing, warm light in the windows" />
      <p className="label">Style</p>
      <div className="chips" role="radiogroup" aria-label="Style">
        {STYLES.map((s) => <button type="button" role="radio" aria-checked={style === s} key={s} className={`chip ${style === s ? 'on' : ''}`} onClick={() => setStyle(s)}>{s}</button>)}
      </div>
      <button className="btn primary block" disabled={gen.loading || locked}><Sparkles size={17} /> {gen.loading ? 'Generating…' : 'Generate image'}</button>
    </form>
  );

  return (
    <ToolShell tool={TOOL} locked={locked} form={form} result={
      <ResultPane {...gen} emptyIcon={ImageIcon} emptyText="Your image will appear here." loadingText="Painting your image. This usually takes 10 to 20 seconds." skeleton={<div className="skel square" />}>
        {gen.data && (
          <>
            <img className="out-img" src={gen.data.content} alt={`Generated image: ${prompt}`} />
            <div className="result-actions"><a className="btn ghost sm" href={downloadUrl(gen.data.content)}><Download size={15} /> Download</a></div>
          </>
        )}
      </ResultPane>
    } />
  );
}
