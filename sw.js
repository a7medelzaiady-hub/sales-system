const CACHE_NAME = "elzaiady-cache-v6";

// 🔥 قائمة شاملة بكافة الملفات الموجودة في المستودع
const STATIC_FILES = [
  "/",
  "/index.html",
  "/index1.html",
  "/login.html",
  "/add-customer.html",
  "/add-product.html",
  "/add-supplier.html",
  "/admin.html",
  "/all-orders.html",
  "/all-receipts.html",
  "/allfile.html",
  "/banknote.html",
  "/cash-flow.html",
  "/client-vouchers.html",
  "/client_menu.html",
  "/customer-details.html",
  "/customer-info.html",
  "/customer-installments.html",
  "/customer-list.html",
  "/customer-orders.html",
  "/customer-payment.html",
  "/customers-trash.html",
  "/invoice.html",
  "/invoice-list.html",
  "/manifest.json",
  "/seed-users.js",
  "/supabase-config.js",
  "/delete-all-customers.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

/* ===========================
   INSTALL (تثبيت الملفات)
=========================== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

/* ===========================
   ACTIVATE (تحديث الإصدارات)
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
   FETCH (استراتيجية التشغيل أوفلاين)
=========================== */
self.addEventListener("fetch", event => {
  const request = event.request;

  // 1. استثناء طلبات قواعد البيانات (Firebase/Supabase) للسماح لها بالعمل أوفلاين ذاتياً
  if (request.url.includes("firestore.googleapis.com") || request.url.includes("firebase") || request.url.includes("supabase")) {
    return;
  }

  // 2. استراتيجية تحديث صفحات الـ HTML أولاً
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. استراتيجية الكاش أولاً للملفات الثابتة (CSS/JS/Images)
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request).then(networkResponse => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return networkResponse;
      });
    })
  );
});
