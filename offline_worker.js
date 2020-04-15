//FIXME this is really, really stupid and bad, but good enough for now. Should be part of the build process.
const cache_name = "imageTransformer";
const files_to_cache = [
	'css/quicksettings_default.css',
	'css/quicksettings_black.css',
	'css/quicksettings_tiny_black.css',
	'css/quicksettings_white.css',
	'css/quicksettings_tiny_white.css',
	'js/gif.js',
	'js/gif.worker.js',
	'js/hammer.min.js',
	'js/quicksettings.min.js',
	'js/regl.min.js',
	'img/icon.png',
	'manifest.json',
	'style.css',
	'transformer.frag',
	'transformer_shaders.js',
	'index.html'
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('ImageTransformerStatic').then(function(cache) {
			return cache.addAll(files_to_cache);
		})
	);
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the network
    fetch(event.request)
      .then(function(res) {
        return caches.open(cache_name)
          .then(function(cache) {
            // Put in cache if succeeds
            cache.put(event.request.url, res.clone());
            return res;
          })
      })
      .catch(function(err) {
          // Fallback to cache
          return caches.match(event.request.url);
      })
  );
});


self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [cache_name];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
