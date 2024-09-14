self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/loadingcafe (1).mp4', // Agrega el video de loading al caché
        '/images/Icon192x192.png',
        '/images/Icon512x512.png',
        '/images/logi.svg',
        '/images/logo1.png',
        '/images/logo2.png',
        '/images/logo3.png',
        '/images/logo4.png',
        '/image1.jpg',
        '/image2 (1).jpg',
        '/image3.jpg',
        '/image4.jpg',
        '/image5.jpg',
        '/image6.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Optionally add fetched resources to cache
        return caches.open('cache-v1').then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});