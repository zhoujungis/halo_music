import { authenticatedUsername, json } from "./_auth.js";

const MAX_RECENT = 50;
const DEFAULT_RECENT = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

function beijingMonthStart(now) {
  const beijing = new Date(now + BEIJING_OFFSET_MS);
  return Date.UTC(beijing.getUTCFullYear(), beijing.getUTCMonth(), 1) - BEIJING_OFFSET_MS;
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ error: "请先登录" }, 401);

  const url = new URL(request.url);
  if (url.searchParams.get("list") === "recent") {
    const raw = Number(url.searchParams.get("limit") || DEFAULT_RECENT);
    const limit = Number.isFinite(raw) ? Math.min(Math.max(1, Math.floor(raw)), MAX_RECENT) : DEFAULT_RECENT;
    const recent = await env.DB.prepare(
      `SELECT track_uid, title, artist, source, cover, MAX(played_at) AS played_at
       FROM music_play_history WHERE username = ?
       GROUP BY track_uid ORDER BY played_at DESC LIMIT ?`,
    ).bind(username, limit).all();
    return json({ recent: recent?.results || [] });
  }

  const now = Date.now();
  const weekStart = now - 7 * DAY_MS;
  const discoveryStart = now - 30 * DAY_MS;
  const monthStart = beijingMonthStart(now);

  const [totals, topTracks, topArtists, topAlbums, daily, hours, month, discoveries, lastPlayed] = await Promise.all([
    env.DB.prepare(
      "SELECT COUNT(*) AS plays, COUNT(DISTINCT track_uid) AS unique_tracks, COALESCE(SUM(duration), 0) AS total_seconds FROM music_play_history WHERE username = ?",
    ).bind(username).first(),
    env.DB.prepare(
      `SELECT track_uid, title, artist, COUNT(*) AS plays, COALESCE(SUM(duration), 0) AS seconds
       FROM music_play_history WHERE username = ?
       GROUP BY track_uid ORDER BY plays DESC, MAX(played_at) DESC LIMIT 5`,
    ).bind(username).all(),
    env.DB.prepare(
      `SELECT artist, COUNT(*) AS plays, COALESCE(SUM(duration), 0) AS seconds
       FROM music_play_history WHERE username = ? AND artist != ''
       GROUP BY artist ORDER BY plays DESC LIMIT 5`,
    ).bind(username).all(),
    env.DB.prepare(
      `SELECT album, artist, COUNT(*) AS plays
       FROM music_play_history WHERE username = ? AND album != ''
       GROUP BY album ORDER BY plays DESC LIMIT 5`,
    ).bind(username).all(),
    env.DB.prepare(
      `SELECT date(played_at / 1000, 'unixepoch', '+8 hours') AS day,
              COUNT(*) AS plays, COALESCE(SUM(duration), 0) AS seconds
       FROM music_play_history WHERE username = ? AND played_at >= ?
       GROUP BY day ORDER BY day`,
    ).bind(username, weekStart).all(),
    env.DB.prepare(
      `SELECT CAST(strftime('%H', played_at / 1000, 'unixepoch', '+8 hours') AS INTEGER) AS hour,
              COUNT(*) AS plays
       FROM music_play_history WHERE username = ?
       GROUP BY hour ORDER BY hour`,
    ).bind(username).all(),
    env.DB.prepare(
      `SELECT COUNT(*) AS plays, COUNT(DISTINCT track_uid) AS unique_tracks, COALESCE(SUM(duration), 0) AS seconds
       FROM music_play_history WHERE username = ? AND played_at >= ?`,
    ).bind(username, monthStart).first(),
    env.DB.prepare(
      `SELECT COUNT(*) AS total FROM (
         SELECT track_uid, MIN(played_at) AS first_played
         FROM music_play_history WHERE username = ? GROUP BY track_uid
       ) WHERE first_played >= ?`,
    ).bind(username, discoveryStart).first(),
    env.DB.prepare(
      "SELECT title, artist, played_at FROM music_play_history WHERE username = ? ORDER BY played_at DESC LIMIT 1",
    ).bind(username).first(),
  ]);

  return json({
    summary: {
      plays: Number(totals?.plays || 0),
      uniqueTracks: Number(totals?.unique_tracks || 0),
      totalSeconds: Number(totals?.total_seconds || 0),
      topTracks: topTracks?.results || [],
      topArtists: topArtists?.results || [],
      topAlbums: topAlbums?.results || [],
      daily: daily?.results || [],
      hours: hours?.results || [],
      month: {
        plays: Number(month?.plays || 0),
        uniqueTracks: Number(month?.unique_tracks || 0),
        seconds: Number(month?.seconds || 0),
      },
      discoveries: Number(discoveries?.total || 0),
      lastPlayed: lastPlayed || null,
    },
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ error: "请先登录" }, 401);
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }
  const trackUid = String(body.uid || "").slice(0, 200);
  const title = String(body.title || "").trim().slice(0, 200);
  const artist = String(body.artist || "").trim().slice(0, 300);
  const source = String(body.source || "").trim().slice(0, 20);
  const cover = String(body.cover || "").trim().slice(0, 1000);
  const album = String(body.album || "").trim().slice(0, 200);
  const rawDuration = Number(body.duration);
  const duration = Number.isFinite(rawDuration) ? Math.min(Math.max(0, Math.round(rawDuration)), 24 * 60 * 60) : 0;
  if (!trackUid || !title) return json({ error: "歌曲信息不完整" }, 400);
  await env.DB.prepare(
    "INSERT INTO music_play_history (username, track_uid, title, artist, source, cover, duration, album, played_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(username, trackUid, title, artist, source, cover, duration, album, Date.now()).run();
  return json({ ok: true });
}
