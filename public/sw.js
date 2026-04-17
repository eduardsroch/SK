// Minimal Service Worker for PWA installation
const CACHE_NAME = 'skina33-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy for a basic dynamic app
  event.respondWith(fetch(event.request));
});
