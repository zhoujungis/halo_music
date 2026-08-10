import { authenticatedUsername, json } from "./_auth.js";

const MAX_INPUT_LENGTH = 2_000;
const MAX_NETEASE_TRACKS = 2_000;
const MAX_QQ_TRACKS = 1_200;
const QQ_PAGE_SIZE = 30;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_PAGE_BYTES = 4_000_000;

const QQ_PLATFORMS = ["-1", "android", "iphone", "h5", "wxfshare", "iphone_wx", "windows"];
const QQ_SIGN_MASK = [212, 45, 80, 68, 195, 163, 163, 203, 157, 220, 254, 91, 204, 79, 104, 6];
const BASE64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

class PlaylistImportError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PlaylistImportError";
    this.status = status;
  }
}

function compactText(value) {
  if (value === undefined || value === null || typeof value === "object") return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function firstText(...values) {
  for (const value of values) {
    const text = compactText(value);
    if (text) return text;
  }
  return "";
}

export function extractSharedUrl(input) {
  const text = compactText(input);
  const match = text.match(/https?:\/\/[^\s<>"']+/i);
  if (!match) throw new PlaylistImportError("没有找到有效的歌单链接");
  const raw = match[0].replace(/[),.;!?，。；！）》】\]}]+$/u, "");
  try {
    return new URL(raw);
  } catch {
    throw new PlaylistImportError("歌单链接格式无效");
  }
}

function isHost(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function detectPlaylistSource(urlValue) {
  const url = urlValue instanceof URL ? urlValue : new URL(urlValue);
  const host = url.hostname.toLowerCase();
  if (isHost(host, "music.163.com") || isHost(host, "163cn.tv")) return "netease";
  if (isHost(host, "y.qq.com")) return "qq";
  if ((host.includes("qishui") && isHost(host, "douyin.com")) || host === "music.douyin.com") return "qishui";
  throw new PlaylistImportError("仅支持网易云音乐、汽水音乐和 QQ 音乐歌单链接");
}

function assertOfficialUrl(url, source) {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new PlaylistImportError("歌单链接协议无效");
  }
  if (detectPlaylistSource(url) !== source) {
    throw new PlaylistImportError("歌单短链跳转到了不受支持的地址");
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") throw new PlaylistImportError("音乐平台响应超时，请稍后重试", 504);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFollowingOfficialRedirects(initialUrl, source) {
  let current = new URL(initialUrl);
  for (let count = 0; count < 6; count += 1) {
    assertOfficialUrl(current, source);
    const response = await fetchWithTimeout(current, {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/json",
        "User-Agent": "Mozilla/5.0 (compatible; HALO-Music/1.0)",
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new PlaylistImportError("分享短链没有返回跳转地址");
      current = new URL(location, current);
      continue;
    }
    return { url: current, response };
  }
  throw new PlaylistImportError("歌单短链跳转次数过多");
}

function extractNumericParam(url, pathPattern) {
  const pathMatch = url.pathname.match(pathPattern);
  if (pathMatch) return pathMatch[1];
  const direct = url.searchParams.get("id") || url.searchParams.get("playlist_id");
  if (direct && /^\d+$/.test(direct)) return direct;
  const hashQuery = url.hash.includes("?") ? url.hash.slice(url.hash.indexOf("?") + 1) : "";
  const hashId = new URLSearchParams(hashQuery).get("id");
  return hashId && /^\d+$/.test(hashId) ? hashId : "";
}

export function extractNeteasePlaylistId(urlValue) {
  return extractNumericParam(urlValue instanceof URL ? urlValue : new URL(urlValue), /\/playlist\/(\d+)/);
}

export function extractQQPlaylistId(urlValue) {
  return extractNumericParam(urlValue instanceof URL ? urlValue : new URL(urlValue), /\/playlist\/(\d+)/);
}

function joinArtists(value) {
  if (Array.isArray(value)) {
    return value.map((item) => firstText(item?.name, item?.title, item?.artist_name, item)).filter(Boolean).join(" / ");
  }
  if (value && typeof value === "object") return firstText(value.name, value.title, value.artist_name);
  return compactText(value);
}

function stableId(value) {
  let hash = 0x811c9dc5;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function haloTrack(source, raw, index) {
  const title = firstText(raw.title, raw.name, raw.songname, raw.song_name, raw.songName);
  const artist = firstText(raw.artist, raw.artist_name, raw.singer_name, joinArtists(raw.ar), joinArtists(raw.artists), joinArtists(raw.singer), "未知音乐人");
  const rawId = firstText(raw.id, raw.songid, raw.songId, raw.song_id, raw.songmid, raw.songMid, raw.mid);
  const id = rawId || stableId(`${title}\n${artist}\n${index}`);
  const track = {
    uid: `${source}-${id}`,
    source,
    songid: id,
    title,
    artist,
    album: firstText(raw.album, raw.album_name, raw.albumName),
    cover: firstText(raw.cover, raw.pic, raw.picUrl, raw.album_pic),
    keyword: `${title} ${artist}`.trim(),
    detailsLoaded: false,
    audioUrl: null,
    lrc: null,
    lrcUrl: null,
  };
  if (source === "qq") {
    const mid = firstText(raw.songmid, raw.songMid, raw.mid, id);
    track.uid = `qq-${mid}`;
    track.songid = mid;
    track.songMid = mid;
    track.qqId = mid;
    track.qqSearchKey = track.keyword;
  }
  return track;
}

function playlistPayload(source, id, name, tracks, total = tracks.length) {
  const safeId = firstText(id, stableId(`${source}:${name}`));
  return {
    version: 1,
    provider: source,
    total,
    truncated: total > tracks.length,
    favorites: [],
    playlists: [{
      id: `import-${source}-${safeId}`,
      name: firstText(name, "导入歌单"),
      tracks,
    }],
  };
}

async function readJson(response, platformName) {
  if (!response.ok) throw new PlaylistImportError(`${platformName}接口请求失败（${response.status}）`, 502);
  try {
    return await response.json();
  } catch {
    throw new PlaylistImportError(`${platformName}返回了无法解析的数据`, 502);
  }
}

async function postNetease(endpoint, body) {
  return readJson(await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Referer: "https://music.163.com/",
      "User-Agent": "Mozilla/5.0 (compatible; HALO-Music/1.0)",
    },
    body,
  }), "网易云音乐");
}

