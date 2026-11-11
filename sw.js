// Garde le site disponible hors connexion (train) : réseau d'abord, cache en secours.
const CACHE = 'arene-v20';
const FILES = ['./', 'index.html', 'progression.html', 'manifest.webmanifest', 'cervonaute.svg', 'cervonaute-192.png', 'cervonaute-512.png', 'js/brand.js', 'js/v8.js', 'css/theme.css', 'css/v8.css', 'css/v8-ecrans.css', 'js/config.js', 'js/data.js', 'js/banque.js', 'js/banque-fr.js', 'js/banque-laniflex.js', 'js/banque-cours.js', 'js/recompenses.js', 'js/ui.js', 'js/emblem.js', 'js/pixel.js', 'js/traductions.js', 'js/lecons.js', 'js/generateurs.js', 'js/generateurs-fr.js', 'js/banque-plus.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('supabase.co')) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
