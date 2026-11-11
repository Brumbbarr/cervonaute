// Générateurs pour le français et les cours (UCD 31, UC A2, UC A3). S'ajoutent à window.GEN.
(function () {
  const R = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uniq = (a) => a.filter((x, i) => a.indexOf(x) === i);
  // Ce que chaque forme EST : sert à expliquer chaque choix (homophones, terminaisons)
  const DEF = { a: 'a = verbe avoir (on peut dire « avait »)', 'à': 'à = préposition (« avait » ne marche pas)', et: 'et = liaison (« et puis »)', est: 'est = verbe être (« était »)', ou: 'ou = choix (« ou bien »)', 'où': 'où = lieu ou moment', son: 'son = possessif (« mon »)', sont: 'sont = verbe être (« étaient »)', on: 'on = pronom (« il »)', ont: 'ont = verbe avoir (« avaient »)', ces: 'ces = démonstratif (« ces … -là »)', ses: 'ses = possessif (« les siens »)', "c'est": "c'est = « cela est »", "s'est": "s'est = verbe en « se » (se tromper → s'est trompé)" };
  const FIN = {
    'fr-e-er': [[/er$/, 'infinitif (on peut dire « vendre »)'], [/ez$/, 'forme en -ez = vous (vous préparez)'], [/é$/, 'participe passé (on peut dire « vendu »)'], [/ai[st]$/, 'imparfait (je / il …ait) : ne va ni après un auxiliaire ni après une préposition']],
    'fr-pp-accord': [[/ées$/, 'féminin pluriel'], [/ée$/, 'féminin singulier'], [/és$/, 'masculin pluriel'], [/é$/, 'masculin singulier, ou participe invariable']],
    'fr-futur-cond': [[/rai[st]?$/, 'conditionnel (avec « nous » : -rions)'], [/rai$/, 'futur (avec « nous » : -rons)']],
    'fr-accord-verbe': [[/^(ont|sont|vont|font)$/, 'pluriel (ils, elles)'], [/^(a|est|va|fait)$/, 'singulier (il, elle)'], [/ent$/, 'pluriel (ils, elles)'], [/[et]$/, 'singulier (il, elle)']] };
  FIN['fr-futur-cond'] = [[/rais$|rait$/, 'conditionnel (avec « nous » : -rions)'], [/rai$|ra$/, 'futur (avec « nous » : -rons)']];
  const decrire = (n, opt) => {
    if (FIN[n]) { const f = FIN[n].find(([re]) => re.test(String(opt).trim())); return f ? f[1] : ''; }
    const p = String(opt).split(' / ').map((w) => DEF[w.trim().toLowerCase()]); return p.every(Boolean) ? p.join(' ; ') : ''; };
  const mc = (n, d, q, opts, good, x) => { const o = shuffle(uniq(opts)); const r = { n, d, t: 'mc', q, o, a: o.indexOf(good), x, gen: true, k: n + '|' + q + '|' + good };
    if (/^fr-/.test(n) && o.every((v) => decrire(n, v))) r.xo = o.map((v) => (v === good ? 'bonne forme ici : ' : 'ne convient pas ici : ') + decrire(n, v) + '.');
    return r; };
  // Questions à écrire : rappel de l'astuce pour éviter la forme voisine
  const XC = { 'fr-a-a': 'Astuce : si on peut dire « avait », c\'est a ; sinon, à.', 'fr-et-est': 'Astuce : « était » → est ; « et puis » → et ; « ou bien » → ou ; un lieu ou un moment → où.', 'fr-son-sont': 'Astuce : « étaient » → sont ; « mon » → son ; « avaient » → ont ; « il » → on.', 'fr-ces-ses': 'Astuce : « cela est » → c\'est ; verbe en « se » → s\'est ; « les siens » → ses ; « ces … -là » → ces.', 'fr-e-er': 'Astuce : remplace par « vendre » (infinitif, -er) ou « vendu » (participe, -é).', 'fr-pp-accord': 'Astuce : avec être, accord avec le sujet ; avec avoir, accord seulement si le COD est placé avant.', 'fr-accord-verbe': 'Astuce : cherche le vrai sujet (qui fait l\'action ?), puis accorde le verbe avec lui.', 'fr-futur-cond': 'Astuce : passe à « nous » : -rons = futur, -rions = conditionnel.' };
  const fill = (n, d, q, ans, x) => { const r = { n, d, t: 'fill', q, a: ans, x, gen: true, k: n + '|' + q }; if (XC[n]) r.xc = XC[n]; return r; };
  const pickOthers = (arr, good, n) => shuffle(arr.filter((x) => x !== good)).slice(0, n);
  const G = window.GEN = window.GEN || {};

  // ================= FRANÇAIS =================
  const PERS = ['Le commercial', 'La cliente', 'Notre fournisseur', 'Le directeur', 'Mon manager', 'La stagiaire', 'Le transporteur'];
  const VILLES = ['Lyon', 'Marseille', 'Lille', 'Nantes', 'Bordeaux', 'Toulouse'];
  const HEURES = ['9 h', '14 h', '16 h 30', 'midi'];
  const DOCS = ['le devis', 'la facture', 'le bon de commande', 'le rapport', 'la brochure', 'le contrat'];

  G['fr-a-a'] = () => { const p = R(PERS), k = R([1, 2, 3, 4]);
    if (k === 1) return mc('fr-a-a', 1, `${p} ___ envoyé ${R(DOCS)} ce matin.`, ['a', 'à'], 'a', 'On peut dire « avait envoyé » → a (verbe avoir).');
    if (k === 2) return mc('fr-a-a', 1, `${p} part ___ ${R(VILLES)} demain.`, ['a', 'à'], 'à', '« avait Lyon » ne marche pas → à (préposition).');
    if (k === 3) return mc('fr-a-a', 2, `${p} ___ rendez-vous ___ ${R(HEURES)}.`, ['a / à', 'à / a', 'a / a', 'à / à'], 'a / à', 'avait rendez-vous → a ; à 14 h → à.');
    return mc('fr-a-a', 2, `Il reste trois dossiers ___ traiter et ${p.toLowerCase()} ___ promis de m'aider.`, ['à / a', 'a / à', 'a / a', 'à / à'], 'à / a', 'dossiers à traiter → à ; avait promis → a.'); };

  G['fr-et-est'] = () => { const p = R(PERS), d = R(DOCS), k = R([1, 2, 3, 4]);
    if (k === 1) return mc('fr-et-est', 1, `${d.charAt(0).toUpperCase() + d.slice(1)} ___ prêt depuis hier.`, ['et', 'est'], 'est', 'était prêt → est.');
    if (k === 2) return mc('fr-et-est', 1, `J'ai appelé ${p.toLowerCase()} ___ le service achats.`, ['et', 'est'], 'et', 'et puis le service achats → et.');
    if (k === 3) return mc('fr-et-est', 1, `Tu préfères ${R(['un appel', 'une visite', 'un mail'])} ___ ${R(['une visio', 'un rendez-vous', 'un devis'])} ?`, ['ou', 'où'], 'ou', 'ou bien → ou (choix).');
    return mc('fr-et-est', 2, `Le salon ___ nous avons rencontré ${p.toLowerCase()} était à ${R(VILLES)}.`, ['ou', 'où'], 'où', 'Lieu → où.'); };

  G['fr-ces-ses'] = () => { const p = R(PERS), k = R([1, 2, 3, 4]);
    if (k === 1) return mc('fr-ces-ses', 1, `${p} a oublié ___ ${R(['dossiers', 'échantillons', 'clés', 'catalogues'])} au bureau.`, ['ces', 'ses', "c'est", "s'est"], 'ses', 'Les siens → ses (possessif).');
    if (k === 2) return mc('fr-ces-ses', 1, `Regarde ___ ${R(['chiffres', 'résultats', 'commandes', 'devis'])} : ils sont excellents !`, ['ces', 'ses', "c'est", "s'est"], 'ces', 'On montre (ceux-là) → ces.');
    if (k === 3) return mc('fr-ces-ses', 1, `___ ${R(['une très bonne offre', 'un client fidèle', 'le bon moment', 'une erreur de date'])}.`, ['Ces', 'Ses', "C'est", "S'est"], "C'est", 'Cela est → c\'est.');
    const v = R([['trompé de date', 'se tromper'], ['excusé du retard', "s'excuser"], ['déplacé chez le client', 'se déplacer'], ['occupé de la commande', "s'occuper"]]);
    return mc('fr-ces-ses', 2, `${p} ___ ${v[0]}.`, ['ces', 'ses', "c'est", "s'est"], "s'est", `Verbe pronominal (${v[1]}) → s'est.`); };

  G['fr-son-sont'] = () => { const p = R(PERS), k = R([1, 2, 3, 4]);
    if (k === 1) return mc('fr-son-sont', 1, `Les ${R(['échantillons', 'colis', 'cartons', 'devis'])} ___ arrivés ce matin.`, ['son', 'sont'], 'sont', 'étaient arrivés → sont.');
    if (k === 2) return mc('fr-son-sont', 1, `${p} présente ___ ${R(['projet', 'bilan', 'plan d\'action', 'catalogue'])} demain.`, ['son', 'sont'], 'son', 'mon projet / son projet → possessif.');
    if (k === 3) return mc('fr-son-sont', 1, `Les clients ___ ${R(['signé le contrat', 'validé le devis', 'payé la facture', 'appelé ce matin'])}.`, ['on', 'ont'], 'ont', 'avaient signé → ont.');
    return mc('fr-son-sont', 2, `___ ${R(['se retrouve à 14 h ?', 'commence la réunion ?', 'appelle le client ?', 'part à Lyon demain ?'])}`, ['On', 'Ont'], 'On', 'il se retrouve → on (pronom).'); };

  const VERBES_ER = [['appel', 'le client'], ['envoy', 'le devis'], ['prépar', 'la commande'], ['contact', 'le fournisseur'], ['valid', 'le contrat'], ['factur', 'la prestation'], ['livr', 'les colis'], ['relanc', 'le prospect']];
  G['fr-e-er'] = () => { const [r, o] = R(VERBES_ER), rac = r === 'envoy' ? 'envoy' : r, k = R([1, 2, 3, 4]);
    const inf = rac + 'er', pp = rac + 'é';
    if (k === 1) return mc('fr-e-er', 1, `Je dois ___ ${o} avant midi.`, [inf, pp, rac + 'ez'], inf, 'Après « dois » → infinitif (je dois vendre).');
    if (k === 2) return mc('fr-e-er', 1, `J'ai ___ ${o} ce matin.`, [pp, inf, rac + 'ais'], pp, 'Après « j\'ai » → participe passé (j\'ai vendu).');
    if (k === 3) return mc('fr-e-er', 2, `Merci de ___ ${o} au plus vite.`, [inf, pp, rac + 'ez'], inf, 'Merci de vendre → infinitif.');
    return mc('fr-e-er', 2, `${o.charAt(0).toUpperCase() + o.slice(1)} a été ___ hier.`, [pp, inf, rac + 'ez'], pp, 'a été vendu → participe passé.'); };

  const NOMSF = [['commande', 'f'], ['facture', 'f'], ['réunion', 'f'], ['offre', 'f'], ['devis', 'm'], ['colis', 'm'], ['contrat', 'm'], ['échantillon', 'm']];
  const PP = [['livr', 'livré'], ['envoy', 'envoyé'], ['signé', 'signé'], ['valid', 'validé']];
  G['fr-pp-accord'] = () => { const [nom, g] = R(NOMSF), pl = Math.random() < 0.5, base = R(['livré', 'envoyé', 'validé', 'préparé', 'vérifié']), k = R([1, 2, 3]);
    const accord = base + (g === 'f' ? 'e' : '') + (pl ? 's' : ''), art = pl ? 'Les' : (/^[aeéiouh]/i.test(nom) ? "L'" : (g === 'f' ? 'La' : 'Le')), n2 = pl ? (nom === 'devis' ? 'devis' : nom.endsWith('eau') ? nom + 'x' : nom + 's') : nom;
    const forms = uniq([base, base + 'e', base + 's', base + 'es']);
    if (k === 1) return mc('fr-pp-accord', 2, `${art}${art.endsWith("'") ? '' : ' '}${n2} ${pl ? 'sont' : 'est'} ___ demain.`, forms, accord, `Avec être → accord avec le sujet (${art.toLowerCase()} ${n2}).`);
    if (k === 2) return mc('fr-pp-accord', 2, `Nous avons ___ ${art.toLowerCase()}${art.endsWith("'") ? '' : ' '}${n2} ce matin.`, forms, base, 'Avec avoir et le COD après le verbe → pas d\'accord.');
    return mc('fr-pp-accord', 3, `${art}${art.endsWith("'") ? '' : ' '}${n2} que nous avons ___ ${pl ? 'sont arrivés' : 'est arrivé'}${g === 'f' && pl ? '' : ''}.`.replace('sont arrivés', g === 'f' ? 'sont arrivées' : 'sont arrivés').replace('est arrivé', g === 'f' ? 'est arrivée' : 'est arrivé'), forms, accord, 'Avec avoir, COD « que » placé AVANT → accord.'); };

  const VFC = [['envoyer', 'enverrai', 'enverrais'], ['appeler', 'appellerai', 'appellerais'], ['vouloir', 'voudrai', 'voudrais'], ['pouvoir', 'pourrai', 'pourrais'], ['passer', 'passerai', 'passerais'], ['livrer', 'livrerai', 'livrerais'], ['préparer', 'préparerai', 'préparerais']];
  G['fr-futur-cond'] = () => { const [inf, fut, cond] = R(VFC), k = R([1, 2, 3]);
    if (k === 1) return mc('fr-futur-cond', 1, `Demain, je vous ___ sans faute. (certain)`, [fut, cond], fut, 'Action certaine → futur (-rai). Astuce : « nous » → nous …rons.');
    if (k === 2) return mc('fr-futur-cond', 2, `Si j'avais le temps, je ___ volontiers. (${inf})`, [fut, cond], cond, 'Si + imparfait → conditionnel (-rais).');
    return mc('fr-futur-cond', 2, `Quand le stock arrivera, je vous ___ . (${inf})`, [fut, cond], fut, 'Quand + futur → futur (-rai).'); };

  const SUJV = [['Le directeur et son adjoint', 'animent', 'anime'], ['Les clients', 'sont', 'est'], ['Chacun des vendeurs', 'a', 'ont'], ['Le nombre de commandes', 'augmente', 'augmentent'], ['Nos produits', 'protègent', 'protège'], ['Toute l\'équipe', 'participe', 'participent']];
  G['fr-accord-verbe'] = () => { const [s, good, bad] = R(SUJV); return mc('fr-accord-verbe', 2, `${s} ___ ${R(['à la réunion.', 'au projet.', 'cette semaine.', 'depuis lundi.'])}`, [good, bad], good, `Le sujet est « ${s} » → ${good}.`); };

  // ================= UCD 31 (calculs et classements) =================
  G['ucd-kpi'] = () => { const k = R([1, 2, 3, 4]);
    if (k === 1) { const c = R([1000, 1500, 2000, 2500, 4000]), gain = c * R([2, 3, 4, 1.5]); const roi = Math.round(100 * (gain - c) / c);
      return fill('ucd-kpi', 2, `Calcule le ROI en % : l'action coûte ${c} € et rapporte ${gain} € de marge.`, [String(roi), roi + '%', roi + ' %'], `ROI = (gain − coût) / coût = (${gain} − ${c}) / ${c} = ${roi} %.`); }
    if (k === 2) { const dv = R([20, 25, 40, 50, 80]), sg = dv * R([0.2, 0.25, 0.3, 0.4, 0.5]); const t = Math.round(100 * sg / dv);
      return fill('ucd-kpi', 2, `Taux de transformation en % : ${dv} devis envoyés, ${sg} signés.`, [String(t), t + '%', t + ' %'], `${sg} / ${dv} = ${t} %.`); }
    if (k === 3) { const ca = R([12000, 24000, 30000, 45000]), n = R([40, 60, 100, 120]); const pm = Math.round(ca / n);
      return fill('ucd-kpi', 2, `Panier moyen en € : ${ca} € de CA pour ${n} commandes.`, [String(pm), pm + '€', pm + ' €'], `Panier moyen = CA / nombre de commandes = ${ca} / ${n} = ${pm} €.`); }
    const pv = R([100, 200, 250, 400]), pa = pv * R([0.5, 0.6, 0.7, 0.75]); const tm = Math.round(100 * (pv - pa) / pa);
    return fill('ucd-kpi', 3, `Calcule le taux de marge en % : prix de vente ${pv} €, coût d'achat ${pa} €.`, [String(tm), tm + '%', tm + ' %'], `Taux de marge = (PV − PA) / PA = (${pv} − ${pa}) / ${pa} = ${tm} %.`); };
  const SWOT = [['Une équipe commerciale expérimentée', 'Force'], ['Un site web vieillissant', 'Faiblesse'], ['La hausse du prix de l\'énergie (les clients veulent isoler)', 'Opportunité'], ['Un nouveau concurrent à bas prix', 'Menace'], ['Un savoir-faire de fabrication reconnu', 'Force'], ['Un délai de livraison trop long', 'Faiblesse'], ['De nouvelles normes d\'hygiène dans l\'agroalimentaire', 'Opportunité'], ['La hausse du prix des matières premières', 'Menace'], ['Un portefeuille clients fidèle', 'Force'], ['Peu de présence sur les réseaux sociaux', 'Faiblesse'], ['Le développement des entrepôts logistiques', 'Opportunité'], ['Une crise économique qui gèle les investissements', 'Menace']];
  const PESTEL = [['Une nouvelle loi sur l\'efficacité énergétique des bâtiments', 'Légal'], ['La hausse des taux d\'intérêt', 'Économique'], ['Une élection qui change la politique industrielle', 'Politique'], ['L\'automatisation des entrepôts', 'Technologique'], ['Les objectifs de réduction des émissions de CO₂', 'Écologique'], ['Le vieillissement de la population active', 'Socioculturel'], ['L\'inflation', 'Économique'], ['Le télétravail qui se généralise', 'Socioculturel'], ['Une nouvelle norme européenne sur les plastiques', 'Légal'], ['L\'arrivée de l\'IA dans la relation client', 'Technologique']];
  G['ucd-analyse'] = () => { if (Math.random() < 0.5) { const [f, c] = R(SWOT); return mc('ucd-analyse', 2, `Pour une PME industrielle, dans un SWOT : « ${f} » est…`, ['Force', 'Faiblesse', 'Opportunité', 'Menace'], c, c === 'Force' || c === 'Faiblesse' ? 'Facteur INTERNE à l\'entreprise.' : 'Facteur EXTERNE (le marché, l\'environnement).'); }
    const [f, c] = R(PESTEL); return mc('ucd-analyse', 2, `Dans un PESTEL, « ${f} » relève du facteur…`, [c].concat(pickOthers(['Politique', 'Économique', 'Socioculturel', 'Technologique', 'Écologique', 'Légal'], c, 3)), c, `PESTEL : Politique, Économique, Socioculturel, Technologique, Écologique, Légal → ${c}.`); };
  const OBJS = [['Augmenter le CA de 10 % sur le secteur Sud d\'ici juin', true], ['Vendre plus', false], ['Signer 5 nouveaux clients agroalimentaires avant le 31 mars', true], ['Être le meilleur commercial', false], ['Réduire le délai de devis à 48 h d\'ici la fin du trimestre', true], ['Avoir des clients contents', false], ['Atteindre un taux de transformation de 30 % en 2027', true], ['Faire beaucoup de prospection', false]];
  G['ucd-objectifs'] = () => { if (Math.random() < 0.6) { const [o, ok] = R(OBJS); return mc('ucd-objectifs', 1, `« ${o} » est-il un objectif SMART ?`, ['Oui', 'Non'], ok ? 'Oui' : 'Non', ok ? 'Chiffré, précis et daté → SMART.' : 'Pas chiffré ni daté → pas SMART.'); }
    const L = [['S', 'Spécifique'], ['M', 'Mesurable'], ['A', 'Atteignable'], ['R', 'Réaliste'], ['T', 'Temporellement défini']]; const [l, w] = R(L);
    return mc('ucd-objectifs', 1, `Dans SMART, que signifie le ${l} ?`, [w].concat(pickOthers(['Spécifique', 'Mesurable', 'Atteignable', 'Réaliste', 'Temporellement défini', 'Motivant', 'Rentable', 'Simple'], w, 3)), w, 'SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini.'); };
  G['ucd-clients'] = () => { const k = R([1, 2]);
    if (k === 1) { const [l, w] = R([['R', 'Récence'], ['F', 'Fréquence'], ['M', 'Montant']]); return mc('ucd-clients', 1, `Dans l'analyse RFM, le ${l} signifie :`, [w].concat(pickOthers(['Rentabilité', 'Fidélité', 'Marge', 'Récence', 'Fréquence', 'Montant'], w, 3)), w, 'RFM : Récence, Fréquence, Montant.'); }
    const n = R([100, 200, 500]); return fill('ucd-clients', 2, `Loi de Pareto : sur ${n} clients, combien font environ 80 % du CA ?`, [String(n * 0.2)], `Environ 20 % des clients → ${n * 0.2}.`); };

  // ================= UC A2 : dates et institutions =================
  const DATES = [['la création de la CECA', '1952'], ['les traités de Rome', '1957'], ['le traité de Maastricht', '1992'], ['l\'entrée en vigueur du traité de Lisbonne', '2009'], ['la création du Conseil de l\'Europe', '1949'], ['la création de l\'ONU', '1945'], ['la signature des accords de Schengen', '1985'], ['le Brexit', '2020'], ['le grand élargissement à l\'Est', '2004'], ['la création de l\'OMC', '1995'], ['l\'adoption de la Convention européenne des droits de l\'homme', '1950'], ['la création de l\'OTAN', '1949']];
  G['eu-histoire'] = () => { const [e, y] = R(DATES); const others = pickOthers(uniq(DATES.map((d) => d[1])), y, 3); return mc('eu-histoire', 2, `En quelle année : ${e} ?`, [y].concat(others), y, `${e.charAt(0).toUpperCase() + e.slice(1)} : ${y}.`); };
  const INST = [['propose les lois européennes', 'La Commission européenne'], ['est élu au suffrage universel direct tous les 5 ans', 'Le Parlement européen'], ['réunit les chefs d\'État ou de gouvernement', 'Le Conseil européen'], ['réunit les ministres des États membres', 'Le Conseil de l\'UE'], ['veille au respect du droit de l\'UE', 'La Cour de justice de l\'UE'], ['gère l\'euro et la politique monétaire', 'La Banque centrale européenne']];
  G['eu-institutions'] = () => { const [r, i] = R(INST); return mc('eu-institutions', 2, `Quelle institution ${r} ?`, [i].concat(pickOthers(INST.map((x) => x[1]), i, 3)), i, `${i} ${r}.`); };
  const COMP = [['L\'union douanière', 'Exclusive'], ['La politique monétaire (euro)', 'Exclusive'], ['La politique commerciale commune', 'Exclusive'], ['Les règles de concurrence', 'Exclusive'], ['L\'environnement', 'Partagée'], ['L\'énergie', 'Partagée'], ['Les transports', 'Partagée'], ['Le marché intérieur', 'Partagée'], ['La santé humaine', 'D\'appui'], ['L\'éducation', 'D\'appui'], ['La culture', 'D\'appui'], ['Le tourisme', 'D\'appui']];
  G['eu-competences'] = () => { const [c, t] = R(COMP); return mc('eu-competences', 2, `${c} est une compétence…`, ['Exclusive', 'Partagée', 'D\'appui'], t, `${c} → compétence ${t.toLowerCase()} de l'UE.`); };
  const ORGS = [['ONU', '1945', 'New York'], ['OIT', '1919', 'Genève'], ['OMS', '1948', 'Genève'], ['OMC', '1995', 'Genève'], ['OTAN', '1949', 'Bruxelles'], ['OCDE', '1961', 'Paris'], ['Conseil de l\'Europe', '1949', 'Strasbourg']];
  G['eu-orgs'] = () => { const [o, y, v] = R(ORGS); return Math.random() < 0.5 ? mc('eu-orgs', 2, `Où siège l'organisation suivante : ${o} ?`, [v].concat(pickOthers(['New York', 'Genève', 'Bruxelles', 'Paris', 'Strasbourg', 'Luxembourg'], v, 3)), v, `${o} : siège à ${v}.`) : mc('eu-orgs', 2, `En quelle année a été créée l'organisation suivante : ${o} ?`, [y].concat(pickOthers(uniq(ORGS.map((x) => x[1])), y, 3)), y, `${o} : créée en ${y}.`); };

  // ================= UC A3 =================
  const HALL = [['Japon', 'Contexte fort'], ['Chine', 'Contexte fort'], ['Pays arabes', 'Contexte fort'], ['France', 'Contexte plutôt fort'], ['Allemagne', 'Contexte faible'], ['Suisse', 'Contexte faible'], ['Pays nordiques', 'Contexte faible'], ['États-Unis', 'Contexte faible']];
  G['a3-communication'] = () => { const [p, c] = R(HALL); return mc('a3-communication', 2, `Selon Hall, la communication au/en ${p} est plutôt de…`, ['Contexte fort', 'Contexte faible', 'Contexte plutôt fort'], c, c.includes('faible') ? 'Message explicite, direct, écrit : contexte faible.' : 'Beaucoup d\'implicite, de relation et de non-verbal : contexte fort.'); };
  const PROT = [['Les pensions financées par les cotisations des salariés', 'Assurance'], ['Le RSA pour les personnes sans ressources', 'Assistance'], ['Une couverture santé pour tous les résidents', 'Protection universelle'], ['Les allocations chômage liées aux cotisations', 'Assurance'], ['Une aide sociale aux personnes démunies', 'Assistance'], ['Les allocations familiales versées à toutes les familles', 'Protection universelle']];
  G['a3-protection'] = () => { const [e, l] = R(PROT); return mc('a3-protection', 2, `« ${e} » relève de quelle logique de protection sociale ?`, ['Assurance', 'Assistance', 'Protection universelle'], l, 'Assurance = cotisations ; assistance = solidarité envers les démunis ; universelle = tout le monde.'); };
})();
