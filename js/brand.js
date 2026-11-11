// =====================================================================
// MARQUE — seul endroit où figurent le nom de l'appli et son univers.
// Pour renommer : changer ces valeurs (et le manifest.webmanifest, qui
// est un fichier statique que le navigateur lit sans JavaScript).
// =====================================================================
window.BRAND = {
  appName: 'Cervonaute',
  playerName: 'Cervonaute',
  playerPlural: 'Cervonautes',
  worldName: 'le Cortex',        // avec l'article
  worldNameBare: 'Cortex',       // sans l'article (« Région du Cortex »)
  regionLabel: 'Région du Cortex',
  tagline: 'Deviens Cervonaute et explore le Cortex, arène après arène.',
  // Compteur de mises à jour publiées : +1 à chaque publication (avec le cache de sw.js)
  version: 36,
  versionDate: '2026-11-11'
};
// 26 mises à jour → v2.6 ; 30 → v3.0
BRAND.versionLabel = 'v' + Math.floor(BRAND.version / 10) + '.' + (BRAND.version % 10) + ' · ' + BRAND.versionDate.split('-').reverse().join('/');
// Remplit les éléments statiques marqués data-brand="cle" et le titre de l'onglet
(function () {
  function fill() {
    document.querySelectorAll('[data-brand]').forEach(function (el) { var k = el.getAttribute('data-brand'); if (BRAND[k]) el.textContent = BRAND[k]; });
    var t = document.documentElement.getAttribute('data-title');
    document.title = t ? t.replace('{app}', BRAND.appName) : BRAND.appName;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
