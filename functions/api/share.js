import { authenticatedUsername, json } from "./_auth.js";

const MAX_TRACKS = 300;
const MAX_BODY_BYTES = 256 * 1024;
const SHARE_WINDOW_MS = 60 * 60 * 1000;
const SHARE_WINDOW_LIMIT = 20;

const TRACK_KEYS = [
  "uid", "source", "title", "artist", "album", "cover", "duration",
  "songid", "songMid", "qqId", "qqSearchKey", "jooxIndex", "keyword",
  "quality", "qualityLabel", "displayIndex",
];

function normalizeTrack(raw) {
  if (!raw || typeof raw !== "object") return null;
  const track = {};
  for (const key of TRACK_KEYS) {
    const value = raw[key];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "string") track[key] = value.slice(0, 1000);
    else if (typeof value === "number" && Number.isFinite(value)) track[key] = value;
  }
  if (!track.uid || !track.title) return null;
  return track;
}

export async function onRequestPost({ request, env }) {
  if (!env?.DB) return json({ error: "数据库未绑定" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ error: "请先登录后再分享歌单" }, 401);

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json({ error: "歌单太大，暂时无法分享" }, 413);
  }
  let body;
  try { body = JSON.parse(raw); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const name = String(body.name || "").trim().slice(0, 120);
  const description = String(body.description || "").trim().slice(0, 200);
  const tracks = Array.isArray(body.tracks)
    ? body.tracks.map(normalizeTrack).filter(Boolean).slice(0, MAX_TRACKS)
    : [];
  if (!name) return json({ error: "歌单名称缺失" }, 400);
  if (!tracks.length) return json({ error: "歌单里还没有歌曲" }, 400);

  const now = Date.now();
  try {
    const recent = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM shared_playlists WHERE username = ? AND created_at > ?",
    ).bind(username, now - SHARE_WINDOW_MS).first();
    if (Number(recent?.total || 0) >= SHARE_WINDOW_LIMIT) {
      return json({ error: "分享太频繁，请稍后再试" }, 429);
    }
  } catch (error) {
    console.warn("share rate check failed", error);
  }

  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  try {
    await env.DB.prepare(
      "INSERT INTO shared_playlists (token, username, name, description, tracks_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(token, username, name, description, JSON.stringify(tracks), now, now).run();
  } catch (error) {
    console.error("share insert failed", error);
    return json({ error: "分享创建失败，请稍后再试" }, 503);
  }
  return json({ ok: true, token, url: `https://music.zhoujun.dev/s/${token}`, count: tracks.length });
}

export async function onRequestGet({ request, env }) {
  if (!env?.DB) return json({ error: "数据库未绑定" }, 500);
  const token = String(new URL(request.url).searchParams.get("id") || "").trim();
  if (!/^[a-z0-9]{6,32}$/i.test(token)) return json({ error: "分享链接无效" }, 400);
  const row = await env.DB.prepare(
    "SELECT token, name, description, tracks_json, created_at, updated_at FROM shared_playlists WHERE token = ?",
  ).bind(token).first();
  if (!row) return json({ error: "分享不存在或已失效" }, 404);
  let tracks = [];
  try { tracks = JSON.parse(row.tracks_json) || []; } catch { tracks = []; }
  return json({
    token: row.token,
    name: row.name,
    description: row.description || "",
    tracks,
    createdAt: Number(row.created_at) || null,
    updatedAt: Number(row.updated_at) || null,
  });
}
