// Français (facile → intermédiaire). Same format as banque.js.
window.BANQUE.push(
// a / à
{n:'fr-a-a',d:1,t:'mc',q:'Il ___ envoyé le devis ce matin.',o:['a','à'],a:0,x:'On peut dire "il avait envoyé" → a (verbe avoir).'},
{n:'fr-a-a',d:1,t:'mc',q:'Je pars ___ Lyon demain pour un salon.',o:['a','à'],a:1,x:'On ne peut pas dire "avait Lyon" → à (préposition).'},
{n:'fr-a-a',d:1,t:'mc',q:'C\'est un produit ___ fort potentiel.',o:['a','à'],a:1,x:'"avait fort potentiel" ne marche pas → à.'},
{n:'fr-a-a',d:2,t:'mc',q:'Le client ___ beaucoup de questions ___ poser.',o:['a / a','à / à','a / à','à / a'],a:2,x:'Il avait des questions → a ; questions à poser → à.'},
{n:'fr-a-a',d:2,t:'fill',q:'Complète avec a ou à : "Elle ___ rendez-vous ___ 14 h."',a:['a à','a / à','a, à','a,à'],x:'Elle avait rendez-vous → a ; à 14 h → à.'},
{n:'fr-a-a',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['Il à fini à temps.','Il a fini a temps.','Il a fini à temps.','Il à fini a temps.'],a:2,x:'Il avait fini → a ; à temps → à.'},
// et / est, ou / où
{n:'fr-et-est',d:1,t:'mc',q:'Le rapport ___ prêt.',o:['et','est'],a:1,x:'On peut dire "était prêt" → est (verbe être).'},
{n:'fr-et-est',d:1,t:'mc',q:'J\'ai appelé le fournisseur ___ le transporteur.',o:['et','est'],a:0,x:'On peut dire "et puis" → et (liaison).'},
{n:'fr-et-est',d:1,t:'mc',q:'Tu préfères un appel ___ un mail ?',o:['ou','où'],a:0,x:'On peut dire "ou bien" → ou (choix).'},
{n:'fr-et-est',d:1,t:'mc',q:'Le bureau ___ je travaille est à Lyon.',o:['ou','où'],a:1,x:'Le lieu → où (avec accent).'},
{n:'fr-et-est',d:2,t:'fill',q:'Complète avec et ou est : "La réunion ___ annulée ___ reportée à lundi."',a:['est et','est / et','est, et'],x:'Était annulée → est ; et puis reportée → et.'},
{n:'fr-et-est',d:2,t:'fill',q:'Complète avec ou ou où : "Dis-moi ___ et quand on se retrouve."',a:['où'],x:'Question de lieu → où.'},
{n:'fr-et-est',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['Le jour ou il est venu, il pleuvait.','Le jour où il est venu, il pleuvait.','Le jour où il et venu, il pleuvait.','Le jour ou il et venu, il pleuvait.'],a:1,x:'Où marque aussi le temps (le jour où) ; il était venu → est.'},
// ces / ses / c'est / s'est
{n:'fr-ces-ses',d:1,t:'mc',q:'Le commercial a oublié ___ dossiers chez le client.',o:['ces','ses','c\'est','s\'est'],a:1,x:'Les dossiers à lui → ses (possessif).'},
{n:'fr-ces-ses',d:1,t:'mc',q:'Regarde ___ chiffres : ils sont excellents !',o:['ces','ses','c\'est','s\'est'],a:0,x:'On montre → ces (démonstratif, "ces chiffres-là").'},
{n:'fr-ces-ses',d:1,t:'mc',q:'___ une très bonne idée.',o:['Ces','Ses','C\'est','S\'est'],a:2,x:'"Cela est" → c\'est.'},
{n:'fr-ces-ses',d:2,t:'mc',q:'Il ___ trompé de date.',o:['ces','ses','c\'est','s\'est'],a:3,x:'Verbe pronominal "se tromper" → s\'est.'},
{n:'fr-ces-ses',d:2,t:'fill',q:'Complète : "La cliente ___ plainte du retard." (se plaindre)',a:['s\'est','s’est'],x:'Se plaindre → elle s\'est plainte.'},
{n:'fr-ces-ses',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['C\'est ses clients qui ont appelé.','Ce sont ses clients qui ont appelé.','Ses sont ces clients qui ont appelé.','S\'est ses clients qui ont appelé.'],a:1,x:'Au pluriel on écrit "ce sont" ; ses = les siens.'},
// son / sont, on / ont
{n:'fr-son-sont',d:1,t:'mc',q:'Les échantillons ___ arrivés hier.',o:['son','sont'],a:1,x:'"étaient arrivés" → sont (verbe être).'},
{n:'fr-son-sont',d:1,t:'mc',q:'Il présente ___ projet demain.',o:['son','sont'],a:0,x:'"son projet / mon projet" → son (possessif).'},
{n:'fr-son-sont',d:1,t:'mc',q:'Les clients ___ signé le contrat.',o:['on','ont'],a:1,x:'"avaient signé" → ont (verbe avoir).'},
{n:'fr-son-sont',d:2,t:'mc',q:'___ se retrouve à la pause ?',o:['On','Ont'],a:0,x:'"Il se retrouve" marche → on (pronom).'},
{n:'fr-son-sont',d:2,t:'fill',q:'Complète avec on ou ont : "Ils ___ dit qu\'___ pouvait commencer."',a:['ont on','ont / on','ont, on'],x:'Ils avaient dit → ont ; il pouvait → on.'},
{n:'fr-son-sont',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['On n\'a pas encore reçu leur réponse.','On a pas encore reçu leur réponse.','Ont n\'a pas encore reçu leur réponse.','On n\'ont pas encore reçu leur réponse.'],a:0,x:'À l\'écrit, la négation garde le n\' : on n\'a pas.'},
// -é / -er / -ez
{n:'fr-e-er',d:1,t:'mc',q:'Je dois ___ le client avant midi.',o:['appelé','appeler','appelez'],a:1,x:'Après "dois", infinitif. Astuce : on peut dire "je dois vendre" → appeler.'},
{n:'fr-e-er',d:1,t:'mc',q:'J\'ai ___ le client ce matin.',o:['appelé','appeler','appelais'],a:0,x:'Après "j\'ai", participe passé. Astuce : "j\'ai vendu" → appelé.'},
{n:'fr-e-er',d:2,t:'mc',q:'Merci de me ___ le document signé.',o:['renvoyé','renvoyer','renvoyez'],a:1,x:'"Merci de me vendre" → infinitif : renvoyer.'},
{n:'fr-e-er',d:2,t:'mc',q:'Vous pouvez ___ votre commande en ligne.',o:['passé','passer','passez'],a:1,x:'Après "pouvez", infinitif. "Vous pouvez vendre" → passer.'},
{n:'fr-e-er',d:2,t:'fill',q:'Complète avec la bonne fin : "Le contrat a été sign___ hier."',a:['é','signé'],x:'"a été vendu" → participe : signé.'},
{n:'fr-e-er',d:3,t:'fill',q:'Complète : "N\'hésitez pas à me contact___ si besoin."',a:['er','contacter'],x:'Après "à", infinitif : "à me vendre" → contacter.'},
{n:'fr-e-er',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['Je vous ai envoyer le devis.','Je vous ai envoyé le devis.','Je vous ai envoyez le devis.','Je vous es envoyé le devis.'],a:1,x:'Ai + participe passé → envoyé.'},
// participe passé accord
{n:'fr-pp-accord',d:1,t:'mc',q:'Elle est ___ à 9 h.',o:['arrivé','arrivée','arrivés'],a:1,x:'Avec être, on accorde avec le sujet : elle → arrivée.'},
{n:'fr-pp-accord',d:1,t:'mc',q:'Ils ont ___ les factures.',o:['payé','payés','payées'],a:0,x:'Avec avoir et le COD après le verbe : pas d\'accord.'},
{n:'fr-pp-accord',d:2,t:'mc',q:'Les commandes sont ___ demain.',o:['livré','livrés','livrées'],a:2,x:'Avec être : accord avec "les commandes" (féminin pluriel).'},
{n:'fr-pp-accord',d:2,t:'mc',q:'Les offres que nous avons ___ ont plu.',o:['envoyé','envoyés','envoyées'],a:2,x:'Avec avoir, COD placé AVANT (que = les offres) → accord : envoyées.'},
{n:'fr-pp-accord',d:3,t:'fill',q:'Accorde : "Les deux commerciales se sont ___ (rencontrer) au salon."',a:['rencontrées'],x:'Pronominal réciproque, COD "se" = elles → rencontrées.'},
{n:'fr-pp-accord',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['La réunion que j\'ai organisé.','La réunion que j\'ai organisée.','La réunion que j\'ai organisées.','La réunion que j\'ai organiser.'],a:1,x:'COD "que" (= la réunion) avant avoir → organisée.'},
// futur / conditionnel
{n:'fr-futur-cond',d:1,t:'mc',q:'Demain, je vous ___ le devis. (certain)',o:['enverrai','enverrais'],a:0,x:'Action certaine dans le futur → futur : -rai.'},
{n:'fr-futur-cond',d:1,t:'mc',q:'Je ___ savoir si vous êtes disponible jeudi. (poli)',o:['voudrai','voudrais'],a:1,x:'Demande polie → conditionnel : -rais.'},
{n:'fr-futur-cond',d:2,t:'mc',q:'Si j\'avais le budget, j\'___ deux commerciaux.',o:['embaucherai','embaucherais'],a:1,x:'Si + imparfait → conditionnel. Astuce : remplace par "nous" → "nous embaucherions".'},
{n:'fr-futur-cond',d:2,t:'mc',q:'Quand j\'aurai mon diplôme, je ___ une promotion.',o:['demanderai','demanderais'],a:0,x:'Quand + futur → futur. "nous demanderons" → -rai.'},
{n:'fr-futur-cond',d:3,t:'fill',q:'Conjugue "pouvoir" (demande polie) : "___-vous me rappeler ?"',a:['pourriez','Pourriez'],x:'Conditionnel de politesse : pourriez-vous.'},
// accord sujet / verbe
{n:'fr-accord-verbe',d:1,t:'mc',q:'Les clients ___ satisfaits.',o:['est','sont','es','soient'],a:1,x:'Sujet pluriel → sont.'},
{n:'fr-accord-verbe',d:2,t:'mc',q:'Le directeur et son adjoint ___ la réunion.',o:['anime','animent','animes','animerait'],a:1,x:'Deux sujets → pluriel : animent.'},
{n:'fr-accord-verbe',d:2,t:'mc',q:'C\'est moi qui ___ le rapport.',o:['écrit','écris','écrivent'],a:1,x:'Qui reprend "moi" → 1re personne : j\'écris → écris.'},
{n:'fr-accord-verbe',d:3,t:'mc',q:'Les produits que nous ___ sont fabriqués en France.',o:['vend','vendons','vendent'],a:1,x:'Le sujet de "vendre" est "nous" → vendons.'},
{n:'fr-accord-verbe',d:3,t:'fill',q:'Conjugue au présent : "Chacun des vendeurs ___ (avoir) un objectif."',a:['a'],x:'Le sujet est "chacun" (singulier) → a.'},
// mail pro
{n:'fr-mail-pro',d:1,t:'mc',q:'Quelle formule ouvre un mail à un client que tu ne connais pas ?',o:['Salut à vous,','Coucou à toute l\'équipe,','Madame, Monsieur,','Hello mon ami,'],a:2,x:'Inconnu → Madame, Monsieur, (ou Bonjour Madame Dupont,).'},
{n:'fr-mail-pro',d:1,t:'mc',q:'Quelle formule de fin est la plus adaptée ?',o:['Gros bisous à toi,','Cordialement,','A+','Bye'],a:1,x:'Cordialement est la formule pro standard.'},
{n:'fr-mail-pro',d:2,t:'mc',q:'Quelle phrase est la plus professionnelle ?',o:['Je vous relance encore une fois pour le devis envoyé lundi.','Vous avez visiblement oublié de répondre à mon dernier devis !','Je me permets de revenir vers vous concernant le devis.','Alors, ce devis, ça avance ou pas ?'],a:2,x:'"Je me permets de revenir vers vous" relance poliment.'},
{n:'fr-mail-pro',d:2,t:'mc',q:'Quelle orthographe est correcte ?',o:['Ci-joint le devis.','Si-joint le devis.','Ci-joins le devis.','Si joint le devis.'],a:0,x:'Ci-joint, invariable en début de phrase.'},
{n:'fr-mail-pro',d:3,t:'mc',q:'Quelle phrase est correcte ?',o:['Je reste à votre disposition pour tout renseignements.','Je reste à votre disposition pour tout renseignement.','Je reste a votre disposition pour tous renseignement.','Je reste à votre dispositions pour tout renseignement.'],a:1,x:'"tout renseignement" au singulier ; à (préposition).'},
{n:'fr-mail-pro',d:3,t:'fill',q:'Corrige : "Je vous prie d\'agréer mes salutation distingué."',a:['je vous prie d\'agréer mes salutations distinguées.','je vous prie d\'agréer mes salutations distinguées','je vous prie d’agréer mes salutations distinguées.'],x:'Salutations distinguées : pluriel et féminin.'}
);
Object.assign(window.NOTIONS_NOMS,{'fr-a-a':'a / à','fr-et-est':'et / est · ou / où','fr-ces-ses':'ces / ses / c\'est / s\'est','fr-son-sont':'son / sont · on / ont','fr-e-er':'-é ou -er','fr-pp-accord':'Accord du participe passé','fr-futur-cond':'Futur ou conditionnel (-rai / -rais)','fr-accord-verbe':'Accord sujet / verbe','fr-mail-pro':'Le mail professionnel'});
