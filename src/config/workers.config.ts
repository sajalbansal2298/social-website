export {};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js', { scope: '/' }));

  // TODO: listen to message event from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, meta } = event.data; // Event Data => {type, meta, payload, data }
    switch (type) {
      case 'CACHE_UPDATED':
        if (meta === 'workbox-broadcast-update') {
          // const { cacheName, updatedUrl } = payload;
          // TODO: update the view when the cache is updated
        }
        break;
      case 'PUSH_NOTIFICATION_EVENT':
        break;
      case 'PUSH_NOTIFICATION_CLICKED':
        break;
      case 'PUSH_NOTIFICATION_CLOSED':
        break;
      default:
        break;
    }
  });
}
