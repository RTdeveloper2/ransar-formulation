-- server.js creates these tables automatically during startup.
CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS business_data (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data JSONB NOT NULL DEFAULT '{"doctors":[],"followups":[],"products":[],"sales":[]}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
