var CACHE_NAME = 'cache-fetch-0.1';

var files = ['./','./main.css','./main.js'];

importScripts('/sw-request/sw-request.js');

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
          serviceOrder: ['cache','fetch'],
          cacheName: CACHE_NAME
        })
        .then(response => {
          return response;
        }).catch(event => {
          console.warn('what kown? a offline page?', event);
        })
    );
});
