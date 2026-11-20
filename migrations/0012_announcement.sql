-- 站点公告栏：只有一行（id = 1）。content 为空时前端不显示公告栏。
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  content TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);
