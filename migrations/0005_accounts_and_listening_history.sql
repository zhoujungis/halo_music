ALTER TABLE "user" ADD COLUMN email TEXT;
ALTER TABLE "user" ADD COLUMN display_name TEXT;
ALTER TABLE "user" ADD COLUMN avatar_url TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON "user"(email) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS email_verification_codes (
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  request_ip TEXT NOT NULL DEFAULT '',
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (email, purpose)
);
CREATE INDEX IF NOT EXISTS idx_email_verification_expires ON email_verification_codes(expires_at);

CREATE TABLE IF NOT EXISTS music_play_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  track_uid TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT '',
  played_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_music_history_user_time ON music_play_history(username, played_at DESC);
