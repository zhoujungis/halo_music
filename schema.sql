CREATE TABLE IF NOT EXISTS "user" (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_login_at INTEGER,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  google_sub TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON "user"(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_google_sub ON "user"(google_sub) WHERE google_sub IS NOT NULL;

CREATE TABLE IF NOT EXISTS music_sessions (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_music_sessions_username ON music_sessions(username);
CREATE INDEX IF NOT EXISTS idx_music_sessions_expires_at ON music_sessions(expires_at);

CREATE TABLE IF NOT EXISTS music_libraries (
  username TEXT PRIMARY KEY,
  library_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS music_cache (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_music_cache_expires_at ON music_cache(expires_at);

CREATE TABLE IF NOT EXISTS search_cache (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_search_cache_expires_at ON search_cache(expires_at);

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
  source TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  duration INTEGER NOT NULL DEFAULT 0,
  album TEXT NOT NULL DEFAULT '',
  played_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_music_history_user_time ON music_play_history(username, played_at DESC);

-- 榜单每日快照（CI 定时抓取，接口只读）
CREATE TABLE IF NOT EXISTS toplist_cache (
  chart TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 歌单分享快照（公开只读 /s/<token>）
CREATE TABLE IF NOT EXISTS shared_playlists (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tracks_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_shared_playlists_user ON shared_playlists(username);

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
