// Direction créative V2 : présentation uniquement, aucune donnée joueur écrite.
(function(root){
 document.body.classList.add('cx-creative');
 const themes=[
  ['#6050cf','#dff7ed','#c5bcf1','#fff0b4','#e5e4ff'],
  ['#3564b9','#def5ff','#b8d8ed','#ffe0cc','#ddeeff'],
  ['#226f70','#d9f4e5','#a9dcca','#ffe7b7','#e1f4ed'],
  ['#a43d66','#ffe1eb','#f1b8cf','#fff0b2','#f7dff0'],
  ['#5c4bbf','#e6e4ff','#c7c0ed','#d4f5ee','#e4e5ff'],
  ['#b5452f','#ffe4cf','#f0bfa2','#fdf0b4','#ffeadb'],
  ['#8a419b','#f4e0ff','#dfb9ea','#d6f6f0','#f0e6ff'],
  ['#6146b2','#e7e0ff','#c7b8ed','#ffe1da','#e6e1ff'],
  ['#6536ab','#e9d9ff','#c7a4e9','#dbf7ed','#e9e0ff']
 ];
 const oldAmbiance=root.CortexUI.ambiance;
 root.CortexUI.ambiance=function(value){
  oldAmbiance(value);const n=Math.max(1,Math.min(9,Math.round(Number(value)||1))),t=themes[n-1];
  for(const[k,v]of Object.entries({ink:t[0],paper:t[1],line:t[2],secondary:t[3],mist:t[4]}))document.documentElement.style.setProperty('--cx-theme-'+k,v);
  document.documentElement.style.setProperty('--cx-creative-world',t[0]);
  document.documentElement.style.setProperty('--cx-theme-scene','url("'+new URL(scenePath(n),document.baseURI).href+'")');
 };
 const scenePath=n=>'assets/cortex-ui/creatif/region-'+n+(n===1?'':'-v2')+'.webp';
 root.V8.areneSvg=(i,name)=>'<img class="cortex-region-image" src="'+scenePath(Math.max(0,Math.min(8,i))+1)+'" alt="'+root.CortexCards.escape(name||root.CortexUI.regionNames[i])+'" width="1200" height="675" decoding="async">';
 root.ARENES.forEach((a,i)=>a.image=scenePath(i+1));
 const originalAccueil=root.CortexUI.accueil;
 root.CortexUI.accueil=c=>'<div class="cx-home-stage">'+originalAccueil(c).replace('Une lumière douce traverse les premières ruines.','La curiosité fait pousser des mondes inattendus.').replace('La poussière des archives cache de nouvelles pistes.','Les idées ne tiennent plus en place. À toi de suivre leur trace.').replace('Ta prochaine<br>découverte ?','Ta prochaine découverte ?')+'</div>';
 for(const [method,layout]of [['explorer','cx-expedition-layout'],['etudier','cx-study-layout']]){
  const original=root.CortexUI[method];
  root.CortexUI[method]=c=>'<div class="'+layout+'">'+original(c)+'</div>';
 }
 if(root.CortexPreview){
  const mount=root.CortexPreview.mount;
  root.CortexPreview.mount=function(){mount.call(this);const notice=document.querySelector('.cortex-preview');if(notice)notice.textContent='Aperçu · ta progression et ta collection restent inchangées.'};
 }
})(window);
