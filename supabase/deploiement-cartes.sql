-- =====================================================================
-- Migration « cartes » : catalogue commun, collections individuelles,
-- récompenses sécurisées côté serveur. N'efface rien : on ajoute.
-- Annulation : voir supabase/annuler-migration-cartes.sql
-- =====================================================================

-- ---------- Tables de réglage
create table if not exists public.matieres (
  id text primary key, nom text not null, ordre int not null default 0, actif boolean not null default true);
create table if not exists public.familles (
  id text primary key, nom text not null, description text, ordre int not null default 0, actif boolean not null default true);
create table if not exists public.raretes (
  id text primary key, nom text not null, ordre int not null unique,
  taux numeric(6,3) not null check (taux >= 0), couleur text);
create table if not exists public.reglages (cle text primary key, valeur jsonb not null);

-- ---------- Catalogue commun
create table if not exists public.cartes (
  id text primary key,
  num int not null unique,
  titre text not null,
  description text,
  matiere text not null references public.matieres(id),
  famille text not null references public.familles(id),
  rarete text not null references public.raretes(id),
  contenu text,
  exemple text,
  anecdote text,
  astuce text,
  serie text,
  image text,
  actif boolean not null default true,
  cree_le timestamptz not null default now()
);
create index if not exists cartes_rarete_idx on public.cartes(rarete) where actif;

-- ---------- Collection individuelle (une ligne par joueur et par carte)
create table if not exists public.collection (
  user_id uuid not null references auth.users(id) on delete cascade,
  carte_id text not null references public.cartes(id),
  exemplaires int not null default 1 check (exemplaires >= 1),
  decouverte_le timestamptz not null default now(),
  derniere_le timestamptz not null default now(),
  primary key (user_id, carte_id)
);

-- ---------- Historique des récompenses (sert aussi à la protection contre la malchance)
create table if not exists public.recompenses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('session','boss','quete','serie')),
  ref text not null,
  carte_id text not null references public.cartes(id),
  rarete text not null references public.raretes(id),
  neuve boolean not null,
  cree_le timestamptz not null default now(),
  unique (user_id, type, ref)
);
create index if not exists recompenses_user_idx on public.recompenses(user_id, cree_le desc);

-- ---------- Sécurité : lecture seule pour les joueurs, écriture uniquement par la fonction serveur
alter table public.matieres enable row level security;
alter table public.familles enable row level security;
alter table public.raretes enable row level security;
alter table public.reglages enable row level security;
alter table public.cartes enable row level security;
alter table public.collection enable row level security;
alter table public.recompenses enable row level security;

drop policy if exists "lecture matieres" on public.matieres;
create policy "lecture matieres" on public.matieres for select to authenticated using (true);
drop policy if exists "lecture familles" on public.familles;
create policy "lecture familles" on public.familles for select to authenticated using (true);
drop policy if exists "lecture raretes" on public.raretes;
create policy "lecture raretes" on public.raretes for select to authenticated using (true);
drop policy if exists "lecture cartes" on public.cartes;
create policy "lecture cartes" on public.cartes for select to authenticated using (actif);
drop policy if exists "ma collection" on public.collection;
create policy "ma collection" on public.collection for select to authenticated using (auth.uid() = user_id);
drop policy if exists "mes recompenses" on public.recompenses;
create policy "mes recompenses" on public.recompenses for select to authenticated using (auth.uid() = user_id);
-- reglages : aucune politique => illisible et non modifiable par les joueurs

revoke all on public.matieres, public.familles, public.raretes, public.reglages, public.cartes, public.collection, public.recompenses from anon, authenticated;
grant select on public.matieres, public.familles, public.raretes, public.cartes, public.collection, public.recompenses to authenticated;

-- ---------- Données de réglage
insert into public.raretes (id, nom, ordre, taux, couleur) values
 ('commune','Commune',1,40,'#9aa0ab'), ('peu_commune','Peu commune',2,25,'#5fd38a'), ('rare','Rare',3,16,'#5b8cff'),
 ('tres_rare','Très rare',4,9,'#36c9e0'), ('epique','Épique',5,5,'#b05bff'), ('legendaire','Légendaire',6,3,'#ffcf5a'),
 ('mythique','Mythique',7,1.5,'#ff5a8a'), ('divine','Divine',8,0.5,'#fff3b0')
on conflict (id) do nothing;
insert into public.familles (id, nom, description, ordre) values
 ('savoir','Savoir','Définitions, notions, vocabulaire, règles et méthodes à retenir.',1),
 ('culture','Culture','Culture générale, histoire, personnalités, découvertes.',2),
 ('strategie','Stratégie','Techniques, méthodes de travail, conseils et prise de décision.',3),
 ('exploration','Exploration','Sujets inhabituels, concepts méconnus et informations surprenantes.',4)
on conflict (id) do nothing;
insert into public.matieres (id, nom, ordre) values
 ('anglais','Anglais',1), ('francais','Français',2), ('commerce','Commerce',3), ('marketing','Marketing',4),
 ('gestion','Gestion',5), ('culture','Culture générale',6), ('divers','Divers',7)
on conflict (id) do nothing;
insert into public.reglages (cle, valeur) values
 ('recompenses', '{"min_reponses":5,"score_min":0.6,"max_par_jour":25,
   "pity":[{"apres":10,"min":"rare"},{"apres":40,"min":"epique"}],
   "min_par_type":{"session":"commune","boss":"rare","quete":"peu_commune"},
   "series":{"3":"peu_commune","7":"rare","14":"tres_rare","30":"epique","60":"legendaire","100":"mythique"}}')
on conflict (cle) do nothing;

-- ---------- Fonction serveur : ouvrir une récompense
create or replace function public.ouvrir_recompense(p_type text, p_ref text)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  cfg jsonb;
  existante record;
  s record;
  nb int; bonnes int;
  min_ordre int := 1;
  jour date := (now() at time zone 'Europe/Paris')::date;
  serie_jours int;
  p jsonb;
  depuis int;
  tirage numeric; cumul numeric := 0; total numeric;
  rar record; choisie text; carte text; deja int; nouv boolean;