export function normalizeNeteasePlaylist(playlist, songs) {
  const tracks = songs.map((song, index) => haloTrack("netease", {
    id: song.id,
    title: song.name,
    artist: joinArtists(song.ar || song.artists),
    album: firstText(song.al?.name, song.album?.name),
    cover: firstText(song.al?.picUrl, song.album?.picUrl),
  }, index)).filter((track) => track.title);
  return playlistPayload("netease", playlist.id, playlist.name, tracks, playlist.trackCount || tracks.length);
}

async function importNetease(initialUrl) {
  let url = initialUrl;
  let id = extractNeteasePlaylistId(url);
  if (!id) {
    const resolved = await fetchFollowingOfficialRedirects(url, "netease");
    url = resolved.url;
    await resolved.response.body?.cancel();
    id = extractNeteasePlaylistId(url);
  }
  if (!id) throw new PlaylistImportError("无法从网易云链接中识别歌单 ID");

  const detail = await postNetease(
    "https://music.163.com/api/v6/playlist/detail",
    new URLSearchParams({ id }).toString(),
  );
  if (detail.code === 401) throw new PlaylistImportError("该网易云歌单未公开或无权访问");
  const playlist = detail.playlist;
  if (!playlist) throw new PlaylistImportError("网易云歌单不存在或暂时无法访问", 502);

  const ids = (Array.isArray(playlist.trackIds) ? playlist.trackIds : [])
    .map((item) => Number(item?.id))
    .filter(Number.isSafeInteger)
    .slice(0, MAX_NETEASE_TRACKS);
  let songs = [];
  if (ids.length) {
    const chunks = [];
    for (let index = 0; index < ids.length; index += 400) chunks.push(ids.slice(index, index + 400));
    const responses = await Promise.all(chunks.map((chunk) => postNetease(
      "https://music.163.com/api/v3/song/detail",
      new URLSearchParams({ c: JSON.stringify(chunk.map((songId) => ({ id: songId }))) }).toString(),
    )));
    const byId = new Map(responses.flatMap((item) => item.songs || []).map((song) => [String(song.id), song]));
    songs = ids.map((songId) => byId.get(String(songId))).filter(Boolean);
  } else if (Array.isArray(playlist.tracks)) {
    songs = playlist.tracks.slice(0, MAX_NETEASE_TRACKS);
  }
  if (!songs.length) throw new PlaylistImportError("网易云歌单中没有可导入的歌曲");
  return normalizeNeteasePlaylist(playlist, songs);
}

