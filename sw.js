const CACHE_NAME = "elzaiady-cache-v5";

const STATIC_FILES = [

  "/",
  "/index.html",
  "/index1.html",
  "/login.html",

  "/customer-list.html",
  "/customer-info.html",
  "/customers-trash.html",

  "/invoice.html",
  "/invoice-list.html",
"/sales-record.html",
"/sales-invoice.html",
"/transactions.html",
"/suppliers.html",
"/inventory.html",
"/offline.html",
  "/manifest.json",

  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"

];



/* ===========================
   INSTALL
=========================== */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_FILES);
      })

  );

  self.skipWaiting();

});



/* ===========================
   ACTIVATE
=========================== */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })

      );

    })

  );

  self.clients.claim();

});



/* ===========================
   FETCH
=========================== */

self.addEventListener("fetch", event => {

  const request = event.request;



  /* ===========================
     FIREBASE REQUESTS
  =========================== */

  if (
    request.url.includes("firestore.googleapis.com") ||
    request.url.includes("firebase")
  ) {

    event.respondWith(

      fetch(request)
        .then(response => {

          const responseClone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseClone);
            });

          return response;

        })
        .catch(() => {
          return caches.match(request);
        })

    );

    return;
  }



  /* ===========================
     HTML PAGES
  =========================== */

  if (request.headers.get("accept")?.includes("text/html")) {

    event.respondWith(

      fetch(request)
        .then(response => {

          const responseClone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseClone);
            });

          return response;

        })
        .catch(() => {
          return caches.match(request);
        })

    );

    return;
  }



  /* ===========================
     CSS / JS / IMAGES
  =========================== */

  event.respondWith(

    caches.match(request)
      .then(cachedResponse => {

        return cachedResponse || fetch(request)
          .then(networkResponse => {

            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseClone);
              });

            return networkResponse;

          });

      })

  );

});
