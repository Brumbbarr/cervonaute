// Questions supplémentaires (anglais), avec traduction.
window.BANQUE.push(
// this / these / that / those
{n:'demonstratifs',d:1,t:'mc',q:'Can you pass me ___ file next to you?',o:['this','that','these','those'],a:0,x:'Singulier, tout près → this.',tr:'Tu peux me passer ce dossier à côté de toi ?'},
{n:'demonstratifs',d:1,t:'mc',q:'Who are ___ people at the back of the room?',o:['this','that','these','those'],a:3,x:'Pluriel, loin → those.',tr:'Qui sont ces gens au fond de la salle ?'},
{n:'demonstratifs',d:2,t:'mc',q:'I\'ll never forget ___ first sale in 2019.',o:['this','that','these','those'],a:1,x:'Singulier, loin dans le temps → that.',tr:'Je n\'oublierai jamais cette première vente en 2019.'},
{n:'demonstratifs',d:2,t:'mc',q:'___ samples here are the new polar grade PVC.',o:['This','That','These','Those'],a:2,x:'Pluriel, ici → these.',tr:'Ces échantillons ici sont le nouveau PVC polaire.'},
{n:'demonstratifs',d:2,t:'fill',q:'Complète : "Look at ___ trucks over there!" (pluriel, loin)',a:['those'],x:'Pluriel, loin → those.',tr:'Regarde ces camions là-bas !'},
{n:'demonstratifs',d:3,t:'mc',q:'Which sentence is correct?',o:['That strips are very worn.','Those strips are worn.','Those strip is worn.','This strips are worn.'],a:1,x:'Pluriel partout : those + strips + are.',tr:'Ces lanières (là-bas) sont usées.'},
// verbes d'état
{n:'verbes-etat',d:1,t:'mc',q:'This curtain ___ to the cold room.',o:['belongs','is belonging','belong'],a:0,x:'Belong = possession → présent simple.',tr:'Ce rideau appartient à la chambre froide.'},
{n:'verbes-etat',d:2,t:'mc',q:'I ___ we need a bigger warehouse.',o:['believe','am believing','believes'],a:0,x:'Believe = opinion → simple.',tr:'Je crois que nous avons besoin d\'un entrepôt plus grand.'},
{n:'verbes-etat',d:2,t:'mc',q:'Do you ___ what I mean?',o:['understand','understanding','understands'],a:0,x:'Do + verbe nu ; understand ne se met pas au continu.',tr:'Tu comprends ce que je veux dire ?'},
{n:'verbes-etat',d:2,t:'mc',q:'We ___ a meeting with Laniflex right now.',o:['have','are having','has','were having'],a:1,x:'Have a meeting = action → -ing possible.',tr:'Nous avons une réunion avec Laniflex en ce moment.'},
{n:'verbes-etat',d:3,t:'fill',q:'Conjugue : "She ___ (want) a quote by Friday."',a:['wants'],x:'Want = verbe d\'état → présent simple, -s à la 3e personne.',tr:'Elle veut un devis d\'ici vendredi.'},
{n:'verbes-etat',d:3,t:'mc',q:'Which sentence is correct?',o:['I am needing more samples.','I need more samples.','I needs more samples.','I am need more samples.'],a:1,x:'Need = verbe d\'état → simple.',tr:'J\'ai besoin de plus d\'échantillons.'},
// plus-que-parfait
{n:'plu-perfect',d:1,t:'mc',q:'The client ___ already signed when I called.',o:['had','has','was'],a:0,x:'Avant un autre passé → had + participe.',tr:'Le client avait déjà signé quand j\'ai appelé.'},
{n:'plu-perfect',d:2,t:'fill',q:'Conjugue : "When we arrived, the truck ___ (leave)."',a:['had left','\'d left'],x:'Le camion est parti AVANT notre arrivée → had left.',tr:'Quand nous sommes arrivés, le camion était parti.'},
{n:'plu-perfect',d:2,t:'mc',q:'I didn\'t recognise him because I ___ him before.',o:['had never met','have never met','never meet'],a:0,x:'Avant un moment passé → had never met.',tr:'Je ne l\'ai pas reconnu parce que je ne l\'avais jamais rencontré.'},
{n:'plu-perfect',d:3,t:'fill',q:'Traduis : "Elle avait oublié le badge."',a:['she had forgotten the badge.','she had forgotten the badge','she\'d forgotten the badge','she\'d forgotten the badge.','she had forgotten her badge.','she had forgotten her badge'],x:'avait + participe → had + forgotten.',tr:'Elle avait oublié le badge.'},
{n:'plu-perfect',d:3,t:'mc',q:'By 2023, Laniflex ___ over 500 cold rooms.',o:['had equipped','has equipped','equips','was equip'],a:0,x:'Avant un moment passé (2023) → had + participe.',tr:'En 2023, Laniflex avait équipé plus de 500 chambres froides.'},
// present perfect (hors since / for)
{n:'present-perfect',d:1,t:'mc',q:'Have you ___ the new catalogue?',o:['seen','saw','see','seeing'],a:0,x:'Have + participe passé : see → seen.',tr:'As-tu vu le nouveau catalogue ?'},
{n:'present-perfect',d:2,t:'mc',q:'I ___ to Germany three times.',o:['have been','went','have gone'],a:0,x:'Expérience de vie → have been (allé et revenu).',tr:'Je suis allé trois fois en Allemagne.'},
{n:'present-perfect',d:2,t:'fill',q:'Conjugue : "She ___ just ___ (finish) the report."',a:['has finished','has / finished','has, finished','has just finished'],x:'Just = action qui vient de finir → has just finished.',tr:'Elle vient de terminer le rapport.'},
{n:'present-perfect',d:2,t:'mc',q:'___ you ever ___ a forklift?',o:['Have / driven','Did / drove','Have / drove','Have / drived'],a:0,x:'Ever = expérience → have + participe (drive → driven).',tr:'As-tu déjà conduit un chariot élévateur ?'},
{n:'present-perfect',d:3,t:'mc',q:'Which sentence is correct?',o:['I have finished it last night.','I finished it last night.','I have finish it last night.','I finish it last night.'],a:1,x:'Last night = date → prétérit.',tr:'Je l\'ai fini hier soir.'},
{n:'present-perfect',d:3,t:'fill',q:'Conjugue : "We ___ (not / receive) the payment yet."',a:['haven\'t received','have not received'],x:'Yet → present perfect négatif.',tr:'Nous n\'avons pas encore reçu le paiement.'},
// futur
{n:'futur',d:1,t:'mc',q:'I\'m tired. I think I ___ go home early.',o:['will','am going to','am'],a:0,x:'Décision prise maintenant avec « I think » → will.',tr:'Je suis fatigué. Je crois que je vais rentrer tôt.'},
{n:'futur',d:2,t:'mc',q:'___ I send you the brochure?',o:['Shall','Will','Am','Would'],a:0,x:'Proposer son aide avec I → Shall I…?',tr:'Voulez-vous que je vous envoie la brochure ?'},
{n:'futur',d:2,t:'mc',q:'Next year, Laniflex ___ open a new factory. It\'s official.',o:['is going to','will maybe','opens','is going open'],a:0,x:'Projet déjà décidé → be going to.',tr:'L\'an prochain, Laniflex va ouvrir une nouvelle usine. C\'est officiel.'},
{n:'futur',d:3,t:'fill',q:'Conjugue : "Don\'t worry, I ___ (help) you with the order."',a:['will help','\'ll help'],x:'Offre d\'aide spontanée → will.',tr:'Ne t\'inquiète pas, je vais t\'aider avec la commande.'},
{n:'futur',d:3,t:'mc',q:'Which sentence is correct?',o:['I am going to visit the client next week.','I am going visit the client next week.','I will to visit the client next week.','I going to visit the client next week.','I am going to visiting the client next week.'],a:0,x:'be + going to + verbe.',tr:'Je vais rendre visite au client la semaine prochaine.'},
// Laniflex
{n:'lx-produit',d:1,t:'mc',q:'« Chariot élévateur » se dit :',o:['forklift','lift truck car','fork car','raising cart'],a:0,x:'Forklift (ou forklift truck).',tr:null},
{n:'lx-produit',d:2,t:'mc',q:'« Entrepôt » se dit :',o:['warehouse','entrepot','storehouse room','depot hall'],a:0,x:'Warehouse.',tr:null},
{n:'lx-produit',d:2,t:'mc',q:'« Rideau de quai / sas d\'étanchéité » se dit :',o:['dock shelter','dock curtain hat','quay seal','port door'],a:0,x:'Dock shelter (ou dock seal).',tr:null},
{n:'lx-produit',d:3,t:'fill',q:'Traduis : « résistant aux chocs »',a:['impact resistant','impact-resistant','shock resistant','shock-resistant'],x:'Impact-resistant.',tr:null},
{n:'lx-arguments',d:2,t:'mc',q:'Best way to say « ils améliorent la sécurité des piétons » :',o:['They improve pedestrian safety.','They are improving the security of walkers.','They better pedestrians securing.','They improves pedestrian safety.'],a:0,x:'Safety = sécurité physique (security = sûreté, malveillance).',tr:'Ils améliorent la sécurité des piétons.'},
{n:'lx-arguments',d:3,t:'fill',q:'Traduis : « Ils réduisent votre facture d\'énergie. »',a:['they reduce your energy bill.','they reduce your energy bill','they cut your energy bill.','they cut your energy bill','they lower your energy bill.','they lower your energy bill'],x:'reduce / cut / lower + your energy bill.',tr:'Ils réduisent votre facture d\'énergie.'},
{n:'lx-client',d:2,t:'mc',q:'Le client demande une remise. « Remise » se dit :',o:['a discount','a remise','a return','a rebate cut'],a:0,x:'A discount.',tr:null},
{n:'lx-client',d:3,t:'mc',q:'Meilleure phrase pour relancer un devis :',o:['I\'m following up on the quote I sent last week.','Why you didn\'t answer to my quote of last week?','Please answer my quote, I am waiting since days.','I am relaunching you about my quote of last week.'],a:0,x:'To follow up on = relancer.',tr:'Je reviens vers vous concernant le devis envoyé la semaine dernière.'}
);
