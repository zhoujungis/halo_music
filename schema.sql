CREATE TABLE IF NOT EXISTS music_users (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS music_sessions (
  token TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES music_users(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_music_sessions_username ON music_sessions(username);
CREATE INDEX IF NOT EXISTS idx_music_sessions_expires_at ON music_sessions(expires_at);

CREATE TABLE IF NOT EXISTS music_libraries (
  username TEXT PRIMARY KEY,
  library_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES music_users(username) ON DELETE CASCADE
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
