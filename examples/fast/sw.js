var CACHE_NAME = 'fast-0.1';

var files = ['/examples/fast/','/examples/fast/main.css','/examples/fast/main.js'];

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
          cacheName: CACHE_NAME
        })
        .then(response => {
          return response;
        }).catch(event => {
          console.warn('what kown? a offline page?', event);
        })
    );
});
