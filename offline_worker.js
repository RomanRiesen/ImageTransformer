self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('ImageTransformerStatic').then(function(cache) {
      return cache.addAll([
        'css/quicksettings.css',
        'css/quicksettings_black.css',
        'css/quicksettings_tiny_black.css',
        'css/quicksettings_white.css',
        'css/quicksettings_tiny_white.css',
        'js/gif.js',
        'js/gif.worker.js',
        'js/hammer.min.js',
        'js/quicksettings.min.js',
        'js/regl.min.js',
        'icon.png',
        'manifest.json',
        'style.css',
        'transformer.frag',
        'transformer_shaders.js',
        'index.html',
        // etc
      ]);
    })
  );
});



self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
          return response;
        }
      return fetch(event.request);
        //event.respondWith(caches.match(event.request));
        //return response || fetch(event.request);
    })
    );
});