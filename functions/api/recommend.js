import { authenticatedUsername, json } from "./_auth.js";

const LIMIT = 8;
const MIN_TRACKS = 3;

// 默认推荐歌曲：新用户/游客、全站记录不足时使用。
// 只存歌名+歌手，点击时由前端走 QQ源（站内“QQ音乐”源）解析播放，
// 避免网易云上的同名冒充/翻唱上传被当成原唱；封面同样用 QQ 封面接口补。
const DEFAULT_SONGS = [
  { title: "七里香", artist: "周杰伦" },
  { title: "稻香", artist: "周杰伦" },
  { title: "夜曲", artist: "周杰伦" },
  { title: "等你下课", artist: "周杰伦" },
  { title: "告白气球", artist: "周杰伦" },
  { title: "龙卷风", artist: "周杰伦" },
  { title: "晴天", artist: "周杰伦" },
  { title: "花海", artist: "周杰伦" },
].map((item) => ({
  track_uid: "",
  title: item.title,
  artist: item.artist,
  source: "",
  cover: "",
  plays: 0,
}));

function normalizeRows(rows) {
  return (rows || [])
    .map((row) => ({
      track_uid: String(row.track_uid || ""),
      title: String(row.title || ""),
      artist: String(row.artist || ""),
      source: String(row.source || ""),
      cover: String(row.cover || ""),
      plays: Number(row.plays || 0),
    }))
    .filter((row) => row.title);
}

function mergeRows(groups) {
  const merged = [];
  const seen = new Set();
  for (const rows of groups) {
    for (const row of rows || []) {
      const key = row.track_uid || `${row.title}|${row.artist}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(row);
      if (merged.length >= LIMIT) return merged;
    }
  }
  return merged;
}

// 推荐歌曲：基于全站用户的播放记录。
//  - 登录用户：同歌手（别人的记录里，你常听的歌手）+ 同好（听过你最爱那首的人还听了什么）
//  - 游客 / 数据不足：全站播放最多的歌（“大家都在听”）
//  - 全站也没有数据：返回空列表，由前端回退到榜单。
export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定" }, 500);
  const username = await authenticatedUsername(request, env);

  let sameArtist = [];
  let coListen = [];

  if (username) {
    const topArtists = await env.DB.prepare(
      `SELECT artist, COUNT(*) AS plays FROM music_play_history
       WHERE username = ? AND artist != ''
       GROUP BY artist ORDER BY plays DESC LIMIT 3`,
    ).bind(username).all();
    const artists = (topArtists?.results || [])
      .map((row) => String(row.artist || "").trim())
      .filter(Boolean);

    if (artists.length) {
      const artistClause = artists.map(() => "artist LIKE ?").join(" OR ");
      const artistParams = artists.map((name) => `%${name}%`);
      const sameArtistRows = await env.DB.prepare(
        `SELECT track_uid, title, artist, source, cover, COUNT(*) AS plays
         FROM music_play_history
         WHERE (${artistClause}) AND username != ?
           AND track_uid NOT IN (SELECT track_uid FROM music_play_history WHERE username = ?)
         GROUP BY track_uid ORDER BY plays DESC, MAX(played_at) DESC LIMIT ?`,
      ).bind(...artistParams, username, username, LIMIT).all();
      sameArtist = normalizeRows(sameArtistRows?.results);
    }

    const seed = await env.DB.prepare(
      `SELECT track_uid FROM music_play_history WHERE username = ?
       GROUP BY track_uid ORDER BY COUNT(*) DESC, MAX(played_at) DESC LIMIT 1`,
    ).bind(username).first();
    if (seed?.track_uid) {
      const coRows = await env.DB.prepare(
        `SELECT track_uid, title, artist, source, cover, COUNT(*) AS plays
         FROM music_play_history
         WHERE username IN (SELECT DISTINCT username FROM music_play_history WHERE track_uid = ?)
           AND track_uid != ? AND username != ?
           AND track_uid NOT IN (SELECT track_uid FROM music_play_history WHERE username = ?)
         GROUP BY track_uid ORDER BY plays DESC, MAX(played_at) DESC LIMIT ?`,
      ).bind(seed.track_uid, seed.track_uid, username, username, LIMIT).all();
      coListen = normalizeRows(coRows?.results);
    }
  }

  const personal = mergeRows([sameArtist, coListen]);
  if (personal.length >= MIN_TRACKS) {
    return json({ basis: "personal", tracks: personal });
  }

  // 全站播放最多的歌：所有用户都算，包括游客场景。
  const globalRows = await env.DB.prepare(
    `SELECT track_uid, title, artist, source, cover, COUNT(*) AS plays
     FROM music_play_history
     GROUP BY track_uid ORDER BY plays DESC, MAX(played_at) DESC LIMIT ?`,
  ).bind(LIMIT).all();
  const globalTracks = normalizeRows(globalRows?.results);
  if (globalTracks.length >= MIN_TRACKS) {
    return json({ basis: "global", tracks: globalTracks });
  }

  // 记录还不够时：把已有的少量记录和默认推荐合并凑满。
  return json({
    basis: "default",
    tracks: mergeRows([personal, globalTracks, DEFAULT_SONGS]),
  });
}