function selectCharacters(value, indexes) {
  return indexes.map((index) => value[index]).join("");
}

function rotateLeft(value, shift) {
  return (value << shift) | (value >>> (32 - shift));
}

function md5Bytes(input) {
  const source = new TextEncoder().encode(input);
  const paddedLength = Math.ceil((source.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(source);
  padded[source.length] = 0x80;
  const view = new DataView(padded.buffer);
  const bitLength = source.length * 8;
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0);
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) => view.getUint32(offset + index * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let index = 0; index < 64; index += 1) {
      let mixed;
      let wordIndex;
      if (index < 16) {
        mixed = (b & c) | (~b & d);
        wordIndex = index;
      } else if (index < 32) {
        mixed = (d & b) | (~d & c);
        wordIndex = (5 * index + 1) % 16;
      } else if (index < 48) {
        mixed = b ^ c ^ d;
        wordIndex = (3 * index + 5) % 16;
      } else {
        mixed = c ^ (b | ~d);
        wordIndex = (7 * index) % 16;
      }
      const nextD = d;
      d = c;
      c = b;
      b = (b + rotateLeft((a + mixed + constants[index] + words[wordIndex]) | 0, shifts[index])) | 0;
      a = nextD;
    }
    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const output = new Uint8Array(16);
  const outputView = new DataView(output.buffer);
  outputView.setUint32(0, a0 >>> 0, true);
  outputView.setUint32(4, b0 >>> 0, true);
  outputView.setUint32(8, c0 >>> 0, true);
  outputView.setUint32(12, d0 >>> 0, true);
  return output;
}

export async function createQQSign(payload) {
  const hex = Array.from(md5Bytes(payload), (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  const prefix = selectCharacters(hex, [21, 4, 9, 26, 16, 20, 27, 30]);
  const suffix = selectCharacters(hex, [18, 11, 3, 2, 1, 7, 6, 25]);
  const bytes = QQ_SIGN_MASK.map((mask, index) => Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16) ^ mask);
  let encoded = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index];
    const b = bytes[index + 1];
    const c = bytes[index + 2];
    encoded += BASE64_TABLE[a >> 2];
    encoded += BASE64_TABLE[((a & 3) << 4) | (b === undefined ? 0 : b >> 4)];
    if (b !== undefined) encoded += BASE64_TABLE[((b & 15) << 2) | (c === undefined ? 0 : c >> 6)];
    if (c !== undefined) encoded += BASE64_TABLE[c & 63];
  }
  return `zzb${prefix}${encoded}${suffix}`.toLowerCase();
}

function qqRequestBody(id, platform, begin, count) {
  return JSON.stringify({
    req_0: {
      module: "music.srfDissInfo.aiDissInfo",
      method: "uniform_get_Dissinfo",
      param: {
        disstid: Number(id),
        enc_host_uin: "",
        tag: 1,
        userinfo: 1,
        song_begin: begin,
        song_num: count,
      },
    },
    comm: { g_tk: 5381, uin: 0, format: "json", platform },
  });
}

