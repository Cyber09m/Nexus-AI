import { Eraser, FileSearch, FileText, Hash, Image as ImageIcon, Scissors } from 'lucide-react';

export const TOOLS = [
  { id: 'article', path: 'article', label: 'Article writer', blurb: 'Turn a topic into a structured, ready-to-edit article.', short: 'Long-form drafts from a single topic', icon: FileText, premium: false },
  { id: 'titles', path: 'titles', label: 'Title generator', blurb: 'Get eight headline options for any keyword.', short: 'Headlines that earn the click', icon: Hash, premium: false },
  { id: 'resume', path: 'resume', label: 'Resume analyzer', blurb: 'Upload a PDF resume for a score, strengths, gaps and rewrites.', short: 'Score, gaps and rewrite advice', icon: FileSearch, premium: false },
  { id: 'image', path: 'image', label: 'Image generator', blurb: 'Describe a scene and pick a style to generate artwork.', short: 'Text-to-image in seven styles', icon: ImageIcon, premium: true },
  { id: 'background', path: 'background', label: 'Background remover', blurb: 'Cut the subject out of any photo with a transparent background.', short: 'Transparent PNG cutouts', icon: Eraser, premium: true },
  { id: 'object', path: 'object', label: 'Object remover', blurb: 'Name something in your photo and it disappears.', short: 'Erase objects by name', icon: Scissors, premium: true },
];

export const TYPE_LABEL = {
  article: 'Article', titles: 'Titles', image: 'Image', background: 'Background removal', object: 'Object removal', resume: 'Resume review',
};
export const toolFor = (type) => TOOLS.find((t) => t.id === type);

export const timeAgo = (iso) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const steps = [[86400, 'd'], [3600, 'h'], [60, 'm']];
  for (const [n, u] of steps) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return 'just now';
};
