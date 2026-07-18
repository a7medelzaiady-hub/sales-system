const CACHE_NAME = "elzaiady-cache-v8-offline";

// 🔥 قائمة شاملة بكافة الملفات الموجودة في المستودع (يتم تجهيزها مسبقًا
// عشان البرنامج يفتح ويشتغل بالكامل من غير إنترنت من أول مرة)
const STATIC_FILES = [
  "/",
    "/add-customer.html",
    "/add-product.html",
    "/add-shortages.html",
    "/add-supplier.html",
    "/admin.html",
    "/all-orders.html",
    "/all-receipts.html",
    "/allfile.html",
    "/banknote.html",
    "/cash-flow.html",
    "/client-vouchers.html",
    "/client_menu.html",
    "/cloud-backup.js",
    "/customer-details.html",
    "/customer-installments.html",
    "/customer-list.html",
    "/customer-orders.html",
    "/customer-payment.html",
    "/customer-portal.html",
    "/customer-statement.html",
    "/customer-transactions-log.html",
    "/customers-trash.html",
    "/dashboard.html",
    "/delete-all-customers.js",
    "/edit-customer.html",
    "/edit-supplier.html",
    "/editablecells.html",
    "/expenses.html",
    "/firebase-compat-shim.js",
    "/firebase-shim.js",
    "/general-ledger.html",
    "/generate-links.html",
    "/icon-192.jpg",
    "/icon-512.png",
    "/index.html",
    "/index1.html",
    "/index2.html",
    "/index3.html",
    "/initial-balances.html",
    "/inventory-list.html",
    "/inventory-menu.html",
    "/inventory.html",
    "/low_stock1.html",
    "/mabiat-menu.html",
    "/makhzan.html",
    "/manifest.json",
    "/mkhazen.html",
    "/new-order.html",
    "/new-purchase-invoice.html",
    "/offline.html",
    "/orders-home.html",
    "/overdue-debts.html",
    "/price-search.html",
    "/product-details.html",
    "/profit.html",
    "/purchase-invoices-list.html",
    "/purchase-mgmt.html",
    "/purchase-orders-list.html",
    "/purchase-return.html",
    "/quotation-history.html",
    "/quotation.html",
    "/remaining-amounts.html",
    "/reports.html",
    "/reports1.html",
    "/reports2.html",
    "/reports3.html",
    "/returns-list.html",
    "/sales-history.html",
    "/sales-invoice.html",
    "/sales-return.html",
    "/sales-returns-history.html",
    "/sales_transactions.html",
    "/sandok.html",
    "/sandok1.html",
    "/seed-users.js",
    "/settings.html",
    "/setup-accounting.html",
    "/supabase-config.js",
    "/supplier-debts.html",
    "/supplier-details.html",
    "/supplier-installments.html",
    "/supplier-list.html",
    "/supplier-management.html",
    "/supplier-opening-balance.html",
    "/supplier-payment.html",
    "/supplier-statement.html",
    "/sw.js",
    "/tacnefat.html",
    "/top-customers.html",
    "/transactions-log.html",
    "/trash.html",
    "/trashi.html",
    "/trashl.html",
    "/update-inventory.html",
    "/upload-supplier.html",
    "/upload_customers.html",
    "/upload_excel.html",
    "/vouchers-hub.html",
    "/vouchers.html",
    "/whatsapp-campaigns.html",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

/* ===========================
   INSTALL (تثبيت الملفات)
   ملاحظة: بنستخدم Promise.allSettled بدل cache.addAll عشان لو ملف
   واحد فشل تحميله (مثلاً مش موجود)، الباقي كله يتخزن عادي ومايفشلش
   التثبيت بالكامل.
=========================== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const results = await Promise.allSettled(
        STATIC_FILES.map(url => cache.add(url))
      );
      const failed = results.filter(r => r.status === "rejected").length;
      if (failed) {
        console.warn(`تعذر تخزين ${failed} ملف/ملفات مؤقتًا (هيتم تخزينها أول ما تتفتح).`);
      }
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

  // 1. استثناء طلبات فايربيز الحقيقية (تُستخدم فقط يدويًا في النسخ الاحتياطي)
  //    عشان لو حصل نسخ احتياطي وقت ما يكون فيه نت، الطلب يعدي عادي.
  if (request.url.includes("firestore.googleapis.com") || request.url.includes("googleapis.com/identitytoolkit") || request.url.includes("supabase")) {
    return;
  }

  // 2. استراتيجية تحديث صفحات الـ HTML أولاً، مع رجوع للكاش لو مفيش نت
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

  // 3. استراتيجية الكاش أولاً للملفات الثابتة (CSS/JS/Images) - أهم حاجة عشان الشغل الأوفلاين
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request).then(networkResponse => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return networkResponse;
      }).catch(() => cachedResponse);
    })
  );
});
