// CI 每日抓取三个榜单并写入 D1（toplist_cache）。
// 运行环境：Node 18+，需要 CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID 或已登录的 wrangler。
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHARTS = {
  hot: { id: "3778678", name: "热歌榜" },
  new: { id: "3779629", name: "新歌榜" },
  rise: { id: "19723756", name: "飙升榜" },
};
// 英文界面使用的国际榜单（公开榜单源，地址只写在 wrangler.toml）。
const EN_CHARTS = {
  "en-hot": { country: "us", name: "US Top 20" },
  "en-new": { country: "gb", name: "UK Top 20" },
  "en-rise": { country: "au", name: "AU Top 20" },
};
const LIMIT = 20;
const TIMEOUT_MS = 15000;

function readConfig(key) {
  const toml = readFileSync("wrangler.toml", "utf8");
  const match = new RegExp(`${key}\\s*=\\s*"([^"]+)"`).exec(toml);
  return match ? match[1] : "";
}

async function fetchAppleChart(country, endpoint) {
  if (!endpoint) return [];
  const url = endpoint.replace("{country}", country);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) continue;
      const data = await response.json();
      const rows = (data?.feed?.results || [])
        .map((row) => ({
          id: `apple-${row.id}`,
          title: String(row.name || "").slice(0, 200),
          artist: String(row.artistName || "").slice(0, 300),
          cover: String(row.artworkUrl100 || "").replace(/\/(\d+)x(\d+)bb\./, "/300x300bb."),
        }))
        .filter((row) => row.title);
      if (rows.length) return rows.slice(0, LIMIT);
    } catch (error) {
      console.log(`  ${country} 第 ${attempt + 1} 次失败：${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return [];
}

function readProviders() {
  const toml = readFileSync("wrangler.toml", "utf8");
  const match = /NETEASE_SOURCE_URLS\s*=\s*"([^"]+)"/.exec(toml);
  if (!match) return [];
  return match[1].split(/[\r\n,]+/).map((item) => item.trim()).filter((item) => /^https?:\/\//i.test(item));
}

function validNeteaseId(value) {
  return /^\d{1,20}$/.test(String(value || "").trim());
}

function extractIdFromUrl(rawUrl) {
  if (!rawUrl) return "";
  try {
    return new URL(rawUrl, "https://music.163.com").searchParams.get("id") || "";
  } catch {
    const match = String(rawUrl).match(/[?&]id=(\d+)/);
    return match ? match[1] : "";
  }
}

function normalizeRows(rows, limit) {
  const out = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || !row.name) continue;
    const id = validNeteaseId(row.id) ? String(row.id).trim() : extractIdFromUrl(row.url);
    if (!validNeteaseId(id)) continue;
    out.push({
      id,
      title: String(row.name).slice(0, 200),
      artist: Array.isArray(row.artist)
        ? row.artist.filter(Boolean).map(String).join(" / ").slice(0, 300)
        : String(row.artist || "").slice(0, 300),
      cover: String(row.pic || row.cover || row.coverUrl || "").slice(0, 1000),
    });
    if (out.length >= limit) break;
  }
  return out;
}

async function resolveDirectCover(cover) {
  const url = String(cover || "").trim();
  if (!url || /music\.126\.net/.test(url)) return url;
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });
    response.body?.cancel();
    if (response.url && /music\.126\.net/.test(response.url)) return response.url;
  } catch {
    // 保留原地址
  }
  return url;
}

async function fetchChart(chartId, providers) {
  for (const base of providers) {
    try {
      const endpoint = new URL(base);
      endpoint.search = new URLSearchParams({ type: "playlist", id: chartId, server: "netease" });
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) continue;
      const data = await response.json();
      const rows = normalizeRows(Array.isArray(data) ? data : data?.data, LIMIT);
      if (!rows.length) continue;
      await Promise.all(rows.map(async (row) => {
        row.cover = await resolveDirectCover(row.cover);
      }));
      console.log(`  ${base} -> ${rows.length} 首`);
      return rows;
    } catch (error) {
      console.log(`  ${base} 失败：${error.message}`);
    }
  }
  return [];
}

function sqlEscape(value) {
  return String(value).replace(/'/g, "''");
}

const providers = readProviders();
if (!providers.length) {
  console.error("wrangler.toml 中没有配置 NETEASE_SOURCE_URLS");
  process.exit(1);
}
console.log(`供应商 ${providers.length} 个`);

const statements = [
  `CREATE TABLE IF NOT EXISTS toplist_cache (chart TEXT PRIMARY KEY, payload_json TEXT NOT NULL, updated_at INTEGER NOT NULL);`,
];
const now = Date.now();
let written = 0;

for (const [key, chart] of Object.entries(CHARTS)) {
  console.log(`抓取 ${chart.name} (${chart.id})`);
  const rows = await fetchChart(chart.id, providers);
  if (!rows.length) {
    console.log(`  ${chart.name} 本轮无数据，保留上一次快照`);
    continue;
  }
  statements.push(
    `INSERT INTO toplist_cache (chart, payload_json, updated_at) VALUES ('${key}', '${sqlEscape(JSON.stringify(rows))}', ${now}) ON CONFLICT(chart) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at;`,
  );
  written += 1;
}

const appleChartEndpoint = readConfig("APPLE_CHART_URL");
if (appleChartEndpoint) {
  for (const [key, chart] of Object.entries(EN_CHARTS)) {
    console.log(`抓取 ${chart.name}（${chart.country}）`);
    const rows = await fetchAppleChart(chart.country, appleChartEndpoint);
    if (!rows.length) {
      console.log(`  ${chart.name} 本轮无数据，保留上一次快照`);
      continue;
    }
    statements.push(
      `INSERT INTO toplist_cache (chart, payload_json, updated_at) VALUES ('${key}', '${sqlEscape(JSON.stringify(rows))}', ${now}) ON CONFLICT(chart) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at;`,
    );
    written += 1;
  }
} else {
  console.log("未配置 APPLE_CHART_URL，跳过英文榜单");
}

if (!written) {
  console.error("所有榜单抓取失败，未写入数据库");
  process.exit(1);
}

const sqlFile = join(tmpdir(), `halo-toplists-${now}.sql`);
writeFileSync(sqlFile, statements.join("\n"));
try {
  console.log(`写入 D1（${written} 个榜单）…`);
  execSync(`npx --yes wrangler@4 d1 execute halo-music-db --remote --file="${sqlFile}"`, { stdio: "inherit" });
  console.log("榜单数据已更新");
} finally {
  try { unlinkSync(sqlFile); } catch {}
}
