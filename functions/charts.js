const CHARTS = {
  zh: [
    { key: "hot", name: "热歌榜", hint: "最近播放量最高的歌曲" },
    { key: "new", name: "新歌榜", hint: "近期发布的新歌" },
    { key: "rise", name: "飙升榜", hint: "热度上升最快的歌曲" },
  ],
  en: [
    { key: "en-hot", name: "US Top 20", hint: "Most-played songs in the United States" },
    { key: "en-new", name: "UK Top 20", hint: "Most-played songs in the United Kingdom" },
    { key: "en-rise", name: "AU Top 20", hint: "Most-played songs in Australia" },
  ],
};

const COPY = {
  zh: {
    lang: "zh",
    title: "热门榜单 - Halo Music",
    description: "Halo Music 每日更新的热门榜单：热歌榜、新歌榜、飙升榜，收录各平台正在流行的歌曲，可直接回到播放器收听。",
    canonical: "https://music.zhoujun.dev/charts",
    altZh: "https://music.zhoujun.dev/charts",
    altEn: "https://music.zhoujun.dev/en/charts",
    h1: "热门榜单",
    intro: "这里收录 Halo Music 每日同步的三张榜单，每天凌晨更新一次，可以作为发现新歌的入口；点击下方的按钮回到播放器即可搜索和播放。",
    note: "榜单只做展示与索引，音乐内容与音频地址归对应平台所有。",
    updated: "最近更新：",
    notUpdated: "尚未更新",
    empty: "榜单数据今日尚未更新，稍后再来看看。",
    updatedSuffix: "更新",
    cta: "打开 Halo Music 播放器",
    nav: [["/", "播放器"], ["/guide", "使用指南"], ["/about", "关于"], ["/changelog", "更新日志"]],
    switchHref: "/en/charts",
    switchLabel: "English",
    footer: [["/about", "关于本站"], ["/guide", "使用指南"], ["/changelog", "更新日志"]],
    dateLocale: "zh-CN",
    unknownSong: "未知歌曲",
    unknownArtist: "未知歌手",
  },
  en: {
    lang: "en",
    title: "Charts - Halo Music",
    description: "Daily updated music charts on Halo Music: US, UK, and Australia top songs, refreshed every night.",
    canonical: "https://music.zhoujun.dev/en/charts",
    altZh: "https://music.zhoujun.dev/charts",
    altEn: "https://music.zhoujun.dev/en/charts",
    h1: "Charts",
    intro: "Three charts synced daily by Halo Music: the most-played songs in the US, the UK, and Australia. They refresh every night and are a good way to find something new — open the player to search and play.",
    note: "The charts are display and index only; music and audio URLs belong to the respective platforms.",
    updated: "Last updated: ",
    notUpdated: "Not updated yet",
    empty: "Today's chart data isn't ready yet. Check back soon.",
    updatedSuffix: "updated",
    cta: "Open the Halo Music player",
    nav: [["/", "Player"], ["/en/guide", "Guide"], ["/en/about", "About"], ["/en/changelog", "Changelog"]],
    switchHref: "/charts",
    switchLabel: "中文",
    footer: [["/en/about", "About"], ["/en/guide", "Guide"], ["/en/changelog", "Changelog"]],
    dateLocale: "en-US",
    unknownSong: "Unknown song",
    unknownArtist: "Unknown artist",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function readChart(env, key) {
  if (!env?.DB) return null;
  try {
    const row = await env.DB.prepare(
      "SELECT payload_json, updated_at FROM toplist_cache WHERE chart = ?",
    ).bind(key).first();
    if (!row) return null;
    return {
      tracks: JSON.parse(row.payload_json) || [],
      updatedAt: Number(row.updated_at) || null,
    };
  } catch (error) {
    console.warn("charts page read failed", error);
    return null;
  }
}

function navLinks(items) {
  return items.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("");
}

function renderChartCard(chart, data, copy) {
  const updated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString(copy.dateLocale, { timeZone: "Asia/Shanghai" })
    : "";
  const tracks = Array.isArray(data?.tracks) ? data.tracks.slice(0, 20) : [];
  const list = tracks.length
    ? `<ol>${tracks.map((track, index) => `
        <li>
          <b>${index + 1}</b>
          <span>${escapeHtml(track.title || copy.unknownSong)}<small>${escapeHtml(track.artist || copy.unknownArtist)}</small></span>
        </li>`).join("")}</ol>`
    : `<p>${escapeHtml(copy.empty)}</p>`;
  return `
    <section class="chart-card">
      <h3>${escapeHtml(chart.name)}</h3>
      <p class="meta">${escapeHtml(chart.hint)}${updated ? ` · ${updated} ${copy.updatedSuffix}` : ""}</p>
      ${list}
    </section>`;
}

export async function buildChartsHtml(env, locale = "zh") {
  const copy = COPY[locale] || COPY.zh;
  const charts = CHARTS[locale] || CHARTS.zh;
  const data = await Promise.all(charts.map((chart) => readChart(env, chart.key)));
  const sections = charts.map((chart, index) => renderChartCard(chart, data[index], copy)).join("");
  const updated = data.find((item) => item?.updatedAt)?.updatedAt;
  const updatedText = updated
    ? new Date(updated).toLocaleString(copy.dateLocale, { timeZone: "Asia/Shanghai" })
    : copy.notUpdated;

  return `<!DOCTYPE html>
<html lang="${copy.lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(copy.title)}</title>
  <meta name="description" content="${escapeHtml(copy.description)}" />
  <link rel="canonical" href="${copy.canonical}" />
  <link rel="alternate" hreflang="zh-CN" href="${copy.altZh}" />
  <link rel="alternate" hreflang="en" href="${copy.altEn}" />
  <link rel="alternate" hreflang="x-default" href="${copy.altZh}" />
  <link rel="stylesheet" href="/content.css" />
</head>
<body>
  <header class="site">
    <a class="brand" href="/"><span class="mark">H</span>Halo Music</a>
    <nav>
      ${navLinks(copy.nav)}
      <a class="lang-switch" href="${copy.switchHref}" hreflang="${copy.lang === "en" ? "zh-CN" : "en"}">${escapeHtml(copy.switchLabel)}</a>
    </nav>
  </header>
  <main>
    <h1>${escapeHtml(copy.h1)}</h1>
    <p>${escapeHtml(copy.intro)}</p>
    <p>${escapeHtml(copy.note)}</p>
    <p>${escapeHtml(copy.updated)}${escapeHtml(updatedText)}</p>
    <div class="chart-grid">${sections}</div>
    <p><a class="cta" href="/">${escapeHtml(copy.cta)}</a></p>
  </main>
  <footer class="site">
    <p>Halo Music · ${copy.footer.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join(" · ")}</p>
  </footer>
</body>
</html>`;
}

export async function onRequestGet({ env }) {
  const html = await buildChartsHtml(env, "zh");
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=600",
    },
  });
}
