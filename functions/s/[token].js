function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function onRequestGet({ params, env }) {
  const token = String(params?.token || "");
  let row = null;
  if (env?.DB && /^[a-z0-9]{6,32}$/i.test(token)) {
    try {
      row = await env.DB.prepare(
        "SELECT name, description, tracks_json, created_at FROM shared_playlists WHERE token = ?",
      ).bind(token).first();
    } catch (error) {
      console.warn("shared playlist read failed", error);
    }
  }

  if (!row) {
    return new Response(
      `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>分享不存在 - Halo Music</title><meta name="robots" content="noindex" /><link rel="stylesheet" href="/content.css" /></head><body><header class="site"><a class="brand" href="/"><span class="mark">H</span>Halo Music</a></header><main><h1>分享不存在或已失效</h1><p>这个歌单分享可能已被删除。你可以回到播放器继续听歌。</p><p><a class="cta" href="/">回到播放器</a></p></main></body></html>`,
      { status: 404, headers: { "content-type": "text/html; charset=UTF-8" } },
    );
  }

  let tracks = [];
  try { tracks = JSON.parse(row.tracks_json) || []; } catch { tracks = []; }
  const created = row.created_at
    ? new Date(Number(row.created_at)).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })
    : "";

  const items = tracks.map((track, index) => `
    <li>
      <b>${index + 1}</b>
      <span>${escapeHtml(track.title || "未知歌曲")}<small>${escapeHtml(track.artist || "未知歌手")}</small></span>
    </li>`).join("");

  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(row.name)} - Halo Music 歌单分享</title>
  <meta name="description" content="Halo Music 歌单分享：${escapeHtml(row.name)}，共 ${tracks.length} 首歌曲。" />
  <meta name="robots" content="noindex" />
  <link rel="stylesheet" href="/content.css" />
</head>
<body>
  <header class="site">
    <a class="brand" href="/"><span class="mark">H</span>Halo Music</a>
    <nav><a href="/">播放器</a><a href="/charts">榜单</a><a href="/guide">使用指南</a></nav>
  </header>
  <main>
    <h1>${escapeHtml(row.name)}</h1>
    <p>${row.description ? escapeHtml(row.description) : "来自 Halo Music 的歌单分享。"} 共 ${tracks.length} 首歌曲${created ? ` · ${created} 创建` : ""}。</p>
    <p><a class="cta" href="/?share=${encodeURIComponent(token)}">在 Halo Music 中打开</a></p>
    <div class="chart-card">
      <ol>${items}</ol>
    </div>
    <p><a href="/?share=${encodeURIComponent(token)}">导入到我的歌单</a></p>
  </main>
  <footer class="site">
    <p>Halo Music · <a href="/about">关于本站</a> · <a href="/guide">使用指南</a> · <a href="/faq">常见问题</a></p>
  </footer>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8", "cache-control": "public, max-age=300" },
  });
}
