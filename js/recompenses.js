// Arènes (selon les points globaux), succès, titres et cartes à collectionner.
window.ARENES = [
  {n:1, nom:'La Plaine',             min:0,    bg:'radial-gradient(130% 120% at 50% 0%,#5b9554 0%,#3c5d3b 55%,#293729 100%)', acc:'#8fe07a', diff:[7,2,1], deco:'🌾'},
  {n:2, nom:'Le Quai de chargement', min:150, bg:'radial-gradient(130% 120% at 50% 0%,#6a717f 0%,#444853 55%,#32353e 100%)', acc:'#9aa0ab', diff:[6,3,1], deco:'📦'},
  {n:3, nom:'L\'Entrepôt',           min:220, bg:'radial-gradient(130% 120% at 50% 0%,#956a44 0%,#5d4434 55%,#382d26 100%)', acc:'#f0a66a', diff:[4,4,2], deco:'🏭'},
  {n:4, nom:'La Chambre froide',     min:310, bg:'radial-gradient(130% 120% at 50% 0%,#447fab 0%,#33506f 55%,#263241 100%)', acc:'#8fd8ff', diff:[3,4,3], deco:'❄️'},
  {n:5, nom:'Le Salon professionnel',min:420, bg:'radial-gradient(130% 120% at 50% 0%,#957f34 0%,#5d5028 55%,#383221 100%)', acc:'#ffe27a', diff:[2,4,4], deco:'🎪'},
  {n:6, nom:'La Salle du conseil',   min:540, bg:'radial-gradient(130% 120% at 50% 0%,#349588 0%,#285d56 55%,#213835 100%)', acc:'#8ff0e0', diff:[1,4,5], deco:'💼'},
  {n:7, nom:'La Tour de verre',      min:670, bg:'radial-gradient(130% 120% at 50% 0%,#4c67c0 0%,#344475 55%,#262d44 100%)', acc:'#a9c4ff', diff:[1,3,6], deco:'🏙️'},
  {n:8, nom:'Le Sommet',             min:820, bg:'radial-gradient(130% 120% at 50% 0%,#7f3fab 0%,#502e6c 55%,#332441 100%)', acc:'#e3a6ff', diff:[0,3,7], deco:'🏔️'},
  {n:9, nom:'Le Panthéon',           min:970, bg:'radial-gradient(130% 120% at 50% 0%,#ab3f54 0%,#6c2e3b 55%,#41242d 100%)', acc:'#ffb3c1', diff:[0,2,8], deco:'👑'}
];window.arene = (pts) => { let a = ARENES[0]; ARENES.forEach((x) => { if (pts >= x.min) a = x; }); return a; };

// Cartes à collectionner : expressions anglaises utiles au travail. r = rareté.
window.CARTES = [
  {id:'c1',r:'commune',en:'to touch base',fr:'reprendre contact rapidement',ex:'Let\'s touch base next week.'},
  {id:'c2',r:'commune',en:'ASAP',fr:'dès que possible (as soon as possible)',ex:'Please send it ASAP.'},
  {id:'c3',r:'commune',en:'to follow up',fr:'relancer, faire le suivi',ex:'I\'m following up on my quote.'},
  {id:'c4',r:'commune',en:'a deadline',fr:'une date limite',ex:'The deadline is Friday.'},
  {id:'c5',r:'commune',en:'to look forward to',fr:'avoir hâte de (+ -ing)',ex:'I look forward to hearing from you.'},
  {id:'c6',r:'commune',en:'a lead',fr:'un prospect, une piste commerciale',ex:'We got ten new leads at the fair.'},
  {id:'c7',r:'commune',en:'to be on the same page',fr:'être sur la même longueur d\'onde',ex:'Let\'s make sure we\'re on the same page.'},
  {id:'c8',r:'commune',en:'a win-win deal',fr:'un accord gagnant-gagnant',ex:'It\'s a win-win deal.'},
  {id:'c9',r:'commune',en:'to get back to someone',fr:'revenir vers quelqu\'un',ex:'I\'ll get back to you tomorrow.'},
  {id:'c10',r:'commune',en:'a ballpark figure',fr:'un chiffre approximatif',ex:'Can you give me a ballpark figure?'},
  {id:'c11',r:'rare',en:'to cut corners',fr:'bâcler pour gagner du temps ou de l\'argent',ex:'We never cut corners on quality.'},
  {id:'c12',r:'rare',en:'to think outside the box',fr:'sortir des sentiers battus',ex:'We need to think outside the box.'},
  {id:'c13',r:'rare',en:'the bottom line',fr:'le résultat net, l\'essentiel',ex:'The bottom line is: it saves energy.'},
  {id:'c14',r:'rare',en:'to close a deal',fr:'conclure une vente',ex:'She closed the deal in one call.'},
  {id:'c15',r:'rare',en:'a cold call',fr:'un appel de prospection à froid',ex:'I made twenty cold calls today.'},
  {id:'c16',r:'rare',en:'to go the extra mile',fr:'faire un effort supplémentaire',ex:'We go the extra mile for our clients.'},
  {id:'c17',r:'rare',en:'to be swamped',fr:'être débordé',ex:'I\'m swamped this week.'},
  {id:'c18',r:'rare',en:'a game changer',fr:'quelque chose qui change tout',ex:'This new software is a game changer.'},
  {id:'c19',r:'épique',en:'to hit the ground running',fr:'être opérationnel tout de suite',ex:'The new rep hit the ground running.'},
  {id:'c20',r:'épique',en:'to keep someone in the loop',fr:'tenir quelqu\'un informé',ex:'Please keep me in the loop.'},
  {id:'c21',r:'épique',en:'low-hanging fruit',fr:'les gains faciles à obtenir',ex:'Let\'s start with the low-hanging fruit.'},
  {id:'c22',r:'épique',en:'to seal the deal',fr:'sceller l\'accord',ex:'A free sample sealed the deal.'},
  {id:'c23',r:'épique',en:'a no-brainer',fr:'une évidence, un choix facile',ex:'Saving 30% on heating is a no-brainer.'},
  {id:'c24',r:'épique',en:'to pull out all the stops',fr:'mettre le paquet',ex:'We pulled out all the stops for the fair.'},
  {id:'c25',r:'légendaire',en:'to move the needle',fr:'faire vraiment bouger les choses',ex:'This contract really moves the needle.'},
  {id:'c26',r:'légendaire',en:'the elephant in the room',fr:'le problème que tout le monde évite',ex:'Let\'s address the elephant in the room: price.'},
  {id:'c27',r:'légendaire',en:'to have a lot on one\'s plate',fr:'avoir beaucoup de travail',ex:'I have a lot on my plate right now.'},
  {id:'c28',r:'légendaire',en:'back to the drawing board',fr:'retour à la case départ',ex:'The client said no: back to the drawing board.'}
];
window.RARETES = {commune:{c:'#9aa0ab'},rare:{c:'#5b8cff'},'épique':{c:'#b05bff'},'légendaire':{c:'#ffcf5a'}};

