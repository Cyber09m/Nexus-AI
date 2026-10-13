import { useState } from 'react';
import { FileSearch } from 'lucide-react';
import ToolShell from '../components/ToolShell.jsx';
import ResultPane from '../components/ResultPane.jsx';
import FileDrop from '../components/FileDrop.jsx';
import ResumeReport from '../components/ResumeReport.jsx';
import { useGenerate } from '../lib/useGenerate.js';
import { useLocked } from '../lib/me.jsx';
import { TOOLS } from '../lib/tools.js';

const TOOL = TOOLS.find((t) => t.id === 'resume');

export default function Resume() {
  const locked = useLocked(TOOL);
  const gen = useGenerate('/ai/resume');
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('role', role.trim());
    fd.append('resume', file);
    gen.run(fd);
  };

  const form = (
    <form onSubmit={submit}>
      <p className="label">Resume (PDF)</p>
      <FileDrop accept="application/pdf" file={file} onFile={setFile} hint="Text-based PDF" disabled={locked} />
      <label className="label" htmlFor="role">Target role <span className="muted">(optional)</span></label>
      <input id="role" className="input" maxLength={100} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Full-stack developer" />
      <button className="btn primary block" disabled={!file || gen.loading || locked}><FileSearch size={17} /> {gen.loading ? 'Analyzing…' : 'Analyze resume'}</button>
    </form>
  );

  return (
    <ToolShell tool={TOOL} locked={locked} form={form} result={
      <ResultPane {...gen} emptyIcon={FileSearch} emptyText="Your resume report will appear here." loadingText="Reading your resume…">
        {gen.data && <ResumeReport a={gen.data.analysis} />}
      </ResultPane>
    } />
  );
}
