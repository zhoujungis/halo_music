const TIMEOUT_MS = 12_000;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/134.0.0.0 Safari/537.36";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" },
  });
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { redirect: "follow", ...options, signal: controller.signal });
    if (!response.ok && response.status !== 206) {
      throw Object.assign(new Error(`酷我上游返回 ${response.status}`), { status: response.status });
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function clean(value) {
  return String(value ?? "").replace(/<[^>]*>/g, "").replace(/&amp;/gi, "&").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function parseSearchResponse(raw) {
  const normalized = raw.replace(/^\s*var\s+\w+\s*=\s*/, "").replace(/;\s*$/, "");
  try { return JSON.parse(normalized); } catch {
    const quoted = normalized
      .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'\s*:/g, (_, key) => `${JSON.stringify(key)}:`)
      .replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, value) => `:${JSON.stringify(value.replace(/\\'/g, "'"))}`);
    return JSON.parse(quoted);
  }
}

export function normalizeKuwoSearch(data) {
  const list = data?.abslist || data?.data?.list || [];
  return list.map((song) => {
    const rid = clean(song.MUSICRID || song.musicrid || song.rid).replace(/^MUSIC_/i, "");
    const rawPic = clean(song.hts_MVPIC || song.MVPIC || song.web_albumpic_short || song.pic);
    const pic = rawPic && !/^https?:\/\//i.test(rawPic) ? `https://img4.kuwo.cn/${rawPic.replace(/^\/+/, "")}` : rawPic;
    return {
      rid,
      name: clean(song.SONGNAME || song.NAME || song.name),
      artist: clean(song.ARTIST || song.artist),
      album: clean(song.ALBUM || song.album),
      pic,
    };
  }).filter((song) => song.rid && song.name);
}

async function searchKuwo(keyword, limit) {
  const params = new URLSearchParams({
    vipver: "1",
    client: "kt",
    ft: "music",
    cluster: "0",
    strategy: "2012",
    encoding: "utf8",
    rformat: "json",
    mobi: "1",
    issubtitle: "1",
    show_copyright_off: "1",
    pn: "0",
    rn: String(limit),
    all: keyword,
  });
  const response = await request(`https://www.kuwo.cn/search/searchMusicBykeyWord?${params}`, {
    headers: { referer: "https://www.kuwo.cn/", "user-agent": USER_AGENT, "x-forwarded-for": "111.206.145.1" },
  });
  return normalizeKuwoSearch(parseSearchResponse(await response.text())).slice(0, limit);
}

async function fetchLyric(id) {
  try {
    const response = await request(`https://www.kuwo.cn/openapi/v1/www/lyric/getlyric?musicId=${encodeURIComponent(id)}`, {
      headers: { accept: "application/json, text/plain, */*", referer: "https://www.kuwo.cn/", "user-agent": USER_AGENT },
    });
    const data = await response.json();
    return (data?.data?.lrclist || []).map((line) => {
      const seconds = Number(line.time) || 0;
      return `[${String(Math.floor(seconds / 60)).padStart(2, "0")}:${(seconds % 60).toFixed(2).padStart(5, "0")}]${line.lineLyric || ""}`;
    }).join("\n");
  } catch { return ""; }
}

export async function onRequestGet({ request: requestObject }) {
  try {
    const url = new URL(requestObject.url);
    const action = url.searchParams.get("action") || "";
    if (action === "search") {
      const keyword = (url.searchParams.get("q") || "").trim().slice(0, 100);
      const limit = Math.min(30, Math.max(1, Number(url.searchParams.get("limit")) || 10));
      if (!keyword) return json({ error: "缺少关键词" }, 400);
      return json({ code: 200, data: await searchKuwo(keyword, limit) });
    }

    const id = (url.searchParams.get("id") || "").trim().replace(/^MUSIC_/i, "");
    if (!/^\d+$/.test(id)) return json({ error: "歌曲 ID 无效" }, 400);
    if (action === "lyric") {
      return json({
        code: 200,
        data: {
          rid: id,
          lyric: await fetchLyric(id),
        },
      });
    }
    return json({ error: "操作无效" }, 400);
  } catch (error) {
    const timeout = error?.name === "AbortError";
    return json({ error: timeout ? "酷我响应超时" : (error?.message || "酷我请求失败") }, error?.status || (timeout ? 504 : 502));
  }
}
