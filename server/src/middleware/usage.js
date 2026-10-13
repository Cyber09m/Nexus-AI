import { config } from '../config.js';
import { asyncHandler, HttpError } from '../errors.js';
import { countThisMonth } from '../models/creations.js';

export const PREMIUM_ONLY = new Set(['image', 'background', 'object']);

/** Enforces plan rules before any paid AI call is made. */
export const guard = (type) =>
  asyncHandler(async (req, _res, next) => {
    if (req.isPremium) return next();
    if (PREMIUM_ONLY.has(type)) {
      throw new HttpError(402, 'This tool is part of the Premium plan. Upgrade to unlock it.', 'PREMIUM_REQUIRED');
    }
    const used = await countThisMonth(req.userId);
    if (used >= config.freeMonthlyLimit) {
      throw new HttpError(402, `You've used all ${config.freeMonthlyLimit} free generations this month. Upgrade for unlimited use.`, 'LIMIT_REACHED');
    }
    next();
  });
