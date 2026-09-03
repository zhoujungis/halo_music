import { authenticatedUsername } from "./_auth.js";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/134.0.0.0 Safari/537.36";
const API_TIMEOUT_MS = 5_500;
const AUDIO_TIMEOUT_MS = 12_000;
const BILI_SEARCH_TIMEOUT_MS = 9_000;
const BILI_AUDIO_TIMEOUT_MS = 15_000;
// Resolver requests can be slow, but must still have a bounded deadline.
const QQ_RESOLVER_TIMEOUT_MS = 22_000;
// Hard deadline for one detail request: bounds the worst case when upstream
// lines hang instead of watching a spinner for 30+ seconds.
const DETAIL_TIMEOUT_MS = 15_000;
// QQ detail includes provider resolution and stream verification.
const QQ_DETAIL_TIMEOUT_MS = 35_000;
// Candidates verified in parallel per batch. 2 keeps the batch from probing
// candidates beyond maxCount (no wasted upstream traffic).
const VERIFY_CONCURRENCY = 2;
// selectVerifiedAudio's own deadline when no external one is supplied.
const SELECT_AUDIO_TIMEOUT_MS = 20_000;
// vkey-style audio URLs expire in minutes, so this is a best-effort warm layer:
// stale entries self-heal through re-resolution in proxyLockedAudio instead of
// failing playback. Memory is L1, D1 (music_cache) is the shared L2.
// 音源缓存按用户要求"一直缓存"：不按时间淘汰（一年视为永久），
// 播放失败时客户端带 refresh=1 强制重新解析、校验通过后覆盖更新。
const AUDIO_CACHE_MS = 365 * 24 * 3600 * 1000;
const SEARCH_CACHE_MS = 45 * 1000;
// L1 内存缓存按 LRU 封顶：上万首歌曲命中时也不让 isolate 内存无限增长。
const memoryCache = new Map();
const MEMORY_CACHE_MAX = 500;

function memoryCacheGet(key) {
  const entry = memoryCache.get(key);
  if (entry === undefined) return undefined;
  memoryCache.delete(key);
  memoryCache.set(key, entry);
  return entry;
}

function memoryCacheSet(key, entry) {
  memoryCache.delete(key);
  memoryCache.set(key, entry);
  if (memoryCache.size > MEMORY_CACHE_MAX) {
    const oldest = memoryCache.keys().next().value;
    memoryCache.delete(oldest);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
    },
  });
}

async function cacheGet(key, env) {
  const cached = memoryCacheGet(key);
  if (cached && cached.expiresAt > Date.now()) return { ...cached.value, expiresAt: cached.expiresAt };
  if (env?.DB) {
    try {
      const row = await env.DB.prepare("SELECT value_json, expires_at FROM music_cache WHERE key = ?").bind(key).first();
      if (row && row.expires_at > Date.now()) {
        const entry = JSON.parse(row.value_json);
        memoryCacheSet(key, entry);
        return { ...entry.value, expiresAt: entry.expiresAt };
      }
    } catch {}
  }
  return null;
}

async function cacheSet(key, value, ttlMs, env, waitUntil = null) {
  const entry = { value, expiresAt: Date.now() + ttlMs };
  memoryCacheSet(key, entry);
  if (env?.DB) {
    const write = env.DB.prepare(
      "INSERT OR REPLACE INTO music_cache (key, value_json, expires_at) VALUES (?, ?, ?)",
    ).bind(key, JSON.stringify(entry), entry.expiresAt).run()
      .catch(() => {})
      .then(() => {
        // Occasional lazy cleanup keeps the table from filling with dead rows.
        if (Math.random() < 0.02) {
          return env.DB.prepare("DELETE FROM music_cache WHERE expires_at < ?").bind(Date.now()).run().catch(() => {});
        }
        return undefined;
      });
    if (waitUntil) waitUntil(write);
    else await write;
  }
}

async function cacheDelete(key, env) {
  memoryCache.delete(key);
  if (env?.DB) {
    try { await env.DB.prepare("DELETE FROM music_cache WHERE key = ?").bind(key).run(); } catch {}
  }
}

