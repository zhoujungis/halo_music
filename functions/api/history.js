import { authenticatedUsername, json } from "./_auth.js";

const MAX_RECENT = 50;
const DEFAULT_RECENT = 30;

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

  const [totals, topTracks, recent] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS plays, COUNT(DISTINCT track_uid) AS unique_tracks FROM music_play_history WHERE username = ?").bind(username).first(),
    env.DB.prepare("SELECT track_uid, title, artist, COUNT(*) AS plays FROM music_play_history WHERE username = ? GROUP BY track_uid ORDER BY plays DESC, MAX(played_at) DESC LIMIT 5").bind(username).all(),
    env.DB.prepare("SELECT title, artist, played_at FROM music_play_history WHERE username = ? ORDER BY played_at DESC LIMIT 1").bind(username).first(),
  ]);
  return json({ summary: { plays: Number(totals?.plays || 0), uniqueTracks: Number(totals?.unique_tracks || 0), topTracks: topTracks?.results || [], lastPlayed: recent || null } });
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
  if (!trackUid || !title) return json({ error: "歌曲信息不完整" }, 400);
  await env.DB.prepare("INSERT INTO music_play_history (username, track_uid, title, artist, source, cover, played_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(username, trackUid, title, artist, source, cover, Date.now()).run();
  return json({ ok: true });
}
