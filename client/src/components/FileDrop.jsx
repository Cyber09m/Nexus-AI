import { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FileDrop({ accept, file, onFile, hint, maxMb = 4, disabled }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const isImage = file?.type?.startsWith('image/');
  const preview = useMemo(() => (isImage ? URL.createObjectURL(file) : null), [file, isImage]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const accepted = accept.split(',').map((s) => s.trim());
  const take = (f) => {
    if (!f) return;
    if (!accepted.includes(f.type)) return toast.error('That file type isn\'t supported here.');
    if (f.size > maxMb * 1024 * 1024) return toast.error(`File is larger than ${maxMb} MB. Compress it and try again.`);
    onFile(f);
  };

  return (
    <div
      className={`drop ${over ? 'over' : ''} ${file ? 'has' : ''}`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) take(e.dataTransfer.files[0]); }}
    >
      <input ref={input} type="file" accept={accept} hidden onChange={(e) => { take(e.target.files[0]); e.target.value = ''; }} />
      {file ? (
        <div className="drop-file">
          {preview ? <img src={preview} alt="Selected upload preview" /> : <FileText size={34} strokeWidth={1.4} />}
          <div className="grow"><strong>{file.name}</strong><span className="muted small">{(file.size / 1024).toFixed(0)} KB</span></div>
          <button type="button" className="icon-btn" aria-label="Remove file" onClick={() => onFile(null)}><X size={16} /></button>
        </div>
      ) : (
        <button type="button" className="drop-empty" disabled={disabled} onClick={() => input.current.click()}>
          <UploadCloud size={30} strokeWidth={1.4} />
          <strong>Drop a file or click to browse</strong>
          <span className="muted small">{hint} · up to {maxMb} MB</span>
        </button>
      )}
    </div>
  );
}
