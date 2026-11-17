// Édition I : six cartes témoins à valider. Aucun tirage ni accès aux données joueur.
(function(root){
 'use strict';
 const rares={
  commune:{nom:'Commune',couleur:'#a9aaa1',lisere:'#aeb8b6',fond:'#d4cbb8',symbole:'diamond'},
  peu_commune:{nom:'Peu commune',couleur:'#849976',lisere:'#8fb38e',fond:'#c5c9a2',symbole:'triangle'},
  rare:{nom:'Rare',couleur:'#7798ac',lisere:'#7db1d5',fond:'#b7c9d0',symbole:'hexagon'},
  epique:{nom:'Épique',couleur:'#ad8eb8',lisere:'#bf98d6',fond:'#d5bbd3',symbole:'star4'},
  legendaire:{nom:'Légendaire',couleur:'#e2b653',lisere:'#f0c86d',fond:'#eac478',symbole:'star4'},
  mythique:{nom:'Mythique',couleur:'#c4b8e4',lisere:'#d8cdef',fond:'#6c608b',symbole:'star8'}
 };
 const cards=[
  {id:'cx-e1-001',slug:'fer-de-faille',num:1,famille:'mineraux',familleNom:'Minéraux',rarete:'commune',titre:'Fer de faille',description:'Une veine claire traverse la pierre sans suivre aucune cassure.',note:'Le métal semble s’être déposé avant la roche. Je préfère recommencer les mesures avant de tirer une conclusion embarrassante.'},
  {id:'cx-e1-002',slug:'cle-bifide',num:2,famille:'vestiges',familleNom:'Vestiges',rarete:'peu_commune',titre:'Clé bifide',description:'Deux tiges entrelacées. Aucune serrure correspondante n’a encore été retrouvée.',note:'Une seule clé, deux serrures ? Ou deux clés qui refusent de se séparer ? Ne pas tenter de les redresser.'},
  {id:'cx-e1-003',slug:'lentille-des-echos',num:3,famille:'instruments',familleNom:'Instruments',rarete:'rare',titre:'Lentille des échos',description:'Un croissant demeure visible dans le verre, quelle que soit la lumière.',note:'La lentille ne grossit rien. Elle montre pourtant quelque chose. Il reste à déterminer où ce quelque chose se trouve.'},
  {id:'cx-e1-004',slug:'graine-d-orage',num:4,famille:'specimens',familleNom:'Spécimens',rarete:'epique',titre:'Graine d’orage',description:'Sous ses deux enveloppes, une tempête semble attendre son heure.',note:'Aucun signe de germination. Plusieurs signes d’orage. Par précaution, j’ai éloigné l’arrosoir.'},
  {id:'cx-e1-005',slug:'coeur-de-braise',num:5,famille:'mineraux',familleNom:'Minéraux',rarete:'legendaire',titre:'Cœur de braise',description:'Une lumière brûlante circule au cœur du cristal sans jamais se consumer.',note:'La température des instruments ne varie pas. Les instruments, en revanche, ont tous été déplacés pendant la nuit.'},
  {id:'cx-e1-006',slug:'sceau-du-neant',num:6,famille:'vestiges',familleNom:'Vestiges',rarete:'mythique',titre:'Sceau du Néant',description:'Les fragments retiennent une ouverture dont on ne voit pas l’autre côté.',note:'Je ne sais pas ce que ce sceau ferme. C’est précisément la raison pour laquelle personne ne doit tenter de l’ouvrir.'}
 ];
 root.CORTEX_EDITION_I={edition:1,editionLabel:'ÉDITION I',total:6,provisoire:true,rendu:'aplati-b-v2',assetBase:'assets/cartes/cortex/edition-i-v2/',sourceBase:'docs/cortex/edition-i/reprise-b-v2/sources/',raretes:rares,cartes:cards};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.CORTEX_EDITION_I;
})(typeof window!=='undefined'?window:globalThis);
