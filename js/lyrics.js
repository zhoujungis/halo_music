/**
 * HALO Music - Lyrics Module
 * LRC 解析、歌词动态滚动高亮、移动端歌词窗口、Document PiP 悬浮窗与 Electron 原生置顶歌词同步
 */

export const MOBILE_LYRIC_WINDOW = 3;

/**
 * 解析 LRC 歌词文本为时间戳数组 [{ time: seconds, text: string }]
 */
export function parseLRC(txt) {
  if (!txt) return [];
  const normalized = String(txt).replace(/\\n/g, '\n').replace(/\r/g, '');
  const reg = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  const out = [];
  const matches = [...normalized.matchAll(reg)];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const min = parseInt(m[1], 10) || 0;
    const sec = parseInt(m[2], 10) || 0;
    const ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0;
    const time = min * 60 + sec + ms / 1000;
    const next = matches[i + 1];
    const text = normalized
      .slice(m.index + m[0].length, next?.index ?? normalized.length)
      .replace(/<\d+,\d+>|\(\d+,\d+\)/g, '')
      .replace(/\[[a-z]+:[^\]]*\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) out.push({ time, text });
  }
  out.sort((a, b) => a.time - b.time);
  return out;
}

/**
 * 移动端歌词视窗滚动限制
 */
export function updateMobileLyricWindow(index, lyricsInner) {
  const rows = [...(lyricsInner?.querySelectorAll('.lyrics-line') || [])];
  if (!rows.length) return;
  const isMobileLyrics = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 760px)').matches
    && document.body.dataset.mobileView === 'lyrics';
  if (!isMobileLyrics) {
    rows.forEach((row) => row.classList.remove('mobile-lyrics-visible', 'mobile-lyrics-current'));
    return;
  }
  const active = Number.isInteger(index) && index >= 0 && index < rows.length ? index : 0;
  rows.forEach((row, i) => {
    row.classList.toggle('mobile-lyrics-visible', Math.abs(i - active) <= MOBILE_LYRIC_WINDOW);
    row.classList.toggle('mobile-lyrics-current', i === active);
  });
}

/**
 * 点击歌词跳转播放进度
 */
export function seekToLyric(index, { state, dom, onSeek }) {
  const line = state.lyricLines[index];
  if (!line || !dom.audio) return;
  const duration = Number.isFinite(dom.audio.duration) && dom.audio.duration > 0 ? dom.audio.duration : null;
  const target = duration === null ? Math.max(0, line.time) : Math.min(Math.max(0, line.time), duration);
  try {
    dom.audio.currentTime = target;
  } catch {
    return;
  }
  state.currentLyricIndex = -1;
  if (typeof onSeek === 'function') {
    onSeek(target);
  }
}

/**
 * 根据播放时间刷新歌词高亮和滚动位置
 */
export function updateLyricsHighlight(time, { state, dom, onSyncPip, onSyncNative }) {
  const lines = state.lyricLines;
  if (!lines || !lines.length) return;
  let idx = state.currentLyricIndex;
  if (idx < 0 || idx >= lines.length || time < lines[idx].time || (idx + 1 < lines.length && time >= lines[idx + 1].time)) {
    idx = lines.findIndex((l, i) => {
      const nxt = lines[i + 1];
      if (!nxt) return time >= l.time - 0.05;
      return time >= l.time - 0.05 && time < nxt.time - 0.05;
    });
  }
  if (idx < 0 || idx === state.currentLyricIndex) return;
  state.currentLyricIndex = idx;
  updateMobileLyricWindow(idx, dom.lyricsInner);
  if (typeof onSyncPip === 'function') onSyncPip();
  if (typeof onSyncNative === 'function') onSyncNative(true);

  const wrap = dom.lyricsInner;
  if (!wrap) return;
  wrap.querySelectorAll('.lyrics-line.active').forEach((el) => el.classList.remove('active'));
  const act = wrap.querySelector(`.lyrics-line[data-index="${idx}"]`);
  if (act) {
    act.classList.add('active');
    const box = dom.lyricsContainer;
    if (box && !(window.matchMedia('(max-width: 760px)').matches && document.body.dataset.mobileView === 'lyrics')) {
      box.scrollTo({ top: act.offsetTop - box.clientHeight * 0.45, behavior: 'smooth' });
    }
  }
}

// ===================== Document Picture-in-Picture 悬浮歌词 =====================

export const PIP_SETTINGS_KEY = 'halo-music-pip-settings-v1';
export const PIP_PRESETS = [
  { id: 'aurora', label: '极光', en: 'Aurora', accent: '#c8ee62' },
  { id: 'ocean', label: '海浪', en: 'Ocean', accent: '#63d8ee' },
  { id: 'sunset', label: '日落', en: 'Sunset', accent: '#ffa45c' },
  { id: 'rose', label: '玫瑰', en: 'Rose', accent: '#ff80ab' },
  { id: 'violet', label: '暮紫', en: 'Violet', accent: '#b6a1ff' }
];

export function loadPipSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(PIP_SETTINGS_KEY) || '{}') || {};
    const accent = typeof raw.accent === 'string' && /^#[0-9a-f]{6}$/i.test(raw.accent) ? raw.accent : '#c8ee62';
    const size = ['s', 'm', 'l'].includes(raw.size) ? raw.size : 'm';
    return { accent, size };
  } catch {
    return { accent: '#c8ee62', size: 'm' };
  }
}

export const pipSettings = loadPipSettings();

export function persistPipSettings() {
  try {
    localStorage.setItem(PIP_SETTINGS_KEY, JSON.stringify(pipSettings));
  } catch {}
}

export const PIP_LYRICS_STYLE = `
:root { color-scheme: dark; }
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; overflow: hidden; background: transparent; }
body {
  color: #f5f8ee;
  font-family: system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
  user-select: none;
}
.pip-root {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 13px 17px 18px;
}
.pip-bg {
  position: absolute;
  inset: -40px;
  background-image:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--pip-accent, #c8ee62) 55%, transparent), transparent 58%),
    linear-gradient(135deg, #26331f, #10150f);
  background-position: center;
  background-size: cover;
  filter: blur(42px) saturate(1.5) brightness(1.14);
  opacity: .96;
  transform: scale(1.12);
}
.pip-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(6,9,7,.42), rgba(6,9,7,.16) 38%, rgba(6,9,7,.6)),
    radial-gradient(ellipse at 50% 130%, rgba(0,0,0,.5), transparent 62%);
}
.pip-top { position: relative; z-index: 1; display: flex; align-items: center; gap: 9px; min-width: 0; }
.pip-thumb {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: cover;
  background: rgba(255,255,255,.08);
  box-shadow: 0 4px 14px rgba(0,0,0,.45);
}
.pip-meta { display: flex; flex: 1; flex-direction: column; gap: 1px; min-width: 0; }
.pip-track {
  overflow: hidden;
  color: rgba(247,249,238,.92);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pip-artist {
  overflow: hidden;
  color: rgba(200,214,196,.72);
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pip-lyrics {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 0;
  text-align: center;
}
.pip-line-current {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #fff;
  font-size: var(--pip-line-size, 17px);
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 2px 14px rgba(0,0,0,.6);
}
.pip-line-next {
  overflow: hidden;
  color: rgba(210,222,204,.68);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pip-progress-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: rgba(200,214,196,.6);
}
.pip-progress-bar {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: rgba(255,255,255,.15);
  overflow: hidden;
}
.pip-progress-fill {
  height: 100%;
  width: 0%;
  background: var(--pip-accent, #c8ee62);
  transition: width 0.1s linear;
}
`;
