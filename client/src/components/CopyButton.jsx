import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CopyButton({ text, label = 'Copy', className = 'btn ghost sm' }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true); setTimeout(() => setDone(false), 1600);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };
  return (
    <button type="button" className={className} onClick={copy}>
      {done ? <Check size={15} /> : <Copy size={15} />}{done ? 'Copied' : label}
    </button>
  );
}
