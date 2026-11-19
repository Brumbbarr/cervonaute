// Accueil V2 : arène ronde au centre (hublot), anneau de progression, satellites et carte du Cortex.
// Remplace seulement l'accueil, son en-tête et sa navigation. Les autres écrans ne changent pas.
// Pour revenir à l'ancien accueil : retirer ce script et css/cortex-accueil-v2.css de index.html.
(function(root){
 const U=root.CortexUI,E=root.CortexCards.escape,I=U.icon,header=U.header,nav=U.nav;
 const scene=n=>'assets/cortex-ui/creatif/region-'+n+(n===1?'':'-v2')+'.webp';
 const pad=n=>String(n).padStart(2,'0');
 const serie=()=>{try{return root.stats().serie||0}catch(_){return 0}};

 U.header=c=>c.screen!=='lobby'?header(c):'';
 U.nav=screen=>screen!=='lobby'?nav(screen):`<nav class="cx2-nav" aria-label="Navigation principale">
  <button data-act="salle">${I('book',22)}<span>Étudier</span></button>
  <button data-act="labo">${I('lab',22)}<span>Le labo</span></button>
  <button class="cx2-nav-center" data-act="lobby" aria-current="page" aria-label="Accueil">${I('compass',26)}</button>
  <button data-act="jouer">${I('crystal',22)}<span>Explorer</span></button>
  <button data-act="profil">${I('user',22)}<span>Carnet</span></button>
 </nav>`;

 U.accueil=c=>{
  const q=c.quest,n=c.region.n,next=c.nextRegion;
  const pct=next?Math.max(0,Math.min(1,(c.points-c.region.min)/Math.max(1,next.min-c.region.min))):1;
  const C=2*Math.PI*134,left=next?Math.max(0,Math.ceil(next.min-c.points)):0,days=serie();
  const questReady=q.done>=q.goal&&!q.claimed;
  const bubble=next?(left<=30?`Encore un petit effort et la brume se lève sur <b>${E(next.nom)}</b>. On y va ?`:`Chaque bonne réponse nous rapproche de <b>${E(next.nom)}</b>.`):'Tu as ouvert tous les horizons du Cortex. Impressionnant.';
  const sat=q.claimed?`<span class="cx2-sat cx2-sat-chest is-done" aria-label="Coffre de mission récupéré">${I('star',22)}<small>Récupéré</small></span>`
   :questReady?`<button class="cx2-sat cx2-sat-chest is-ready" data-act="claim" aria-label="Récupérer le coffre de mission">${chest()}<small>Ouvrir !</small></button>`
   :`<button class="cx2-sat cx2-sat-chest" data-notion="${E(q.id)}" aria-label="Mission du jour : ${q.done} sur ${q.goal}">${chest()}<small>${q.done}/${q.goal}</small></button>`;
  return `<main class="cx2-home">
  <header class="cx2-top">
   <button class="cx2-avatar" data-act="profil" aria-label="Mon carnet"><img src="assets/cortex-ui/monogramme-cervonaute.svg" alt="" width="40" height="40"></button>
   <div class="cx2-hello"><strong>Salut ${E(c.name)}</strong><small>${E(c.rankLabel)} · <b>${c.points} pts</b></small></div>
   ${days?`<span class="cx2-streak" aria-label="Série de ${days} jours">${flame()}${days} j</span>`:''}
  </header>
  ${c.error?`<p class="cortex-notice" role="status">${E(c.error)}</p>`:''}${!c.ready?'<p class="cortex-notice" role="status">Chargement de ta progression…</p>':''}
  <section class="cx2-prof"><button class="cx2-prof-seal" data-act="professeur" aria-label="Le professeur B">B</button><p>${bubble}</p></section>
  <section class="cx2-stage">
   <span class="cx2-eyebrow">Région ${n} du Cortex</span>
   <h1>${E(c.region.nom)}</h1>
   <div class="cx2-portal-wrap">
    <svg class="cx2-ring" viewBox="0 0 280 280" aria-hidden="true"><circle cx="140" cy="140" r="134" fill="none" stroke="#d8e6e4" stroke-width="8"/><circle cx="140" cy="140" r="134" fill="none" stroke="#2bb3c4" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(pct*C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 140 140)"/></svg>
    <button class="cx2-portal" data-v2-map aria-label="Ouvrir la carte du Cortex"><img src="${scene(n)}" alt="" width="1400" height="788" decoding="async"><span>Voir la carte</span></button>
    <button class="cx2-sat cx2-sat-goal" data-mode="warm" aria-label="Objectif du jour : ${c.today} sur ${c.goal}. Lancer une révision express"><b>${c.today}/${c.goal}</b><small>objectif</small></button>
    ${sat}
   </div>
   <p class="cx2-left">${next?`Encore <b>${left} pts</b> avant ${E(next.nom)}`:'Tous les horizons sont ouverts'}</p>
  </section>
  <button class="cx2-row" data-notion="${E(q.id)}"><span class="cx2-row-ic">${I('compass',20)}</span><span class="cx2-row-txt"><strong>Mission : ${E(c.questName||'notion du jour')}</strong><small>Réussis ${q.goal} questions · ${q.done}/${q.goal}</small></span>${I('arrow',18)}</button>
  ${c.palier?`<button class="cx2-row cx2-row-gift" data-act="serie" data-palier="${c.palier}"><span class="cx2-row-ic">${I('star',20)}</span><span class="cx2-row-txt"><strong>Récompense de série</strong><small>${c.palier} jours d’affilée, bravo</small></span>${I('arrow',18)}</button>`:''}
  <div class="cx2-actions">
   <button class="cx2-side" data-act="labo" aria-label="Le labo, ${c.ownedCount} artefacts sur 24">${I('lab',24)}<i>${c.ownedCount}</i></button>
   <button class="cx2-go" data-act="jouer"><span><strong>Explorer</strong><small>Choisir mon entraînement</small></span><i>${I('arrow',22)}</i></button>
   <button class="cx2-side" data-act="salle" aria-label="La salle d’étude">${I('book',24)}</button>
  </div>
 </main>`;};

 function chest(){return '<svg width="24" height="22" viewBox="0 0 34 30" aria-hidden="true"><rect x="2" y="10" width="30" height="18" rx="3" fill="#fff1e4"/><path d="M2 13c0-7 6-11 15-11s15 4 15 11z" fill="#fff"/><rect x="14" y="11" width="6" height="8" rx="1.5" fill="#2bb3c4"/></svg>';}
 function flame(){return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 3-3z"/></svg>';}

 function carte(){const c=root.cortexContext(),cur=c.regionIndex;const align=['flex-start','center','flex-end','center'];
  return `<dialog class="cx2-map" aria-labelledby="cx2-map-title"><div class="cx2-map-head"><div><span class="cx2-eyebrow">Carte du Cortex</span><h2 id="cx2-map-title">9 régions à explorer</h2></div><button class="cx2-round" data-close-dialog aria-label="Fermer la carte">${I('close',18)}</button></div>
  <ol class="cx2-path">${root.ARENES.map((a,i)=>{const st=i<cur?'done':i===cur?'here':'locked';return `<li class="cx2-step is-${st}" style="align-self:${align[i%4]}"><span class="cx2-step-img"><img src="${scene(i+1)}" alt="" width="1400" height="788" loading="lazy">${st==='locked'?`<i class="cx2-lock">${lock()}</i>`:''}<em>${st==='here'?'Tu es ici':st==='done'?'Explorée':'Région '+pad(i+1)}</em></span><strong>${E(a.nom)}</strong><small>${a.min} pts</small></li>`;}).join('')}</ol></dialog>`;}
 function lock(){return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';}

 document.addEventListener('click',e=>{const b=e.target.closest('[data-v2-map]');if(!b||typeof root.ouvrirDialogue!=='function')return;root.ouvrirDialogue(carte(),b);const here=document.querySelector('.cx2-map .is-here');if(here)here.scrollIntoView({block:'center'});});
})(window);
