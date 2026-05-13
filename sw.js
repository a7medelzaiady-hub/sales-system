const CACHE_NAME = "elzaiady-v1";

const urlsToCache = [
  "/",
  "/login.html",
  "/index1.html",
  "/sales-history.html"
];

// تثبيت الكاش
self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// تشغيل أوفلاين
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).catch(() => {
        return caches.match("/login.html");
      });
    })
  );
});

// تحديث الكاش
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