begin
  if uid is null then raise exception 'non connecté'; end if;
  select valeur into cfg from reglages where cle = 'recompenses';

  -- Déjà ouverte ? On renvoie la même (utile si le réseau a coupé)
  select r.*, c.exemplaires into existante from recompenses r join collection c on c.user_id = r.user_id and c.carte_id = r.carte_id
   where r.user_id = uid and r.type = p_type and r.ref = p_ref;
  if found then return json_build_object('carte_id', existante.carte_id, 'rarete', existante.rarete, 'neuve', existante.neuve, 'exemplaires', existante.exemplaires, 'deja', true); end if;

  -- Plafond quotidien
  select count(*) into nb from recompenses where user_id = uid and (cree_le at time zone 'Europe/Paris')::date = jour;
  if nb >= coalesce((cfg->>'max_par_jour')::int, 25) then raise exception 'plafond quotidien atteint'; end if;

  -- Vérifications selon le type
  if p_type in ('session','boss') then
    select * into s from sessions where id = p_ref::uuid and user_id = uid;
    if not found then raise exception 'session introuvable'; end if;
    select count(*), count(*) filter (where correct) into nb, bonnes from reponses where session_id = s.id and user_id = uid;
    if nb < coalesce((cfg->>'min_reponses')::int, 5) then raise exception 'pas assez de réponses'; end if;
    if p_type = 'boss' then
      if s.boss is null or s.victoire is not true then raise exception 'boss non vaincu'; end if;
    else
      if s.boss is not null then raise exception 'utiliser le type boss'; end if;
      if bonnes::numeric / nb < coalesce((cfg->>'score_min')::numeric, 0.6) then raise exception 'score insuffisant'; end if;
    end if;
    select ordre into min_ordre from raretes where id = coalesce(cfg->'min_par_type'->>p_type, 'commune');
  elsif p_type = 'quete' then
    -- ref = AAAA-MM-JJ|notion ; une seule quête par jour, au moins 6 bonnes réponses aujourd'hui sur la notion
    if split_part(p_ref, '|', 1) <> jour::text then raise exception 'quête périmée'; end if;
    if exists (select 1 from recompenses where user_id = uid and type = 'quete' and ref like jour::text || '|%') then raise exception 'quête déjà réclamée'; end if;
    select count(*) into bonnes from reponses where user_id = uid and notion = split_part(p_ref, '|', 2) and correct and date = jour;
    if bonnes < 6 then raise exception 'quête non terminée'; end if;
    select ordre into min_ordre from raretes where id = coalesce(cfg->'min_par_type'->>'quete', 'peu_commune');
  elsif p_type = 'serie' then
    -- ref = nombre de jours (3, 7, 14…) ; on recompte la série réelle à partir des réponses
    if cfg->'series'->>p_ref is null then raise exception 'palier inconnu'; end if;
    with j as (select distinct date d from reponses where user_id = uid and date <= jour),
         g as (select d, d - (row_number() over (order by d))::int grp from j),
         derniere as (select grp from g where d >= jour - 1 order by d desc limit 1)
    select count(*) into serie_jours from g where grp = (select grp from derniere);
    if coalesce(serie_jours, 0) < p_ref::int then raise exception 'série insuffisante'; end if;
    select ordre into min_ordre from raretes where id = cfg->'series'->>p_ref;
  else
    raise exception 'type inconnu';
  end if;

  -- Protection contre la malchance : après N récompenses sans une rareté donnée, on la garantit
  for p in select * from jsonb_array_elements(coalesce(cfg->'pity', '[]'::jsonb)) loop
    select count(*) into depuis from recompenses r join raretes ra on ra.id = r.rarete
     where r.user_id = uid and r.cree_le > coalesce((select max(r2.cree_le) from recompenses r2 join raretes ra2 on ra2.id = r2.rarete
       where r2.user_id = uid and ra2.ordre >= (select ordre from raretes where id = p->>'min')), '-infinity');
    if depuis + 1 >= (p->>'apres')::int then
      min_ordre := greatest(min_ordre, (select ordre from raretes where id = p->>'min'));
    end if;
  end loop;

  -- Tirage de la rareté (seulement parmi celles qui ont des cartes actives)
  select sum(ra.taux) into total from raretes ra where ra.ordre >= min_ordre and exists (select 1 from cartes c where c.rarete = ra.id and c.actif);
  if total is null or total = 0 then raise exception 'aucune carte disponible'; end if;
  tirage := random() * total;
  for rar in select ra.id, ra.taux from raretes ra where ra.ordre >= min_ordre and exists (select 1 from cartes c where c.rarete = ra.id and c.actif) order by ra.ordre loop
    cumul := cumul + rar.taux; choisie := rar.id;
    exit when tirage < cumul;
  end loop;

  -- Tirage de la carte ; les « babioles » ne sortent jamais d'une récompense garantie
  select id into carte from cartes where rarete = choisie and actif
    and (serie is distinct from 'babioles' or (min_ordre = 1 and p_type = 'session'))
    order by random() limit 1;
  if carte is null then select id into carte from cartes where rarete = choisie and actif order by random() limit 1; end if;

  select exemplaires into deja from collection where user_id = uid and carte_id = carte;
  nouv := deja is null;
  insert into collection (user_id, carte_id) values (uid, carte)
    on conflict (user_id, carte_id) do update set exemplaires = collection.exemplaires + 1, derniere_le = now();
  insert into recompenses (user_id, type, ref, carte_id, rarete, neuve) values (uid, p_type, p_ref, carte, choisie, nouv);
  return json_build_object('carte_id', carte, 'rarete', choisie, 'neuve', nouv, 'exemplaires', coalesce(deja, 0) + 1, 'deja', false);
end $$;

revoke all on function public.ouvrir_recompense(text, text) from public, anon;
grant execute on function public.ouvrir_recompense(text, text) to authenticated;


