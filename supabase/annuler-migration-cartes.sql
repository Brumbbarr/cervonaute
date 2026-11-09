-- Annule la migration « cartes ». Les tables d'origine (sessions, reponses, profil, notions)
-- ne sont pas touchées : l'ancienne colonne sessions.carte contient toujours les cartes gagnées avant la migration.
-- Une copie complète des tables d'origine existe aussi dans le schéma « sauvegarde » (suffixe _20261109).
drop function if exists public.ouvrir_recompense(text, text);
drop table if exists public.recompenses;
drop table if exists public.collection;
drop table if exists public.cartes;
drop table if exists public.reglages;
drop table if exists public.raretes;
drop table if exists public.familles;
drop table if exists public.matieres;
