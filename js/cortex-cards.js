// Habillage partagé : illustration, papier, liseré, bandeau, informations.
(function(root){
 'use strict';
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const windowPath='M108 81H910Q925 81 938 97L964 124V992Q964 1006 950 1020L930 1037H94Q80 1037 68 1023L58 1009V125L85 97Q96 81 108 81Z';
 const outerPath='M80 25H944Q1007 25 1007 88V1448Q1007 1511 944 1511H80Q17 1511 17 1448V88Q17 25 80 25Z';
 const symbols={diamond:'M0-20 20 0 0 20-20 0Z',triangle:'M0-22 22 18H-22Z',hexagon:'M0-22 19-11V11L0 22-19 11V-11Z',star4:'M0-25Q5-6 25 0Q5 6 0 25Q-5 6-25 0Q-5-6 0-25Z',star8:'M0-25 5-8 19-19 8-5 25 0 8 5 19 19 5 8 0 25-5 8-19 19-8 5-25 0-8-5-19-19-5-8Z'};
 function resolve(id){return (root.CORTEX_EDITION_I?.cartes||[]).find(c=>c.id===id)||null;}
 function layout(card,options={}){
  const cat=root.CORTEX_EDITION_I;
  const r=cat.raretes[card.rarete];
  if(!r)throw Error('Rareté inconnue : '+card.rarete);
  const assetBase=options.assetBase||'assets/cartes/cortex/edition-i/';
  const art=options.artHref||assetBase+card.slug+'-illustration.webp';
  const frame=options.frameHref||assetBase+'cadre.webp';
  const prefix='cx-'+card.slug;
  const text=card.titre.length>18?64:card.titre.length>15?69:76;
  const rareText=r.nom.toUpperCase(), rareFont=card.rarete==='peu_commune'?30:35;
  const ink=card.rarete==='mythique'?'#fff3d9':'#19343c';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536" role="img" aria-labelledby="${prefix}-title"><title id="${prefix}-title">${escape(card.titre)} · ${escape(card.familleNom)} · ${escape(r.nom)} · Édition I · ${String(card.num).padStart(3,'0')} sur ${cat.total}</title>
<defs><clipPath id="${prefix}-outer"><path d="${outerPath}"/></clipPath><clipPath id="${prefix}-art"><path d="${windowPath}"/></clipPath><mask id="${prefix}-paper" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><rect width="1024" height="1536" fill="white"/><path d="${windowPath}" fill="black"/></mask><linearGradient id="${prefix}-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${r.fond}"/><stop offset=".5" stop-color="${r.couleur}" stop-opacity=".68"/><stop offset="1" stop-color="${r.fond}"/></linearGradient></defs>
<g id="${prefix}-illustration" clip-path="url(#${prefix}-art)"><image href="${escape(art)}" x="58" y="81" width="906" height="956" preserveAspectRatio="xMidYMid slice"/></g>
<g id="${prefix}-papier" clip-path="url(#${prefix}-outer)" mask="url(#${prefix}-paper)"><image href="${escape(frame)}" width="1024" height="1536" preserveAspectRatio="none"/></g>
<g id="${prefix}-lisere"><path d="${windowPath}" transform="translate(512 559) scale(.988) translate(-512 -559)" fill="none" stroke="${r.lisere||r.couleur}" stroke-width="7" stroke-linejoin="round"/></g>
<g id="${prefix}-bandeau"><path d="M106 1274H918L932 1288V1346L918 1361H106L92 1346V1288Z" fill="url(#${prefix}-ribbon)" stroke="#a28252" stroke-width="1.5"/><path d="M111 1281H913" stroke="#fff2ce" stroke-opacity=".35" stroke-width="1"/></g>
<g id="${prefix}-informations" fill="#12343f" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle"><path d="M102 1104H294M730 1104H922" fill="none" stroke="#b18b4e" stroke-width="2"/><text x="512" y="1117" font-size="28" letter-spacing="5">${escape(card.familleNom.toUpperCase())}</text><text x="512" y="1220" font-size="${text}" font-weight="700">${escape(card.titre)}</text><path d="${symbols[r.symbole]}" transform="translate(248 1318)" fill="${card.rarete==='mythique'?ink:'none'}" stroke="${ink}" stroke-width="2.8"/><text x="572" y="1330" font-size="${rareFont}" letter-spacing="4" fill="${ink}">${escape(rareText)}</text><text x="90" y="1451" text-anchor="start" font-size="27" letter-spacing="2">ÉDITION I</text><text x="934" y="1451" text-anchor="end" font-size="27" letter-spacing="2">N° ${String(card.num).padStart(3,'0')} / ${String(cat.total).padStart(3,'0')}</text></g></svg>`;
 }
 function picture(id,options={}){
  const card=resolve(id);if(!card)return '';
  const base=options.assetBase||root.CORTEX_EDITION_I.assetBase||'assets/cartes/cortex/edition-i/';
  return `<img class="cortex-card-image" src="${escape(base+card.slug+'.webp')}" srcset="${escape(base+card.slug+'-mini.webp')} 320w, ${escape(base+card.slug+'.webp')} 800w" sizes="${escape(options.sizes||'(max-width: 600px) 44vw, 280px')}" width="800" height="1200" loading="${options.eager?'eager':'lazy'}" decoding="async" alt="${escape(card.titre+' — '+root.CORTEX_EDITION_I.raretes[card.rarete].nom+' — '+card.familleNom)}">`;
 }
 function appCard(id,{neuve=false,exemplaires=0,complet=false}={}){
  const c=resolve(id);if(!c)return '';
  const status=neuve?'Nouvelle découverte':exemplaires>1?'×'+exemplaires:'';
  return `<article class="cortex-in-app">${status?`<p class="cortex-app-status">${escape(status)}</p>`:''}${picture(id,{eager:true,sizes:'(max-width:600px) 85vw, 380px'})}${complet?`<div class="cortex-app-note"><p>${escape(c.description)}</p><small>Note du professeur B</small><p>« ${escape(c.note)} »</p></div>`:''}</article>`;
 }
 function albumTile(id,acquired){
  const c=resolve(id);if(!c)return '';
  if(acquired)return `<button class="cortex-album-tile" data-carte="${escape(id)}" aria-label="Examiner ${escape(c.titre)}">${picture(id,{sizes:'(max-width:600px) 40vw, 200px'})}</button>`;
  const r=root.CORTEX_EDITION_I.raretes[c.rarete];
  return `<div class="cortex-album-locked" aria-label="Artefact à découvrir, ${escape(r.nom)}"><small>ÉDITION I · ${String(c.num).padStart(3,'0')}</small><span aria-hidden="true">?</span><small>${escape(r.nom)}</small></div>`;
 }
 root.CortexCards={resolve,layout,picture,appCard,albumTile,escape};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.CortexCards;
})(typeof window!=='undefined'?window:globalThis);
