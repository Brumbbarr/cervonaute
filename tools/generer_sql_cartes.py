# Génère supabase/deploiement-cartes.sql à partir de supabase/cartes.json et de migration-cartes.sql.
# Usage : py -I tools/generer_sql_cartes.py   (depuis le dossier du projet)
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cartes = json.load(io.open(os.path.join(ROOT, 'supabase', 'cartes.json'), encoding='utf-8'))
migration = io.open(os.path.join(ROOT, 'supabase', 'migration-cartes.sql'), encoding='utf-8').read()

def q(v):
    if v is None or v == '':
        return 'null'
    return "'" + str(v).replace("'", "''") + "'"

champs = ['id', 'num', 'titre', 'description', 'matiere', 'famille', 'rarete', 'contenu', 'exemple', 'anecdote', 'astuce', 'serie', 'image']
lignes = []
for c in cartes:
    vals = [q(c.get(k)) if k != 'num' else str(int(c['num'])) for k in champs]
    lignes.append('(' + ','.join(vals) + ')')
maj = ','.join(f'{k}=excluded.{k}' for k in champs if k not in ('id',))

sql = migration + '\n\n-- ---------- Catalogue (' + str(len(cartes)) + ' cartes) : insertion ou mise à jour\n'
sql += 'insert into public.cartes (' + ','.join(champs) + ') values\n' + ',\n'.join(lignes) + '\non conflict (id) do update set ' + maj + ';\n'
sql += '''
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
'''
io.open(os.path.join(ROOT, 'supabase', 'deploiement-cartes.sql'), 'w', encoding='utf-8').write(sql)
print('cartes:', len(cartes), 'taille:', len(sql))
