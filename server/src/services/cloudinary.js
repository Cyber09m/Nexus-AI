import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';
import { HttpError, missingKey } from '../errors.js';

function init() {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) throw missingKey('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET', 'Image storage');
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

export function uploadImage(buffer) {
  init();
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'nexus-ai', resource_type: 'image' }, (err, result) =>
        err ? reject(new HttpError(502, `Image storage upload failed: ${err.message}`, 'UPSTREAM_ERROR')) : resolve(result))
      .end(buffer);
  });
}

/** Builds a Cloudinary Generative Remove URL and confirms it renders (add-on must be enabled). */
export async function removeObject(publicId, object) {
  init();
  const url = cloudinary.url(publicId, {
    secure: true,
    resource_type: 'image',
    transformation: [{ effect: `gen_remove:prompt_${object}` }],
  });
  const res = await fetch(url, { signal: AbortSignal.timeout(55_000) }).catch(() => null);
  if (!res) throw new HttpError(504, 'Object removal took too long. Please try again.', 'UPSTREAM_TIMEOUT');
  if (!res.ok) {
    await res.body?.cancel();
    const why = res.headers.get('x-cld-error') || `status ${res.status}`;
    throw new HttpError(502, `Object removal failed (${why}). Make sure the Cloudinary "Generative AI Remove" add-on is enabled.`, 'UPSTREAM_ERROR');
  }
  await res.body?.cancel();
  return url;
}
