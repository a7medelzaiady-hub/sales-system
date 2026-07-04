const CACHE_NAME = "elzyady-pos-v1";

// 🔥 قائمة بكل صفحات النظام والملفات الخارجية ليتم تخزينها
const urlsToCache = [
  "/",
  "/sales-invoice.html",
  "/sales-history.html",
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
  "/customer-installments.html",
  "/customer-list.html",
  "/customer-orders.html",
  "/customer-payment.html",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
];

// 🔥 تثبيت الملفات وتخزينها
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 🔥 تشغيل الكاش بدل الإنترنت
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 🔥 تحديث الكاش القديم
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
});
