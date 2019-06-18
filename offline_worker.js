//FIXME this is really, really stupid and bad, but good enough for now. Should be part of the build process.
const staticCacheName = "imageTransformer";
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


//FIXME rewrite also FIXME should always fetch and only on fetch fail load from cache
var fetcher = async event =>
{
	console.log('Fetch event for ', event.request.url);
	event.respondWith(
		caches
			.match(event.request)
			.then(response => {
				if (response) {
					//console.log('Found ', event.request.url, ' in cache');
					return response;
				}
				//console.log('Network request for ', event.request.url);
				return (
					fetch(event.request)
						.then(response => {
							return caches.open(staticCacheName).then(cache => {
                cache.put(event.request.url, response.clone());
								return response;
							});
            })
            .catch(error => {
              //FIXME return file from cache
            })
				);
			})
			.catch(error => {
			  // TODO 6 - Respond with custom offline page
			})
	);
}

self.addEventListener('fetch', fetcher);


self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

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
