// Garde le site disponible hors connexion (train) : réseau d'abord, cache en secours.
const CACHE = 'cervonaute-cortex-v38';
const FILES = ['./', 'index.html', 'progression.html', 'manifest.webmanifest', 'cervonaute.svg', 'cervonaute-192.png', 'cervonaute-512.png', 'js/brand.js', 'js/v8.js', 'css/theme.css', 'css/v8.css', 'css/v8-ecrans.css', 'js/config.js', 'js/data.js', 'js/banque.js', 'js/banque-fr.js', 'js/banque-anglais-pro.js', 'js/banque-cours.js', 'js/banque-en-presents.js', 'js/banque-en-3e.js', 'js/banque-en-preterit.js', 'js/banque-en-present-perfect.js', 'js/banque-en-futur.js', 'js/banque-en-demonstratifs.js', 'js/banque-en-verbes-etat.js', 'js/banque-en-plu-perfect.js', 'js/banque-en-articles.js', 'js/banque-en-some-any.js', 'js/banque-fr-homophones.js', 'js/banque-fr-accords.js', 'js/banque-fr-pro.js', 'js/banque-fr-homophones-2.js', 'js/banque-fr-accords-2.js', 'js/banque-fr-pro-2.js', 'js/recompenses.js', 'js/ui.js', 'js/emblem.js', 'js/pixel.js', 'js/traductions.js', 'js/lecons.js', 'js/generateurs.js', 'js/generateurs-fr.js', 'js/banque-plus.js'];
const CORTEX_SLUGS = 'fer-de-faille cle-bifide lentille-des-echos graine-d-orage coeur-de-braise sceau-du-neant quartz-sourd verre-de-faille vesperite nacre-de-nuit aiguille-de-derive compas-decentre diapason-muet pince-d-equilibre astrolabe-des-marees sceau-fendu jeton-sans-face disque-des-passages cle-des-seuils coquille-inverse graine-de-brume spore-de-verre fleur-de-veille cocon-d-aurore'.split(' ');
FILES.push('css/cortex-accueil.css','js/cortex-accueil.js','js/cortex-creatif.js');
FILES.push('css/cortex-creatif.css',...Array.from({length:9},(_,i)=>`assets/cortex-ui/creatif/region-${i+1}${i?'-v2':''}.webp`));
FILES.push('css/cortex-parcours.css','js/cortex-parcours.js');
FILES.push('assets/cortex-ui/dos-carte.svg');
FILES.push('assets/cortex-ui/logo-cervonaute.svg','assets/cortex-ui/monogramme-cervonaute.svg','assets/cortex-ui/decouverte-ancienne.webp');
FILES.push('css/cortex-revelation.css','js/cortex-revelation.js');
FILES.push('js/cortex-insignes-v2.js');
FILES.push('js/cortex-ambiances.js','css/cortex-ambiances.css');
FILES.push('css/cortex-cards.css','css/cortex-interface.css','js/cortex-catalogue.js','js/cortex-edition-i-24.js','js/cortex-cards.js','js/cortex-ui.js','js/cortex-emblems.js','js/cortex-apercu.js','assets/cortex-ui/laboratoire.webp',...Array.from({length:9},(_,i)=>`assets/cortex-ui/region-${i+1}.webp`),...CORTEX_SLUGS.flatMap(s=>['.webp','-mini.webp'].map(suffix=>'assets/cartes/cortex/edition-i-24/'+s+suffix)));
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('supabase.co')) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
