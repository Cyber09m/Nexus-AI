import 'dotenv/config';

const int = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);
const env = process.env;

export const config = {
  port: int(env.PORT, 3000),
  clientUrls: (env.CLIENT_URL || 'http://localhost:8080').split(',').map((s) => s.trim()).filter(Boolean),
  databaseUrl: env.DATABASE_URL,
  clerk: { secretKey: env.CLERK_SECRET_KEY, publishableKey: env.CLERK_PUBLISHABLE_KEY },
  premiumPlan: env.PREMIUM_PLAN_SLUG || 'premium',
  adminIds: (env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean),
  freeMonthlyLimit: int(env.FREE_MONTHLY_LIMIT, 10),
  maxUploadMb: int(env.MAX_UPLOAD_MB, 4),
  gemini: { apiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL || 'gemini-2.5-flash' },
  clipdropKey: env.CLIPDROP_API_KEY,
  cloudinary: { cloudName: env.CLOUDINARY_CLOUD_NAME, apiKey: env.CLOUDINARY_API_KEY, apiSecret: env.CLOUDINARY_API_SECRET },
};

export const servicesStatus = () => ({
  auth: Boolean(config.clerk.secretKey && config.clerk.publishableKey),
  database: Boolean(config.databaseUrl),
  gemini: Boolean(config.gemini.apiKey),
  clipdrop: Boolean(config.clipdropKey),
  cloudinary: Boolean(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret),
});
