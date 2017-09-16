var cacheStorageKey = 'minimal-pwa-2'
// 哪些文件需要缓存 离线访问
var cacheList = [
  '/',
  "index.html",
  "main.css",
  "logo.png"
]
// self表示server worker
// 处理静态缓存
self.addEventListener('install',function(e) {
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      return cache.addAll(cacheList)
    }).then(function() {
      // 强制当前出于waiting状态的脚本
      // active状态
      return self.skipWaiting()
    })
  )
})
 // 动态缓存 决定如何响应资源请求
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        return response
      }
      return fetch(e.request.url)
    })
  )
})
self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      return self.clients.claim()
    })
  )
})
