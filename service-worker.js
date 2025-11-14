
const CACHE_NAME = 'mazdaspeed-xr-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './assets/img/Mazdaspeed.jpg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/models/Mazdaspeed.glb',
  './viewer3D/mazdaspeed-3d.html',
  './viewerAR/mazdaspeed-ar.html',
  './viewerVR/mazdaspeed-vr.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
