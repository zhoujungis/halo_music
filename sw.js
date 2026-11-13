/* HALO Music 应用外壳缓存：断网时仍能打开页面，配合 IndexedDB 里的已下载歌曲离线播放。 */
const VERSION = new URL(self.location.href).searchParams.get("v") || "1";
const CACHE_PREFIX = "halo-shell-";
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
// 与 major.js 里 OFFLINE_COVER_CACHE 保持一致：下载时写入，离线时回放。
const COVER_CACHE = "halo-covers-v1";
const SHELL_ASSETS = [
  "/",
  "/major.js",
  "/js/fsm.js",
  "/js/storage.js",
  "/js/particles.js",
  "/js/lyrics.js",
  "/js/player.js",
  "/styles.css",
  "/i18n.js",
  "/manifest.json",
  "/favicon.svg",
  "/favicon-32.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        SHELL_ASSETS.map((url) => cache.add(new Request(url, { cache: "reload" }))),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    // 只把主入口存档，避免访问 /en/ 等页面时覆盖掉中文外壳。
    if (response && response.ok && new URL(request.url).pathname === "/") {
      cache.put("/", response.clone()).catch(() => {});
    }
    return response;
  } catch (error) {
    const cached = (await cache.match(request, { ignoreSearch: true })) || (await cache.match("/"));
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

// 带版本号的静态资源优先取网络，避免旧外壳加载到不同版本的 JS/CSS。
async function networkFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (error) {
    return (await cache.match(request, { ignoreSearch: true })) || Response.error();
  }
}

// 下载歌曲时一并缓存的封面：离线时直接命中，不再请求图床。
async function coverFirst(request) {
  try {
    const cache = await caches.open(COVER_CACHE);
    const cached = await cache.match(request, { ignoreVary: true });
    if (cached) return cached;
  } catch (error) {
    // 缓存不可用时退回普通网络请求。
  }
  return fetch(request);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    if (request.destination === "image") event.respondWith(coverFirst(request));
    return;
  }
  // 接口请求交给浏览器处理：离线播放走 IndexedDB 里的本地副本。
  if (url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.searchParams.has("v")) {
    event.respondWith(networkFirstAsset(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});
