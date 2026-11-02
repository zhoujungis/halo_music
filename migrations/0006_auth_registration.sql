-- Registration, Google sign-in and per-IP account limits.
ALTER TABLE "user" ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_google_sub ON "user"(google_sub) WHERE google_sub IS NOT NULL;

CREATE TABLE IF NOT EXISTS registration_ips (
  ip_hash TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  count INTEGER NOT NULL
);
