const CACHE = "a-deux-v1";
const SHELL = [
  "./index.html",
  "./morpion.html",
  "./puissance4.html",
  "./ballons.html",
  "./dessin.html",
  "./styles.css",
  "./icons.js",
  "./words.js",
  "./couple.js",
  "./dice.js",
  "./firebase.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Réseau d'abord pour tout ce qui touche Firebase (temps réel), cache pour le reste.
self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (url.includes("firestore") || url.includes("googleapis") || url.includes("gstatic")) {
    return; // laisse passer normalement, pas de cache sur le temps réel
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
