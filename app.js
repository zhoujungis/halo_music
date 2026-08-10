/*
 * Online search adapters are adapted from CharlesPikachu/musicsquare
 * (Apache-2.0). The UI and player integration in this file are project-specific.
 */

const FALLBACK_ART = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22352d"/><stop offset="1" stop-color="#8e9f3b"/></linearGradient></defs>
    <rect width="800" height="800" fill="url(#g)"/><circle cx="400" cy="400" r="190" fill="#111815" opacity=".82"/>
    <circle cx="400" cy="400" r="55" fill="#d8f34b"/><path d="M138 635c118-74 201-81 323-42 73 24 126 17 201-21" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="18" stroke-linecap="round"/>
  </svg>`)}`;

const HOT_KEYWORD = "热门歌曲";
const SOURCE_LABELS = { local: "本地", netease: "网易云", qq: "QQ音乐", kuwo: "酷我" };
const moodKeywords = ["华语热歌", "流行新歌", "轻音乐", "治愈音乐", "经典老歌", "通勤歌单"];

let tracks = [];
let currentIndex = 0;
let currentList = tracks;
let isPlaying = false;
let isMuted = false;
let volume = 0.54;
let repeatOn = true;
let lyricsOpen = false;
let renderedLyricTrackId = null;
let activeLyricIndex = -1;
let loadedAudioTrackId = null;
let audioCandidateIndex = 0;
let searchRequestId = 0;
let toastTimer;
let liked = new Set(JSON.parse(localStorage.getItem("halo-liked-tracks") || "[]"));

const audio = new Audio();
audio.preload = "metadata";
audio.volume = volume;

