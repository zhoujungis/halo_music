const CHARTS = [
  { key: "hot", name: "热歌榜", hint: "最近播放量最高的歌曲" },
  { key: "new", name: "新歌榜", hint: "近期发布的新歌" },
  { key: "rise", name: "飙升榜", hint: "热度上升最快的歌曲" },
];

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

function renderChartCard(chart, data) {
  const updated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })
    : "";
  const tracks = Array.isArray(data?.tracks) ? data.tracks.slice(0, 20) : [];
  const list = tracks.length
    ? `<ol>${tracks.map((track, index) => `
        <li>
          <b>${index + 1}</b>
          <span>${escapeHtml(track.title || "未知歌曲")}<small>${escapeHtml(track.artist || "未知歌手")}</small></span>
        </li>`).join("")}</ol>`
    : `<p>榜单数据今日尚未更新，稍后再来看看。</p>`;
  return `
    <section class="chart-card">
      <h3>${escapeHtml(chart.name)}</h3>
      <p class="meta">${escapeHtml(chart.hint)}${updated ? ` · ${updated} 更新` : ""}</p>
      ${list}
    </section>`;
}

export async function onRequestGet({ env }) {
  const data = await Promise.all(CHARTS.map((chart) => readChart(env, chart.key)));
  const sections = CHARTS.map((chart, index) => renderChartCard(chart, data[index])).join("");
  const updated = data.find((item) => item?.updatedAt)?.updatedAt;
  const updatedText = updated
    ? new Date(updated).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    : "尚未更新";

  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>热门榜单 - Halo Music</title>
  <meta name="description" content="Halo Music 每日更新的热门榜单：热歌榜、新歌榜、飙升榜，收录各平台正在流行的歌曲，可直接回到播放器收听。" />
  <link rel="canonical" href="https://music.zhoujun.dev/charts" />
  <link rel="stylesheet" href="/content.css" />
</head>
<body>
  <header class="site">
    <a class="brand" href="/"><span class="mark">H</span>Halo Music</a>
    <nav>
      <a href="/">播放器</a>
      <a href="/guide.html">使用指南</a>
      <a href="/about.html">关于</a>
      <a href="/changelog.html">更新日志</a>
    </nav>
  </header>
  <main>
    <h1>热门榜单</h1>
    <p>这里收录 Halo Music 每日同步的三张榜单：热歌榜、新歌榜和飙升榜。数据每天凌晨更新一次，可以作为发现新歌的入口；点击下方的按钮回到播放器即可搜索和播放。</p>
    <p>榜单只做展示与索引，音乐内容与音频地址归对应平台所有。</p>
    <p>最近更新：${escapeHtml(updatedText)}</p>
    <div class="chart-grid">${sections}</div>
    <p><a class="cta" href="/">打开 Halo Music 播放器</a></p>
  </main>
  <footer class="site">
    <p>Halo Music · <a href="/about.html">关于本站</a> · <a href="/guide.html">使用指南</a> · <a href="/changelog.html">更新日志</a></p>
  </footer>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=600",
    },
  });
}
