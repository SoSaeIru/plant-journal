// 서비스 워커: 인터넷이 없어도 앱이 열리게 한다. (기록·사진은 IndexedDB에 따로 있어 여기와 상관없음)
// VERSION과 ASSETS는 npm run build가 자동으로 채운다. 손으로 고치지 않는다.
const VERSION = '95e3841a';
const ASSETS = ['./', './styles.css?v=806e7117', './vendor/confetti.browser.js?v=eb3a3525', './fonts/Jua-Regular.woff2?v=83edad5d'];
const CACHE = `plant-journal-${VERSION}`;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('plant-journal-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// 화면(HTML): 인터넷 우선 → 새 버전이 바로 보이고, 끊기면(또는 4초 넘게 느리면) 저장해 둔 것을 연다.
// 그 밖의 파일(styles.css?v=… 등): 저장해 둔 것 우선. 주소에 버전이 붙어 있어 바뀌면 새로 받는다.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const fromNet = fetch(req).then(res => { if (res.ok) cache.put('./', res.clone()); return res; });
      const timeout = new Promise(r => setTimeout(r, 4000));
      try {
        const res = await Promise.race([fromNet, timeout]);
        if (res) return res;
      } catch (err) {}
      return (await cache.match('./')) || fromNet;
    })());
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
    return res;
  })));
});