const $ = (selector) => document.querySelector(selector);
const formatTime = (seconds) => {
  const value = Number.isFinite(Number(seconds)) ? Math.max(0, Number(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
};
const currentTrack = () => tracks[currentIndex] || null;
const sourceLabel = (source) => SOURCE_LABELS[source] || source || "在线";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function normalizeText(value = "") {
  return String(value).toLowerCase().replace(/[\s\-—_·()（）【】\[\]]+/g, "").trim();
}

function trackKey(track) {
  return `${normalizeText(track.title)}::${normalizeText(track.artist)}`;
}

function parseDuration(value) {
  if (Number.isFinite(Number(value))) return Number(value);
  const parts = String(value || "").split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function parseLrc(text) {
  if (!text) return [];
  const output = [];
  String(text).split(/\r?\n/).forEach((line) => {
    const timestamps = [...line.matchAll(/\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g)];
    const lyricText = line.replace(/\[[^\]]+\]/g, "").trim();
    if (!lyricText) return;
    timestamps.forEach((match) => {
      const fraction = match[3] ? Number(`0.${match[3].padEnd(3, "0").slice(0, 3)}`) : 0;
      output.push({ time: Number(match[1]) * 60 + Number(match[2]) + fraction, text: lyricText });
    });
  });
  return output.sort((a, b) => a.time - b.time);
}

function normalizeLocalTrack(item, index) {
  const title = item.title || item.name || `本地歌曲 ${index + 1}`;
  const artist = item.artist || item.singer || item.singers || "未知音乐人";
  const audioUrl = item.audioUrl || item.audio || item.url || "";
  return {
    id: String(item.id || `local-${index}-${title}-${artist}`),
    source: item.source || "local",
    title,
    artist,
    album: item.album || "本地曲库",
    length: parseDuration(item.length || item.duration),
    tag: item.tag || "本地音乐",
    art: item.art || item.cover || item.pic || FALLBACK_ART,
    audioUrl,
    audioCandidates: audioUrl ? [audioUrl] : [],
    lyrics: Array.isArray(item.lyrics) ? item.lyrics : parseLrc(item.lrc || item.lyric),
    lrcUrl: item.lrcUrl || null,
    detailsLoaded: Boolean(audioUrl),
    pageUrl: item.pageUrl || null
  };
}

async function loadLocalIndex() {
  try {
    const response = await fetch("music/index.json", { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    const list = Array.isArray(data) ? data : data.tracks;
    return Array.isArray(list) ? list.map(normalizeLocalTrack) : [];
  } catch {
    return [];
  }
}

async function searchNetease(keyword, limit = 8) {
  const url = `https://api.qijieya.cn/meting/?type=search&id=${encodeURIComponent(keyword)}&limit=${limit}&server=netease`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`网易云索引请求失败：${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) return [];

  const queryParam = (rawUrl, key) => {
    try { return new URL(rawUrl, window.location.href).searchParams.get(key) || ""; }
    catch { return ""; }
  };

  return data.slice(0, limit).map((item, index) => {
    const songId = queryParam(item.url, "id") || `${keyword}-${index}`;
    return {
      id: `netease-${songId}`,
      source: "netease",
      songId,
      title: item.name || "未知歌曲",
      artist: item.artist || "未知音乐人",
      album: "网易云音乐",
      length: 0,
      tag: "网易云 在线",
      art: item.pic || FALLBACK_ART,
      audioUrl: item.url || null,
      audioCandidates: item.url ? [item.url] : [],
      lrcUrl: item.lrc || null,
      lyrics: [],
      detailsLoaded: Boolean(item.url)
    };
  });
}

async function searchQQ(keyword, limit = 8) {
  const url = `https://tang.api.s01s.cn/music_open_api.php?msg=${encodeURIComponent(keyword)}&type=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`QQ音乐索引请求失败：${response.status}`);
  const json = await response.json();
  const data = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);

  return data.slice(0, limit).filter((item) => item.song_mid).map((item) => ({
    id: `qq-${item.song_mid}`,
    source: "qq",
    songId: item.song_mid,
    keyword,
    title: item.song_title || "未知歌曲",
    artist: item.singer_name || "未知音乐人",
    album: "QQ音乐",
    length: 0,
    tag: `QQ音乐 ${item.pay || "在线"}`,
    art: FALLBACK_ART,
    audioUrl: null,
    audioCandidates: [],
    lyrics: [],
    detailsLoaded: false
  }));
}

async function searchKuwo(keyword, limit = 8) {
  const url = `https://kw-api.cenguigui.cn/?name=${encodeURIComponent(keyword)}&page=1&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`酷我索引请求失败：${response.status}`);
  const json = await response.json();
  if (json.code !== 200 || !Array.isArray(json.data)) return [];

  return json.data.slice(0, limit).map((item) => ({
    id: `kuwo-${item.rid}`,
    source: "kuwo",
    songId: item.rid,
    title: item.name || "未知歌曲",
    artist: item.artist || "未知音乐人",
    album: item.album || "酷我音乐",
    length: 0,
    tag: "酷我 在线",
    art: item.pic || FALLBACK_ART,
    audioUrl: null,
    audioCandidates: [],
    lyrics: [],
    detailsLoaded: false
  }));
}

function interleave(groups) {
  const result = [];
  const maxLength = Math.max(0, ...groups.map((group) => group.length));
  for (let index = 0; index < maxLength; index += 1) {
    groups.forEach((group) => { if (group[index]) result.push(group[index]); });
  }
  return result;
}

function dedupeTracks(list) {
  const seenIds = new Set();
  const seenSongs = new Set();
  return list.filter((track) => {
    const key = trackKey(track);
    if (!track.id || seenIds.has(track.id) || (key !== "::" && seenSongs.has(key))) return false;
    seenIds.add(track.id);
    seenSongs.add(key);
    return true;
  });
}

async function fetchOnlineIndex(keyword, limit = 8) {
  const results = await Promise.allSettled([
    searchNetease(keyword, limit),
    searchQQ(keyword, limit),
    searchKuwo(keyword, limit)
  ]);
  results.filter((result) => result.status === "rejected").forEach((result) => console.warn(result.reason));
  return interleave(results.map((result) => result.status === "fulfilled" ? result.value : []));
}

async function fetchText(url) {
  if (!url) return "";
  const response = await fetch(url);
  if (!response.ok) return "";
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (!type.includes("json")) return response.text();
  const json = await response.json();
  return typeof json === "string" ? json : (json?.lrc || json?.lyric || json?.data?.lrc || json?.data?.lyric || "");
}

async function fetchNeteaseDetails(track) {
  if (!track.audioUrl && track.songId) {
    track.audioUrl = `https://api.qijieya.cn/meting/?server=netease&type=url&id=${encodeURIComponent(track.songId)}`;
    track.audioCandidates = [track.audioUrl];
  }
  if (!track.lrcUrl && track.songId) {
    track.lrcUrl = `https://api.qijieya.cn/meting/?server=netease&type=lrc&id=${encodeURIComponent(track.songId)}`;
  }
  if (!track.lyrics.length && track.lrcUrl) track.lyrics = parseLrc(await fetchText(track.lrcUrl));
  track.detailsLoaded = Boolean(track.audioUrl);
}

async function fetchQQDetails(track) {
  const keyword = track.keyword || `${track.title} ${track.artist}`;
  const url = `https://tang.api.s01s.cn/music_open_api.php?msg=${encodeURIComponent(keyword)}&type=json&mid=${encodeURIComponent(track.songId)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`QQ音乐详情请求失败：${response.status}`);
  const data = await response.json();
  if (!data || typeof data !== "object" || !data.song_mid) throw new Error("QQ音乐详情无有效数据");

  track.title = data.song_title || data.song_name || track.title;
  track.artist = data.singer_name || track.artist;
  track.album = data.album_name || data.album_title || track.album;
  track.art = data.album_pic || data.singer_pic || track.art;
  track.pageUrl = data.song_h5_url || null;
  track.lyrics = parseLrc(data.song_lyric || data.lyric || "");
  track.audioCandidates = [
    data.song_play_url_hq,
    data.song_play_url_standard,
    data.song_play_url_sq,
    data.song_play_url_pq,
    data.song_play_url_fq,
    data.song_play_url
  ].filter(Boolean);
  track.audioUrl = track.audioCandidates[0] || null;
  track.detailsLoaded = Boolean(track.audioUrl);
}

async function fetchKuwoDetails(track) {
  const url = `https://kw-api.cenguigui.cn/?id=${encodeURIComponent(track.songId)}&type=song&level=zp&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`酷我详情请求失败：${response.status}`);
  const json = await response.json();
  if (json.code !== 200 || !json.data) throw new Error("酷我详情无有效数据");
  const data = json.data;
  track.title = data.name || track.title;
  track.artist = data.artist || track.artist;
  track.album = data.album || track.album;
  track.art = data.pic || track.art;
  track.audioUrl = data.url || null;
  track.audioCandidates = data.url ? [data.url] : [];
  track.lyrics = parseLrc(data.lyric || "");
  track.length = parseDuration(data.duration || track.length);
  track.detailsLoaded = Boolean(track.audioUrl);
}

async function ensureTrackDetails(track) {
  if (!track) return false;
  if (track.detailsLoaded && track.audioUrl && (track.lyrics.length || !track.lrcUrl)) return true;
  if (track.loadingPromise) return track.loadingPromise;

  track.loadingPromise = (async () => {
    if (track.source === "netease") await fetchNeteaseDetails(track);
    else if (track.source === "qq") await fetchQQDetails(track);
    else if (track.source === "kuwo") await fetchKuwoDetails(track);
    else track.detailsLoaded = Boolean(track.audioUrl);
    return Boolean(track.audioUrl);
  })().catch((error) => {
    console.error(error);
    return false;
  }).finally(() => { track.loadingPromise = null; });

  return track.loadingPromise;
}

function renderAlbums(list = currentList) {
  const grid = $("#albumGrid");
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">没有可显示的歌曲索引，请稍后重试或搜索歌名。</div>`;
    return;
  }
  grid.innerHTML = list.slice(0, 12).map((track) => `
    <button class="album-card" type="button" data-track="${escapeHtml(track.id)}" aria-label="播放 ${escapeHtml(track.title)}">
      <span class="album-art-wrap"><img src="${escapeHtml(track.art || FALLBACK_ART)}" alt="${escapeHtml(track.album)} 封面" loading="lazy" /><span class="card-play" aria-hidden="true">▶</span></span>
      <h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(track.artist)} · ${escapeHtml(sourceLabel(track.source))}</p>
    </button>`).join("");
}

function renderQueue(list = currentList) {
  const table = $("#trackTable");
  if (!list.length) {
    table.innerHTML = `<div class="empty-state">索引为空。搜索歌曲、歌手，或稍后重新加载热门歌曲。</div>`;
    $("#queueCount").textContent = "0";
    return;
  }
  table.innerHTML = list.map((track, listIndex) => {
    const index = tracks.findIndex((item) => item.id === track.id);
    const active = index === currentIndex;
    return `<div class="track-row ${active ? "current" : ""}" role="listitem" data-track="${escapeHtml(track.id)}">
      <span class="track-number">${active && isPlaying ? "▶" : String(listIndex + 1).padStart(2, "0")}</span>
      <button class="track-info" type="button" data-track="${escapeHtml(track.id)}" aria-label="播放 ${escapeHtml(track.title)}"><img src="${escapeHtml(track.art || FALLBACK_ART)}" alt="" loading="lazy" /><span><strong>${escapeHtml(track.title)}</strong><span>${escapeHtml(track.artist)}</span></span></button>
      <span class="track-artist">${escapeHtml(sourceLabel(track.source))} · ${escapeHtml(track.album || "未知专辑")}</span><span class="track-time">${track.length ? formatTime(track.length) : "在线"}</span>
      <button class="track-more" data-like="${escapeHtml(track.id)}" type="button" title="收藏 ${escapeHtml(track.title)}" aria-label="收藏 ${escapeHtml(track.title)}">${liked.has(track.id) ? "♥" : "♡"}</button>
    </div>`;
  }).join("");
  $("#queueCount").textContent = String(list.length);
}

function renderPlayer() {
  const track = currentTrack();
  if (!track) {
    $("#playerArt").src = FALLBACK_ART;
    $("#playerTitle").textContent = "等待歌曲索引";
    $("#playerArtist").textContent = "搜索歌曲后即可播放";
    $("#elapsed").textContent = "0:00";
    $("#duration").textContent = "0:00";
    $("#seek").value = 0;
    $("#playToggle").textContent = "▶";
    return;
  }

  const duration = Number.isFinite(audio.duration) ? audio.duration : track.length;
  track.length = duration || track.length;
  $("#playerArt").src = track.art || FALLBACK_ART;
  $("#playerArt").alt = `${track.album || track.title} 封面`;
  $("#playerTitle").textContent = track.title;
  $("#playerArtist").textContent = `${track.artist} · ${sourceLabel(track.source)}`;
  $("#duration").textContent = formatTime(duration);
  $("#elapsed").textContent = formatTime(audio.currentTime);
  $("#seek").value = duration ? Math.min(100, audio.currentTime / duration * 100) : 0;
  $("#playToggle").textContent = isPlaying ? "Ⅱ" : "▶";
  $("#playToggle").title = isPlaying ? "暂停" : "播放";
  $("#playToggle").setAttribute("aria-label", $("#playToggle").title);
  $("#playerLike").textContent = liked.has(track.id) ? "♥" : "♡";
  $("#playerLike").classList.toggle("liked", liked.has(track.id));
  $("#repeat").classList.toggle("active", repeatOn);
  $("#mute").textContent = isMuted ? "◼" : "◖";
  renderLyrics();
}

function renderLyrics(force = false) {
  const track = currentTrack();
  if (!track) return;
  const lyricLines = track.lyrics.length ? track.lyrics : [{ time: 0, text: "暂无歌词，先听听旋律吧" }];
  if (force || renderedLyricTrackId !== track.id) {
    $("#lyricsArt").src = track.art || FALLBACK_ART;
    $("#lyricsTitle").textContent = track.title;
    $("#lyricsArtist").textContent = `${track.artist} · ${sourceLabel(track.source)}`;
    $("#lyricsPanel").style.setProperty("--lyrics-art", `url("${String(track.art || FALLBACK_ART).replace(/"/g, "%22")}")`);
    $("#lyricsList").innerHTML = lyricLines.map((line, index) => `
      <button class="lyric-line" type="button" data-lyric-index="${index}" data-lyric-time="${line.time}" aria-label="跳转到 ${formatTime(line.time)}">
        <time>${formatTime(line.time)}</time><span>${escapeHtml(line.text)}</span>
      </button>`).join("");
    renderedLyricTrackId = track.id;
    activeLyricIndex = -1;
    $("#lyricsScroll").scrollTop = 0;
  }

  let nextActiveIndex = 0;
  for (let index = lyricLines.length - 1; index >= 0; index -= 1) {
    if (audio.currentTime >= lyricLines[index].time) { nextActiveIndex = index; break; }
  }
  if (nextActiveIndex === activeLyricIndex) return;
  const previousLine = $(".lyric-line.active");
  const nextLine = $(`.lyric-line[data-lyric-index="${nextActiveIndex}"]`);
  previousLine?.classList.remove("active");
  previousLine?.removeAttribute("aria-current");
  nextLine?.classList.add("active");
  nextLine?.setAttribute("aria-current", "true");
  activeLyricIndex = nextActiveIndex;
  if (lyricsOpen) nextLine?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderAll(list = tracks) {
  currentList = list;
  renderAlbums(list);
  renderQueue(list);
  renderPlayer();
}

function showToast(message, duration = 2600) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), duration);
}

