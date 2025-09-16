self.addEventListener("install", e => {
  e.waitUntil(caches.open("bob-empire-cache").then(c => {
    return c.addAll([
      "/",
      "/index.html",
      "/style.css",
      "/main.js",
      "/config.js"
    ]);
  }));
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});