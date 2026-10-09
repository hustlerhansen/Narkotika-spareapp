import { allArticles } from "@nystart/core";

export const dynamic = "force-static";

/**
 * Service worker for offline use.
 *
 * PRIVACY: only same-origin GET requests for static pages and build assets are
 * cached. Pages are pre-rendered without personal data (all personal data is
 * rendered on the device from local storage), and /api/* is never cached.
 */
const PRECACHE = [
  "/sos",
  "/offline",
  "/hjelp",
  "/laer",
  "/",
  "/verktoy",
  ...allArticles()
    .filter((a) => a.essential)
    .map((a) => `/laer/${a.id}`),
];

// Evaluated at build time (force-static), so each build gets a fresh cache name.
const VERSION = process.env.NEXT_BUILD_ID ?? String(Date.now());

const source = `
const CACHE = "nystart-${VERSION}";
const PRECACHE = ${JSON.stringify(PRECACHE)};

async function cachePage(cache, url) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) return;
  await cache.put(url, res.clone());
  const html = await res.text();
  const assets = [...new Set([...html.matchAll(/\\/_next\\/static\\/[^"'\\s)]+/g)].map((m) => m[0]))];
  await Promise.all(assets.map((a) => cache.match(a).then((hit) => hit || cache.add(a).catch(() => undefined))));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const url of PRECACHE) {
        try { await cachePage(cache, url); } catch (e) { /* offline during install – skip */ }
      }
    }).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("nystart-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;

  // Hashed build assets never change: cache first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })),
    );
    return;
  }

  // Pages and RSC payloads: network first, fall back to cache, then to the offline page (which links to SOS).
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === "basic") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req) || await caches.match(url.pathname);
        if (hit) return hit;
        if (req.mode === "navigate") return (await caches.match("/offline")) || (await caches.match("/sos")) || Response.error();
        return Response.error();
      }),
  );
});
`;

export function GET() {
  return new Response(source, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