function setLyricsOpen(open) {
  lyricsOpen = open;
  document.body.classList.toggle("lyrics-open", open);
  $("#lyricsPanel").setAttribute("aria-hidden", String(!open));
  $("#lyricsToggle").setAttribute("aria-expanded", String(open));
  if (open) {
    renderLyrics(true);
    window.setTimeout(() => $(".lyric-line.active")?.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
  }
}

function setTracks(nextTracks) {
  audio.pause();
  audio.removeAttribute("src");
  loadedAudioTrackId = null;
  isPlaying = false;
  tracks = dedupeTracks(nextTracks);
  currentIndex = 0;
  renderedLyricTrackId = null;
  renderAll(tracks);
}

async function searchOnline(keyword, { silent = false, includeLocal = false } = {}) {
  const query = keyword.trim();
  if (!query) return;
  const requestId = ++searchRequestId;
  if (!silent) showToast(`正在抓取“${query}”的歌曲索引…`, 5000);
  $("#discover-title").textContent = query === HOT_KEYWORD ? "热门歌曲" : `“${query}”的搜索结果`;
  $("#trackTable").innerHTML = `<div class="empty-state">正在从网易云、QQ音乐和酷我抓取索引…</div>`;
  $("#albumGrid").innerHTML = `<div class="empty-state">正在加载歌曲、封面与播放信息…</div>`;

  const localTracks = includeLocal ? await loadLocalIndex() : [];
  const onlineTracks = await fetchOnlineIndex(query);
  if (requestId !== searchRequestId) return;
  setTracks([...localTracks, ...onlineTracks]);
  if (tracks.length) showToast(`已加载 ${tracks.length} 首“${query}”相关歌曲`);
  else showToast("公开索引接口暂时没有返回结果，请稍后重试", 4000);
}

async function prepareAudio(track) {
  if (!track) return false;
  const ready = await ensureTrackDetails(track);
  if (!ready || !track.audioUrl) return false;
  if (loadedAudioTrackId !== track.id || audio.src !== new URL(track.audioUrl, window.location.href).href) {
    audioCandidateIndex = Math.max(0, track.audioCandidates.indexOf(track.audioUrl));
    audio.src = track.audioUrl;
    loadedAudioTrackId = track.id;
    audio.load();
    renderedLyricTrackId = null;
  }
  renderAll(currentList);
  return true;
}

async function togglePlay(forcePlay) {
  const track = currentTrack();
  if (!track) { showToast("歌曲索引还没有加载完成"); return; }
  const shouldPlay = typeof forcePlay === "boolean" ? forcePlay : !isPlaying;
  if (!shouldPlay) { audio.pause(); return; }

  $("#playerArtist").textContent = "正在解析播放地址…";
  const ready = await prepareAudio(track);
  if (!ready) { showToast("这首歌暂时没有可用的公开播放地址", 4000); renderPlayer(); return; }
  try { await audio.play(); }
  catch (error) { console.error(error); showToast("浏览器未能播放该地址，请换一首歌曲"); }
}

function selectTrack(id, play = true) {
  const index = tracks.findIndex((track) => track.id === id);
  if (index < 0) return;
  currentIndex = index;
  loadedAudioTrackId = null;
  audio.pause();
  audio.currentTime = 0;
  renderedLyricTrackId = null;
  renderAll(currentList);
  if (play) togglePlay(true);
}

function nextTrack() {
  if (!tracks.length) return;
  if (!repeatOn && currentIndex === tracks.length - 1) { audio.pause(); audio.currentTime = 0; return; }
  currentIndex = (currentIndex + 1) % tracks.length;
  loadedAudioTrackId = null;
  renderedLyricTrackId = null;
  renderAll(currentList);
  togglePlay(true);
}

function previousTrack() {
  if (!tracks.length) return;
  if (audio.currentTime > 4) { audio.currentTime = 0; return; }
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadedAudioTrackId = null;
  renderedLyricTrackId = null;
  renderAll(currentList);
  togglePlay(true);
}

function toggleLike(id) {
  liked.has(id) ? liked.delete(id) : liked.add(id);
  localStorage.setItem("halo-liked-tracks", JSON.stringify([...liked]));
  renderAll(currentList);
  showToast(liked.has(id) ? "已加入我的收藏" : "已从收藏中移除");
}

function filterContent(query) {
  const normalized = query.trim().toLowerCase();
  const result = normalized ? tracks.filter((track) => `${track.title} ${track.artist} ${track.album} ${sourceLabel(track.source)}`.toLowerCase().includes(normalized)) : tracks;
  renderAll(result);
}

audio.addEventListener("play", () => { isPlaying = true; renderPlayer(); renderQueue(currentList); });
audio.addEventListener("pause", () => { isPlaying = false; renderPlayer(); renderQueue(currentList); });
audio.addEventListener("timeupdate", renderPlayer);
audio.addEventListener("durationchange", renderPlayer);
audio.addEventListener("ended", nextTrack);
audio.addEventListener("error", () => {
  const track = currentTrack();
  if (!track || loadedAudioTrackId !== track.id) return;
  const nextCandidate = track.audioCandidates[audioCandidateIndex + 1];
  if (nextCandidate) {
    audioCandidateIndex += 1;
    track.audioUrl = nextCandidate;
    audio.src = nextCandidate;
    audio.play().catch(() => {});
    return;
  }
  isPlaying = false;
  showToast("当前音源已失效，请尝试其他歌曲", 3500);
  renderPlayer();
});

$("#albumGrid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-track]");
  if (card) selectTrack(card.dataset.track);
});
$("#trackTable").addEventListener("click", (event) => {
  const like = event.target.closest("[data-like]");
  if (like) { toggleLike(like.dataset.like); return; }
  const track = event.target.closest("[data-track]");
  if (track) selectTrack(track.dataset.track);
});
$("#playToggle").addEventListener("click", () => togglePlay());
$("#heroPlay").addEventListener("click", () => currentTrack() ? togglePlay(true) : searchOnline(HOT_KEYWORD));
$("#previous").addEventListener("click", previousTrack);
$("#next").addEventListener("click", nextTrack);
$("#repeat").addEventListener("click", () => { repeatOn = !repeatOn; renderPlayer(); showToast(repeatOn ? "循环播放已开启" : "列表播完后停止"); });
$("#shuffle").addEventListener("click", () => {
  if (tracks.length < 2) return;
  let next = currentIndex;
  while (next === currentIndex) next = Math.floor(Math.random() * tracks.length);
  selectTrack(tracks[next].id);
});
$("#playerLike").addEventListener("click", () => currentTrack() && toggleLike(currentTrack().id));
$("#lyricsToggle").addEventListener("click", () => setLyricsOpen(!lyricsOpen));
$("#lyricsClose").addEventListener("click", () => setLyricsOpen(false));
$("#lyricsBackdrop").addEventListener("click", () => setLyricsOpen(false));
$("#lyricsList").addEventListener("click", (event) => {
  const line = event.target.closest("[data-lyric-time]");
  if (line) audio.currentTime = Number(line.dataset.lyricTime);
});
$("#seek").addEventListener("input", (event) => {
  if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * Number(event.target.value) / 100;
});
$("#volume").addEventListener("input", (event) => {
  volume = Number(event.target.value) / 100;
  audio.volume = volume;
  isMuted = volume === 0;
  audio.muted = isMuted;
});
$("#mute").addEventListener("click", () => { isMuted = !isMuted; audio.muted = isMuted; renderPlayer(); showToast(isMuted ? "已静音" : "已恢复声音"); });
$("#searchInput").addEventListener("input", (event) => filterContent(event.target.value));
$("#searchInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); searchOnline(event.target.value || HOT_KEYWORD); }
  if (event.key === "Escape") { event.target.value = ""; renderAll(tracks); event.target.blur(); }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lyricsOpen) { setLyricsOpen(false); return; }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); }
  if (event.code === "Space" && !["INPUT", "BUTTON"].includes(document.activeElement.tagName)) { event.preventDefault(); togglePlay(); }
});
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  if (button.dataset.nav === "我的收藏") {
    const saved = tracks.filter((track) => liked.has(track.id));
    renderAll(saved);
    showToast(saved.length ? `共收藏 ${saved.length} 首歌曲` : "还没有收藏歌曲");
  } else if (button.dataset.nav === "发现" || button.dataset.nav === "曲库") {
    renderAll(tracks);
  } else showToast("播客索引暂未接入");
}));
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  const keyword = button.dataset.filter;
  $("#searchInput").value = keyword;
  searchOnline(keyword);
  document.querySelector(".discovery").scrollIntoView({ behavior: "smooth", block: "start" });
}));
$("#refreshMood").addEventListener("click", () => {
  const keyword = moodKeywords[Math.floor(Math.random() * moodKeywords.length)];
  $("#searchInput").value = keyword;
  searchOnline(keyword);
});
$("#showAll").addEventListener("click", () => { $("#searchInput").value = ""; searchOnline(HOT_KEYWORD, { includeLocal: true }); });
$("#clearQueue").addEventListener("click", () => showToast("在线索引无需清空，搜索新关键词即可换一批歌曲"));
$("#newPlaylist").addEventListener("click", () => showToast("使用歌曲右侧的爱心即可加入收藏"));
$("#heroSave").addEventListener("click", () => showToast("热门索引会随接口结果自动更新"));
$("#userButton").addEventListener("click", () => showToast("收藏数据仅保存在当前浏览器"));
$("#queueToggle").addEventListener("click", () => document.querySelector(".queue-section").scrollIntoView({ behavior: "smooth" }));

async function bootstrap() {
  renderAll([]);
  const localTracks = await loadLocalIndex();
  if (localTracks.length) {
    setTracks(localTracks);
    $("#discover-title").textContent = "本地热门歌曲";
    showToast(`已从 /music 加载 ${localTracks.length} 首歌曲`);
    return;
  }
  await searchOnline(HOT_KEYWORD, { silent: true, includeLocal: false });
}

bootstrap();
