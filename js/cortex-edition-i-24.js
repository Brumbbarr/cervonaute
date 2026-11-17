// Première édition complète en revue graphique. Aucun tirage ni écriture en base.
(function(root){
 'use strict';const C=root.CORTEX_EDITION_I;if(!C)throw Error('Catalogue de base absent');
 const rows=[
 [7,'Quartz sourd','quartz-sourd','mineraux','commune','Ses bandes opaques semblent retenir la lumière au lieu de la réfléchir.','Trois cristaux, trois mesures différentes. Aucun n’apprécie que l’on frappe sur la table.'],
 [8,'Verre de faille','verre-de-faille','mineraux','peu_commune','Une ligne claire demeure suspendue dans cet éclat de verre fumé.','La cassure contourne la ligne sans jamais la traverser. Je conserve les deux observations séparément.'],
 [9,'Vesperite','vesperite','mineraux','rare','Une couture lavande réunit les lames de ce minéral vert profond.','Les lames paraissent pousser dans plusieurs directions à la fois. L’étagère n’a rien demandé.'],
 [10,'Nacre de nuit','nacre-de-nuit','mineraux','epique','Sous ses couches sombres, une lumière cyan ne trouve aucune sortie.','La lumière apparaît entre les lames, jamais à leur surface. Éviter de chercher avec un marteau.'],
 [11,'Aiguille de dérive','aiguille-de-derive','instruments','commune','L’aiguille reste en équilibre, même lorsque son support est déplacé.','Elle indique une direction. Je n’ai pas encore trouvé de carte où cette direction soit utile.'],
 [12,'Compas décentré','compas-decentre','instruments','commune','Ses deux branches inégales tracent des courbes étonnamment régulières.','Son concepteur ne cherchait manifestement pas le centre. Cela ne l’a pas empêché de le trouver.'],
 [13,'Diapason muet','diapason-muet','instruments','peu_commune','La traverse de verre frémit sans qu’aucun son ne soit perceptible.','Le silence n’est pas une mesure suffisante. Mes collègues soutiennent le contraire depuis une heure.'],
 [14,'Pince d’équilibre','pince-d-equilibre','instruments','peu_commune','Les pointes de céramique maintiennent un écart que rien ne semble réduire.','Elle saisit très bien les objets fragiles. Elle refuse seulement de les toucher.'],
 [15,'Astrolabe des marées','astrolabe-des-marees','instruments','epique','Une courbe lumineuse traverse l’eau suspendue entre ses arcs.','Il suit une marée. La difficulté sera de retrouver la mer correspondante.'],
 [16,'Sceau fendu','sceau-fendu','vestiges','commune','Sa marque circulaire se poursuit de part et d’autre d’une vieille fente.','Les empreintes restent complètes malgré la fissure. J’ai vérifié le papier avant d’accuser le sceau.'],
 [17,'Jeton sans face','jeton-sans-face','vestiges','peu_commune','Deux ouvertures remplacent les faces de ce lourd jeton.','Ni valeur, ni portrait, ni inscription. Il a pourtant été soigneusement conservé par quelqu’un.'],
 [18,'Disque des passages','disque-des-passages','vestiges','rare','Trois chemins de métal s’arrêtent au bord d’une même fente lumineuse.','Aucun chemin ne rejoint le bord du disque. Il manque peut-être une destination, plutôt qu’un morceau.'],
 [19,'Clé des seuils','cle-des-seuils','vestiges','legendaire','Une déchirure ambrée relie les parties séparées de cette clé.','Je n’ai trouvé aucune serrure. Je commence à soupçonner que la clé n’en a pas besoin.'],
 [20,'Coquille inverse','coquille-inverse','specimens','commune','Sa spirale change de sens avant de rejoindre l’ouverture.','Son ancien occupant disposait de beaucoup d’espace et d’un sens de l’orientation particulier.'],
 [21,'Graine de brume','graine-de-brume','specimens','peu_commune','Une brume pâle tourne lentement sous l’enveloppe translucide.','Deux feuilles, aucune racine visible. La cloche sert surtout à rassurer l’assistant.'],
 [22,'Spore de verre','spore-de-verre','specimens','rare','De fins filaments relient trois membranes presque transparentes.','Le verre serait une explication commode. Malheureusement, le spécimen continue de pousser.'],
 [23,'Fleur de veille','fleur-de-veille','specimens','rare','Ses pétales sombres se referment autour d’un cœur laiteux.','Elle se tourne vers les lampes éteintes. Je lui ai réservé celle qui fonctionne le moins bien.'],
 [24,'Cocon d’aurore','cocon-d-aurore','specimens','epique','Une lumière chaude passe sous les fibres vert d’eau de sa soie.','Le cocon est immobile. Son ombre, elle, donne parfois l’impression d’attendre quelque chose.']
 ];
 const families={mineraux:'Minéraux',instruments:'Instruments',vestiges:'Vestiges',specimens:'Spécimens'};
 const additions=rows.map(([num,titre,slug,famille,rarete,description,note])=>({id:'cx-e1-'+String(num).padStart(3,'0'),num,titre,slug,famille,familleNom:families[famille],rarete,description,note}));
 // Une carte de chaque rang dans chacune des quatre familles. Identifiants inchangés.
 const classification={
  'fer-de-faille':'commune','quartz-sourd':'peu_commune','verre-de-faille':'rare','vesperite':'epique','coeur-de-braise':'legendaire','nacre-de-nuit':'mythique',
  'compas-decentre':'commune','pince-d-equilibre':'peu_commune','diapason-muet':'rare','lentille-des-echos':'epique','aiguille-de-derive':'legendaire','astrolabe-des-marees':'mythique',
  'sceau-fendu':'commune','jeton-sans-face':'peu_commune','disque-des-passages':'rare','cle-bifide':'epique','cle-des-seuils':'legendaire','sceau-du-neant':'mythique',
  'coquille-inverse':'commune','graine-de-brume':'peu_commune','spore-de-verre':'rare','graine-d-orage':'epique','cocon-d-aurore':'legendaire','fleur-de-veille':'mythique'
 };
 const cartes=[...C.cartes.slice(0,6),...additions].map(c=>({...c,rarete:classification[c.slug]}));
 root.CORTEX_EDITION_I={...C,total:24,provisoire:true,rendu:'gabarit-b24',equilibrage:'v2-un-rang-par-famille',assetBase:'assets/cartes/cortex/edition-i-24/',sourceBase:'docs/cortex/edition-i/v1-24/cartes/',calqueBase:'docs/cortex/edition-i/v1-24/calques/',cartes};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.CORTEX_EDITION_I;
})(typeof window!=='undefined'?window:globalThis);