async function searchCacheGet(key, env) {
  const cached = memoryCacheGet(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  if (env?.DB) {
    try {
      const row = await env.DB.prepare("SELECT value_json, expires_at FROM search_cache WHERE key = ?").bind(key).first();
      if (row && row.expires_at > Date.now()) {
        const entry = JSON.parse(row.value_json);
        memoryCacheSet(key, entry);
        return entry.value;
      }
    } catch {}
  }
  return null;
}

async function searchCacheSet(key, value, ttlMs, env, waitUntil = null) {
  const entry = { value, expiresAt: Date.now() + ttlMs };
  memoryCacheSet(key, entry);
  if (!env?.DB) return;
  const write = env.DB.prepare(
    "INSERT OR REPLACE INTO search_cache (key, value_json, expires_at) VALUES (?, ?, ?)",
  ).bind(key, JSON.stringify(entry), entry.expiresAt).run()
    .catch(() => {})
    .then(() => {
      if (Math.random() < 0.02) {
        return env.DB.prepare("DELETE FROM search_cache WHERE expires_at < ?").bind(Date.now()).run().catch(() => {});
      }
      return undefined;
    });
  if (waitUntil) waitUntil(write);
  else await write;
}

async function request(url, options = {}, timeoutMs = API_TIMEOUT_MS, externalSignal = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onExternalAbort, { once: true });
  try {
    return await fetch(url, {
      redirect: "follow",
      ...options,
      headers: { "user-agent": USER_AGENT, ...(options.headers || {}) },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

async function withDetailDeadline(run, timeoutMs = DETAIL_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function readJson(response) {
  if (!response.ok && response.status !== 206) {
    const error = new Error(`上游返回 ${response.status}`);
    error.upstreamStatus = response.status;
    throw error;
  }
  const text = await response.text();
  if (!text.trim()) throw new Error("上游返回空内容");
  const normalized = text
    .replace(/^\s*[\w$.]+\s*\(\s*/, "")
    .replace(/\s*\)\s*;?\s*$/, "")
    .replace(/^\s*var\s+\w+\s*=\s*/, "")
    .replace(/;\s*$/, "");
  return JSON.parse(normalized);
}

function clean(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstText(...values) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

export function normalizeTimedLyric(value) {
  const raw = String(value ?? "").replace(/\\n/g, "\n").replace(/\r/g, "");
  const tagPattern = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  const matches = [...raw.matchAll(tagPattern)];
  if (!matches.length) return raw.trim();
  const lines = [];
  for (let index = 0; index < matches.length; index++) {
    const match = matches[index];
    const next = matches[index + 1];
    const text = raw.slice(match.index + match[0].length, next?.index ?? raw.length)
      .replace(/<\d+,\d+>|\(\d+,\d+\)/g, "")
      .replace(/\[[a-z]+:[^\]]*\]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    const fraction = match[3] ? `.${match[3].padEnd(2, "0").slice(0, 3)}` : "";
    lines.push(`[${String(match[1]).padStart(2, "0")}:${String(match[2]).padStart(2, "0")}${fraction}]${text}`);
  }
  return lines.join("\n");
}

function joinArtists(value) {
  if (Array.isArray(value)) {
    return value.map((artist) => clean(artist?.name ?? artist?.title ?? artist)).filter(Boolean).join(" / ");
  }
  return clean(value);
}

function qqCover(albumMid) {
  const mid = clean(albumMid);
  return mid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg` : "";
}

function qqMediaMid(song) {
  const direct = firstText(song?.file?.media_mid, song?.media_mid, song?.strMediaMid);
  if (direct) return direct;
  const filename = firstText(
    song?.song_filename_hq,
    song?.song_filename,
    song?.song_filename_lq,
    song?.song_filename_sq,
  );
  return filename.match(/^[A-Z]\d{3}([A-Za-z0-9]{8,32})\.[A-Za-z0-9]+$/)?.[1] || "";
}

function qqAudioCacheKey(mid) {
  return `qq:${mid}`;
}

function qqCacheMatchesMedia(cached, expectedMediaMid) {
  const expected = clean(expectedMediaMid);
  if (!expected) return true;
  const cachedMediaMids = (cached?.verified || []).map((candidate) => {
    try {
      const filename = new URL(candidate?.url).pathname.split("/").pop() || "";
      return qqMediaMid({ song_filename: filename });
    } catch {
      return "";
    }
  }).filter(Boolean);
  return !cachedMediaMids.length || cachedMediaMids.every((mediaMid) => mediaMid === expected);
}

async function compatibleQQCacheGet(cacheKey, mediaMid, env) {
  const cached = await cacheGet(cacheKey, env);
  if (!cached || qqCacheMatchesMedia(cached, mediaMid)) return cached;
  await cacheDelete(cacheKey, env);
  return null;
}

export function normalizeQQOfficial(data) {
  const songs = data?.req?.data?.body?.song?.list || data?.req?.data?.song?.list || [];
  if (!Array.isArray(songs)) return [];
  return songs.map((song) => {
    const mid = firstText(song?.mid, song?.songmid, song?.file?.media_mid);
    const name = firstText(song?.name, song?.title, song?.songname);
    const albumMid = firstText(song?.album?.mid, song?.albummid);
    return {
      mid,
      name,
      artist: joinArtists(song?.singer),
      album: firstText(song?.album?.name, song?.albumname),
      cover: qqCover(albumMid),
      albumMid,
      mediaMid: firstText(qqMediaMid(song), mid),
      duration: Number(song?.interval) || 0,
      pay: song?.pay?.pay_play ? "付费" : "",
    };
  }).filter((song) => song.mid && song.name);
}

export function normalizeQQLegacy(data) {
  const songs = data?.data?.song?.list || data?.song?.list || [];
  if (!Array.isArray(songs)) return [];
  return songs.map((song) => {
    const mid = firstText(song?.songmid, song?.mid, song?.file?.media_mid);
    const albumMid = firstText(song?.albummid, song?.album?.mid);
    return {
      mid,
      name: firstText(song?.songname, song?.songorig, song?.name),
      artist: joinArtists(song?.singer),
      album: firstText(song?.albumname, song?.album?.name),
      cover: qqCover(albumMid),
      albumMid,
      mediaMid: firstText(qqMediaMid(song), mid),
      duration: Number(song?.interval) || 0,
      pay: song?.pay?.payplay ? "付费" : "",
    };
  }).filter((song) => song.mid && song.name);
}

export function normalizeQQProxy(data) {
  const songs = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  return songs.map((song) => {
    const mid = firstText(song?.song_mid, song?.songmid, song?.mid, song?.id);
    return {
      mid,
      name: firstText(song?.song_title, song?.song_name, song?.name),
      artist: firstText(song?.singer_name, joinArtists(song?.artist), joinArtists(song?.singer)),
      album: firstText(song?.album_name, song?.album_title, song?.album),
      cover: firstText(song?.album_pic, song?.pic, song?.cover),
      albumMid: firstText(song?.album_mid, song?.albummid),
      mediaMid: firstText(qqMediaMid(song), mid),
      duration: Number(song?.song_play_time || song?.duration) || 0,
      pay: firstText(song?.pay, song?.vip),
    };
  }).filter((song) => song.mid && song.name);
}

function qqSearchBody(keyword, limit) {
  return {
    comm: { ct: "19", cv: "1859", uin: "0" },
    req: {
      method: "DoSearchForQQMusicDesktop",
      module: "music.search.SearchCgiService",
      param: { grp: 1, num_per_page: limit, page_num: 1, query: keyword, search_type: 0 },
    },
  };
}

async function searchQQOfficial(keyword, limit, signal = null) {
  const response = await request("https://u.y.qq.com/cgi-bin/musicu.fcg", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://y.qq.com", referer: "https://y.qq.com/" },
    body: JSON.stringify(qqSearchBody(keyword, limit)),
  }, API_TIMEOUT_MS, signal);
  return normalizeQQOfficial(await readJson(response)).slice(0, limit);
}

async function searchQQLegacy(keyword, limit) {
  const params = new URLSearchParams({ format: "json", p: "1", n: String(limit), w: keyword });
  const response = await request(`https://c.y.qq.com/soso/fcgi-bin/client_search_cp?${params}`, {
    headers: { referer: "https://y.qq.com/" },
  });
  return normalizeQQLegacy(await readJson(response)).slice(0, limit);
}

async function searchQQProvider(base, keyword, limit) {
  let lastError = null;
  const variants = [
    { msg: keyword, type: "json" },
    { server: "tencent", type: "search", id: keyword },
  ];
  for (const query of variants) {
    try {
      const endpoint = new URL(base);
      Object.entries(query).forEach(([key, value]) => endpoint.searchParams.set(key, value));
      const response = await request(endpoint.href);
      const list = normalizeQQProxy(await readJson(response)).slice(0, limit);
      if (list.length) return list;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return [];
}

async function fastestSearch(sources) {
  const errors = [];
  const attempts = sources.map((source) => Promise.resolve()
    .then(() => source.run())
    .then((list) => {
      if (!list.length) throw new Error(`${source.name}: empty result`);
      return { list, source: source.name };
    })
    .catch((error) => {
      errors.push(`${source.name}: ${error?.message || error}`);
      throw error;
    }));
  try {
    const winner = await Promise.any(attempts);
    return { ...winner, errors };
  } catch {
    return { list: [], source: "", errors };
  }
}

async function cachedSearch(cacheKey, run, env, waitUntil) {
  const cached = await searchCacheGet(cacheKey, env);
  if (cached) return cached;
  const value = await run();
  if (value.list.length) await searchCacheSet(cacheKey, value, SEARCH_CACHE_MS, env, waitUntil);
  return value;
}

async function searchQQ(keyword, limit, env, waitUntil) {
  const sources = [
    { name: "qq-official-musicu", run: () => searchQQOfficial(keyword, limit) },
    { name: "qq-official-legacy", run: () => searchQQLegacy(keyword, limit) },
  ];
  configuredProviderUrls(env?.QQ_SOURCE_URLS)
    .forEach((base, index) => sources.push({
      name: `qq-provider-${index + 1}`,
      run: () => searchQQProvider(base, keyword, limit),
    }));
  return cachedSearch(`search:qq:${keyword}:${limit}`, () => fastestSearch(sources), env, waitUntil);
}

function configuredProviderUrl(value) {
  const url = String(value || "").trim().replace(/\/$/, "");
  return /^https?:\/\//i.test(url) ? url : "";
}

function configuredProviderUrls(value) {
  return String(value || "")
    .split(/[\r\n,]+/)
    .map((item) => configuredProviderUrl(item))
    .filter(Boolean);
}

function neteaseProviderUrls(env) {
  return configuredProviderUrls(env?.NETEASE_SOURCE_URLS);
}

async function searchNetease(keyword, limit, env) {
  const providers = neteaseProviderUrls(env);
  for (const base of providers) {
    try {
      const endpoint = new URL(`${base}/`);
      endpoint.search = new URLSearchParams({ type: "search", id: keyword, limit: String(limit), server: "netease" });
      const data = await readJson(await request(endpoint.href, {}, API_TIMEOUT_MS));
      const rows = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      if (rows.length) return rows.slice(0, limit);
    } catch (error) {
      console.warn("Netease provider unavailable", error);
    }
  }
  return [];
}

function validNeteaseId(value) {
  return /^\d{1,20}$/.test(clean(value));
}

async function resolveNeteaseProvider(base, id, signal = null) {
  const endpoint = new URL(`${base}/`);
  endpoint.search = new URLSearchParams({ server: "netease", type: "url", id: clean(id), br: "320" });
  const response = await request(endpoint.href, { redirect: "manual" }, API_TIMEOUT_MS, signal);
  const redirect = response.headers.get("location");
  if (redirect && response.status >= 300 && response.status < 400) {
    return new URL(redirect, endpoint.href).href;
  }
  if (!redirect && response.status >= 300 && response.status < 400) {
    response.body?.cancel();
    const followed = await request(endpoint.href, { redirect: "follow" }, API_TIMEOUT_MS, signal);
    if (followed.url && followed.url !== endpoint.href && /^https?:\/\//i.test(followed.url)) {
      followed.body?.cancel();
      return followed.url;
    }
    followed.body?.cancel();
    throw new Error(`redirect without Location (HTTP ${response.status})`);
  }
  // A few Workers-compatible proxies hide Location when redirect mode is
  // manual. If they followed the redirect anyway, Response.url still
  // identifies the final audio resource without reading its body.
  if (response.url && response.url !== endpoint.href && /^https?:\/\//i.test(response.url)) {
    const type = (response.headers.get("content-type") || "").toLowerCase();
    if (type.startsWith("audio/") || type.startsWith("video/") || type.includes("octet-stream")) {
      response.body?.cancel();
      return response.url;
    }
  }
  if (!response.ok) {
    response.body?.cancel();
    throw new Error(`HTTP ${response.status}`);
  }
  const body = (await response.text()).trim();
  let value = body;
  try {
    const data = JSON.parse(body);
    const parsed = typeof data === "string"
      ? data
      : firstText(
        data?.url,
        data?.audioUrl,
        data?.data?.url,
        data?.data?.audioUrl,
        data?.data,
      );
    if (parsed) value = parsed;
  } catch {
    // Some proxies return a URL as plain text or use a non-JSON MIME type.
  }
  if (value.startsWith("@")) value = value.slice(1).trim();
  if (/^(?:https?:)?\/\//i.test(value)) return new URL(value, endpoint.href).href;
  throw new Error(`no URL (${response.headers.get("content-type") || "unknown"})`);
}

export async function resolveNeteaseUrl(id, env, signal = null) {
  const providers = neteaseProviderUrls(env);
  if (!providers.length) throw new Error("Netease providers are not configured");
  const failures = [];
  const attempts = providers.map((base) => resolveNeteaseProvider(base, id, signal).catch((error) => {
    failures.push(`${base}: ${error?.message || error}`);
    throw error;
  }));
  try {
    return await Promise.any(attempts);
  } catch {
    if (signal?.aborted) throw Object.assign(new Error("Netease resolver aborted"), { name: "AbortError" });
    const error = new Error("Netease providers returned no playable stream");
    error.providerFailures = failures;
    throw error;
  }
}

async function proxyNeteaseLyric(id, env) {
  for (const base of neteaseProviderUrls(env)) {
    try {
      const endpoint = new URL(`${base}/`);
      endpoint.search = new URLSearchParams({ server: "netease", type: "lrc", id: clean(id) });
      const response = await request(endpoint.href, {}, API_TIMEOUT_MS);
      if (!response.ok) {
        response.body?.cancel();
        continue;
      }
      const headers = new Headers();
      const type = response.headers.get("content-type");
      if (type) headers.set("content-type", type);
      headers.set("cache-control", "private, max-age=120");
      return new Response(response.body, { status: response.status, headers });
    } catch {}
  }
  return json({ error: "Netease providers unavailable" }, 503);
}

export function biliDurationSeconds(value) {
  const text = clean(value);
  if (!text) return 0;
  const parts = text.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(parts[0]) || 0;
}

function biliVideoId(value) {
  const text = clean(value);
  const match = text.match(/\/(BV[0-9A-Za-z]+)(?:[/?#]|$)/i) || text.match(/\b(BV[0-9A-Za-z]+)\b/i);
  return match ? match[1] : "";
}

function biliAid(value) {
  const text = clean(value);
  const match = text.match(/(?:^|[/?#])av?(\d+)(?:[/?#]|$)/i) || text.match(/^\d+$/);
  return match ? (match[1] || match[0]) : "";
}

export function normalizeBiliSearchResults(data, targetTitle = "", targetArtist = "", targetDuration = 0) {
  const rawResults = Array.isArray(data?.data?.result) ? data.data.result : [];
  // /search/all/v2 returns modules ({ result_type: "video", data: [...] }),
  // while the legacy /search/type endpoint returned a flat video array.
  const rows = rawResults.flatMap((entry) => {
    if (entry?.result_type === "video" && Array.isArray(entry.data)) return entry.data;
    if (entry?.type === "video" || entry?.bvid || entry?.aid) return [entry];
    return [];
  });
  const titleKey = normalizedMatchText(targetTitle);
  const artistKey = normalizedMatchText(targetArtist);
  return rows.map((item, index) => {
    const bvid = firstText(item?.bvid, biliVideoId(item?.arcurl), biliVideoId(item?.url));
    const aid = firstText(item?.aid, biliAid(item?.arcurl), biliAid(item?.url));
    const title = firstText(item?.title, item?.description);
    const artist = firstText(item?.author, item?.up_name);
    const duration = biliDurationSeconds(item?.duration);
    const cleanPic = firstText(item?.pic, item?.thumbnail).replace(/^\/\//, "https:");
    const titleKeyCandidate = normalizedMatchText(title);
    const artistKeyCandidate = normalizedMatchText(artist);
    const titleMatch = titleKey && titleKeyCandidate && (titleKeyCandidate.includes(titleKey) || titleKey.includes(titleKeyCandidate));
    const artistMatch = artistKey && artistKeyCandidate && (artistKeyCandidate.includes(artistKey) || artistKey.includes(artistKeyCandidate));
    const durationDiff = targetDuration > 0 && duration > 0 ? Math.abs(duration - targetDuration) : 0;
    const durationTolerance = targetDuration > 0 ? Math.max(6, targetDuration * 0.1) : 0;
    let score = Math.max(0, 20 - index * 0.2);
    if (titleKeyCandidate === titleKey) score += 70;
    else if (titleMatch) score += 42;
    if (artistKeyCandidate === artistKey) score += 40;
    else if (artistMatch) score += 24;
    if (targetDuration > 0 && duration > 0) {
      score += Math.max(0, 35 - durationDiff * 1.5);
      if (durationDiff <= durationTolerance) score += 22;
    }
    return {
      source: "bilibili",
      bvid,
      aid,
      page: 1,
      title,
      artist,
      duration,
      cover: cleanPic,
      pageUrl: bvid ? `https://www.bilibili.com/video/${bvid}` : "",
      score,
    };
  })
    .filter((item) => (item.bvid || item.aid) && item.title)
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...item }) => item);
}

async function searchBilibili(keyword, targetTitle, targetArtist, targetDuration, limit, env, waitUntil) {
  const query = clean(keyword || `${targetArtist} ${targetTitle}`);
  const cacheKey = `search:bilibili:${query}:${targetTitle}:${targetArtist}:${targetDuration}:${limit}`;
  return cachedSearch(cacheKey, async () => {
    const params = new URLSearchParams({
      search_type: "video",
      keyword: query,
      page: "1",
      pagesize: String(Math.min(20, Math.max(5, limit * 2))),
      order: "totalrank",
    });
    const response = await request(`https://api.bilibili.com/x/web-interface/search/all/v2?${params}`, {
      headers: { referer: "https://search.bilibili.com/", origin: "https://search.bilibili.com" },
    }, BILI_SEARCH_TIMEOUT_MS);
    const data = await readJson(response);
    if (data?.code !== 0) throw new Error(`Bilibili search failed (${data?.code ?? "unknown"})`);
    const list = normalizeBiliSearchResults(data, targetTitle, targetArtist, targetDuration).slice(0, limit);
    return { list, source: "bilibili", errors: [] };
  }, env, waitUntil);
}

function validBiliVideoId(value) {
  return /^BV[0-9A-Za-z]{6,}$/i.test(clean(value));
}

function validBiliAid(value) {
  return /^\d{1,20}$/.test(clean(value));
}

async function fetchBiliView(videoId, aid, signal = null) {
  const params = new URLSearchParams();
  if (videoId) params.set("bvid", videoId);
  else params.set("aid", aid);
  const response = await request(`https://api.bilibili.com/x/web-interface/view?${params}`, {
    headers: { referer: videoId ? `https://www.bilibili.com/video/${videoId}` : "https://www.bilibili.com/" },
  }, BILI_SEARCH_TIMEOUT_MS, signal);
  const data = await readJson(response);
  if (data?.code !== 0 || !data?.data) throw new Error(`Bilibili video detail failed (${data?.code ?? "unknown"})`);
  return data.data;
}

async function fetchBiliPlayUrl(videoId, aid, cid, signal = null) {
  // DASH exposes an audio-only stream and avoids downloading the video track.
  // Keep a low-quality progressive MP4 fallback for older/limited videos.
  const requests = [
    { fnval: 16, qn: 64, platform: "pc" },
    { fnval: 16, qn: 32, platform: "pc" },
    { fnval: 1, qn: 32, platform: "html5" },
    { fnval: 1, qn: 16, platform: "html5" },
  ];
  let lastError = null;
  const streamCandidateUrl = (item) => {
    const backup = item?.backup_url ?? item?.backupUrl;
    const value = clean(item?.url || item?.baseUrl || item?.base_url || (Array.isArray(backup) ? backup[0] : backup));
    return value.startsWith("//") ? `https:${value}` : value;
  };
  for (const format of requests) {
    const params = new URLSearchParams({
      cid: String(cid),
      qn: String(format.qn),
      fnval: String(format.fnval),
      fnver: "0",
      fourk: "0",
      platform: format.platform,
      otype: "json",
    });
    if (videoId) params.set("bvid", videoId);
    else params.set("avid", aid);
    try {
      const response = await request(`https://api.bilibili.com/x/player/playurl?${params}`, {
        headers: { referer: videoId ? `https://www.bilibili.com/video/${videoId}` : "https://www.bilibili.com/" },
      }, BILI_AUDIO_TIMEOUT_MS, signal);
      const data = await readJson(response);
      if (data?.code !== 0) {
        lastError = new Error(`Bilibili playurl failed (${data?.code ?? "unknown"})`);
        continue;
      }
      const durl = Array.isArray(data?.data?.durl) ? data.data.durl : [];
      const dashAudio = Array.isArray(data?.data?.dash?.audio) ? data.data.dash.audio : [];
      const first = (format.fnval === 16 ? dashAudio : durl).map((item) => ({ item, url: streamCandidateUrl(item) })).find(({ url }) => /^https?:\/\//i.test(url))
        || durl.map((item) => ({ item, url: streamCandidateUrl(item) })).find(({ url }) => /^https?:\/\//i.test(url))
        || dashAudio.map((item) => ({ item, url: streamCandidateUrl(item) })).find(({ url }) => /^https?:\/\//i.test(url));
      const streamUrl = first?.url || "";
      if (streamUrl) return { url: streamUrl, container: "mp4" };
      lastError = new Error("Bilibili returned no playable stream");
    } catch (error) {
      if (signal?.aborted) throw error;
      lastError = error;
    }
  }
  throw lastError || new Error("Bilibili returned no playable stream");
}

async function proxyBilibiliAudio(videoId, aid, duration, page, requestObject) {
  const detail = await fetchBiliView(videoId, aid);
  const pages = Array.isArray(detail?.pages) ? detail.pages : [];
  if (!pages.length) throw new Error("Bilibili video has no playable page");
  const targetDuration = Number(duration) || 0;
  const requestedPage = Math.max(1, Number(page) || 1);
  const pageEntry = pages.find((item) => Number(item?.page) === requestedPage) || pages[0];
  const selectedPage = targetDuration > 0
    ? pages.reduce((best, item) => Math.abs(Number(item?.duration || 0) - targetDuration) < Math.abs(Number(best?.duration || 0) - targetDuration) ? item : best, pageEntry)
    : pageEntry;
  const cid = clean(selectedPage?.cid);
  if (!/^\d+$/.test(cid)) throw new Error("Bilibili page has no cid");
  const stream = await fetchBiliPlayUrl(videoId, aid, cid);
  const range = requestObject.headers.get("range") || "bytes=0-";
  const upstream = await request(stream.url, {
    headers: { range, referer: videoId ? `https://www.bilibili.com/video/${videoId}` : "https://www.bilibili.com/" },
  }, BILI_AUDIO_TIMEOUT_MS);
  if (!isAudioResponse(upstream)) {
    upstream.body?.cancel();
    throw new Error(`Bilibili stream unavailable (${upstream.status})`);
  }
  return audioResponse(upstream, "bilibili", stream.container);
}

function validQQMid(value) {
  return /^[A-Za-z0-9]{8,32}$/.test(value);
}

async function resolveQQDetail(mid, keyword, signal = null, env = null) {
  const query = keyword || mid;
  let lastError = null;
  for (const base of configuredProviderUrls(env?.QQ_SOURCE_URLS)) {
    try {
      const endpoint = new URL(base);
      endpoint.searchParams.set("msg", query);
      endpoint.searchParams.set("type", "json");
      endpoint.searchParams.set("mid", mid);
      const data = await readJson(await request(endpoint.href, {}, QQ_RESOLVER_TIMEOUT_MS, signal));
      if (data && typeof data === "object" && firstText(data.song_mid) === mid) return data;
    } catch (error) {
      lastError = error;
      if (signal?.aborted) throw error;
    }
  }
  throw lastError || new Error("QQ provider returned no matching song");
}

function qqAudioChoices(detail) {
  const choices = [
    [detail?.song_play_url_hq, "192k", "192K"],
    [detail?.song_play_url_standard, "96k", "96K"],
    [detail?.song_play_url, null, null],
    [detail?.song_play_url_fq, "48k", "48K"],
    [detail?.song_play_url_sq, "lossless", "LOSSLESS"],
    [detail?.song_play_url_pq, "lossless", "LOSSLESS"],
  ];
  const seen = new Set();
  return choices.map(([url, quality, qualityLabel], index) => ({
    url: clean(url),
    quality,
    qualityLabel,
    source: `qq-provider-${quality || `default-${index}`}`,
    // Keyed by the exact song mid, so no ID3 cross-check needed.
    skipIdentityCheck: true,
  }))
    .filter((choice) => /^https?:\/\//i.test(choice.url) && !seen.has(choice.url) && seen.add(choice.url));
}

async function qqOfficialVkey(mid, keyword, mediaMid = "", signal = null) {
  let resolvedMediaMid = clean(mediaMid);
  if (!resolvedMediaMid || resolvedMediaMid === mid) {
    const songs = await searchQQOfficial(keyword || mid, 20, signal);
    const match = songs.find((song) => song.mid === mid);
    resolvedMediaMid = match?.mediaMid || resolvedMediaMid || mid;
  }
  const filenames = [`M800${resolvedMediaMid}.mp3`, `M500${resolvedMediaMid}.mp3`, `C400${resolvedMediaMid}.m4a`];
  // Rotate parameter sets: on shared Cloudflare egress IPs QQ throttles some
  // ct/platform pairs after request bursts, and different pairs are counted
  // separately. A combo that answered (even with empty purls, e.g. paywalled
  // songs) is treated as definitive and ends the rotation.
  const combos = [
    { ct: 24, platform: "20", loginflag: 1 },
    { ct: 25, platform: "23", loginflag: 1 },
    { ct: 24, platform: "10", loginflag: 1 },
  ];
  const quality = ["320k", "128k", "96k"];
  for (const combo of combos) {
    const body = {
      comm: { ct: combo.ct, cv: 0, uin: "0" },
      req: {
        module: "vkey.GetVkeyServer",
        method: "CgiGetVkey",
        param: {
          guid: String(Math.floor(Math.random() * 1e10)).padStart(10, "0"),
          songmid: filenames.map(() => mid), songtype: filenames.map(() => 0),
          uin: "0", loginflag: combo.loginflag, platform: combo.platform, filename: filenames,
        },
      },
    };
    try {
      const response = await request("https://u.y.qq.com/cgi-bin/musicu.fcg", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://y.qq.com", referer: "https://y.qq.com/" },
        body: JSON.stringify(body),
      }, API_TIMEOUT_MS, signal);
      const data = (await readJson(response))?.req?.data || {};
      const list = data.midurlinfo;
      if (!Array.isArray(list)) continue; // throttled/malformed — try next combo
      const sip = Array.isArray(data.sip) ? data.sip : [];
      return list.map((item, index) => ({
        url: item?.purl && sip[0] ? new URL(item.purl, sip[0]).href : "",
        quality: quality[index] || null,
        qualityLabel: (quality[index] || "").toUpperCase() || null,
        source: "qq-official-vkey",
        skipIdentityCheck: true,
      })).filter((item) => item.url);
    } catch (error) {
      if (signal?.aborted) throw error;
    }
  }
  return [];
}

// QQ 官方歌词接口独立于音源链路，VIP 歌曲的歌词不受付费墙限制。
async function qqOfficialLyric(mid, signal = null) {
  const response = await request(
    `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${encodeURIComponent(mid)}&format=json&nobase64=1`,
    {
      headers: {
        referer: "https://y.qq.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    },
    8_000,
    signal,
  );
  const data = await readJson(response);
  if (data?.code !== 0 || typeof data?.lyric !== "string" || !data.lyric.trim()) return "";
  return data.lyric;
}

async function qqAudioCandidates(mid, keyword, mediaMid, signal = null, { skipProxy = false, proxyDetail = null, proxyAttempted = false, env = null } = {}) {
  const candidates = [];
  if (!skipProxy && proxyDetail) {
    candidates.push(...qqAudioChoices(proxyDetail));
  } else if (!skipProxy && !proxyAttempted) {
    try { candidates.push(...qqAudioChoices(await resolveQQDetail(mid, keyword, signal, env))); } catch {}
  }
  const resolvedMediaMid = firstText(qqMediaMid(proxyDetail), mediaMid);
  try { candidates.push(...await qqOfficialVkey(mid, keyword, resolvedMediaMid, signal)); } catch {}
  configuredProviderUrls(env?.QQ_SOURCE_URLS).forEach((base, index) => {
    candidates.push({
      url: `${base}?server=tencent&type=url&id=${encodeURIComponent(mid)}`,
      quality: null,
      qualityLabel: null,
      source: `qq-provider-${index + 1}`,
    });
  });
  return candidates;
}

function isAudioResponse(response) {
  if (!response || (!response.ok && response.status !== 206)) return false;
  const type = (response.headers.get("content-type") || "").toLowerCase();
  return type.startsWith("audio/") || type.startsWith("video/mp4") || type.includes("application/octet-stream") || type.includes("application/ogg")
    || (response.status === 206 && Boolean(response.headers.get("content-range")));
}

function audioResponse(upstream, source, container = "") {
  const headers = new Headers();
  for (const name of ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  const correctedType = { flac: "audio/flac", ogg: "audio/ogg", mpeg: "audio/mpeg", wav: "audio/wav", mp4: "audio/mp4" }[container];
  if (correctedType) headers.set("content-type", correctedType);
  headers.set("cache-control", "private, max-age=120");
  headers.set("x-halo-music-source", source);
  return new Response(upstream.body, { status: upstream.status, headers });
}

function responseTotalBytes(response) {
  const range = response.headers.get("content-range") || "";
  const total = Number(range.match(/\/(\d+)$/)?.[1]);
  if (Number.isFinite(total) && total > 0) return total;
  if (response.status === 200) {
    const length = Number(response.headers.get("content-length"));
    if (Number.isFinite(length) && length > 0) return length;
  }
  return 0;
}

function isPlausiblyComplete(response, durationSeconds) {
  const duration = Number(durationSeconds) || 0;
  const total = responseTotalBytes(response);
  if (duration <= 30 || total <= 0) return true;
  // Provider music streams are at least 48 kbps. A smaller average bitrate
  // indicates a preview/placeholder whose real duration is far below the song.
  return total >= duration * 6_000;
}

export function detectAudioContainer(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  const ascii = (start, length) => String.fromCharCode(...data.slice(start, start + length));
  if (ascii(0, 4) === "fLaC") return "flac";
  if (ascii(0, 4) === "OggS") return "ogg";
  if (ascii(0, 3) === "ID3" || (data[0] === 0xff && (data[1] & 0xe0) === 0xe0)) return "mpeg";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE") return "wav";
  if (ascii(4, 4) === "ftyp") return "mp4";
  return "";
}

function mpegFrameInfo(bytes, offset) {
  if (offset + 4 > bytes.length || bytes[offset] !== 0xff || (bytes[offset + 1] & 0xe0) !== 0xe0) return null;
  const versionBits = (bytes[offset + 1] >> 3) & 3;
  const layerBits = (bytes[offset + 1] >> 1) & 3;
  const bitrateIndex = (bytes[offset + 2] >> 4) & 15;
  const sampleRateIndex = (bytes[offset + 2] >> 2) & 3;
  if (versionBits === 1 || layerBits !== 1 || !bitrateIndex || bitrateIndex === 15 || sampleRateIndex === 3) return null;
  const mpeg1 = versionBits === 3;
  const bitrates = mpeg1
    ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
    : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  const rates = versionBits === 3 ? [44100, 48000, 32000]
    : (versionBits === 2 ? [22050, 24000, 16000] : [11025, 12000, 8000]);
  const bitrate = bitrates[bitrateIndex] * 1000;
  const sampleRate = rates[sampleRateIndex];
  const padding = (bytes[offset + 2] >> 1) & 1;
  const frameLength = Math.floor((mpeg1 ? 144 : 72) * bitrate / sampleRate) + padding;
  return frameLength >= 24 ? { bitrate, sampleRate, frameLength } : null;
}

export function estimateMpegDuration(bytes, totalBytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  const total = Number(totalBytes) || 0;
  if (!total) return 0;
  for (let offset = 0; offset + 4 < data.length; offset += 1) {
    const first = mpegFrameInfo(data, offset);
    if (!first) continue;
    const second = mpegFrameInfo(data, offset + first.frameLength);
    if (!second || second.bitrate !== first.bitrate || second.sampleRate !== first.sampleRate) continue;
    return total * 8 / first.bitrate;
  }
  return 0;
}

function decodeId3Text(bytes) {
  if (!bytes.length) return "";
  const encoding = bytes[0];
  const payload = bytes.slice(1);
  try {
    if (encoding === 1 || encoding === 2) {
      const even = payload.length % 2 ? payload.slice(0, -1) : payload;
      return new TextDecoder(encoding === 2 ? "utf-16be" : "utf-16").decode(even).replace(/\0/g, "").trim();
    }
    return new TextDecoder("utf-8").decode(payload).replace(/\0/g, "").trim();
  } catch {
    return "";
  }
}

function extractId3Identity(bytes) {
  if (String.fromCharCode(...bytes.slice(0, 3)) !== "ID3") return {};
  const version = bytes[3] || 0;
  const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
  const end = Math.min(bytes.length, 10 + tagSize);
  const identity = {};
  for (let offset = 10; offset + 10 <= end;) {
    const id = String.fromCharCode(...bytes.slice(offset, offset + 4));
    const size = version >= 4
      ? ((bytes[offset + 4] & 0x7f) << 21) | ((bytes[offset + 5] & 0x7f) << 14) | ((bytes[offset + 6] & 0x7f) << 7) | (bytes[offset + 7] & 0x7f)
      : new DataView(bytes.buffer, bytes.byteOffset + offset + 4, 4).getUint32(0);
    if (!/^(TIT2|TPE1|TALB)$/.test(id) || size <= 1 || offset + 10 + size > end) {
      if (!id.trim() || size <= 0) break;
      offset += 10 + size;
      continue;
    }
    const value = decodeId3Text(bytes.slice(offset + 10, offset + 10 + size));
    if (id === "TIT2") identity.title = value;
    if (id === "TPE1") identity.artist = value;
    if (id === "TALB") identity.album = value;
    offset += 10 + size;
  }
  return identity;
}

function normalizedMatchText(value) {
  return clean(value).toLowerCase().replace(/[\s\-_/.,!?，。！？：:()（）[\]【】]/g, "");
}

function matchesIdentity(expected, actual) {
  const title = normalizedMatchText(expected?.title);
  const artist = normalizedMatchText(expected?.artist);
  if (!title && !artist) return true;
  const actualTitle = normalizedMatchText(actual?.title);
  const actualArtist = normalizedMatchText(actual?.artist);
  if (title && actualTitle && !actualTitle.includes(title) && !title.includes(actualTitle)) return false;
  if (artist && actualArtist && !actualArtist.includes(artist) && !artist.includes(actualArtist)) return false;
  return true;
}

async function probeAudioRange(candidate, range, referer, durationSeconds, signal = null) {
  const response = await request(candidate.url, { headers: { range, referer } }, AUDIO_TIMEOUT_MS, signal);
  if (!isAudioResponse(response)) {
    response.body?.cancel();
    throw new Error(`非音频响应 ${response.status} ${response.headers.get("content-type") || ""}`);
  }
  if (response.status !== 206 || !response.headers.get("content-range")) {
    response.body?.cancel();
    throw new Error("音频源不支持分段校验");
  }
  if (!isPlausiblyComplete(response, durationSeconds)) {
    const total = responseTotalBytes(response);
    response.body?.cancel();
    throw new Error(`疑似试听片段（${total} bytes / ${durationSeconds}s）`);
  }
  const total = responseTotalBytes(response);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length || !bytes.some((byte) => byte !== 0)) throw new Error("音频分段内容为空");
  return { total, type: response.headers.get("content-type") || "", bytes };
}

async function verifyAudioCandidate(candidate, cacheKey, durationSeconds, identity = {}, signal = null) {
  const referer = "https://y.qq.com/";
  const expectedDuration = Number(durationSeconds) || 0;
  const resolvedDuration = Number(candidate.resolvedDuration) || 0;
  if (expectedDuration > 30 && resolvedDuration > 30) {
    const tolerance = Math.max(3, expectedDuration * 0.03);
    if (Math.abs(expectedDuration - resolvedDuration) > tolerance) {
      throw new Error(`解析结果时长不匹配（${resolvedDuration}s / ${expectedDuration}s）`);
    }
  }
  const head = await probeAudioRange(candidate, "bytes=0-4095", referer, durationSeconds, signal);
  if (head.total < 12_288) throw new Error(`音频文件过小（${head.total} bytes）`);
  const container = detectAudioContainer(head.bytes);
  if (!container) throw new Error("音频文件头无法被浏览器识别（可能是加密格式）");
  const estimatedDuration = container === "mpeg" ? estimateMpegDuration(head.bytes, head.total) : 0;
  if (expectedDuration > 30 && estimatedDuration > 30) {
    const tolerance = Math.max(4, expectedDuration * 0.04);
    if (Math.abs(expectedDuration - estimatedDuration) > tolerance) {
      throw new Error(`音频实际时长不匹配（${estimatedDuration.toFixed(1)}s / ${expectedDuration}s）`);
    }
  }
  if (!candidate.skipIdentityCheck) {
    // Sources keyed by provider id (mid/rid) skip this: their URL already
    // pins the exact song, and the ID3 tags are often absent or messy.
    const taggedIdentity = extractId3Identity(head.bytes);
    if (!matchesIdentity(identity, taggedIdentity)) throw new Error("音频标签与目标歌曲不匹配");
  }
  // Two probes per candidate (head + tail) instead of three: the middle
  // probe rarely caught anything the tail probe missed, and dropping it
  // cuts verification latency by a third under load.
  const tailStart = Math.max(8192, head.total - 4096);
  const tail = await probeAudioRange(candidate, `bytes=${tailStart}-${head.total - 1}`, referer, durationSeconds, signal);
  if (tail.total !== head.total) throw new Error("音频总长度在校验中发生变化");
  return { ...candidate, totalBytes: head.total, contentType: head.type, container, estimatedDuration, verifiedAt: Date.now() };
}

async function selectVerifiedAudio(cacheKey, candidates, durationSeconds, identity = {}, env, { maxCount = 2, signal = null, timeoutMs = SELECT_AUDIO_TIMEOUT_MS, skipCache = false } = {}) {
  if (!skipCache) {
    const cached = await cacheGet(cacheKey, env);
    if (cached && cached.expiresAt > Date.now() && cached.verified?.length) return cached;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort, { once: true });
  try {
    const verified = [];
    const errors = [];
    let start = 0;
    // Verify in order-preserving parallel batches instead of one long serial
    // chain: under load the serial chain was the main latency multiplier.
    while (start < candidates.length && verified.length < maxCount && !controller.signal.aborted) {
      const batch = candidates.slice(start, start + VERIFY_CONCURRENCY);
      const outcomes = await Promise.all(batch.map((candidate) => verifyAudioCandidate(candidate, cacheKey, durationSeconds, identity, controller.signal)
        .then((entry) => ({ entry }))
        .catch((error) => ({ error: error?.name === "AbortError" ? "线路校验超时" : (error?.message || error) }))));
      outcomes.forEach((outcome, offset) => {
        if (outcome.entry) verified.push(outcome.entry);
        else if (errors.length < 12) errors.push(`${candidates[start + offset]?.source || "unknown"}: ${outcome.error}`);
      });
      if (verified.length > maxCount) verified.length = maxCount;
      start += batch.length;
    }
    if (!verified.length) {
      const message = controller.signal.aborted
        ? `音乐源解析超时（${errors.join("；") || "所有线路均未在限时内通过校验"}）`
        : (errors.join("；") || "没有可用音频线路");
      throw Object.assign(new Error(message), controller.signal.aborted ? { status: 504 } : {});
    }
    const cachedValue = { verified, identity, expiresAt: Date.now() + AUDIO_CACHE_MS };
    await cacheSet(cacheKey, cachedValue, AUDIO_CACHE_MS, env);
    return cachedValue;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onExternalAbort);
  }
}

async function streamLockedCandidate(cacheKey, getCandidates, lockedSource, requestObject, durationSeconds, lockedContainer = "", lockedBytes = 0, env) {
  const cached = await cacheGet(cacheKey, env);
  let candidate = cached?.verified?.find((item) => item.source === lockedSource) || null;
  if (!candidate) {
    const candidates = await getCandidates();
    candidate = candidates.find((item) => item.source === lockedSource);
  }
  if (!candidate) throw Object.assign(new Error("已锁定的播放线路已失效，请重新点击播放"), { status: 409 });
  const referer = "https://y.qq.com/";
  const range = requestObject.headers.get("range") || "bytes=0-";
  const response = await request(candidate.url, { headers: { range, referer } }, AUDIO_TIMEOUT_MS);
  if (!isAudioResponse(response) || !isPlausiblyComplete(response, durationSeconds)) {
    response.body?.cancel();
    await cacheDelete(cacheKey, env);
    throw new Error("已验证的播放线路当前不可用");
  }
  const actualBytes = responseTotalBytes(response);
  if (lockedBytes > 0 && actualBytes > 0 && actualBytes !== lockedBytes) {
    response.body?.cancel();
    await cacheDelete(cacheKey, env);
    throw new Error("音频源在验证后发生变化");
  }
  return audioResponse(response, lockedSource, candidate.container || lockedContainer);
}

async function proxyLockedAudio(cacheKey, getCandidates, lockedSource, requestObject, durationSeconds, lockedContainer = "", lockedBytes = 0, env, identity = {}) {
  if (!lockedSource) throw Object.assign(new Error("请先完成播放线路检测"), { status: 409 });
  try {
    return await streamLockedCandidate(cacheKey, getCandidates, lockedSource, requestObject, durationSeconds, lockedContainer, lockedBytes, env);
  } catch (error) {
    if (error?.status === 409) throw error;
    // The verified line went stale (expired vkey / throttled CDN): re-resolve
    // once and stream from the freshest available line instead of failing.
    const cached = await cacheGet(cacheKey, env);
    try {
      await selectVerifiedAudio(cacheKey, await getCandidates(), durationSeconds, cached?.identity || identity, env);
    } catch {
      throw Object.assign(new Error("播放线路失效且自动重新解析失败，请重新点击播放"), { status: 409 });
    }
    const fresh = await cacheGet(cacheKey, env);
    const freshCandidate = fresh?.verified?.[0] || null;
    if (!freshCandidate) throw Object.assign(new Error("播放线路失效且自动重新解析失败，请重新点击播放"), { status: 409 });
    const range = requestObject.headers.get("range") || "bytes=0-";
    const referer = "https://y.qq.com/";
    const response = await request(freshCandidate.url, { headers: { range, referer } }, AUDIO_TIMEOUT_MS);
    if (!isAudioResponse(response) || !isPlausiblyComplete(response, durationSeconds)) {
      response.body?.cancel();
      throw Object.assign(new Error("重新解析的播放线路不可用，请重新点击播放"), { status: 409 });
    }
    return audioResponse(response, freshCandidate.source, freshCandidate.container);
  }
}

export async function onRequestGet({ request: requestObject, env, waitUntil }) {
  try {
    const url = new URL(requestObject.url);
    const action = url.searchParams.get("action") || "";
    if (["qq_detail", "qq_audio", "qq_lyric", "bili_audio", "netease_detail", "netease_audio", "netease_lyric"].includes(action)) {
      if (!env?.DB) return json({ error: "播放服务未初始化" }, 503);
      const username = await authenticatedUsername(requestObject, env);
      if (!username) return json({ error: "请先登录后播放" }, 401);
    }
    const keyword = (url.searchParams.get("q") || "").trim().slice(0, 100);
    const limit = Math.min(30, Math.max(1, Number(url.searchParams.get("limit")) || 10));
    const duration = Math.min(24 * 60 * 60, Math.max(0, Number(url.searchParams.get("duration")) || 0));
    const lockedSource = clean(url.searchParams.get("source"));
    const lockedContainer = /^(flac|ogg|mpeg|wav|mp4)$/.test(clean(url.searchParams.get("container")))
      ? clean(url.searchParams.get("container"))
      : "";
    const lockedBytes = Math.max(0, Number(url.searchParams.get("bytes")) || 0);
    const targetIdentity = {
      title: clean(url.searchParams.get("title")),
      artist: clean(url.searchParams.get("artist")),
    };

    if (action === "netease_search") {
      if (!keyword) return json({ error: "缺少关键词" }, 400);
      const neteaseLimit = Math.min(120, Math.max(1, Number(url.searchParams.get("limit")) || 10));
      const data = await searchNetease(keyword, neteaseLimit, env);
      return json({ code: 200, data });
    }

    if (action === "netease_audio") {
      const id = clean(url.searchParams.get("id"));
      if (!validNeteaseId(id)) return json({ error: "网易云歌曲 ID 无效" }, 400);
      const streamUrl = await resolveNeteaseUrl(id, env);
      const range = requestObject.headers.get("range") || "bytes=0-";
      const upstream = await request(streamUrl, { headers: { range, referer: "https://music.163.com/" } }, AUDIO_TIMEOUT_MS);
      if (!isAudioResponse(upstream)) {
        upstream.body?.cancel();
        throw new Error(`Netease stream unavailable (${upstream.status})`);
      }
      return audioResponse(upstream, "netease");
    }

    if (action === "netease_lyric") {
      const id = clean(url.searchParams.get("id"));
      if (!validNeteaseId(id)) return json({ error: "网易云歌曲 ID 无效" }, 400);
      return await proxyNeteaseLyric(id, env);
    }

    if (action === "qq_search") {
      if (!keyword) return json({ error: "缺少关键词" }, 400);
      const result = await searchQQ(keyword, limit, env, waitUntil);
      return json({ code: 200, data: result.list, source: result.source, fallbacks: result.errors });
    }

    if (action === "bili_search") {
      const title = clean(url.searchParams.get("title"));
      const artist = clean(url.searchParams.get("artist"));
      const query = keyword || `${artist} ${title}`.trim();
      if (!query) return json({ error: "缺少关键词" }, 400);
      const result = await searchBilibili(query, title, artist, duration, Math.min(8, limit), env, waitUntil);
      const data = result.list.map((item) => {
        const params = new URLSearchParams({ action: "bili_audio" });
        if (item.bvid) params.set("bvid", item.bvid);
        if (item.aid) params.set("aid", item.aid);
        if (item.page) params.set("page", String(item.page));
        if (item.duration) params.set("duration", String(item.duration));
        return { ...item, audioUrl: `/api/music?${params}` };
      });
      return json({ code: 200, data, source: "bilibili" });
    }

    if (action === "bili_audio") {
      const bvid = clean(url.searchParams.get("bvid"));
      const aid = clean(url.searchParams.get("aid"));
      if ((bvid && !validBiliVideoId(bvid)) || (!bvid && !validBiliAid(aid))) {
        return json({ error: "Bilibili 视频 ID 无效" }, 400);
      }
      return await proxyBilibiliAudio(
        bvid || "",
        bvid ? "" : aid,
        duration,
        url.searchParams.get("page"),
        requestObject,
      );
    }

    // Keep lyrics independent from the QQ audio resolver. QQ audio may be
    // unavailable while its public lyric endpoint still works.
    if (action === "qq_lyric") {
      const mid = clean(url.searchParams.get("id"));
      if (!validQQMid(mid)) return json({ error: "QQ lyric id invalid" }, 400);
      const lyric = await withDetailDeadline((signal) => qqOfficialLyric(mid, signal), 10_000);
      return json({ code: 200, data: { lyric: normalizeTimedLyric(lyric) } });
    }

    if (action === "qq_detail" || action === "qq_audio") {
      const mid = clean(url.searchParams.get("id"));
      if (!validQQMid(mid)) return json({ error: "QQ 音乐歌曲 ID 无效" }, 400);
      const mediaMid = clean(url.searchParams.get("media_mid"));
      const audioCacheKey = qqAudioCacheKey(mid);
      if (action === "qq_audio") {
        await compatibleQQCacheGet(audioCacheKey, mediaMid, env);
        const qqCandidates = async () => {
          const candidates = await qqAudioCandidates(mid, keyword, mediaMid, null, { env });
          return candidates;
        };
        return await proxyLockedAudio(audioCacheKey, qqCandidates, lockedSource, requestObject, duration, lockedContainer, lockedBytes, env, targetIdentity);
      }
      return await withDetailDeadline(async (signal) => {
        // 缓存命中时跳过全部音源上游解析，避免重复等待；歌词独立获取。
        const lyricFallback = qqOfficialLyric(mid, signal).catch(() => "");
        // 播放失败后客户端带 refresh=1 重试：绕过缓存重新解析并覆盖更新。
        const forceRefresh = url.searchParams.get("refresh") === "1";
        const cachedAudio = forceRefresh ? null : await compatibleQQCacheGet(audioCacheKey, mediaMid, env);
        let detail = null;
        let official = null;
        let candidates;
        if (cachedAudio) {
          candidates = [];
        } else {
          try { detail = await resolveQQDetail(mid, keyword, signal, env); } catch {}
          if (!detail) {
            try { official = (await searchQQOfficial(keyword || mid, 20, signal)).find((song) => song.mid === mid) || null; } catch {}
          }
          candidates = await qqAudioCandidates(mid, keyword, mediaMid || official?.mediaMid, signal, { proxyDetail: detail, proxyAttempted: true, env });
        }
        const identity = {
          title: firstText(cachedAudio?.identity?.title, detail?.song_title, detail?.song_name, official?.name, targetIdentity.title),
          artist: firstText(cachedAudio?.identity?.artist, detail?.singer_name, official?.artist, targetIdentity.artist),
        };
        const resolved = await selectVerifiedAudio(audioCacheKey, candidates, duration, identity, env, { signal, skipCache: forceRefresh });
        const verified = resolved.verified[0];
        const audioUrls = resolved.verified.map((entry) => {
          const params = new URLSearchParams({ action: "qq_audio", id: mid });
          if (keyword) params.set("q", keyword);
          if (mediaMid || official?.mediaMid) params.set("media_mid", mediaMid || official.mediaMid);
          if (duration) params.set("duration", String(duration));
          if (identity.title) params.set("title", identity.title);
          if (identity.artist) params.set("artist", identity.artist);
          params.set("source", entry.source);
          params.set("container", entry.container);
          params.set("bytes", String(entry.totalBytes));
          return {
            url: `/api/music?${params}`,
            source: entry.source,
            container: entry.container,
            bytes: entry.totalBytes,
            qualityLabel: entry.qualityLabel || null,
          };
        });
        return json({
          code: 200,
          data: {
            mid,
            name: firstText(detail?.song_title, detail?.song_name, official?.name),
            artist: firstText(detail?.singer_name, official?.artist),
            album: firstText(detail?.album_name, detail?.album_title, official?.album),
            cover: firstText(detail?.album_pic, detail?.singer_pic, official?.cover).replace(/^http:/i, "https:"),
            pageUrl: firstText(detail?.song_h5_url),
            lyric: normalizeTimedLyric(firstText(detail?.song_lyric, detail?.lyric) || await lyricFallback),
            audioUrl: audioUrls[0]?.url || "",
            audioUrls,
            quality: verified.quality || null,
            qualityLabel: verified.qualityLabel || null,
            verifiedSource: verified.source,
            verifiedBytes: verified.totalBytes,
          },
        });
      }, QQ_DETAIL_TIMEOUT_MS);
    }

    return json({ error: "操作无效" }, 400);
  } catch (error) {
    const timeout = error?.name === "AbortError";
    const message = timeout ? "音乐源响应超时" : (error?.message || "音乐源请求失败");
    console.error("[music] request failed", {
      action: new URL(requestObject.url).searchParams.get("action") || "",
      status: error?.status || (timeout ? 504 : 502),
      upstreamStatus: error?.upstreamStatus || null,
      providerFailures: error?.providerFailures || undefined,
      message,
      stack: error?.stack || String(error),
    });
    const response = json({ error: message, upstreamStatus: error?.upstreamStatus || null }, error?.status || (timeout ? 504 : 502));
    if (error?.upstreamStatus) response.headers.set("x-halo-upstream-status", String(error.upstreamStatus));
    return response;
  }
}
