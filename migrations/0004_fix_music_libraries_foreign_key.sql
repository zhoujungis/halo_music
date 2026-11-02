-- The initial library table referenced the legacy music_users table.
-- Rebuild it so library writes reference the current user table.
PRAGMA foreign_keys=OFF;

CREATE TABLE music_libraries_fixed (
  username TEXT PRIMARY KEY,
  library_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES "user"(username) ON DELETE CASCADE
);

INSERT OR IGNORE INTO music_libraries_fixed (username, library_json, updated_at)
  SELECT username, library_json, updated_at FROM music_libraries;

DROP TABLE music_libraries;
ALTER TABLE music_libraries_fixed RENAME TO music_libraries;

PRAGMA foreign_keys=ON;
