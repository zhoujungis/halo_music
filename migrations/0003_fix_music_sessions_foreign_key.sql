-- The legacy sessions table referenced music_users, which was removed by
-- 0002. Rebuild it so successful logins can create sessions against user.
CREATE TABLE music_sessions_fixed (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE
);

INSERT OR IGNORE INTO music_sessions_fixed (token, username, expires_at)
  SELECT token, username, expires_at FROM music_sessions;

DROP TABLE music_sessions;
ALTER TABLE music_sessions_fixed RENAME TO music_sessions;
CREATE INDEX IF NOT EXISTS idx_music_sessions_username ON music_sessions(username);
CREATE INDEX IF NOT EXISTS idx_music_sessions_expires_at ON music_sessions(expires_at);
