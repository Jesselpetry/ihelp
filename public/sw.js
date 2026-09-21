/**
 * Minimal service worker for the installable PWA.
 *
 * It exists mainly so Chromium treats the app as installable (a fetch handler
 * that can answer a navigation while offline is part of that check) and so any
 * rogue worker previously registered on this origin/port is taken over — the
 * job the old self-unregistering worker used to do.
 *
 * Caching is deliberately conservative:
 *   - build output and icons are cache-first (content-hashed or brand assets)
 *   - navigations are network-first, so page content is never served stale
 *   - everything else (API routes, RSC payloads, Supabase) is not touched
 */
const VERSION = "ihelp-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;

const OFFLINE_HTML = `<!doctype html><html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ออฟไลน์ · &lt;i&gt;Help</title>
<style>:root{color-scheme:light dark}body{margin:0;min-height:100vh;display:flex;flex-direction:column;
align-items:center;justify-content:center;gap:.5rem;font-family:system-ui,-apple-system,sans-serif;
background:#f4f6f8;color:#111827;text-align:center;padding:1.5rem}
@media(prefers-color-scheme:dark){body{background:#0f1318;color:#e7eaef}}
h1{font-size:1.125rem;margin:0}p{margin:0;opacity:.7;font-size:.875rem}</style></head>
<body><h1>ออฟไลน์อยู่</h1><p>เชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง</p></body></html>`;

const offlineResponse = () =>
  new Response(OFFLINE_HTML, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Content-hashed build output and brand icons — safe to serve from cache. */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/favicon.png"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(request, response.clone());
        }
        return response;
      })(),
    );
    return;
  }

  // Network-first for full page loads only. RSC payloads, route handlers and
  // API calls fall through untouched, so no dynamic data is ever cached.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return (await caches.match(request)) ?? offlineResponse();
        }
      })(),
    );
  }
});
