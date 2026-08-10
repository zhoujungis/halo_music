import { authenticatedUsername, json } from "./_auth.js";

const MAX_LIBRARY_BYTES = 1_000_000;
const MAX_FAVORITES = 2_000;
const MAX_PLAYLISTS = 200;
const MAX_TRACKS_PER_PLAYLIST = 2_000;

function validateLibrary(input) {
  if (!input || typeof input !== "object" || !Array.isArray(input.favorites) || !Array.isArray(input.playlists)) {
    return null;
  }
  if (input.favorites.length > MAX_FAVORITES || input.playlists.length > MAX_PLAYLISTS) return null;
  if (input.playlists.some((playlist) => (
    !playlist || typeof playlist !== "object" ||
    typeof playlist.id !== "string" || typeof playlist.name !== "string" ||
    playlist.id.length > 160 || playlist.name.length > 120 ||
    !Array.isArray(playlist.tracks) || playlist.tracks.length > MAX_TRACKS_PER_PLAYLIST
  ))) return null;

  const library = {
    version: 1,
    savedAt: new Date().toISOString(),
    favorites: input.favorites,
    playlists: input.playlists,
  };
  const serialized = JSON.stringify(library);
  return new TextEncoder().encode(serialized).byteLength <= MAX_LIBRARY_BYTES ? serialized : null;
}

async function requireUser(request, env) {
  if (!env.DB) return { response: json({ error: "数据库未绑定（D1 binding 缺失）" }, 500) };
  const username = await authenticatedUsername(request, env);
  return username ? { username } : { response: json({ error: "请先登录" }, 401) };
}

export async function onRequestGet({ request, env }) {
  const auth = await requireUser(request, env);
  if (auth.response) return auth.response;

  const row = await env.DB.prepare(
    "SELECT library_json, updated_at FROM music_libraries WHERE username = ?",
  ).bind(auth.username).first();
  if (!row) return json({ library: null, updatedAt: null });

  try {
    return json({ library: JSON.parse(row.library_json), updatedAt: row.updated_at });
  } catch (error) {
    console.error("Invalid library data", error);
    return json({ error: "歌单数据损坏" }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const auth = await requireUser(request, env);
  if (auth.response) return auth.response;

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const libraryJson = validateLibrary(body);
  if (!libraryJson) return json({ error: "歌单数据格式错误或数据过大" }, 400);

  const updatedAt = Date.now();
  await env.DB.prepare(
    `INSERT INTO music_libraries (username, library_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(username) DO UPDATE SET library_json = excluded.library_json, updated_at = excluded.updated_at`,
  ).bind(auth.username, libraryJson, updatedAt).run();
  return json({ ok: true, updatedAt });
}
