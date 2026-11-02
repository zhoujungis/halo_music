import { json } from "./_auth.js";

const QQ_TRACKS_CTE = `
WITH tracks AS (
  SELECT
    COALESCE(
      NULLIF(json_extract(value, '$.songid'), ''),
      NULLIF(json_extract(value, '$.qqId'), ''),
      NULLIF(json_extract(value, '$.songMid'), ''),
      NULLIF(substr(json_extract(value, '$.uid'), 4), '')
    ) AS mid,
    json_extract(value, '$.duration') AS duration,
    json_extract(value, '$.title') AS title,
    json_extract(value, '$.artist') AS artist
  FROM music_libraries, json_each(json_extract(library_json, '$.favorites'))
  WHERE json_extract(value, '$.uid') LIKE 'qq-%'

  UNION ALL

  SELECT
    COALESCE(
      NULLIF(json_extract(track.value, '$.songid'), ''),
      NULLIF(json_extract(track.value, '$.qqId'), ''),
      NULLIF(json_extract(track.value, '$.songMid'), ''),
      NULLIF(substr(json_extract(track.value, '$.uid'), 4), '')
    ) AS mid,
    json_extract(track.value, '$.duration') AS duration,
    json_extract(track.value, '$.title') AS title,
    json_extract(track.value, '$.artist') AS artist
  FROM music_libraries,
       json_each(json_extract(library_json, '$.playlists')) AS playlist,
       json_each(json_extract(playlist.value, '$.tracks')) AS track
  WHERE json_extract(track.value, '$.uid') LIKE 'qq-%'

  UNION ALL

  SELECT
    NULLIF(substr(track_uid, 4), '') AS mid,
    NULL AS duration,
    title AS title,
    artist AS artist
  FROM music_play_history
  WHERE track_uid LIKE 'qq-%'
)
`;

const ROWS_SQL = `${QQ_TRACKS_CTE}
SELECT
  mid,
  MAX(duration) AS duration,
  MAX(title) AS title,
  MAX(artist) AS artist
FROM tracks
WHERE mid IS NOT NULL AND mid != ''
GROUP BY mid
ORDER BY mid
LIMIT ? OFFSET ?`;

const COUNT_SQL = `${QQ_TRACKS_CTE}
SELECT COUNT(*) AS total FROM (
  SELECT mid FROM tracks WHERE mid IS NOT NULL AND mid != '' GROUP BY mid
)`;

function authorized(request, env) {
  const expected = String(env?.CACHE_REFRESH_TOKEN || "");
  if (!expected) return json({ error: "缓存刷新未配置" }, 503);
  const header = request.headers.get("authorization") || "";
  if (header !== `Bearer ${expected}`) return json({ error: "无权访问" }, 401);
  return null;
}

async function refreshTrack(origin, track, token) {
  const params = new URLSearchParams({
    action: "qq_detail",
    id: String(track.mid),
    refresh: "1",
  });
  if (track.duration) params.set("duration", String(track.duration));
  if (track.title) params.set("title", String(track.title));
  if (track.artist) params.set("artist", String(track.artist));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${origin}/api/music?${params}`, {
      headers: {
        "user-agent": "HALO-Music-QQ-Cache-Refresh",
        "x-cache-refresh-token": String(token || ""),
      },
      signal: controller.signal,
    });
    await response.body?.cancel();
    return { mid: track.mid, ok: response.ok, status: response.status };
  } catch (error) {
    return { mid: track.mid, ok: false, status: 0, error: String(error?.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestPost({ request, env }) {
  if (!env?.DB) return json({ error: "数据库未绑定" }, 500);
  const authError = authorized(request, env);
  if (authError) return authError;

  let body = {};
  try { body = await request.json(); } catch {}
  const limit = Math.min(20, Math.max(1, Number(body.limit) || 10));
  const offset = Math.max(0, Number(body.offset) || 0);

  let rows;
  let count;
  try {
    [rows, count] = await Promise.all([
      env.DB.prepare(ROWS_SQL).bind(limit, offset).all(),
      env.DB.prepare(COUNT_SQL).first(),
    ]);
  } catch (error) {
    console.error("QQ cache refresh query failed", error);
    return json({ error: "读取歌曲列表失败" }, 500);
  }

  const tracks = rows?.results || [];
  const total = Number(count?.total || 0);
  const origin = new URL(request.url).origin;
  const results = await Promise.all(
    tracks.map((track) => refreshTrack(origin, track, env.CACHE_REFRESH_TOKEN)),
  );

  const nextOffset = offset + tracks.length;
  return json({
    ok: true,
    total,
    processed: tracks.length,
    nextOffset,
    done: tracks.length === 0 || nextOffset >= total,
    results,
  });
}
