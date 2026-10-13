import { ensureSchema, getSql } from '../db.js';

export async function createCreation({ userId, type, prompt, content, meta = {} }) {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql`
    INSERT INTO creations (user_id, type, prompt, content, meta)
    VALUES (${userId}, ${type}, ${prompt.slice(0, 1000)}, ${content}, ${JSON.stringify(meta)}::jsonb)
    RETURNING *`;
  return row;
}

export async function countThisMonth(userId) {
  await ensureSchema();
  const sql = getSql();
  const [r] = await sql`SELECT count(*)::int AS n FROM creations
    WHERE user_id = ${userId} AND created_at >= date_trunc('month', now())`;
  return r.n;
}

export async function listCreations({ userId, type = null, q = null, limit = 12, offset = 0 }) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM creations
    WHERE user_id = ${userId}
      AND (${type}::text IS NULL OR type = ${type})
      AND (${q}::text IS NULL OR prompt ILIKE '%' || ${q} || '%')
    ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM creations
    WHERE user_id = ${userId}
      AND (${type}::text IS NULL OR type = ${type})
      AND (${q}::text IS NULL OR prompt ILIKE '%' || ${q} || '%')`;
  return { rows, total: n };
}

export async function deleteCreation({ userId, id }) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`DELETE FROM creations WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
  return rows.length > 0;
}

export async function getStats(userId) {
  await ensureSchema();
  const sql = getSql();
  const byType = await sql`SELECT type, count(*)::int AS n FROM creations WHERE user_id = ${userId} GROUP BY type`;
  const daily = await sql`
    SELECT to_char(d, 'YYYY-MM-DD') AS day, coalesce(c.n, 0)::int AS n
    FROM generate_series(current_date - 13, current_date, interval '1 day') d
    LEFT JOIN (SELECT created_at::date AS day, count(*) AS n FROM creations WHERE user_id = ${userId} GROUP BY 1) c
      ON c.day = d::date
    ORDER BY d`;
  const thisMonth = await countThisMonth(userId);
  return {
    total: byType.reduce((a, r) => a + r.n, 0),
    thisMonth,
    byType: Object.fromEntries(byType.map((r) => [r.type, r.n])),
    daily,
  };
}
