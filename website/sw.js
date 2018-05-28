var CACHE_NAME = 'devhoot';
var urlsToCache = [
  '/',
  '/styles/style.css',
  'images/myAvatar.svg',
  '/images/charusat.png',
  '/images/cbse.jpg',
  '/images/udacity.png',
  '/images/bootstrap.png'
];


// Installing a sevice worker and defining files to be cached. 
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


// Updating the service worker.
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });
  
  // const expectedCaches = ['static-v2'];

  // self.addEventListener('activate', event => {
  //   // delete any caches that aren't in expectedCaches
  //   // which will get rid of static-v1
  //   event.waitUntil(
  //     caches.keys().then(keys => Promise.all(
  //       keys.map(key => {
  //         if (!expectedCaches.includes(key)) {
  //           return caches.delete(key);
  //         }
  //       })
  //     )).then(() => {
  //       console.log('V2 now ready to handle fetches!');
  //     })
  //   );
  // });

//  By default, fetching a resource from a third party URL will fail if it doesn't support CORS.
//  You can add a no-CORS option to the Request to overcome this, although this will cause an 'opaque' response,
//   which means you won't be able to tell if the response was successful or not.

//   cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
//     return new Request(urlToPrefetch, { mode: 'no-cors' });
//   })).then(function() {
//     console.log('All resources have been fetched and cached.');
//   });