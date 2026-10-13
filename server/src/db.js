import { neon } from '@neondatabase/serverless';
import { config } from './config.js';
import { missingKey } from './errors.js';

let client;
export function getSql() {
  if (!config.databaseUrl) throw missingKey('DATABASE_URL', 'The database');
  return (client ??= neon(config.databaseUrl));
}

let ready;
/** Creates tables on first use (idempotent). Safe for serverless cold starts. */
export function ensureSchema() {
  ready ??= (async () => {
    const sql = getSql();
    await sql`CREATE TABLE IF NOT EXISTS creations (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('article','titles','image','background','object','resume')),
      prompt TEXT NOT NULL,
      content TEXT NOT NULL,
      meta JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
    await sql`CREATE INDEX IF NOT EXISTS creations_user_created_idx ON creations (user_id, created_at DESC)`;
  })().catch((e) => {
    ready = undefined;
    throw e;
  });
  return ready;
}
