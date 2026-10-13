import { config } from '../config.js';
import { HttpError, missingKey } from '../errors.js';

async function call(path, form) {
  if (!config.clipdropKey) throw missingKey('CLIPDROP_API_KEY', 'Image generation');
  let res;
  try {
    res = await fetch(`https://clipdrop-api.co/${path}`, {
      method: 'POST',
      headers: { 'x-api-key': config.clipdropKey },
      body: form,
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    throw new HttpError(504, 'The image provider took too long to respond. Please try again.', 'UPSTREAM_TIMEOUT');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.error || res.statusText;
    if (res.status === 401 || res.status === 403) throw new HttpError(502, 'The ClipDrop API key is invalid. Check CLIPDROP_API_KEY on the server.', 'UPSTREAM_AUTH');
    if (res.status === 402) throw new HttpError(502, 'The ClipDrop account is out of credits. Top it up and try again.', 'UPSTREAM_QUOTA');
    if (res.status === 429) throw new HttpError(429, 'The image provider is rate-limiting requests. Wait a moment and retry.', 'UPSTREAM_RATE_LIMIT');
    if (res.status === 400) throw new HttpError(400, `The image provider rejected the request: ${detail}`, 'VALIDATION');
    throw new HttpError(502, `The image provider returned an error: ${detail}`, 'UPSTREAM_ERROR');
  }
  return Buffer.from(await res.arrayBuffer());
}

export function textToImage(prompt) {
  const form = new FormData();
  form.append('prompt', prompt);
  return call('text-to-image/v1', form);
}

export function removeBackground(buffer, mimetype) {
  const form = new FormData();
  form.append('image_file', new Blob([buffer], { type: mimetype }), 'image');
  return call('remove-background/v1', form);
}
