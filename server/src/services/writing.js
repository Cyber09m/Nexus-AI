import { generate, parseJson } from './gemini.js';

const WORDS = { short: 500, medium: 900, long: 1500 };

export function writeArticle({ topic, length, tone }) {
  return generate({
    system: 'You are a senior editorial writer. Write original, accurate, well-structured articles in Markdown. Never invent statistics, quotes or sources.',
    prompt: `Write an article about: ${topic}\n\nTarget length: about ${WORDS[length]} words.\nTone: ${tone}.\nFormat: one H1 title, a short intro, H2 sections with useful detail, and a brief conclusion. Output Markdown only.`,
    maxTokens: Math.ceil(WORDS[length] * 2.2) + 400,
  });
}

export async function generateTitles({ keyword, category }) {
  const text = await generate({
    json: true,
    temperature: 0.95,
    prompt: `Create 8 distinct, click-worthy blog post titles for the keyword "${keyword}" in the category "${category}". Mix formats (how-to, list, question, contrarian). Keep each under 80 characters. Respond with JSON only: {"titles": ["..."]}`,
    maxTokens: 800,
  });
  const titles = parseJson(text).titles;
  if (!Array.isArray(titles) || !titles.length) return parseJson('{'); // forces BAD_AI_OUTPUT
  return titles.map(String).slice(0, 10);
}

export async function analyzeResume({ text, role }) {
  const out = await generate({
    json: true,
    temperature: 0.4,
    maxTokens: 3000,
    system: 'You are an experienced technical recruiter and resume coach. Be specific, honest and constructive. Base every point only on the resume text provided.',
    prompt: `Review this resume${role ? ` for the target role "${role}"` : ''}.\n\nRESUME:\n"""\n${text.slice(0, 12000)}\n"""\n\nRespond with JSON only, in exactly this shape:\n{\n "score": <integer 0-100 overall quality${role ? ' and fit' : ''}>,\n "summary": "<2-3 sentence overall assessment>",\n "strengths": ["<3-5 specific strengths>"],\n "weaknesses": ["<3-5 specific weaknesses>"],\n "suggestions": [{"area": "<short area name>", "advice": "<concrete rewrite or action>"}],\n "keywords": {"present": ["<relevant keywords found>"], "missing": ["<important keywords to add>"]}\n}\nGive 4-6 suggestions.`,
  });
  const r = parseJson(out);
  const arr = (v) => (Array.isArray(v) ? v.map(String) : []);
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(r.score) || 0))),
    summary: String(r.summary || ''),
    strengths: arr(r.strengths),
    weaknesses: arr(r.weaknesses),
    suggestions: (Array.isArray(r.suggestions) ? r.suggestions : []).map((s) => ({ area: String(s.area || 'General'), advice: String(s.advice || '') })),
    keywords: { present: arr(r.keywords?.present), missing: arr(r.keywords?.missing) },
  };
}
