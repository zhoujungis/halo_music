-- 歌单分享：把歌单快照存库，公开只读链接 /s/<token> 读取。
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
