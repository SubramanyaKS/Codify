const CACHE_NAME = "codify-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico"
];

// Install event → caching static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching app shell...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event → serve cached or fetch new
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(resp => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resp.clone());
            return resp;
          });
        })
      );
    })
  );
});

// Activate event → clean old cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("sync", event => {
  if (event.tag === "sync-progress") {
    event.waitUntil(syncProgressToServer());
  }
});

async function syncProgressToServer() {
  const db = await openDB("codifyDB", 1);
  const progresses = await db.getAll("progress");
  // send API request to sync
  await fetch("/api/sync-progress", {
    method: "POST",
    body: JSON.stringify(progresses),
    headers: { "Content-Type": "application/json" }
  });
}
