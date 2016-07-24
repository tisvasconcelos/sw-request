if(navigator.serviceWorker) {
  navigator.serviceWorker.register('/examples/cache-fetch/sw.js', {scope: '/examples/cache-fetch/'}).then(function(event){
    console.log('register', event);
  }).catch(function(err){
    console.log('not register', err);
  });
}