// Succès. f(stats) → vrai si débloqué. Chacun donne un titre.
window.SUCCES = [
  {id:'premiere',nom:'Premier sang',desc:'Finir ta première session',titre:'Recrue',f:(s)=>s.sessions>=1},
  {id:'parfait',nom:'Sans faute',desc:'Une session de 8 questions ou plus à 100 %',titre:'Perfectionniste',f:(s)=>s.parfaites>=1},
  {id:'combo10',nom:'En feu',desc:'Un combo de 10 bonnes réponses',titre:'Inarrêtable',f:(s)=>s.combo>=10},
  {id:'combo25',nom:'Machine',desc:'Un combo de 25 bonnes réponses',titre:'Machine à grammaire',f:(s)=>s.combo>=25},
  {id:'boss1',nom:'Chasseur',desc:'Battre un boss',titre:'Chasseur de boss',f:(s)=>s.boss>=1},
  {id:'bossall',nom:'Tueur de légendes',desc:'Battre tous les boss au moins une fois',titre:'Tueur de légendes',f:(s)=>s.bossDiff>=s.bossTotal},
  {id:'q100',nom:'Centurion',desc:'Répondre à 100 questions',titre:'Centurion',f:(s)=>s.questions>=100},
  {id:'q500',nom:'Vétéran',desc:'Répondre à 500 questions',titre:'Vétéran',f:(s)=>s.questions>=500},
  {id:'serie3',nom:'Régulier',desc:'3 jours de suite',titre:'Régulier',f:(s)=>s.serie>=3},
  {id:'serie7',nom:'Discipline de fer',desc:'7 jours de suite',titre:'Discipliné',f:(s)=>s.serie>=7},
  {id:'arene3',nom:'Coup de froid',desc:'Atteindre la Chambre froide',titre:'Frigoriste',f:(s)=>s.arene>=4},
  {id:'arene5',nom:'Dans la cour des grands',desc:'Atteindre la Salle du conseil',titre:'Stratège',f:(s)=>s.arene>=6},
  {id:'arene8',nom:'Immortel',desc:'Atteindre le Panthéon',titre:'Légende vivante',f:(s)=>s.arene>=9},
  {id:'laniflex',nom:'Pro de l\'anglais pro',desc:'Classer les 3 notions d\'anglais pro',titre:'Ambassadeur',f:(s)=>s.lx>=3},
  {id:'bilingue',nom:'Bilingue',desc:'Classer une notion en anglais et une en français',titre:'Bilingue',f:(s)=>s.en>=1&&s.fr>=1},
  {id:'collec10',nom:'Collectionneur',desc:'Avoir 10 cartes différentes',titre:'Collectionneur',f:(s)=>s.cartes>=10},
  {id:'legende',nom:'Chanceux',desc:'Obtenir une carte légendaire',titre:'Chanceux',f:(s)=>s.legendaires>=1},
  {id:'collecall',nom:'Album complet',desc:'Avoir toutes les cartes',titre:'Encyclopédie',f:(s)=>s.cartes>=CARTES.length}
];

// Tirage d'une carte après une session (déterministe à partir d'une graine).
window.tirerCarte = (score, boss, victoire, graine) => {
  let x = graine % 2147483647; const rnd = () => (x = (x * 48271) % 2147483647) / 2147483647;
  let p = {commune:.62, rare:.28, 'épique':.08, 'légendaire':.02};
  if (score >= .8) p = {commune:.45, rare:.35, 'épique':.15, 'légendaire':.05};
  if (score >= 1) p = {commune:.3, rare:.4, 'épique':.22, 'légendaire':.08};
  if (boss && victoire) p = {commune:0, rare:0, 'épique':.75, 'légendaire':.25};
  let r = rnd(), rar = 'commune'; for (const k of ['légendaire','épique','rare','commune']) { if ((r -= p[k]) <= 0) { rar = k; break; } }
  const pool = CARTES.filter((c) => c.r === rar); return pool[Math.floor(rnd() * pool.length)].id;
};
