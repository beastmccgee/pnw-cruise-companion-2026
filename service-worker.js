const CACHE_NAME = "honeymoon-pwa-v1";
const TILE_CACHE = "honeymoon-tiles-v1";

const CORE_ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "css/styles.css",
  "js/data.js",
  "js/checklist.js",
  "js/app.js",
  "vendor/leaflet/leaflet.js",
  "vendor/leaflet/leaflet.css",
  "vendor/leaflet/images/marker-icon.png",
  "vendor/leaflet/images/marker-icon-2x.png",
  "vendor/leaflet/images/marker-shadow.png",
  "fonts/playfair_variable.ttf",
  "fonts/playfair_variable_italic.ttf",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon-180.png",
  "images/day1_seattle.jpg",
  "images/day2_lapush.jpg",
  "images/day3_rialto.jpg",
  "images/day4_cruiseship.jpg",
  "images/day5_insidepassage.jpg",
  "images/day6_juneauwhale.jpg",
  "images/day7_whitepass.jpg",
  "images/day8_glacierbay.jpg",
  "images/day9_ketchikan.jpg",
  "images/day10_victoria.jpg",
  "images/day11_airplane.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== TILE_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Map tiles: cache-first, cached indefinitely once viewed (for offline days at sea/rainforest)
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(event.request).then(cached => cached || fetch(event.request).then(res => {
          cache.put(event.request, res.clone());
          return res;
        }).catch(() => cached))
      )
    );
    return;
  }

  // Same-origin app assets: cache-first, falling back to network
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
