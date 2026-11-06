// 推荐歌手头像：固定名单 + 本站同源代理，边缘缓存 30 天。
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
  // 英文歌手（Wikimedia，按 160px 取图）
  "Taylor Swift": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/250px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png",
  "Ed Sheeran": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Ed_Sheeran_2022_%283x4_crop%29.jpg/250px-Ed_Sheeran_2022_%283x4_crop%29.jpg",
  "The Weeknd": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Weeknd_Portrait_by_Brian_Ziff.jpg/250px-The_Weeknd_Portrait_by_Brian_Ziff.jpg",
  "Billie Eilish": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg/250px-BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg",
  "Bruno Mars": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg/250px-BrunoMars24KMagicWorldTourLive_%28cropped%29.jpg",
  "Adele": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/250px-Adele_2016.jpg",
  "Coldplay": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/ColdplayWembley120925_%28cropped%29.jpg/250px-ColdplayWembley120925_%28cropped%29.jpg",
  "Drake": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg/250px-Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg",
};

export async function onRequestGet({ request }) {
  const name = String(new URL(request.url).searchParams.get("name") || "").trim();
  const source = ARTISTS[name];
  if (!source) return new Response("Not found", { status: 404 });

  const cache = typeof caches !== "undefined" ? caches.default : null;
  const cacheKey = new Request(`https://music.zhoujun.dev/api/avatar?name=${encodeURIComponent(name)}`, { method: "GET" });
  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
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
    const response = new Response(body, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=2592000, immutable",
      },
    });
    if (cache) {
      try { await cache.put(cacheKey, response.clone()); } catch (error) {}
    }
    return response;
  } catch (error) {
    return new Response("", { status: 404, headers: { "cache-control": "public, max-age=600" } });
  }
}
