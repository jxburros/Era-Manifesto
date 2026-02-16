/**
 * Service Worker Registration Utility
 * Registers the service worker for offline capabilities
 */

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          
          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[PWA] New service worker found, updating...');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New service worker installed, content updated');
                // Optionally notify user about update
                // You can add a UI notification here if desired
              }
            });
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    });

    // Handle controller change (when new SW takes over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  } else {
    console.log('[PWA] Service Workers are not supported in this browser');
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[PWA] Service Worker unregistered');
      })
      .catch((error) => {
        console.error('[PWA] Service Worker unregistration failed:', error);
      });
  }
};
