import { config } from '../config.js';
import { HttpError, missingKey } from '../errors.js';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Thin wrapper around Gemini's generateContent. Returns plain text. */
export async function generate({ prompt, system, temperature = 0.8, maxTokens = 4096, json = false }) {
  const { apiKey, model } = config.gemini;
  if (!apiKey) throw missingKey('GEMINI_API_KEY', 'Text generation');

  const generationConfig = { temperature, maxOutputTokens: maxTokens };
  if (json) generationConfig.responseMimeType = 'application/json';
  if (model.includes('2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 }; // keep tokens for the answer

  let res;
  try {
    res = await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        ...(system && { systemInstruction: { parts: [{ text: system }] } }),
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      }),
      signal: AbortSignal.timeout(55_000),
    });
  } catch (e) {
    throw new HttpError(504, 'The AI provider took too long to respond. Please try again.', 'UPSTREAM_TIMEOUT');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.error?.message || res.statusText;
    if (res.status === 429) throw new HttpError(429, 'The AI provider is rate-limiting requests. Wait a moment and retry.', 'UPSTREAM_RATE_LIMIT');
    if (res.status === 400 && /api key/i.test(detail)) throw new HttpError(502, 'The Gemini API key is invalid. Check GEMINI_API_KEY on the server.', 'UPSTREAM_AUTH');
    if (res.status === 403) throw new HttpError(502, 'The Gemini API key was rejected or lacks access to this model.', 'UPSTREAM_AUTH');
    throw new HttpError(502, `The AI provider returned an error: ${detail}`, 'UPSTREAM_ERROR');
  }

  const data = await res.json();
  const cand = data.candidates?.[0];
  const text = cand?.content?.parts?.map((p) => p.text || '').join('').trim();
  if (!text) {
    const reason = data.promptFeedback?.blockReason || cand?.finishReason;
    throw new HttpError(422, `The AI returned no content${reason ? ` (${reason})` : ''}. Try rephrasing your request.`, 'EMPTY_RESPONSE');
  }
  return text;
}

export function parseJson(text) {
  try {
    return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ''));
  } catch {
    throw new HttpError(502, 'The AI returned a malformed response. Please try again.', 'BAD_AI_OUTPUT');
  }
}
