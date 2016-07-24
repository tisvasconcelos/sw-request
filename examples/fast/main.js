if(navigator.serviceWorker) {
  navigator.serviceWorker.register('/examples/fast/sw.js', {scope: '/examples/fast/'}).then(function(event){
    console.log('register', event);
  }).catch(function(err){
    console.log('not register', err);
  });
}
