-- Per-account daily download quota, counted separately per platform.
CREATE TABLE IF NOT EXISTS music_downloads (
  username TEXT NOT NULL,
  platform TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE,
  PRIMARY KEY (username, platform, day)
);

CREATE INDEX IF NOT EXISTS idx_music_downloads_day ON music_downloads(day);