async function requestQQPage(id, begin, count, preferredPlatform = "") {
  const platforms = preferredPlatform
    ? [preferredPlatform, ...QQ_PLATFORMS.filter((item) => item !== preferredPlatform)]
    : QQ_PLATFORMS;
  let lastError;
  for (const platform of platforms) {
    const body = qqRequestBody(id, platform, begin, count);
    const sign = await createQQSign(body);
    try {
      const response = await fetchWithTimeout(`https://u6.y.qq.com/cgi-bin/musics.fcg?sign=${sign}&_=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://y.qq.com",
          Referer: "https://y.qq.com/",
          "User-Agent": "Mozilla/5.0 (compatible; HALO-Music/1.0)",
        },
        body,
      });
      const data = await readJson(response, "QQ 音乐");
      const page = data?.req_0;
      if (page?.code === 0 && page.data && Array.isArray(page.data.songlist)) return { data: page.data, platform };
      lastError = new Error(`QQ response code ${page?.code ?? data?.code ?? "unknown"}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw new PlaylistImportError(`QQ 音乐歌单接口暂时不可用${lastError?.message ? `：${lastError.message}` : ""}`, 502);
}

function qqAlbumCover(song) {
  const mid = firstText(song?.album?.mid, song.albummid, song.albumMid);
  return mid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg` : "";
}

export function normalizeQQPlaylist(id, dirinfo, songs) {
  const tracks = songs.map((song, index) => haloTrack("qq", {
    id: song.id,
    songmid: firstText(song.mid, song.songmid, song.file?.media_mid),
    title: firstText(song.name, song.songname, song.title),
    artist: joinArtists(song.singer),
    album: firstText(song.album?.name, song.albumname),
    cover: firstText(song.album?.picUrl, qqAlbumCover(song)),
  }, index)).filter((track) => track.title);
  return playlistPayload("qq", id, firstText(dirinfo?.title, dirinfo?.dissname), tracks, dirinfo?.songnum || tracks.length);
}

async function importQQ(initialUrl) {
  let url = initialUrl;
  let id = extractQQPlaylistId(url);
  if (!id) {
    const resolved = await fetchFollowingOfficialRedirects(url, "qq");
    url = resolved.url;
    await resolved.response.body?.cancel();
    id = extractQQPlaylistId(url);
  }
  if (!id) throw new PlaylistImportError("无法从 QQ 音乐链接中识别歌单 ID");

  const firstPage = await requestQQPage(id, 0, QQ_PAGE_SIZE);
  const total = Number(firstPage.data.dirinfo?.songnum) || firstPage.data.songlist.length;
  const fetchCount = Math.min(total, MAX_QQ_TRACKS);
  const songs = [...firstPage.data.songlist];
  const starts = [];
  for (let begin = QQ_PAGE_SIZE; begin < fetchCount; begin += QQ_PAGE_SIZE) starts.push(begin);
  for (let index = 0; index < starts.length; index += 5) {
    const pages = await Promise.all(starts.slice(index, index + 5).map((begin) => (
      requestQQPage(id, begin, Math.min(QQ_PAGE_SIZE, fetchCount - begin), firstPage.platform)
    )));
    pages.forEach((page) => songs.push(...page.data.songlist));
  }
  if (!songs.length) throw new PlaylistImportError("QQ 音乐歌单中没有可导入的歌曲");
  const payload = normalizeQQPlaylist(id, firstPage.data.dirinfo, songs.slice(0, fetchCount));
  payload.total = total;
  payload.truncated = total > payload.playlists[0].tracks.length;
  return payload;
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function stripHtml(value) {
  return compactText(decodeHtml(String(value || "").replace(/<[^>]*>/g, " ")));
}

function qishuiArtist(raw) {
  const value = raw.artist_name || raw.artistName || raw.singer_name || raw.singerName
    || raw.artists || raw.singers || raw.artist || raw.singer || raw.author;
  const artist = joinArtists(value);
  return artist.split(/[•·]/)[0].trim();
}

function normalizeQishuiTrack(raw, index) {
  if (!raw || typeof raw !== "object") return null;
  const nested = raw.track || raw.music || raw.song || {};
  const title = firstText(raw.title, raw.name, raw.song_name, raw.songName, raw.music_name, raw.track_name,
    nested.title, nested.name, nested.song_name);
  const artist = firstText(qishuiArtist(raw), qishuiArtist(nested));
  if (!title || !artist || title.length > 200 || artist.length > 200) return null;
  const albumObject = raw.album || nested.album;
  return {
    id: firstText(raw.id, raw.track_id, raw.song_id, raw.music_id, nested.id, stableId(`${title}\n${artist}\n${index}`)),
    title,
    artist,
    album: firstText(albumObject?.name, raw.album, raw.album_name, nested.album_name),
    cover: firstText(raw.cover, raw.cover_url, raw.image_url, albumObject?.cover, nested.cover),
  };
}

function objectPlaylistName(object) {
  return firstText(object?.playlist_name, object?.playlistName, object?.title, object?.name, object?.mix_name);
}

function parseEmbeddedJson(html) {
  const documents = [];
  const scripts = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    const attributes = match[1];
    const raw = match[2].trim();
    if (!raw || raw.length > MAX_PAGE_BYTES) continue;
    const likelyData = /RENDER_DATA|NEXT_DATA|application\/json|ld\+json/i.test(attributes)
      || /playlist|track_list|song_list|music_list/i.test(raw);
    if (!likelyData) continue;
    const variants = [raw, decodeHtml(raw)];
    if (/%(?:7B|5B)/i.test(raw)) {
      try { variants.push(decodeURIComponent(raw)); } catch {}
    }
    for (const variant of variants) {
      const candidates = [variant];
      const objectStart = variant.indexOf("{");
      const objectEnd = variant.lastIndexOf("}");
      if (objectStart >= 0 && objectEnd > objectStart) candidates.push(variant.slice(objectStart, objectEnd + 1));
      for (const candidate of candidates) {
        try {
          documents.push(JSON.parse(candidate));
          break;
        } catch {}
      }
    }
  }
  return documents;
}

function findQishuiTrackArray(documents) {
  let best = null;
  const seen = new Set();
  const visit = (value, ancestors = [], depth = 0) => {
    if (depth > 20 || value === null || value === undefined) return;
    if (typeof value === "string" && value.length > 20 && /^[\s%]*[\[{]/.test(value)) {
      try { visit(JSON.parse(value), ancestors, depth + 1); } catch {}
      return;
    }
    if (typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, ancestors, depth + 1));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (Array.isArray(child) && child.length) {
        const tracks = child.map(normalizeQishuiTrack).filter(Boolean);
        if (tracks.length) {
          const keyBonus = /track|song|music|media|item/i.test(key) ? 100 : 0;
          const playlistBonus = /playlist|mix/i.test(key) || firstText(value.playlist_id, value.playlistId) ? 80 : 0;
          const score = tracks.length * 10 + keyBonus + playlistBonus;
          const nameOwner = [value, ...ancestors.slice().reverse()].find((item) => objectPlaylistName(item));
          if (!best || score > best.score) best = { score, tracks, owner: value, nameOwner };
        }
      }
      visit(child, [...ancestors, value], depth + 1);
    }
  };
  documents.forEach((document) => visit(document));
  return best;
}

function parseHtmlTree(html) {
  html = String(html || "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const root = { tag: "root", attrs: "", children: [] };
  const stack = [root];
  const tokens = html.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<\/?[a-z][^>]*>|[^<]+/gi);
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  for (const tokenMatch of tokens) {
    const token = tokenMatch[0];
    if (token.startsWith("<!--") || token.startsWith("<!")) continue;
    if (token.startsWith("</")) {
      const tag = token.slice(2).match(/^\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
      while (stack.length > 1) {
        const node = stack.pop();
        if (node.tag === tag) break;
      }
      continue;
    }
    if (token.startsWith("<")) {
      const parts = token.match(/^<\s*([a-z0-9-]+)([\s\S]*?)>$/i);
      if (!parts) continue;
      const node = { tag: parts[1].toLowerCase(), attrs: parts[2], children: [] };
      stack[stack.length - 1].children.push(node);
      if (!token.endsWith("/>") && !voidTags.has(node.tag)) stack.push(node);
      continue;
    }
    const text = stripHtml(token);
    if (text) stack[stack.length - 1].children.push({ tag: "#text", text, children: [] });
  }
  return root;
}

function elementChildren(node) {
  return (node?.children || []).filter((child) => child.tag !== "#text");
}

function nodeText(node) {
  if (!node) return "";
  if (node.tag === "#text") return node.text;
  return compactText((node.children || []).map(nodeText).filter(Boolean).join(" "));
}

function findDescendant(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node?.children || []) {
    const match = findDescendant(child, predicate);
    if (match) return match;
  }
  return null;
}

function collectDescendants(node, predicate, output = []) {
  if (predicate(node)) output.push(node);
  for (const child of node?.children || []) collectDescendants(child, predicate, output);
  return output;
}

function parseQishuiHtmlTracks(html) {
  const tree = parseHtmlTree(html);
  const pageRoot = findDescendant(tree, (node) => /\bid=["']root["']/i.test(node.attrs || "")) || tree;
  const titleNode = findDescendant(pageRoot, (node) => node.tag === "h1");
  const rows = collectDescendants(pageRoot, (node) => node.tag === "div");
  const tracks = [];
  for (const row of rows) {
    const rowChildren = elementChildren(row);
    const info = rowChildren[1];
    if (!info || info.tag !== "div") continue;
    const infoChildren = elementChildren(info);
    if (infoChildren.length < 2) continue;
    const title = nodeText(findDescendant(infoChildren[0], (node) => node.tag === "p"));
    const artistLine = nodeText(findDescendant(infoChildren[1], (node) => node.tag === "p"));
    const artist = artistLine.split(/[•·]/)[0].trim();
    if (!title || !artist || title.length > 200 || artist.length > 200) continue;
    tracks.push({ id: stableId(`${title}\n${artist}`), title, artist });
  }
  return { name: firstText(nodeText(titleNode), "汽水音乐歌单"), tracks };
}

export function parseQishuiPlaylistPage(html, finalUrl = "https://qishui.douyin.com/") {
  const documents = parseEmbeddedJson(html);
  const candidate = findQishuiTrackArray(documents);
  const fallback = candidate ? null : parseQishuiHtmlTracks(html);
  const rawTracks = candidate?.tracks || fallback?.tracks || [];
  const deduplicated = [];
  const keys = new Set();
  rawTracks.forEach((raw, index) => {
    const normalized = normalizeQishuiTrack(raw, index) || raw;
    const key = firstText(normalized.id, `${normalized.title}\n${normalized.artist}`).toLowerCase();
    if (!normalized.title || !normalized.artist || keys.has(key)) return;
    keys.add(key);
    deduplicated.push(haloTrack("qishui", normalized, index));
  });
  if (!deduplicated.length) throw new PlaylistImportError("未能从汽水音乐页面解析出歌曲，请确认歌单已公开");
  const url = new URL(finalUrl);
  const id = firstText(candidate?.owner?.playlist_id, candidate?.owner?.playlistId, url.searchParams.get("playlist_id"), stableId(url.href));
  const name = firstText(objectPlaylistName(candidate?.nameOwner), fallback?.name, "汽水音乐歌单");
  return playlistPayload("qishui", id, name, deduplicated, deduplicated.length);
}

async function importQishui(initialUrl) {
  const { url, response } = await fetchFollowingOfficialRedirects(initialUrl, "qishui");
  if (!response.ok) throw new PlaylistImportError(`汽水音乐页面请求失败（${response.status}）`, 502);
  const declaredLength = Number(response.headers.get("content-length"));
  if (declaredLength > MAX_PAGE_BYTES) throw new PlaylistImportError("汽水音乐歌单页面数据过大");
  const html = await response.text();
  if (html.length > MAX_PAGE_BYTES) throw new PlaylistImportError("汽水音乐歌单页面数据过大");
  return parseQishuiPlaylistPage(html, url.href);
}

export async function importPlaylistFromInput(input) {
  const url = extractSharedUrl(input);
  const source = detectPlaylistSource(url);
  if (source === "netease") return importNetease(url);
  if (source === "qq") return importQQ(url);
  return importQishui(url);
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ error: "请先登录" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "请求格式错误" }, 400);
  }
  const input = compactText(body?.url);
  if (!input || input.length > MAX_INPUT_LENGTH) return json({ error: "请输入有效的歌单分享链接" }, 400);

  try {
    return json(await importPlaylistFromInput(input));
  } catch (error) {
    console.error("playlist import failed", error);
    const status = error instanceof PlaylistImportError ? error.status : 502;
    return json({ error: error instanceof PlaylistImportError ? error.message : "歌单解析失败，请稍后重试" }, status);
  }
}
