import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { clerkMiddleware } from '@clerk/express';
import { config, servicesStatus } from './config.js';
import { HttpError, missingKey } from './errors.js';
import { requireUser } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import aiRouter from './routes/ai.js';
import userRouter from './routes/user.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => (!origin || config.clientUrls.includes(origin) ? cb(null, true) : cb(new HttpError(403, 'Origin not allowed.'))),
  }),
);
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, services: servicesStatus() }));

const authReady = servicesStatus().auth;
if (authReady) app.use(clerkMiddleware());
app.use('/api', (_req, _res, next) => (authReady ? next() : next(missingKey('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY', 'Authentication'))));

const aiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "You're generating too quickly. Wait a minute and try again.", code: 'RATE_LIMIT' },
});

app.use('/api/ai', requireUser, aiLimiter, aiRouter);
app.use('/api/user', requireUser, userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
