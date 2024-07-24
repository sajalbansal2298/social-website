import { skipWaiting } from 'workbox-core/skipWaiting';
import { clientsClaim } from 'workbox-core/clientsClaim';
import { CacheableResponsePlugin } from 'workbox-cacheable-response/CacheableResponsePlugin';
import { ExpirationPlugin } from 'workbox-expiration/ExpirationPlugin';
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update/BroadcastUpdatePlugin';

// Precaching
import { cleanupOutdatedCaches } from 'workbox-precaching/cleanupOutdatedCaches';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

// Routing
import * as navigationPreload from 'workbox-navigation-preload';
import { registerRoute } from 'workbox-routing/registerRoute';

// Strategies
import { CacheFirst } from 'workbox-strategies/CacheFirst';

// TODO: Add this later once we understand the documentation
// Google Analytics
// import * as googleAnalytics from 'workbox-google-analytics';

// googleAnalytics.initialize();

const config = (name, maxAgeDays, maxEntries) => ({
  cacheName: name,
  plugins: [
    new ExpirationPlugin({
      maxEntries: maxEntries || 1000,
      maxAgeSeconds: (maxAgeDays || 3) * 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
    new CacheableResponsePlugin({ statuses: [0, 200, 206] }),
    new BroadcastUpdatePlugin(),
  ],
});

if ('function' === typeof importScripts) {
  // eslint-disable-next-line no-undef
  importScripts('https://cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js');
}

navigationPreload.enable();

cleanupOutdatedCaches();

precacheAndRoute(self.__precacheManifest || self.__WB_MANIFEST || []);

registerRoute(({ request }) => request.destination === 'script', new CacheFirst(config('script-cache')));

registerRoute(({ request }) => request.destination === 'style', new CacheFirst(config('style-cache')));

// TODO: to be added back when we handle s3 urls
registerRoute(({ request }) => request.destination === 'image', new CacheFirst(config('image-cache', 30)));

registerRoute(({ request }) => request.destination === 'font', new CacheFirst(config('font-cache')));

addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    skipWaiting();
    clientsClaim();
  }
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', async (event) => {
  // eslint-disable-next-line no-undef
  event.waitUntil(clients.claim());

  // The cleaning part could be on service worker side
  indexedDB.deleteDatabase('workbox-expiration');
  const cacheKeys = await caches.keys();
  for (const key of cacheKeys) {
    caches.delete(key);
  }
});
