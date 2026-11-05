-- 为最近播放（发现页）记录音源与封面：history POST 写入，GET ?list=recent 返回。
ALTER TABLE music_play_history ADD COLUMN source TEXT NOT NULL DEFAULT '';
ALTER TABLE music_play_history ADD COLUMN cover TEXT NOT NULL DEFAULT '';
