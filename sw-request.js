var _cacheService = (() => {
  return {
    get(event, config) {
      console.log('trying by cache: ', event.request);
      return new Promise(function(resolve, reject){
        caches.match(event.request, {cacheName: config.cacheName})
          .then((response) => {
            if(response) {
              console.log('return with cache: ', event.request);
              return resolve(response);
            }
            return reject(event);
          }).catch(err => {
            console.info('failed by cache');
            reject(event);
          });
        });
    },
    clean(config) {
      caches.keys()
        .then((keyList) => {
          console.log('deleting older caches');
          keyList.forEach(function(key){
            if (key !== config.cacheName) {
              return caches.delete(key);
            }
          });
        });
    },
    cache(files, config) {
      caches.open(config.cacheName)
        .then((cache) => {
          console.log('start cache');
          return cache.addAll(files);
        });
    }
  }
})();

var _fetchService = (() => {
  return {
    get(event) {
      console.log('trying by fetch: ', event.request);
      return new Promise(function(resolve, reject){
        fetch(event.request)
          .then((response) => {
            if(response) {
              console.log('return with fetch: ', event.request);
              return resolve(response);
            }
            return reject(event);
          }).catch(err => {
            console.info('failed by fetch');
            reject(event);
          });
        });
    }
  }
})();

// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// by https://jakearchibald.com/2014/offline-cookbook/#cache-network-race
// race function:
var _promiseAny = function(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map(p => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach(p => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error("All failed")));
  });
};

const swRequest = (function(){
  return {
    get(event, config) {
      if(!config.serviceOrder) {
        console.log('choose fast');
        return new Promise((resolve, reject) => {
          _promiseAny([
            _cacheService.get(event, config),
            _fetchService.get(event)
          ]).then(response => {
            resolve(response);
          }).catch(err => {
            console.error(err);
            reject(event);
          });
        });
      } else {
        let services = {
          'cache': _cacheService,
          'fetch': _fetchService
        };

        return new Promise((resolve, reject) => {
          services[config.serviceOrder[0]].get(event, config)
            .then(response => {
              resolve(response);
            }).catch(event => {
              services[config.serviceOrder[1]].get(event, config)
                .then(response => {
                  resolve(response);
                }).catch(event => {
                  reject(event);
                })
            });
        });
      }
    },
    fetchService: _fetchService,
    cacheService: _cacheService
  }
})();
