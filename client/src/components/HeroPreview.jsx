import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

const PROMPT = 'Write a short article on remote-first onboarding';
const OUTPUT = [
  '# Remote onboarding that sticks',
  'The first week sets the tone. Skip the pile of documents and give every new hire three things: a buddy, one small real task, and a calendar that is mostly empty.',
  '## Make the first win small',
  'A merged pull request or a published page on day two beats any slide deck about culture.',
];

function useTyped(text, active, speed = 22) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return text.slice(0, n);
}

export default function HeroPreview() {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState('prompt'); // prompt -> output -> hold
  const prompt = useTyped(PROMPT, phase === 'prompt', 28);
  const body = useTyped(OUTPUT.join('\n'), phase === 'output', 14);

  useEffect(() => {
    if (phase === 'prompt' && prompt.length === PROMPT.length) { const t = setTimeout(() => setPhase('output'), 450); return () => clearTimeout(t); }
    if (phase === 'output' && body.length === OUTPUT.join('\n').length) { const t = setTimeout(() => setPhase('hold'), 600); return () => clearTimeout(t); }
    if (phase === 'hold') { const t = setTimeout(() => { setPhase('prompt'); setCycle((c) => c + 1); }, 4200); return () => clearTimeout(t); }
  }, [phase, prompt, body]);

  return (
    <div className="hp" aria-label="Animated preview of the article writer">
      <div className="hp-win glass">
        <div className="hp-bar"><i /><i /><i /><span>Article writer · sample output</span></div>
        <div className="hp-prompt"><Sparkles size={15} /><span>{prompt}</span>{phase === 'prompt' && <b className="caret" />}</div>
        <div className="hp-out" key={cycle}>
          {body.split('\n').map((line, i) =>
            line.startsWith('# ') ? <h4 key={i}>{line.slice(2)}</h4>
              : line.startsWith('## ') ? <h5 key={i}>{line.slice(3)}</h5>
              : <p key={i}>{line}</p>)}
          {phase === 'output' && <b className="caret" />}
        </div>
      </div>
      <motion.div className="hp-float f1 glass" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="mini-img" /><span><ImageIcon size={14} /> Image ready</span>
      </motion.div>
      <motion.div className="hp-float f2 glass" animate={{ y: [0, 9, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <strong>82</strong><span>Resume score</span>
      </motion.div>
    </div>
  );
}
