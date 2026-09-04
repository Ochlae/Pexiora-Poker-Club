const CACHE_NAME = "pexiora-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./logo.png",
  "./favicon.ico",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  // Toujours privilégier Internet afin que les inscriptions Firebase et
  // les nouvelles versions de l'application restent à jour.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
