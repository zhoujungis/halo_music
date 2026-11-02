const site = String(process.env.SITE_URL || "https://music.zhoujun.dev").replace(/\/$/, "");
const token = String(process.env.CACHE_REFRESH_TOKEN || "").trim();
if (!token) {
  console.error("CACHE_REFRESH_TOKEN is not set.");
  process.exit(1);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let offset = 0;
let total = 0;
let refreshed = 0;
let failed = 0;
let rounds = 0;

while (rounds < 10000) {
  rounds += 1;
  const response = await fetch(`${site}/api/cache-refresh`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "user-agent": "HALO-Music-QQ-Cache-Refresh",
    },
    body: JSON.stringify({ offset, limit: 10 }),
  });
  if (!response.ok) {
    console.error(`cache refresh request failed: HTTP ${response.status}`);
    console.error(await response.text().catch(() => ""));
    process.exit(1);
  }

  const data = await response.json();
  total = Number(data.total || 0);
  const results = Array.isArray(data.results) ? data.results : [];
  if (results.some((item) => item.status === 429)) {
    console.log("rate limited; waiting 60s before retrying this batch");
    await wait(60_000);
    continue;
  }

  refreshed += results.filter((item) => item.ok).length;
  failed += results.filter((item) => !item.ok).length;
  offset = Number(data.nextOffset || offset);
  console.log(`batch ${rounds}: ${refreshed}/${total} refreshed, ${failed} failed, next=${offset}`);
  if (data.done) break;
  await wait(500);
}

console.log(`QQ cache refresh finished: ${refreshed}/${total} refreshed, ${failed} failed.`);
if (!refreshed && failed) process.exit(1);
