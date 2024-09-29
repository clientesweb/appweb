const CACHE_NAME = 'cafeclubtv-v1';
const urlsToCache = [
    'index.html',
    'css/main.css',
    'js/main.js',
    'images/logi.svg',
    'images/Icon512x512.png',
    'images/Icon192x192.png',
    // Añade aquí otras rutas que quieras cachear
];

// Instalar el Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activar el Service Worker y limpiar cachés viejos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Manejar las solicitudes de recursos
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Devuelve el recurso del caché si existe, o de la red si no
                return response || fetch(event.request);
            })
    );
});
