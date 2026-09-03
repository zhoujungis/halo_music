-- Migrate the pre-0001 table name when it exists. Creating both table shapes
-- first makes this migration safe on fresh databases and on reruns.
CREATE TABLE IF NOT EXISTS "user" (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_login_at INTEGER
);
CREATE TABLE IF NOT EXISTS music_users (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_login_at INTEGER
);
INSERT OR IGNORE INTO "user" (username, password_hash, password_salt, created_at, last_login_at)
  SELECT username, password_hash, password_salt, created_at, NULL FROM music_users;
DROP TABLE IF EXISTS music_users;
