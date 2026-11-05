-- Halo Insights：记录每次播放的时长与专辑，用于总时长、时段分布、最常听专辑等统计。
ALTER TABLE music_play_history ADD COLUMN duration INTEGER NOT NULL DEFAULT 0;
ALTER TABLE music_play_history ADD COLUMN album TEXT NOT NULL DEFAULT '';
