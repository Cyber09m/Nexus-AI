import { useState } from 'react';
import { Download, Scissors } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import ResultPane from '../components/ResultPane.jsx';
import FileDrop from '../components/FileDrop.jsx';
import { useGenerate } from '../lib/useGenerate.js';
import { useLocked } from '../lib/me.jsx';
import { downloadUrl } from '../lib/api.js';
import { TOOLS } from '../lib/tools.js';

const TOOL = TOOLS.find((t) => t.id === 'object');

export default function RemoveObject() {
  const locked = useLocked(TOOL);
  const gen = useGenerate('/ai/remove-object');
  const [file, setFile] = useState(null);
  const [object, setObject] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('object', object);
    fd.append('image', file); // text fields first so the server can validate before reading the file
    gen.run(fd);
  };

  const form = (
    <form onSubmit={submit}>
      <p className="label">Photo</p>
      <FileDrop accept="image/png,image/jpeg,image/webp" file={file} onFile={setFile} hint="PNG, JPG or WebP" disabled={locked} />
      <label className="label" htmlFor="obj">Object to remove</label>
      <input id="obj" className="input" required minLength={2} maxLength={60} value={object} onChange={(e) => setObject(e.target.value)} placeholder="Red car, lamp post, person in the background" />
      <p className="muted small">Use one object name. Describe it as you would to a friend.</p>
      <button className="btn primary block" disabled={!file || gen.loading || locked}><Scissors size={17} /> {gen.loading ? 'Removing…' : 'Remove object'}</button>
    </form>
  );

  return (
    <ToolShell tool={TOOL} locked={locked} form={form} result={
      <ResultPane {...gen} emptyIcon={Scissors} emptyText="Your edited photo will appear here." loadingText="Erasing the object. This can take up to 30 seconds." skeleton={<div className="skel square" />}>
        {gen.data && (
          <>
            <img className="out-img" src={gen.data.content} alt={`Photo with ${object} removed`} />
            <div className="result-actions"><a className="btn ghost sm" href={downloadUrl(gen.data.content)}><Download size={15} /> Download</a></div>
          </>
        )}
      </ResultPane>
    } />
  );
}
