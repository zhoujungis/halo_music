// 推荐歌手头像：固定名单 + 本站同源代理，D1 缓存 30 天。
// 直接外链图床（Wikipedia / 网易云）在国内或跨区域访问都不稳定，代理后统一走本站域名。
const ARTISTS = {
  // 中文歌手（网易云图床，按 120px 取图）
  "周杰伦": "https://p1.music.126.net/NWv6PtSBkyWZzqbJVzBr7g==/109951169164936450.jpg?param=120y120",
  "林俊杰": "https://p2.music.126.net/78q0jUUJ0h08GxAs2G-tCA==/109951168529051968.jpg?param=120y120",
  "陈奕迅": "https://p1.music.126.net/5KJI2mq0G0OQHQaAfAJfwg==/109951173289563385.jpg?param=120y120",
  "告五人": "https://p2.music.126.net/7G5nKTU6uOgZaCCzVMC1kg==/109951173831544913.jpg?param=120y120",
  "五月天": "https://p1.music.126.net/qr5EV1Z5LDgar18Pilw0Eg==/109951170331174200.jpg?param=120y120",
  "邓紫棋": "https://p1.music.126.net/nvhb84VlA7jYwKy5yY4N4w==/109951169621849611.jpg?param=120y120",
  "薛之谦": "https://p1.music.126.net/Z2x6knGRr7eRrZeOlgCngA==/109951172414270313.jpg?param=120y120",
  "孙燕姿": "https://p2.music.126.net/VED2XoZcISpeGUTE_Q6lTA==/109951170045683199.jpg?param=120y120",
  // 英文歌手（Wikimedia 标准 250px 缩略图）
  "Taylor Swift": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/250px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png",
  "Ed Sheeran": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Ed_Sheeran_2022_%283x4_crop%29.jpg/250px-Ed_Sheeran_2022_%283x4_crop%29.jpg",
  "The Weeknd": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Weeknd_Portrait_by_Brian_Ziff.jpg/250px-The_Weeknd_Portrait_by_Brian_Ziff.jpg",
  "Billie Eilish": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg/250px-BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg",
  "Bruno Mars": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg/250px-BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg",
  "Adele": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/250px-Adele_2016.jpg",
  "Coldplay": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/ColdplayWembley120925_%28cropped%29.jpg/250px-ColdplayWembley120925_%28cropped%29.jpg",
  "Drake": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg/250px-Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg",
};

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const memoryCache = new Map();

function bytesToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function imageResponse(body, contentType) {
  return new Response(body, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=2592000, immutable",
    },
  });
}

export async function onRequestGet({ request, env }) {
  const name = String(new URL(request.url).searchParams.get("name") || "").trim();
  const source = ARTISTS[name];
  if (!source) return new Response("Not found", { status: 404 });

  const cacheKey = `avatar:v1:${name}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return imageResponse(cached.body, cached.type);
  }

  if (env?.DB) {
    try {
      const row = await env.DB.prepare(
        "SELECT value_json, expires_at FROM music_cache WHERE key = ?",
      ).bind(cacheKey).first();
      if (row && Number(row.expires_at) > Date.now()) {
        const entry = JSON.parse(row.value_json);
        const body = base64ToBytes(entry.body);
        memoryCache.set(cacheKey, { body, type: entry.type, expiresAt: Number(row.expires_at) });
        return imageResponse(body, entry.type);
      }
    } catch (error) {
      console.warn("avatar cache read failed", error);
    }
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const upstream = await fetch(source, {
      headers: { "user-agent": "HaloMusic/1.0 (+https://music.zhoujun.dev)", referer: "https://music.zhoujun.dev/" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) throw new Error("upstream is not an image");
    const body = await upstream.arrayBuffer();

    memoryCache.set(cacheKey, { body, type: contentType, expiresAt: Date.now() + CACHE_TTL_MS });
    if (env?.DB) {
      try {
        await env.DB.prepare(
          "INSERT OR REPLACE INTO music_cache (key, value_json, expires_at) VALUES (?, ?, ?)",
        ).bind(
          cacheKey,
          JSON.stringify({ type: contentType, body: bytesToBase64(body) }),
          Date.now() + CACHE_TTL_MS,
        ).run();
      } catch (error) {
        console.warn("avatar cache write failed", error);
      }
    }
    return imageResponse(body, contentType);
  } catch (error) {
    return new Response("", { status: 404, headers: { "cache-control": "public, max-age=600" } });
  }
}
