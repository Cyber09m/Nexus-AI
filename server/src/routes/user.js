import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { asyncHandler, HttpError } from '../errors.js';
import { PREMIUM_ONLY } from '../middleware/usage.js';
import { countThisMonth, deleteCreation, getStats, listCreations } from '../models/creations.js';

const router = Router();
router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

router.get('/me', asyncHandler(async (req, res) => {
  const used = await countThisMonth(req.userId);
  const now = new Date();
  res.json({
    success: true,
    premium: req.isPremium,
    used,
    limit: req.isPremium ? null : config.freeMonthlyLimit,
    resetsOn: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString(),
    premiumTools: [...PREMIUM_ONLY],
  });
}));

router.get('/stats', asyncHandler(async (req, res) => {
  res.json({ success: true, ...(await getStats(req.userId)) });
}));

const listSchema = z.object({
  type: z.enum(['article', 'titles', 'image', 'background', 'object', 'resume']).optional(),
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  offset: z.coerce.number().int().min(0).default(0),
});
router.get('/creations', asyncHandler(async (req, res) => {
  const p = listSchema.safeParse(req.query);
  if (!p.success) throw new HttpError(400, 'Invalid filter options.', 'VALIDATION');
  const { type, q, limit, offset } = p.data;
  const { rows, total } = await listCreations({ userId: req.userId, type: type ?? null, q: q || null, limit, offset });
  res.json({ success: true, creations: rows, total });
}));

router.delete('/creations/:id', asyncHandler(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) throw new HttpError(400, 'Invalid id.', 'VALIDATION');
  const ok = await deleteCreation({ userId: req.userId, id: req.params.id });
  if (!ok) throw new HttpError(404, 'That item no longer exists.', 'NOT_FOUND');
  res.json({ success: true });
}));

export default router;
