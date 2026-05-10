var CACHE_NAME = 'little-claraval-v2'

self.addEventListener('install', function(event) {
  self.skipWaiting()
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE_NAME })
          .map(function(name) { return caches.delete(name) })
      )
    }).then(function() { return self.clients.claim() })
  )
})

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match('/') || new Response('Offline', { status: 503 })
      })
    )
    return
  }
  if (url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(response) {
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, response.clone())
            return response
          })
        })
      })
    )
    return
  }
  event.respondWith(fetch(event.request))
})
