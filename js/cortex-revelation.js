// Effet commun aux récompenses et à leur simulation. Aucun tirage dans ce module.
(function(root){
 const colors={commune:'#e7ba73',peu_commune:'#86ce9c',rare:'#75cbf5',epique:'#bd91f6',legendaire:'#ffc34f',mythique:'#ead2ff'};
 const light=`<svg class="cx-light-art" viewBox="0 0 1536 1024" aria-hidden="true"><defs><filter id="cx-seam-soft" x="-40%" y="-200%" width="180%" height="500%"><feGaussianBlur stdDeviation="12"/></filter><filter id="cx-seam-core" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="2.5"/></filter></defs><g class="cx-seam-bloom" fill="none" stroke="currentColor"><path d="M252 572Q276 613 354 622L1112 553Q1193 543 1211 511" stroke-width="22" opacity=".7" filter="url(#cx-seam-soft)"/><path d="M252 572Q276 613 354 622L1112 553Q1193 543 1211 511" stroke-width="4" opacity=".85" filter="url(#cx-seam-core)"/><path d="m540 386 14 23-8 18 21 15-4 21m440-77-12 26 13 14-8 21" stroke-width="2" opacity=".5" filter="url(#cx-seam-core)"/></g><ellipse class="cx-clasp-light" cx="818" cy="583" rx="90" ry="21" fill="currentColor" opacity=".8" filter="url(#cx-seam-soft)"/></svg>`;
 function scene(){return `<span class="cx-discovery-scene cx-seam-v2"><img src="assets/cortex-ui/decouverte-ancienne.webp" alt="Écrin ancien scellé, une lumière filtre par la jointure" width="900" height="600">${light}</span>`;}
 root.V8.coffreGrand=scene;
 async function ouvrir(button,rarity,{motion}={}){if(!button?.isConnected)return false;button.disabled=true;button.classList.add('cx-opening-v2');button.setAttribute('aria-label','La découverte se révèle');const animated=motion??!matchMedia('(prefers-reduced-motion: reduce)').matches;const pause=ms=>new Promise(r=>setTimeout(r,animated?ms:0));await pause(650);if(!button.isConnected)return false;button.style.setProperty('--cx-light',colors[rarity]||colors.commune);button.dataset.revealRarity=rarity;button.classList.add('cx-rarity-reveal');await pause(1450);return button.isConnected;}
 root.CortexReveal={scene,ouvrir,colors};
 const original=root.CortexUI.ambiance;
 const motifs=[
 '<path d="M15 170Q35 85 78 30M36 111Q5 75 11 55q42 13 25 56m14-30q1-39 33-48-1 39-33 48"/>',
 '<path d="M0 55q90-45 180 0t180 0M-40 95q90-45 180 0t180 0M0 140q90-45 180 0t180 0"/>',
 '<path d="M15 155q70-90 70-130Q8 50 15 155Zm0 0L85 25m-60 87 31-4m-16-28 24-7"/>',
 '<path d="M15 30h45l15 12 15-12h45v100H90l-15 12-15-12H15Zm60 12v100M30 55h20m-20 18h25m40-18h20m-20 18h25"/>',
 '<circle cx="80" cy="80" r="55"/><ellipse cx="80" cy="80" rx="65" ry="20" transform="rotate(-35 80 80)"/><path d="M80 7v20m0 106v20M7 80h20m106 0h20"/>',
 '<path d="m25 130 12-80 28 35-16 63Zm55-45 20-68 28 63-19 49Zm-25 90 10-18m70-115 13-13"/>',
 '<path d="m20 145 15-115 24 22 7 93Zm60 0 20-140 24 25 10 115ZM35 30l5 115m60-140 5 140"/>',
 '<path d="m15 130 35-85 55 40 30-65M50 45l85-25"/><circle cx="15" cy="130" r="4"/><circle cx="50" cy="45" r="5"/><circle cx="105" cy="85" r="4"/><circle cx="135" cy="20" r="5"/>',
 '<path d="m80 10 12 44 45 26-44 12-13 48-15-46-49-14 48-25Z M15 25l18 4-5 18m105 88-18-4 5-18"/>'
 ];
 root.CortexUI.ambiance=function(n){original(n);const motif=motifs[Math.max(0,Math.min(8,n-1))];const svg='<svg xmlns="http://www.w3.org/2000/svg" width="330" height="330" viewBox="0 0 330 330"><g transform="translate(100 90)" fill="none" stroke="'+['#668a60','#5d8e99','#668f61','#9c8153','#60869b','#b48140','#778eac','#8980b0','#9869b0'][n-1]+'" stroke-opacity=".12" stroke-width="1.5">'+motif+'</g></svg>';document.documentElement.style.setProperty('--cortex-region-pattern','url("data:image/svg+xml,'+encodeURIComponent(svg)+'")');};
 // L’illustration fermée de l’accueil utilise exactement le même éclairage.
 const accueil=root.CortexUI.accueil;root.CortexUI.accueil=c=>accueil(c).replace(/<div class="cx-discovery-scene"[\s\S]*?<\/div>/,scene());
})(window);
