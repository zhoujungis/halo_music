-- 榜单每日快照：由 CI 定时任务写入，接口只读此表。
CREATE TABLE IF NOT EXISTS toplist_cache (
  chart TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
