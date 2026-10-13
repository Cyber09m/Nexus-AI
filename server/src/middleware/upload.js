import multer from 'multer';
import { config } from '../config.js';
import { HttpError } from '../errors.js';

const make = (allowed, label) =>
  multer({
    storage: multer.memoryStorage(), // serverless-safe: nothing touches disk
    limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) =>
      allowed.includes(file.mimetype) ? cb(null, true) : cb(new HttpError(400, `Unsupported file type. Upload ${label}.`, 'VALIDATION')),
  });

export const imageUpload = make(['image/png', 'image/jpeg', 'image/webp'], 'a PNG, JPG or WebP image');
export const pdfUpload = make(['application/pdf'], 'a PDF file');
