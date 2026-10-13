import { getAuth } from '@clerk/express';
import { config } from '../config.js';
import { HttpError } from '../errors.js';

/** Rejects unauthenticated calls with JSON (instead of a redirect) and attaches plan info. */
export function requireUser(req, _res, next) {
  const auth = getAuth(req);
  if (!auth?.userId) return next(new HttpError(401, 'Please sign in to continue.', 'UNAUTHENTICATED'));
  req.userId = auth.userId;
  req.isAdmin = config.adminIds.includes(auth.userId);
  req.isPremium = req.isAdmin || Boolean(auth.has?.({ plan: config.premiumPlan }));
  next();
}
