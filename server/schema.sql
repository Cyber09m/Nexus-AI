-- Applied automatically on first request; kept here for reference / manual runs.
CREATE TABLE IF NOT EXISTS creations (
  id          BIGSERIAL PRIMARY KEY,
  user_id     TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('article','titles','image','background','object','resume')),
  prompt      TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  meta        JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS creations_user_created_idx ON creations (user_id, created_at DESC);