-- ---------- Catalogue (120 cartes) : insertion ou mise à jour
insert into public.cartes (id,num,titre,description,matiere,famille,rarete,contenu,exemple,anecdote,astuce,serie,image) values
('c1',1,'To touch base','Un court message qui relance la conversation sans brusquer personne.','anglais','savoir','commune','Reprendre contact rapidement avec quelqu''un.','Let''s touch base next week.',null,null,null,null),
('c2',2,'ASAP','Quatre lettres qui font accélérer tout un service.','anglais','savoir','commune','Dès que possible (as soon as possible).','Please send it ASAP.',null,'À éviter avec un client : préférez une date précise, c''est plus poli.',null,null),
('c3',3,'To follow up','L''art de relancer sans jamais être lourd.','anglais','savoir','commune','Relancer, faire le suivi.','I''m following up on my quote.',null,null,null,null),
('c4',4,'A deadline','La ligne d''arrivée que tout le monde regarde approcher.','anglais','savoir','commune','Une date limite.','The deadline is Friday.',null,null,null,null),
('c5',5,'To look forward to','La formule qui clôt les mails sur une note positive.','anglais','savoir','commune','Avoir hâte de (suivi d''un verbe en -ing).','I look forward to hearing from you.',null,'Toujours -ing après : look forward to meeting you.',null,null),
('c6',6,'A lead','Une piste chaude, peut-être le prochain gros contrat.','anglais','savoir','commune','Un prospect, une piste commerciale.','We got ten new leads at the fair.',null,null,null,null),
('c7',7,'To be on the same page','Le moment où toute l''équipe comprend enfin la même chose.','anglais','savoir','commune','Être sur la même longueur d''onde.','Let''s make sure we''re on the same page.',null,null,null,null),
('c8',8,'A win-win deal','Un accord où personne ne repart les mains vides.','anglais','savoir','commune','Un accord gagnant-gagnant.','It''s a win-win deal.',null,null,null,null),
('c9',9,'To get back to someone','La promesse de rappeler… à tenir absolument.','anglais','savoir','commune','Revenir vers quelqu''un.','I''ll get back to you tomorrow.',null,null,null,null),
('c10',10,'A ballpark figure','Un chiffre lancé à vue d''œil, comme on estime un stade plein.','anglais','savoir','commune','Un chiffre approximatif.','Can you give me a ballpark figure?','Ballpark = le terrain de baseball : on estime le public d''un coup d''œil.',null,null,null),
('c11',11,'To cut corners','Le raccourci tentant qui coûte cher plus tard.','anglais','savoir','rare','Bâcler pour gagner du temps ou de l''argent.','We never cut corners on quality.',null,null,null,null),
('c12',12,'To think outside the box','Sortir du cadre pour trouver l''idée que personne n''a vue.','anglais','savoir','rare','Sortir des sentiers battus.','We need to think outside the box.',null,null,null,null),
('c13',13,'The bottom line','La dernière ligne du bilan, celle qui compte vraiment.','anglais','savoir','rare','Le résultat net ; par extension, l''essentiel.','The bottom line is: it saves energy.',null,null,null,null),
('c14',14,'To close a deal','La poignée de main qui transforme un prospect en client.','anglais','savoir','rare','Conclure une vente.','She closed the deal in one call.',null,null,null,null),
('c15',15,'A cold call','Décrocher, composer, et convaincre un parfait inconnu.','anglais','savoir','rare','Un appel de prospection à froid.','I made twenty cold calls today.',null,null,null,null),
('c16',16,'To go the extra mile','Le petit effort en plus qui fait la différence.','anglais','savoir','rare','Faire un effort supplémentaire.','We go the extra mile for our clients.',null,null,null,null),
('c17',17,'To be swamped','Noyé sous les mails, les appels et les dossiers.','anglais','savoir','rare','Être débordé.','I''m swamped this week.',null,null,null,null),
('c18',18,'A game changer','L''innovation qui change les règles du jeu.','anglais','savoir','rare','Quelque chose qui change tout.','This new PVC is a game changer.',null,null,null,null),
('c19',19,'To hit the ground running','Le nouvel arrivant déjà efficace dès le premier jour.','anglais','savoir','epique','Être opérationnel tout de suite.','The new rep hit the ground running.',null,null,null,null),
('c20',20,'To keep someone in the loop','Personne n''est laissé dans l''ombre.','anglais','savoir','epique','Tenir quelqu''un informé.','Please keep me in the loop.',null,null,null,null),
('c21',21,'Low-hanging fruit','Les fruits les plus bas, à cueillir en premier.','anglais','savoir','epique','Les gains faciles à obtenir.','Let''s start with the low-hanging fruit.',null,null,null,null),
('c22',22,'To seal the deal','Le dernier geste qui verrouille l''accord.','anglais','savoir','epique','Sceller l''accord.','A free sample sealed the deal.',null,null,null,null),
('c23',23,'A no-brainer','La décision si évidente qu''elle ne demande aucun effort.','anglais','savoir','epique','Une évidence, un choix facile.','Saving 30% on heating is a no-brainer.',null,null,null,null),
('c24',24,'To pull out all the stops','Tous les registres de l''orgue ouverts en même temps.','anglais','savoir','epique','Mettre le paquet.','We pulled out all the stops for the fair.','L''expression vient de l''orgue : tirer tous les « jeux » donne le son le plus puissant.',null,null,null),
('c25',25,'To move the needle','Faire enfin bouger l''aiguille du compteur.','anglais','savoir','legendaire','Faire vraiment bouger les choses.','This contract really moves the needle.',null,null,null,null),
('c26',26,'The elephant in the room','Énorme, visible de tous… et pourtant personne n''en parle.','anglais','savoir','legendaire','Le problème que tout le monde évite.','Let''s address the elephant in the room: price.',null,null,null,null),
('c27',27,'To have a lot on one''s plate','Une assiette qui déborde de tâches.','anglais','savoir','legendaire','Avoir beaucoup de travail.','I have a lot on my plate right now.',null,null,null,null),
('c28',28,'Back to the drawing board','On efface tout et on recommence le plan.','anglais','savoir','legendaire','Retour à la case départ.','The client said no: back to the drawing board.',null,null,null,null),
('c29',29,'To attend','Un faux ami qui piège les francophones en réunion.','anglais','savoir','commune','Assister à (une réunion, un salon). « Attendre » se dit to wait.','I attended the trade fair in Lyon.',null,'Attend = être présent ; wait = attendre.',null,null),
('c30',30,'Library','On n''y achète pas de livres, on les emprunte.','anglais','savoir','commune','Bibliothèque. Une librairie se dit a bookshop.','The library is closed on Sundays.',null,null,null,null),
('c31',31,'Delay','Le mot qui inquiète tous les chefs de projet.','anglais','savoir','commune','Un retard. Un délai (de livraison) se dit lead time.','Sorry for the delay in my reply.',null,'Delay = retard ; lead time = délai.',null,null),
('c32',32,'a ou à ?','Une seule lettre et un accent changent tout.','francais','savoir','commune','« a » est le verbe avoir, « à » est une préposition.','Il a rendez-vous à 14 h.',null,'Remplace par « avait » : si ça marche, c''est « a ».',null,null),
('c33',33,'Ci-joint','Deux mots qui accompagnent chaque pièce jointe.','francais','savoir','commune','Invariable en début de phrase ou devant un nom sans article : « Ci-joint le devis ». Il s''accorde après le nom : « les pièces ci-jointes ».','Ci-joint la facture du mois d''octobre.',null,null,null,null),
('c34',34,'QQOQCP','Six questions pour ne rien oublier d''un problème.','commerce','strategie','commune','Qui ? Quoi ? Où ? Quand ? Comment ? Pourquoi ? Méthode pour analyser une situation ou préparer un rendez-vous.','Avant un rendez-vous client : qui décide, quel besoin, où installer, quand livrer, comment, pourquoi maintenant ?',null,null,null,null),
('c35',35,'BtoB ou BtoC','Vendre à une entreprise ou à un particulier : deux mondes.','commerce','savoir','commune','BtoB : l''entreprise vend à des professionnels (cycle de vente long, plusieurs décideurs). BtoC : elle vend à des particuliers (achat plus rapide, plus émotionnel).','Laniflex vend surtout en BtoB : entrepôts, industrie, agroalimentaire.',null,null,null,null),
('c36',36,'Le persona','Un client imaginaire qui ressemble beaucoup aux vrais.','marketing','savoir','commune','Portrait fictif d''un client type : âge, métier, besoins, freins, habitudes. Il aide à adapter son message.','« Marc, 45 ans, responsable logistique, veut réduire ses coûts de chauffage. »',null,null,null,null),
('c37',37,'Le SWOT','Quatre cases pour voir l''entreprise en entier.','marketing','savoir','commune','Forces et faiblesses (internes), opportunités et menaces (externes).','La hausse du prix de l''énergie est une opportunité pour un fabricant de rideaux isolants.',null,'S et W regardent l''entreprise, O et T regardent le marché.',null,null),
('c38',38,'Le PESTEL','Six lunettes pour observer l''environnement d''une entreprise.','marketing','savoir','commune','Politique, Économique, Socioculturel, Technologique, Écologique, Légal.','Une nouvelle norme sur l''efficacité énergétique = facteur Légal.',null,null,null,null),
('c39',39,'La segmentation','Découper le marché en groupes qui se ressemblent.','marketing','savoir','commune','Diviser les clients en segments homogènes (taille, secteur, besoin…) pour choisir lesquels cibler.','Segment « chambres froides agroalimentaires » vs segment « ateliers de soudure ».',null,null,null,null),
('c40',40,'Le ROI','La question que pose chaque directeur financier.','gestion','savoir','commune','Retour sur investissement = (gain − coût) / coût.','Une action à 2 000 € qui rapporte 5 000 € de marge : ROI = 150 %.',null,null,null,null),
('c41',41,'La trésorerie','L''argent réellement disponible, aujourd''hui, sur le compte.','gestion','savoir','commune','Les liquidités dont dispose l''entreprise. On peut être rentable et manquer de trésorerie si les clients paient tard.','Une grosse commande payée à 60 jours peut créer un trou de trésorerie.',null,null,null,null),
('c42',42,'L''objectif SMART','Un but flou devient un plan d''action.','gestion','strategie','commune','Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini.','« Signer 5 nouveaux clients agroalimentaires avant le 31 mars. »',null,null,null,null),
('c43',43,'Le plan Marshall','L''aide américaine qui a relancé l''Europe d''après-guerre.','culture','culture','commune','Programme d''aide économique des États-Unis à l''Europe (1948-1952). Il a donné naissance à l''OECE, devenue l''OCDE en 1961.','Une des premières étapes de la coopération européenne.',null,null,null,null),
('c44',44,'Le premier iPhone','Le jour où le téléphone est devenu un ordinateur de poche.','culture','culture','commune','Présenté par Steve Jobs en janvier 2007, sorti en juin 2007 aux États-Unis.','Il a lancé l''ère des applications mobiles et du commerce sur smartphone.',null,null,null,null),
('c45',45,'Meeting minutes','La mémoire écrite de chaque réunion.','anglais','savoir','commune','Le compte rendu de réunion.','Who''s taking the minutes today?',null,null,null,null),
('c46',46,'Le chiffre d''affaires','Le total de toutes les ventes, avant de payer quoi que ce soit.','gestion','savoir','commune','Somme des ventes sur une période, hors taxes. Ce n''est pas le bénéfice.','100 rideaux vendus 300 € HT = 30 000 € de chiffre d''affaires.',null,null,null,null),
('c47',47,'Le trombone','Il tient tout. Il ne vaut rien. Il est indispensable.','divers','exploration','commune','Une babiole de bureau. Aucune valeur… sauf pour ceux qui collectionnent tout.',null,null,'Les grandes victoires commencent parfois par de petits objets.','babioles',null),
('c48',48,'L''agrafeuse vide','Toujours vide au moment exact où l''on en a besoin.','divers','exploration','commune','Une babiole de bureau, légendairement vide.',null,null,null,'babioles',null),
('c49',49,'Le café de 15 h','Froid, oublié sur le bureau depuis la réunion de midi.','divers','exploration','commune','Une babiole : carburant officiel des après-midis chargés.',null,null,null,'babioles',null),
('c50',50,'La réunion qui aurait pu être un mail','Une heure de perdue, trois phrases utiles.','divers','exploration','commune','Une babiole… et un rappel : un ordre du jour clair évite bien des réunions inutiles.',null,null,null,'babioles',null),
('c51',51,'Le post-it fatigué','Il ne colle plus, mais personne n''ose le jeter.','divers','exploration','commune','Une babiole de bureau en fin de carrière.',null,null,null,'babioles',null),
('c52',52,'Le stylo sans encre','Il marche… sauf quand le client attend la signature.','divers','exploration','commune','Une babiole. Astuce de pro : toujours deux stylos en rendez-vous.',null,null,null,'babioles',null),
('c53',53,'La chaise qui grince','Chaque mouvement est annoncé à tout l''open space.','divers','exploration','commune','Une babiole de bureau très bavarde.',null,null,null,'babioles',null),
('c54',54,'Le Wi-Fi du train','Connecté. Déconnecté. Connecté. Tunnel.','divers','exploration','commune','Une babiole… et la raison pour laquelle l''Arène marche hors connexion.',null,null,null,'babioles',null),
('c55',55,'Actually','Le faux ami le plus fréquent de l''anglais.','anglais','savoir','peu_commune','En fait, en réalité. « Actuellement » se dit currently.','Actually, the price includes delivery.',null,'Actually = en fait ; currently = actuellement.',null,null),
('c56',56,'Eventually','Ça finira par arriver… mais pas forcément « éventuellement ».','anglais','savoir','peu_commune','Finalement, au bout du compte. « Éventuellement » se dit possibly.','Eventually, the client signed.',null,null,null,null),
('c57',57,'Sensible','Un client sensible en anglais est surtout… raisonnable.','anglais','savoir','peu_commune','Raisonnable, sensé. « Sensible » (émotif) se dit sensitive.','That''s a sensible decision.',null,null,null,null),
('c58',58,'Since ou for ?','Deux façons de dire « depuis », jamais interchangeables.','anglais','savoir','peu_commune','since + point de départ (since 2021) ; for + durée (for three years). Avec le present perfect.','I''ve worked here since September / for two months.',null,null,null,null),
('c59',59,'Will ou going to ?','Décidé à l''instant ou prévu depuis longtemps ?','anglais','savoir','peu_commune','will = décision spontanée, promesse, prédiction ; be going to = décision déjà prise, ou signes visibles.','The phone''s ringing, I''ll get it. / I''m going to apply for this job.',null,null,null,null),
('c60',60,'Cordialement ou Bien à vous ?','La dernière ligne d''un mail en dit long.','francais','savoir','peu_commune','« Cordialement » : neutre et pro. « Bien cordialement » : un peu plus chaleureux. « Bien à vous » : plus personnel. « Je vous prie d''agréer… » : très formel (courrier).','Premier contact avec un client : « Cordialement ».',null,null,null,null),
('c61',61,'Les pléonasmes','Dire deux fois la même chose… pour rien.','francais','savoir','peu_commune','Répétition inutile d''une même idée : « au jour d''aujourd''hui », « monter en haut », « prévoir à l''avance », « collaborer ensemble ».','On écrit « prévoir », pas « prévoir à l''avance ».',null,null,null,null),
('c62',62,'Anticonstitutionnellement','Longtemps présenté comme le plus long mot du français courant.','francais','exploration','peu_commune','25 lettres. D''autres mots, plus rares, sont encore plus longs, comme « intergouvernementalisations » (27 lettres).',null,'Les dictionnaires ne sont pas tous d''accord sur le « record ».',null,null,null),
('c63',63,'La méthode CAP','Trois étapes pour transformer une caractéristique en argument.','commerce','strategie','peu_commune','Caractéristique (ce que c''est), Avantage (ce que ça fait), Preuve (ce qui le démontre).','Lanières en PVC polaire (C) qui restent souples à −25 °C (A) : testées dans les chambres froides de nos clients (P).',null,null,null,null),
('c64',64,'L''écoute active','Le meilleur vendeur est souvent celui qui parle le moins.','commerce','strategie','peu_commune','Laisser parler, reformuler (« si je comprends bien… »), poser des questions ouvertes, montrer qu''on a compris avant de répondre.','« Si je comprends bien, votre priorité, c''est de garder le froid sans ralentir les chariots ? »',null,null,null,null),
('c65',65,'Les 4P','Les quatre leviers du marketing mix.','marketing','savoir','peu_commune','Produit, Prix, Place (distribution), Promotion (communication).','Changer de distributeur = agir sur le P de Place.',null,null,null,null),
('c66',66,'Le NPS','Une seule question pour mesurer la fidélité.','marketing','savoir','peu_commune','« Recommanderiez-vous notre entreprise ? » de 0 à 10. NPS = % de promoteurs (9-10) − % de détracteurs (0-6).','60 % de promoteurs, 15 % de détracteurs : NPS = +45.',null,null,null,null),
('c67',67,'AIDA','Le chemin que suit l''esprit d''un client.','marketing','strategie','peu_commune','Attention, Intérêt, Désir, Action : la structure classique d''un message publicitaire ou d''un mail de prospection.','Objet accrocheur (A), problème du client (I), bénéfice chiffré (D), proposition de rendez-vous (A).',null,null,null,null),
('c68',68,'La roue PDCA','Une roue qui tourne et améliore tout ce qu''elle touche.','gestion','strategie','peu_commune','Plan (prévoir), Do (faire), Check (vérifier), Act (ajuster). Popularisée par W. Edwards Deming.','Tester un nouveau script d''appel, mesurer, corriger, recommencer.',null,null,null,null),
('c69',69,'La méthode Pomodoro','Une tomate-minuteur contre la procrastination.','divers','strategie','peu_commune','25 minutes de travail concentré, 5 minutes de pause ; une pause longue après 4 cycles.',null,'Inventée par Francesco Cirillo à la fin des années 1980, avec un minuteur de cuisine en forme de tomate.',null,null,null),
('c70',70,'Jean Monnet','L''homme de l''ombre de la construction européenne.','culture','culture','peu_commune','Inspirateur de la déclaration Schuman et premier président de la Haute Autorité de la CECA (1952).',null,'Il venait d''une famille de négociants en cognac.',null,null,null),
('c71',71,'Coca-Cola, 1886','D''une pharmacie d''Atlanta au monde entier.','culture','culture','peu_commune','Créé en 1886 par le pharmacien John Pemberton à Atlanta. Le nom et le logo viennent de son comptable, Frank Robinson.',null,'Les premiers verres se vendaient 5 cents.',null,null,null),
('c72',72,'Le positionnement','La place que vous occupez dans la tête du client.','marketing','savoir','peu_commune','La façon dont une offre se distingue de ses concurrents aux yeux de la cible (prix, qualité, service, innovation…).','« Le spécialiste du rideau sur mesure, livré vite. »',null,null,null,null),
('c73',73,'La question alternative','Proposer deux « oui » au lieu d''un « oui ou non ».','commerce','strategie','peu_commune','Technique de conclusion : offrir un choix entre deux options positives.','« On fixe l''installation mardi ou jeudi ? »',null,null,null,null),
('c74',74,'Le pitch d''ascenseur','Trente secondes pour donner envie d''en savoir plus.','commerce','strategie','peu_commune','Présentation très courte : qui vous êtes, le problème que vous résolvez, le bénéfice, et une question pour continuer.','« J''aide les entrepôts à réduire leurs pertes de froid. Vous avez des portes souvent ouvertes ? »',null,null,null,null),
('c75',75,'Questions ouvertes','Une question qui fait parler vaut dix arguments.','commerce','strategie','peu_commune','Ouvertes (comment, pourquoi, quoi) pour découvrir ; fermées (oui / non) pour valider.','« Comment gérez-vous les courants d''air aujourd''hui ? »',null,null,null,null),
('c76',76,'L''objet du mail','Il décide si votre mail sera lu… ou ignoré.','francais','strategie','peu_commune','Court, précis, utile : le sujet et l''action attendue.','« Devis rideaux quai 3 – validation avant vendredi »',null,null,null,null),
('c77',77,'Le KPI','Le tableau de bord du commercial.','gestion','savoir','peu_commune','Indicateur clé de performance : taux de transformation, panier moyen, nombre de rendez-vous…','10 devis signés sur 40 : taux de transformation de 25 %.',null,null,null,null),
('c78',78,'L''upselling','Proposer la version supérieure, au bon moment.','commerce','strategie','peu_commune','Vente additionnelle d''une version plus haut de gamme du même produit.','Proposer le PVC polaire plutôt que le standard pour une chambre froide négative.',null,null,null,null),
('c79',79,'Le cross-selling','Le produit complémentaire qui rend service.','commerce','strategie','peu_commune','Vente croisée d''un produit complémentaire.','Avec le rideau, proposer le rail de fixation et des lanières de rechange.',null,null,null,null),
('c80',80,'Black Friday','Le vendredi où les comptes passent du rouge au noir.','culture','exploration','peu_commune','Lendemain de Thanksgiving aux États-Unis, devenu le coup d''envoi des achats de Noël.',null,'L''expression a été popularisée à Philadelphie dans les années 1960, par la police, à cause des embouteillages.',null,null,null),
('c81',81,'La méthode SONCAS','Six motivations cachées derrière chaque achat.','commerce','strategie','rare','Sécurité, Orgueil, Nouveauté, Confort, Argent, Sympathie : identifier la motivation principale du client pour adapter ses arguments.','Un client « Argent » : mettez en avant les économies de chauffage.',null,null,null,null),
('c82',82,'Traiter une objection','Une objection n''est pas un refus, c''est une question.','commerce','strategie','rare','Écouter, reformuler, valider (« je comprends »), répondre avec une preuve, vérifier que c''est réglé.','« C''est trop cher. » → « Je comprends. Comparons avec ce que vous coûtent vos pertes d''énergie chaque mois. »',null,null,null,null),
('c83',83,'La pyramide de Maslow','Cinq étages de besoins humains.','marketing','savoir','rare','Besoins physiologiques, sécurité, appartenance, estime, accomplissement (Abraham Maslow, 1943).',null,'Maslow n''a jamais dessiné de pyramide : ce schéma a été popularisé après lui.',null,null,null),
('c84',84,'Le parcours client','Chaque étape, du premier contact à la fidélité.','marketing','strategie','rare','Customer journey : découverte, considération, achat, utilisation, fidélisation. On cherche les points de friction à chaque étape.','Un devis qui met une semaine à arriver = friction à l''étape considération.',null,null,null,null),
('c85',85,'La loi de Pareto','20 % des causes, 80 % des effets.','gestion','savoir','rare','Souvent, environ 20 % des clients font 80 % du chiffre d''affaires. Utile pour prioriser.',null,'Vilfredo Pareto l''a observé vers 1900 : environ 20 % des Italiens possédaient 80 % des terres.',null,null,null),
('c86',86,'Le seuil de rentabilité','Le moment où l''entreprise commence enfin à gagner de l''argent.','gestion','savoir','rare','Chiffre d''affaires pour lequel le résultat est nul : toutes les charges sont couvertes. Au-delà, on fait du bénéfice.','Seuil = charges fixes / taux de marge sur coût variable.',null,null,null,null),
('c87',87,'La matrice d''Eisenhower','Urgent ou important ? Pas toujours la même chose.','divers','strategie','rare','Urgent et important : faire. Important non urgent : planifier. Urgent non important : déléguer. Ni l''un ni l''autre : éliminer.','Réviser l''examen dans un mois = important non urgent : à planifier dès maintenant.',null,null,null,null),
('c88',88,'Le 9 mai 1950','Un discours qui a lancé l''Europe.','culture','culture','rare','Robert Schuman propose de mettre en commun le charbon et l''acier français et allemands : c''est la naissance de la CECA. Le 9 mai est devenu la Journée de l''Europe.',null,'Le texte avait été préparé en grande partie par Jean Monnet.',null,null,null),
('c89',89,'Henry Ford, 1913','La chaîne qui a mis l''automobile à la portée de tous.','culture','culture','rare','Ford installe la chaîne de montage mobile en 1913 pour la Ford T : le temps d''assemblage d''une voiture passe d''environ 12 heures à moins de 2 heures.',null,'En 1914, il double presque le salaire de ses ouvriers (5 dollars par jour).',null,null,null),
('c90',90,'Adam Smith','Le père de l''économie moderne et de la « main invisible ».','culture','culture','rare','Auteur de « La Richesse des nations » (1776). Il y décrit la division du travail avec l''exemple d''une fabrique d''épingles.',null,'Son visage figure sur un billet de 20 livres en Angleterre.',null,null,null),
('c91',91,'Le premier e-mail','Un message envoyé… à l''ordinateur d''à côté.','culture','exploration','rare','En 1971, Ray Tomlinson envoie le premier e-mail entre deux ordinateurs du réseau ARPANET et choisit le signe @ pour séparer le nom et la machine.',null,'Il ne se souvenait plus du contenu : probablement une suite de lettres comme « QWERTYUIOP ».',null,null,null),
('c92',92,'L''accord avec avoir','Le piège préféré des dictées.','francais','savoir','rare','Avec avoir, le participe passé ne s''accorde pas… sauf si le COD est placé avant le verbe.','Les offres que nous avons envoyées. / Nous avons envoyé les offres.',null,null,null,null),
('c93',93,'Le principe de réciprocité','Recevoir donne envie de rendre.','commerce','strategie','tres_rare','Quand on reçoit quelque chose (échantillon, conseil, service), on se sent redevable. Décrit par Robert Cialdini dans « Influence » (1984).','Un échantillon gratuit envoyé avant le rendez-vous.',null,null,null,null),
('c94',94,'L''effet de rareté','Ce qui manque attire.','commerce','strategie','tres_rare','Un produit perçu comme rare ou limité dans le temps paraît plus désirable (Robert Cialdini).','« Tarif valable jusqu''à vendredi. » À utiliser honnêtement, sinon la confiance s''effondre.',null,null,null,null),
('c95',95,'La matrice BCG','Vedettes, vaches à lait, dilemmes et poids morts.','marketing','strategie','tres_rare','Classe les activités selon la croissance du marché et la part de marché. Vedette (forte, forte), vache à lait (faible croissance, forte part), dilemme (forte croissance, faible part), poids mort (faible, faible).',null,'Créée par le Boston Consulting Group à la fin des années 1960.',null,null,null),
('c96',96,'Taux de marge ou de marque ?','Même calcul en haut, pas le même en bas.','gestion','savoir','tres_rare','Taux de marge = marge / coût d''achat. Taux de marque = marge / prix de vente HT.','Achat 60 €, vente 100 € : marge 40 €, taux de marge 66,7 %, taux de marque 40 %.',null,null,null,null),
('c97',97,'La loi de Parkinson','Le travail s''étale pour remplir le temps disponible.','divers','exploration','tres_rare','Énoncée en 1955 par l''historien C. Northcote Parkinson. Conseil : se fixer des délais courts et précis.','Un rapport à rendre « dans un mois » prendra un mois ; à rendre vendredi, il sera prêt vendredi.',null,null,null,null),
('c98',98,'Le premier code-barres','Un paquet de chewing-gums est entré dans l''histoire.','culture','exploration','tres_rare','Le 26 juin 1974, dans un supermarché de Troy (Ohio), un paquet de chewing-gums Wrigley''s est le premier produit scanné grâce à un code-barres UPC.',null,'Ce paquet est aujourd''hui conservé au Smithsonian, à Washington.',null,null,null),
('c99',99,'La première pub télé','Dix secondes pour une montre, en 1941.','culture','culture','tres_rare','Le 1er juillet 1941, à New York, la chaîne WNBT diffuse une publicité pour les montres Bulova avant un match de baseball : la première pub télévisée officielle.',null,'Elle montrait simplement une horloge sur une carte des États-Unis.',null,null,null),
('c100',100,'Le present perfect','Le temps qui relie le passé au présent.','anglais','savoir','tres_rare','have / has + participe passé. Pas de date précise, avec une conséquence maintenant, une expérience de vie, ou « depuis » (have been + -ing).','I''ve lost my keys (je ne peux pas entrer). Mais : I lost my keys yesterday.',null,'Une date → prétérit. Pas de date → have. Depuis → have been.',null,null),
('c101',101,'L''effet de leurre','La troisième option qui sert juste à faire choisir la deuxième.','marketing','exploration','tres_rare','Ajouter une option peu intéressante rend une autre option plus attractive par comparaison.',null,'Dan Ariely l''a illustré avec un abonnement à The Economist : la formule « papier seul », au même prix que « papier + web », poussait vers la formule complète.',null,null,null),
('c102',102,'L''effet d''ancrage','Le premier chiffre entendu influence tous les autres.','commerce','strategie','tres_rare','Le premier prix annoncé sert de référence pour la suite de la négociation (Tversky et Kahneman, 1974).','Présenter d''abord la solution complète, puis l''option simple, qui paraît alors raisonnable.',null,null,null,null),
('c103',103,'Bien que + subjonctif','Une concession qui exige toujours le subjonctif.','francais','savoir','tres_rare','« Bien que » et « quoique » sont suivis du subjonctif. « Après que », lui, est suivi de l''indicatif.','Bien que le devis soit élevé, le client a signé. / Après que le client a signé…',null,null,null,null),
('c104',104,'L''effet Zeigarnik','Une tâche inachevée reste en tête.','divers','exploration','tres_rare','On se souvient mieux des tâches interrompues que des tâches terminées (Bluma Zeigarnik, années 1920).',null,null,'Arrêter une révision au milieu d''un exercice aide à y repenser et à reprendre plus facilement.',null,null),
('c105',105,'Le mot-valise','Deux mots rangés dans la même valise.','francais','exploration','tres_rare','Mot formé en fusionnant deux mots : courriel (courrier + électronique), franglais (français + anglais), motel (motor + hotel).',null,'« Courriel » a été proposé au Québec dans les années 1990.',null,null,null),
('c106',106,'Le vol de la Joconde','Le vol qui a rendu un tableau mondialement célèbre.','culture','culture','tres_rare','En août 1911, Vincenzo Peruggia vole la Joconde au Louvre. Elle n''est retrouvée qu''en 1913, à Florence.',null,'Le vol a fait la une des journaux du monde entier, et c''est à ce moment que le tableau est devenu une icône.',null,null,null),
('c107',107,'La VOC, 1602','La première grande entreprise cotée en bourse.','culture','culture','epique','La Compagnie néerlandaise des Indes orientales (VOC), fondée en 1602, est souvent considérée comme la première société dont les actions s''échangeaient en bourse, à Amsterdam.',null,'Elle avait le droit de battre monnaie, de signer des traités et d''avoir sa propre armée.',null,null,null),
('c108',108,'La tulipomanie','Un bulbe de tulipe au prix d''une maison.','culture','exploration','epique','Aux Pays-Bas, en 1636-1637, le prix des bulbes de tulipes s''envole puis s''effondre brutalement : on la cite souvent comme la première bulle spéculative.',null,'Les historiens pensent aujourd''hui que son ampleur a été exagérée par les récits de l''époque.',null,null,null),
('c109',109,'Le Post-it','Une colle ratée devenue un best-seller.','culture','exploration','epique','En 1968, Spencer Silver (3M) invente une colle qui colle mal. En 1974, son collègue Art Fry l''utilise pour faire des marque-pages repositionnables. Le Post-it sort en 1980.',null,'Un « échec » peut devenir une innovation… si quelqu''un lui trouve un usage.',null,null,null),
('c110',110,'L''effet Veblen','Plus c''est cher, plus on en veut.','marketing','exploration','epique','Pour certains produits de luxe, une hausse de prix augmente la demande, parce que le prix élevé montre un statut social. Décrit par Thorstein Veblen en 1899.','Montres et sacs de luxe : baisser le prix peut faire baisser les ventes.',null,null,null,null),
('c111',111,'Kongō Gumi','Une entreprise fondée il y a plus de 1 400 ans.','culture','exploration','legendaire','Entreprise japonaise de construction de temples fondée en 578, souvent citée comme la plus ancienne entreprise du monde. Elle a été dirigée par la même famille pendant environ 40 générations.',null,'En difficulté financière, elle a été rachetée en 2006, mais elle existe toujours.',null,null,null),
('c112',112,'Le code d''Hammurabi','Des règles de commerce gravées dans la pierre.','culture','culture','legendaire','Vers 1750 avant notre ère, le roi babylonien Hammurabi fait graver près de 280 lois, dont des règles sur les prêts, les salaires, les contrats et les responsabilités des artisans.',null,'La stèle est exposée au musée du Louvre.',null,null,null),
('c113',113,'La BATNA','Votre meilleure solution de repli, votre vraie force en négociation.','commerce','strategie','legendaire','Best Alternative To a Negotiated Agreement (en français MESORE) : ce que vous ferez si la négociation échoue. Plus elle est bonne, plus vous négociez sereinement. Concept de Roger Fisher et William Ury (« Getting to Yes », 1981).',null,null,'Ne jamais entrer en négociation sans connaître sa BATNA.',null,null),
('c114',114,'La pizza à 10 000 bitcoins','Le dîner le plus cher de l''histoire.','culture','exploration','mythique','Le 22 mai 2010, Laszlo Hanyecz paie deux pizzas 10 000 bitcoins : c''est souvent cité comme le premier achat réel en bitcoin. Le 22 mai est devenu le « Bitcoin Pizza Day ».',null,'Au cours du bitcoin des années 2020, ces pizzas auraient valu plusieurs centaines de millions de dollars.',null,null,null),
('c115',115,'La tablette de Kushim','Le plus vieux nom connu de l''histoire… était celui d''un comptable.','culture','exploration','mythique','Tablette d''argile d''Uruk (Mésopotamie), d''environ 3 000 ans avant notre ère. Elle enregistre des quantités d''orge et porte le nom « Kushim », peut-être celui de l''administrateur.',null,'Parmi les premiers écrits de l''humanité, beaucoup étaient… de la comptabilité.',null,null,null),
('c116',116,'Le dilemme du prisonnier','Coopérer ou trahir ?','divers','strategie','mythique','Jeu de la théorie des jeux : deux joueurs gagneraient à coopérer, mais chacun a intérêt à trahir l''autre. Quand le jeu se répète, la coopération devient souvent la meilleure stratégie.','En affaires, la relation durable avec un client vaut plus qu''un gain rapide.',null,null,null,null),
('c117',117,'L''effet Dunning-Kruger','Moins on en sait, plus on se croit fort.','divers','exploration','mythique','Étude de David Dunning et Justin Kruger (1999) : les personnes les moins compétentes dans un domaine ont tendance à surestimer leur niveau.',null,null,'C''est pour ça que l''Arène ne dit jamais « maîtrisé » après un seul quiz.',null,null),
('c118',118,'La méthode Feynman','Pour vraiment comprendre, explique-le simplement.','divers','strategie','divine','1. Choisir une notion. 2. L''expliquer avec des mots simples, comme à un enfant. 3. Repérer les trous dans son explication et retourner au cours. 4. Simplifier encore.',null,'Méthode inspirée du physicien Richard Feynman, prix Nobel 1965, célèbre pour ses explications limpides.',null,null,null),
('c119',119,'La courbe de l''oubli','Sans révision, la mémoire s''efface à toute vitesse.','divers','strategie','divine','Hermann Ebbinghaus (1885) montre qu''on oublie très vite ce qu''on vient d''apprendre, mais que chaque révision espacée ralentit l''oubli. C''est la base de la répétition espacée.',null,null,'Revoir une notion le lendemain, puis 3 jours après, puis une semaine après : c''est exactement ce que fait la Revanche de l''Arène.',null,null),
('c120',120,'La pierre de Rosette','Un seul texte, trois écritures, et des hiéroglyphes enfin lus.','culture','exploration','divine','Découverte en 1799 en Égypte, elle porte le même décret en hiéroglyphes, en démotique et en grec ancien. Grâce à elle, Jean-François Champollion déchiffre les hiéroglyphes en 1822.',null,'Elle est conservée au British Museum, à Londres.',null,null,null)
on conflict (id) do update set num=excluded.num,titre=excluded.titre,description=excluded.description,matiere=excluded.matiere,famille=excluded.famille,rarete=excluded.rarete,contenu=excluded.contenu,exemple=excluded.exemple,anecdote=excluded.anecdote,astuce=excluded.astuce,serie=excluded.serie,image=excluded.image;

-- ---------- Reprise des cartes déjà gagnées (anciennes sessions) : rien n'est effacé
insert into public.recompenses (user_id, type, ref, carte_id, rarete, neuve, cree_le)
select s.user_id,
       case when s.mode = 'quete' then 'quete' when s.boss is not null then 'boss' else 'session' end,
       case when s.mode = 'quete' then s.date::text || '|' || replace(s.titre, 'Quête : ', '') else s.id::text end,
       s.carte, c.rarete,
       row_number() over (partition by s.user_id, s.carte order by s.at) = 1,
       s.at
from public.sessions s join public.cartes c on c.id = s.carte
where s.carte is not null
on conflict (user_id, type, ref) do nothing;

insert into public.collection (user_id, carte_id, exemplaires, decouverte_le, derniere_le)
select user_id, carte, count(*), min(at), max(at) from public.sessions where carte is not null group by user_id, carte
on conflict (user_id, carte_id) do nothing;

select 'cartes' t, count(*)::text n from public.cartes
union all select 'collections', count(*)::text from public.collection
union all select 'recompenses', count(*)::text from public.recompenses
union all select 'par_rarete', string_agg(rarete || ':' || n, ' ') from (select rarete, count(*) n from public.cartes group by rarete) x;
