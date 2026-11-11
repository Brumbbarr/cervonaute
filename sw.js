// Garde le site disponible hors connexion (train) : réseau d'abord, cache en secours.
const CACHE = 'arene-v29';
const FILES = ['./', 'index.html', 'progression.html', 'manifest.webmanifest', 'cervonaute.svg', 'cervonaute-192.png', 'cervonaute-512.png', 'js/brand.js', 'js/v8.js', 'css/theme.css', 'css/v8.css', 'css/v8-ecrans.css', 'js/config.js', 'js/data.js', 'js/banque.js', 'js/banque-fr.js', 'js/banque-anglais-pro.js', 'js/banque-cours.js', 'js/banque-en-presents.js', 'js/banque-en-3e.js', 'js/banque-en-preterit.js', 'js/banque-en-present-perfect.js', 'js/banque-en-futur.js', 'js/banque-en-demonstratifs.js', 'js/banque-en-verbes-etat.js', 'js/banque-en-plu-perfect.js', 'js/banque-en-articles.js', 'js/banque-en-some-any.js', 'js/banque-fr-homophones.js', 'js/banque-fr-accords.js', 'js/banque-fr-pro.js', 'js/banque-fr-homophones-2.js', 'js/banque-fr-accords-2.js', 'js/banque-fr-pro-2.js', 'js/recompenses.js', 'js/ui.js', 'js/emblem.js', 'js/pixel.js', 'js/traductions.js', 'js/lecons.js', 'js/generateurs.js', 'js/generateurs-fr.js', 'js/banque-plus.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('supabase.co')) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
