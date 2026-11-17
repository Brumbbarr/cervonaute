// Présentation régionale uniquement : aucun point ni état de progression modifié.
(function(root){
 const themes=[
  ['#3d6950','#dfead3','#becfae','#edf0df','#dce7cf','Une lumière douce traverse les premières ruines.'],
  ['#365e70','#dce7ec','#b4cbd3','#e6e9f1','#d8e6ea','Dans les brumes, les contours deviennent des indices.'],
  ['#396651','#d8e9dc','#afcdbb','#e8edcf','#d1e5d9','Sous les verrières, le Cortex reprend vie.'],
  ['#765334','#eee1c7','#d5bd94','#ece5d7','#e9d8b9','La poussière des archives cache de nouvelles pistes.'],
  ['#345f75','#dbe7ef','#b3cad9','#e5e1f2','#d4e4ed','Ici, même les échos semblent avoir quelque chose à dire.'],
  ['#805029','#f0dfbf','#d5b17c','#efdfce','#efd8b4','Une chaleur ancienne veille encore dans les forges.'],
  ['#4d5c81','#e0e5f1','#bdc7de','#e7e3f2','#dce4f1','Les aiguilles de verre retiennent des éclats de lumière.'],
  ['#5d4b85','#e5dff1','#c9bde2','#dfe9ef','#dfd9ee','Le ciel se rapproche. Les découvertes aussi.'],
  ['#68427c','#e8dded','#ccb6dc','#e5dff0','#e1d2eb','Au-delà du seuil, le silence devient presque lumineux.']
 ];
 const previous=root.CortexUI.ambiance;
 root.CortexUI.ambiance=function(value){
  const n=Math.max(1,Math.min(9,Math.round(Number(value)||1))),t=themes[n-1];previous(n);
  const r=document.documentElement;
  for(const[key,v]of Object.entries({ink:t[0],paper:t[1],line:t[2],secondary:t[3],mist:t[4]}))r.style.setProperty('--cx-theme-'+key,v);
  r.style.setProperty('--cx-theme-scene','url("'+new URL('assets/cortex-ui/region-'+n+'.webp',document.baseURI).href+'")');
  r.style.setProperty('--cortex-region-pattern','none');r.style.setProperty('--cortex-region-decoration','none');
  r.dataset.ambiance=n<4?'vivante':n<7?'ancienne':'celeste';
 };
 const accueil=root.CortexUI.accueil;
 root.CortexUI.accueil=c=>accueil(c).replace('Quelques bonnes questions, et l’aventure continue.',themes[Math.max(0,Math.min(8,c.region.n-1))][5]);
})(window);
