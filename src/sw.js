// Minimal Service Worker to satisfy PWA installability requirements
const CACHE_NAME = 'sais-offline-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  // Pass-through fetch handler (network first)
  event.respondWith(fetch(event.request).catch(() => {
    return caches.match(event.request);
  }));
});
