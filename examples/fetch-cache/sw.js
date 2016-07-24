var CACHE_NAME = 'fetch-cache-0.1';

var files = ['/examples/fetch-cache/','/examples/fetch-cache/main.css','/examples/fetch-cache/main.js'];

importScripts('/sw-request.js');

self.addEventListener('install', function(event){
  console.log('installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  swRequest.cacheService.cache(files, {cacheName: CACHE_NAME});
});

self.addEventListener('fetch', function(event){
  event.respondWith(
      swRequest.get(event, {
          serviceOrder: ['fetch','cache'],
          cacheName: CACHE_NAME
        })
        .then(response => {
          return response;
        }).catch(event => {
          console.warn('what kown? a offline page?', event);
        })
    );
});