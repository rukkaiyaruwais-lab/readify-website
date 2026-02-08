const ASSETS = [
  "/",
  "/index.html",
  "/book-explorer.html",
  "/progress-tracker.html",
  "/recommender.html",
  "/reading-flow.html",
  "/feedback.html",

  "/css/style.css",

  "/js/main.js",
  "/js/books.js",
  "/js/progress.js",
  "/js/recommender.js",
  "/js/reading.js",
  "/js/feedback.js",

  "/data/books.json",

  "/favicon.ico",
  "/images/hero.jpg",
  "/images/harry-potter-sorcerers-stone.png",
  "/images/pride and prejudice.jpg",
  "/images/sherlock.jpg",

  "/sound/rain.mp3",
  "/sound/fireplace.mp3",
  "/sound/cafe.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("readify-v1").then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
