if(navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js', {scope: './'}).then(function(event){
    console.log('register', event);
  }).catch(function(err){
    console.log('not register', err);
  });
}
