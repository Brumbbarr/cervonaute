// Générateurs de questions : combinent des listes de mots pour créer des phrases toujours nouvelles,
// avec la bonne réponse, une explication et la traduction. window.GEN[notion]() renvoie une question.
(function () {
  const R = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const mc = (n, d, q, opts, good, x, tr) => { const o = shuffle(opts); return { n, d, t: 'mc', q, o, a: o.indexOf(good), x, tr, gen: true, k: n + '|' + q + '|' + good }; };
  const xc = (texte, q) => Object.assign(q, { xc: texte });
  const fill = (n, d, q, ans, x, tr) => ({ n, d, t: 'fill', q, a: ans, x, tr, gen: true, k: n + '|' + q });

  // ---------- -s de la 3e personne / does
  const SUJ = [
    { en: 'My manager', fr: 'Mon manager', p: '3s' }, { en: 'Our sales rep', fr: 'Notre commercial', p: '3s' }, { en: 'The company', fr: "L'entreprise", p: '3s' },
    { en: 'She', fr: 'Elle', p: '3s' }, { en: 'He', fr: 'Il', p: '3s' }, { en: 'The team', fr: "L'équipe", p: '3s' },
    { en: 'Our clients', fr: 'Nos clients', p: '3p' }, { en: 'They', fr: 'Ils', p: '3p' }, { en: 'We', fr: 'Nous', p: '1p' }, { en: 'I', fr: 'Je', p: '1s' }, { en: 'You', fr: 'Tu', p: '2s' }
  ];
  const VERB = [
    { b: 'sell', s: 'sells', o: 'software', fo: 'des logiciels', f: { '1s': 'vends', '2s': 'vends', '3s': 'vend', '1p': 'vendons', '3p': 'vendent' } },
    { b: 'call', s: 'calls', o: 'new clients', fo: 'de nouveaux clients', f: { '1s': 'appelle', '2s': 'appelles', '3s': 'appelle', '1p': 'appelons', '3p': 'appellent' } },
    { b: 'visit', s: 'visits', o: 'the warehouse', fo: "l'entrepôt", f: { '1s': 'visite', '2s': 'visites', '3s': 'visite', '1p': 'visitons', '3p': 'visitent' } },
    { b: 'send', s: 'sends', o: 'quotes', fo: 'des devis', f: { '1s': 'envoie', '2s': 'envoies', '3s': 'envoie', '1p': 'envoyons', '3p': 'envoient' } },
    { b: 'go', s: 'goes', o: 'to Lyon', fo: 'à Lyon', f: { '1s': 'vais', '2s': 'vas', '3s': 'va', '1p': 'allons', '3p': 'vont' } },
    { b: 'watch', s: 'watches', o: 'the sales figures', fo: 'les chiffres de vente', f: { '1s': 'surveille', '2s': 'surveilles', '3s': 'surveille', '1p': 'surveillons', '3p': 'surveillent' } },
    { b: 'study', s: 'studies', o: 'marketing', fo: 'le marketing', f: { '1s': 'étudie', '2s': 'étudies', '3s': 'étudie', '1p': 'étudions', '3p': 'étudient' } },
    { b: 'fix', s: 'fixes', o: 'the printers', fo: 'les imprimantes', f: { '1s': 'répare', '2s': 'répares', '3s': 'répare', '1p': 'réparons', '3p': 'réparent' } },
    { b: 'deliver', s: 'delivers', o: 'the orders', fo: 'les commandes', f: { '1s': 'livre', '2s': 'livres', '3s': 'livre', '1p': 'livrons', '3p': 'livrent' } }
  ];
  const QUAND = [['every week', 'chaque semaine'], ['every Monday', 'chaque lundi'], ['every day', 'tous les jours'], ['twice a month', 'deux fois par mois'], ['on Fridays', 'le vendredi']];
  const elide = (s, v) => (s === 'Je' && /^[aeéiouy]/i.test(v) ? "J'" + v : s + ' ' + v);
  const g3 = () => {
    const s = R(SUJ), v = R(VERB), w = R(QUAND), is3 = s.p === '3s', kind = Math.random();
    if (kind < 0.45) return fill('3e-personne-does', 2, `Conjugue au présent : "${s.en} ___ (${v.b}) ${v.o} ${w[0]}."`, [is3 ? v.s : v.b],
      is3 ? `${s.en} = il / elle → le verbe prend -s : ${v.s}.` : `${s.en} n'est pas à la 3e personne du singulier → pas de -s : ${v.b}.`, `${elide(s.fr, v.f[s.p])} ${v.fo} ${w[1]}.`);
    if (kind < 0.75) { const sl = s.en === 'I' ? s.en : s.en.toLowerCase();
      const good = (is3 ? 'Does' : 'Do') + ` ${sl} ${v.b} ${v.o}?`;
      const sf = s.fr.charAt(0).toLowerCase() + s.fr.slice(1);
      const esq = (/^[aeéiouy]/i.test(sf) ? "Est-ce qu'" : 'Est-ce que ') + elide(sf, v.f[s.p]).replace(/^je /, 'je ');
      return mc('3e-personne-does', 2, `Choisis la bonne question : « ${esq} ${v.fo} ? »`, [good, (is3 ? 'Do' : 'Does') + ` ${sl} ${v.b} ${v.o}?`, (is3 ? 'Does' : 'Do') + ` ${sl} ${v.s} ${v.o}?`, `${is3 ? 'Is' : 'Are'} ${sl} ${v.b} ${v.o}?`].filter((x, i, a) => a.indexOf(x) === i), good,
        `${is3 ? 'Does' : 'Do'} + sujet + verbe SANS -s.`, `${esq} ${v.fo} ?`); }
    const neg = (is3 ? "doesn't " : "don't ") + v.b;
    return fill('3e-personne-does', 3, `Mets à la forme négative : "${s.en} ${is3 ? v.s : v.b} ${v.o} ${w[0]}." → ${s.en} ___ ${v.o} ${w[0]}.`, [neg, neg.replace("n't", ' not')],
      `${is3 ? "doesn't" : "don't"} + verbe sans -s.`, `${s.fr} ne ${v.f[s.p]} pas ${v.fo} ${w[1]}.`.replace(/ ne ([aeéiouy])/, " n'$1"));
  };

  // ---------- Prétérit : verbes irréguliers datés
  const IRR = [
    ['go', 'went', 'to Lyon', 'je suis allé à Lyon'], ['buy', 'bought', 'a new laptop', "j'ai acheté un nouvel ordinateur"], ['meet', 'met', 'a new supplier', "j'ai rencontré un nouveau fournisseur"],
    ['send', 'sent', 'the invoice', "j'ai envoyé la facture"], ['make', 'made', 'a big sale', "j'ai fait une grosse vente"], ['write', 'wrote', 'the report', "j'ai écrit le rapport"],
    ['take', 'took', 'the train', "j'ai pris le train"], ['sell', 'sold', 'twenty licences', "j'ai vendu vingt licences"], ['speak', 'spoke', 'to the director', "j'ai parlé au directeur"],
    ['find', 'found', 'a new client', "j'ai trouvé un nouveau client"], ['give', 'gave', 'a presentation', "j'ai fait une présentation"], ['leave', 'left', 'the office early', "j'ai quitté le bureau tôt"],
    ['spend', 'spent', 'two hours on the phone', "j'ai passé deux heures au téléphone"], ['win', 'won', 'a contract', "j'ai gagné un contrat"], ['lose', 'lost', 'my badge', "j'ai perdu mon badge"],
    ['bring', 'brought', 'some samples', "j'ai apporté des échantillons"], ['think', 'thought', 'about the offer', "j'ai réfléchi à l'offre"], ['pay', 'paid', 'the supplier', "j'ai payé le fournisseur"]
  ];
  const QUANDP = [['Yesterday', 'Hier'], ['Last week', 'La semaine dernière'], ['Two days ago', 'Il y a deux jours'], ['Last Monday', 'Lundi dernier'], ['In 2024', 'En 2024'], ['Last month', 'Le mois dernier']];
  const gPret = () => { const [b, p, o, fr] = R(IRR), [w, fw] = R(QUANDP), k = Math.random();
    if (k < 0.6) return fill('preterit', 2, `Conjugue au prétérit : "${w}, I ___ (${b}) ${o}."`, [p], `Date (${w.toLowerCase()}) → prétérit. ${b} est irrégulier : ${b} → ${p}.`, `${fw}, ${fr}.`);
    return mc('preterit', 2, `${w}, I ___ ${o}.`, [p, 'have ' + IRR.find((x) => x[0] === b)[1], b, b + 'ed'].filter((x, i, a) => a.indexOf(x) === i), p, `Une date (${w.toLowerCase()}) → prétérit, jamais le present perfect. ${b} → ${p}.`, `${fw}, ${fr}.`); };

  // ---------- Present perfect : since / for
  const ACT = [['I have worked here', 'Je travaille ici'], ['She has lived in Lyon', 'Elle vit à Lyon'], ['We have known this client', 'Nous connaissons ce client'], ['He has been our supplier', 'Il est notre fournisseur'],
    ['They have used our software', 'Ils utilisent notre logiciel'], ['I have studied English', "J'étudie l'anglais"], ['The warehouse has been open', "L'entrepôt est ouvert"], ['We have had this machine', 'Nous avons cette machine']];
  const DUR = [['three years', 'trois ans', 'for'], ['two months', 'deux mois', 'for'], ['a long time', 'longtemps', 'for'], ['ten days', 'dix jours', 'for'], ['six weeks', 'six semaines', 'for'],
    ['2021', '2021', 'since'], ['September', 'septembre', 'since'], ['last Monday', 'lundi dernier', 'since'], ['the beginning of the year', 'le début de l\'année', 'since'], ['January', 'janvier', 'since']];
  const gPP = () => { const [a, fa] = R(ACT), [d, fd, good] = R(DUR);
    return mc('present-perfect', 2, `${a} ___ ${d}.`, ['since', 'for', 'ago', 'during'], good, good === 'for' ? `« ${d} » est une durée → for.` : `« ${d} » est un point de départ → since.`, `${fa} depuis ${fd}.`); };

  // ---------- Articles a / an
  const NOMS = [['engineer', 'an', 'un ingénieur'], ['hour', 'an', 'une heure'], ['university', 'a', 'une université'], ['honest offer', 'an', 'une offre honnête'], ['European client', 'a', 'un client européen'],
    ['order', 'an', 'une commande'], ['quote', 'a', 'un devis'], ['invoice', 'an', 'une facture'], ['useful tool', 'a', 'un outil utile'], ['email', 'an', 'un mail'], ['one-year contract', 'a', "un contrat d'un an"],
    ['urgent request', 'an', 'une demande urgente'], ['warehouse', 'a', 'un entrepôt'], ['easy question', 'an', 'une question facile'], ['MBA', 'an', 'un MBA'], ['user guide', 'a', 'un guide utilisateur']];
  const gArt = () => { const [w, good, fr] = R(NOMS);
    return mc('articles', /hour|honest|university|European|one-year|MBA|useful/.test(w) ? 3 : 1, `We need ___ ${w}.`, ['a', 'an', 'the', 'Ø'], good,
      good === 'an' ? `« ${w} » commence par un SON voyelle → an.` : `« ${w} » commence par un SON consonne → a.`, `Nous avons besoin d'${fr.replace(/^un(e)? /, (m) => m)}.`.replace("d'un", "d'un").replace("d'une", "d'une")); };

  // ---------- Some / any / no
  const QTE = [['questions', 'des questions', 'aucune question', 'de questions'], ['samples', 'des échantillons', 'aucun échantillon', "d'échantillons"], ['complaints', 'des réclamations', 'aucune réclamation', 'de réclamations'], ['stock', 'du stock', 'aucun stock', 'de stock'], ['meeting rooms', 'des salles de réunion', 'aucune salle de réunion', 'de salles de réunion'], ['orders', 'des commandes', 'aucune commande', 'de commandes'], ['feedback', 'des retours', 'aucun retour', 'de retours']];
  const gSAN = () => { const [w, fdes, faucun, fde] = R(QTE), k = R(['neg', 'q', 'aff', 'no']);
    if (k === 'neg') return mc('some-any-no', 1, `We don't have ___ ${w}.`, ['some', 'any', 'no'], 'any', 'Verbe négatif (don\'t) → any.', `Nous n'avons pas ${fde}.`);
    if (k === 'q') return mc('some-any-no', 2, `Do you have ___ ${w}? (tu ne connais pas la réponse)`, ['some', 'any', 'no'], 'any', 'Vraie question → any.', `Avez-vous ${fdes} ?`);
    if (k === 'aff') return mc('some-any-no', 1, `We received ___ ${w} this morning.`, ['some', 'any', 'no'], 'some', 'Phrase affirmative, quantité positive → some.', `Nous avons reçu ${fdes} ce matin.`);
    return mc('some-any-no', 2, `There are ___ ${w} today: it's very quiet.`, ['some', 'any', 'no'], 'no', 'Verbe affirmatif (are) + sens négatif → no.', `Il n'y a ${faucun} aujourd'hui : c'est très calme.`); };

  // ---------- Présent simple ou continu
  const ACTS = [['work', 'working', 'travaille', 'on the project', 'sur le projet'], ['call', 'calling', 'appelle', 'the client', 'le client'], ['prepare', 'preparing', 'prépare', 'a quote', 'un devis'], ['visit', 'visiting', 'visite', 'the warehouse', "l'entrepôt"], ['check', 'checking', 'vérifie', 'the stock', 'le stock'], ['write', 'writing', 'rédige', 'the sales report', 'le rapport des ventes'], ['meet', 'meeting', 'rencontre', 'the suppliers', 'les fournisseurs']];
  const gPSC = () => { const [b, ing, fr, o, fo] = R(ACTS), k = Math.random();
    const NOW = [['Right now', 'En ce moment'], ['At the moment', 'En ce moment'], ['Look!', 'Regarde !'], ['This week', 'Cette semaine'], ['Today', "Aujourd'hui"]];
    const HAB = [['usually', "D'habitude"], ['always', 'Toujours,'], ['often', 'Souvent,'], ['every Monday', 'Chaque lundi,'], ['never', '']];
    if (k < 0.5) { const [w, fw] = R(NOW); return xc(`Pourquoi pas « I ${b} » ? Le présent simple parlerait d'une habitude ; « ${w} » montre ce qui se passe maintenant ou en ce moment.`, fill('present-simple-continu', 2, `Conjugue : "${w} I ___ (${b}) ${o}."`, ['am ' + ing, "'m " + ing, 'm ' + ing], `${w} = maintenant ou temporaire → présent continu (am + -ing).`, `${fw}, je ${fr} ${fo}.`.replace('!,', ' !'))); }
    const [w, fw] = R(HAB);
    if (w === 'never') return xc(`Pourquoi pas « am never ${ing} » ? Never décrit une habitude (jamais), pas une action en cours : présent simple.`, fill('present-simple-continu', 2, `Conjugue : "I never ___ (${b}) ${o} on Sundays."`, [b], 'Never = habitude → présent simple.', `Je ne ${fr} jamais ${fo} le dimanche.`.replace(/ne ([aeéiouy])/, "n'$1")));
    const pos = w === 'every Monday' ? `I ___ (${b}) ${o} ${w}.` : `I ${w} ___ (${b}) ${o}.`;
    return xc(`Pourquoi pas « am ${ing} » ? Le présent continu parlerait d'une action en cours ; « ${w} » décrit une habitude.`, fill('present-simple-continu', 2, `Conjugue : "${pos}"`, [b], `${w} = habitude → présent simple.`, `${fw} je ${fr} ${fo}.`.replace("D'habitude je", "D'habitude, je"))); };

  // ---------- Futur
  const gFut = () => { const k = R(['spont', 'plan', 'rdv', 'sign']);
    const [o, fo] = R([['the supplier', 'le fournisseur'], ['the director', 'le directeur'], ['a new client', 'un nouveau client'], ['the team', "l'équipe"]]);
    const [t, ft] = R([['tomorrow at 10', 'demain à 10 h'], ['on Friday at 3 pm', 'vendredi à 15 h'], ['next Tuesday at 9', 'mardi prochain à 9 h']]);
    if (k === 'rdv') return mc('futur', 2, `I ___ ${o} ${t}. It's in my calendar.`, ['am meeting', 'will meet', 'meet', 'met'], 'am meeting', 'Rendez-vous prévu dans l\'agenda → présent continu.', `Je vois ${fo} ${ft}. C'est dans mon agenda.`);
    if (k === 'spont') return mc('futur', 1, `— The phone is ringing. — OK, I ___ answer it.`, ['will', 'am going to', 'am', 'did'], 'will', 'Décision prise sur le moment → will.', '— Le téléphone sonne. — OK, je réponds.');
    if (k === 'plan') return mc('futur', 2, `I've already decided: I ___ call ${o} ${t}.`, ['am going to', 'will', 'shall', 'called'], 'am going to', 'Décision déjà prise → be going to.', `C'est déjà décidé : je vais appeler ${fo} ${ft}.`);
    return mc('futur', 2, `Look at those dark clouds! It ___ rain.`, ['is going to', 'will', 'rains', 'is raining'], 'is going to', 'On voit les signes → be going to.', 'Regarde ces nuages noirs ! Il va pleuvoir.'); };

  window.GEN = { '3e-personne-does': g3, 'preterit': gPret, 'present-perfect': gPP, 'articles': gArt, 'some-any-no': gSAN, 'present-simple-continu': gPSC, 'futur': gFut };
})();
