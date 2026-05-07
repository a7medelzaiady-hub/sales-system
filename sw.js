self.addEventListener('install', (e) => {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  // بيسمح للتطبيق يشتغل حتى لو النت ضعيف
});
