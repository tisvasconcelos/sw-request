if(navigator.serviceWorker) {
  navigator.serviceWorker.register('/examples/fetch-cache/sw.js', {scope: '/examples/fetch-cache/'}).then(function(event){
    console.log('register', event);
  }).catch(function(err){
    console.log('not register', err);
  });
}
