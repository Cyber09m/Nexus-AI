import { useState } from 'react';
import { Download, Eraser } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import ResultPane from '../components/ResultPane.jsx';
import FileDrop from '../components/FileDrop.jsx';
import { useGenerate } from '../lib/useGenerate.js';
import { useLocked } from '../lib/me.jsx';
import { downloadUrl } from '../lib/api.js';
import { TOOLS } from '../lib/tools.js';

const TOOL = TOOLS.find((t) => t.id === 'background');

export default function Background() {
  const locked = useLocked(TOOL);
  const gen = useGenerate('/ai/remove-background');
  const [file, setFile] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('image', file);
    gen.run(fd);
  };

  const form = (
    <form onSubmit={submit}>
      <p className="label">Photo</p>
      <FileDrop accept="image/png,image/jpeg,image/webp" file={file} onFile={setFile} hint="PNG, JPG or WebP" disabled={locked} />
      <button className="btn primary block" disabled={!file || gen.loading || locked}><Eraser size={17} /> {gen.loading ? 'Removing…' : 'Remove background'}</button>
    </form>
  );

  return (
    <ToolShell tool={TOOL} locked={locked} form={form} result={
      <ResultPane {...gen} emptyIcon={Eraser} emptyText="Your cutout will appear here." loadingText="Cutting out the subject…" skeleton={<div className="skel square" />}>
        {gen.data && (
          <>
            <div className="checker"><img className="out-img" src={gen.data.content} alt="Image with background removed" /></div>
            <div className="result-actions"><a className="btn ghost sm" href={downloadUrl(gen.data.content)}><Download size={15} /> Download PNG</a></div>
          </>
        )}
      </ResultPane>
    } />
  );
}
