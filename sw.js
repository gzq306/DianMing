// PWA Service Worker：离线缓存（需 HTTPS 部署）
const CACHE = 'rollcall-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon512.png', './rollcall-data.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      try{ const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }catch(err){}
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
