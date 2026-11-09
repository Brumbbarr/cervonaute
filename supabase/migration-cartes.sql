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
 ('mythique','Mythique',7,1.5,'#ff5a8a'), ('divine','Divine',8,0.5,'#fff3b0'),
 ('transcendante','Transcendante',9,0.02,'#ff4dff')
on conflict (id) do nothing;
insert into public.familles (id, nom, description, ordre) values
 ('savoir','Savoir','Définitions, notions, vocabulaire, règles et méthodes à retenir.',1),
 ('culture','Culture','Culture générale, histoire, personnalités, découvertes.',2),
 ('strategie','Stratégie','Techniques, méthodes de travail, conseils et prise de décision.',3),
 ('exploration','Exploration','Sujets inhabituels, concepts méconnus et informations surprenantes.',4)
on conflict (id) do nothing;
insert into public.matieres (id, nom, ordre) values
 ('anglais','Anglais',1), ('francais','Français',2), ('commerce','Commerce',3), ('marketing','Marketing',4),
 ('gestion','Gestion',5), ('culture','Culture générale',6), ('divers','Divers',7), ('insolite','Insolite',8)
on conflict (id) do nothing;
insert into public.reglages (cle, valeur) values
 ('recompenses', '{"min_reponses":5,"score_min":0.6,"max_par_jour":25,
   "pity":[{"apres":10,"min":"rare"},{"apres":40,"min":"epique"}],
   "min_par_type":{"session":"commune","boss":"rare","quete":"peu_commune"},
   "series":{"3":"peu_commune","7":"rare","14":"tres_rare","30":"epique","60":"legendaire","100":"mythique"}}')
on conflict (cle) do nothing;

-- Rareté Transcendante : 0,02 % pris sur la Commune (total toujours 100 %)
update public.raretes set taux = 39.98 where id = 'commune' and taux = 40;

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
