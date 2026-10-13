import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, HttpError } from '../errors.js';
import { guard } from '../middleware/usage.js';
import { imageUpload, pdfUpload } from '../middleware/upload.js';
import { createCreation } from '../models/creations.js';
import { analyzeResume, generateTitles, writeArticle } from '../services/writing.js';
import { extractPdfText } from '../services/pdf.js';
import * as clipdrop from '../services/clipdrop.js';
import * as storage from '../services/cloudinary.js';

const router = Router();

const parse = (schema, body) => {
  const r = schema.safeParse(body ?? {});
  if (!r.success) throw new HttpError(400, r.error.issues[0].message, 'VALIDATION');
  return r.data;
};
const needFile = (req, label) => {
  if (!req.file) throw new HttpError(400, `Attach ${label} to continue.`, 'VALIDATION');
  return req.file;
};
const save = (req, fields) => createCreation({ userId: req.userId, ...fields });

const articleSchema = z.object({
  topic: z.string().trim().min(5, 'Describe your topic in at least 5 characters.').max(500, 'Keep the topic under 500 characters.'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  tone: z.enum(['professional', 'conversational', 'persuasive', 'witty', 'academic']).default('professional'),
});
router.post('/article', guard('article'), asyncHandler(async (req, res) => {
  const { topic, length, tone } = parse(articleSchema, req.body);
  const content = await writeArticle({ topic, length, tone });
  const creation = await save(req, { type: 'article', prompt: topic, content, meta: { length, tone } });
  res.json({ success: true, content, creation });
}));

const CATEGORIES = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'];
const titlesSchema = z.object({
  keyword: z.string().trim().min(2, 'Enter a keyword or topic.').max(120, 'Keep the keyword under 120 characters.'),
  category: z.enum(CATEGORIES).default('General'),
});
router.post('/titles', guard('titles'), asyncHandler(async (req, res) => {
  const { keyword, category } = parse(titlesSchema, req.body);
  const titles = await generateTitles({ keyword, category });
  const creation = await save(req, { type: 'titles', prompt: keyword, content: titles.join('\n'), meta: { category } });
  res.json({ success: true, titles, creation });
}));

const imageSchema = z.object({
  prompt: z.string().trim().min(5, 'Describe the image in at least 5 characters.').max(700, 'Keep the description under 700 characters.'),
  style: z.enum(['Realistic', 'Ghibli', 'Anime', 'Cartoon', 'Fantasy', '3D', 'Portrait']).default('Realistic'),
});
const STYLE_HINT = {
  Realistic: 'photorealistic, natural lighting, high detail',
  Ghibli: 'Studio Ghibli inspired, hand-painted watercolor, soft light',
  Anime: 'anime illustration, clean line art, vibrant colors',
  Cartoon: 'playful cartoon illustration, bold outlines',
  Fantasy: 'epic fantasy concept art, dramatic lighting',
  '3D': 'stylized 3D render, soft studio lighting',
  Portrait: 'professional portrait photography, shallow depth of field',
};
router.post('/image', guard('image'), asyncHandler(async (req, res) => {
  const { prompt, style } = parse(imageSchema, req.body);
  const png = await clipdrop.textToImage(`${prompt}. Style: ${STYLE_HINT[style]}`.slice(0, 1000));
  const { secure_url } = await storage.uploadImage(png);
  const creation = await save(req, { type: 'image', prompt, content: secure_url, meta: { style } });
  res.json({ success: true, content: secure_url, creation });
}));

router.post('/remove-background', guard('background'), imageUpload.single('image'), asyncHandler(async (req, res) => {
  const file = needFile(req, 'an image');
  const png = await clipdrop.removeBackground(file.buffer, file.mimetype);
  const { secure_url } = await storage.uploadImage(png);
  const creation = await save(req, { type: 'background', prompt: file.originalname, content: secure_url });
  res.json({ success: true, content: secure_url, creation });
}));

const objectSchema = z.object({
  object: z.string().trim().min(2, 'Name the object to remove.').max(60, 'Use a short name, up to 60 characters.')
    .transform((s) => s.replace(/[^\p{L}\p{N} ]/gu, '').trim())
    .refine((s) => s.length >= 2, 'Use letters and numbers only for the object name.'),
});
router.post('/remove-object', guard('object'), imageUpload.single('image'), asyncHandler(async (req, res) => {
  const { object } = parse(objectSchema, req.body);
  const file = needFile(req, 'an image');
  const { public_id } = await storage.uploadImage(file.buffer);
  const url = await storage.removeObject(public_id, object);
  const creation = await save(req, { type: 'object', prompt: `Removed: ${object}`, content: url, meta: { object, file: file.originalname } });
  res.json({ success: true, content: url, creation });
}));

const resumeSchema = z.object({ role: z.string().trim().max(100, 'Keep the target role under 100 characters.').optional() });
router.post('/resume', guard('resume'), pdfUpload.single('resume'), asyncHandler(async (req, res) => {
  const { role } = parse(resumeSchema, req.body);
  const file = needFile(req, 'your resume as a PDF');
  const text = await extractPdfText(file.buffer);
  const analysis = await analyzeResume({ text, role });
  const creation = await save(req, { type: 'resume', prompt: role ? `${file.originalname} → ${role}` : file.originalname, content: JSON.stringify(analysis), meta: { role: role || null } });
  res.json({ success: true, analysis, creation });
}));

export default router;
