# Recherche d’accueil — une scène commune

## Révision 2 — informations mieux délimitées

Retour utilisateur : la première scène est trop fondue ; les informations se perdent. Révision sur le même aperçu : en-tête opaque, paysage conservant ses couleurs, zone d’entraînement opaque et contrastée, prochaine escale sur une surface de lecture et trois zones contiguës teintées pour mission/objectif/collection. Les titres sont explicites, les chiffres plus grands, le décor ne passe plus sous les informations. La hauteur du paysage est réduite pour rendre les trois repères visibles sur un écran 1920 × 1080. Sur téléphone, l’image précède le bloc d’action puis les informations se lisent verticalement. Aucun changement du design normal v4.0.

Vérification supplémentaire : contraste texte/fond des cinq repères principaux au moins 4,5:1, action et trois catégories présentes dans le premier écran en 1080p. Navigation, données fictives et sept tailles vérifiées à nouveau. Paramètre `recherche=2` et fichiers d’aperçu versionnés pour afficher cette passe lors de la comparaison.

Accord utilisateur du 18 novembre 2026 : travailler un seul accueil complet avant de décliner la direction sur les autres pages. Le problème relevé est l’absence d’unité entre les bulles et l’en-tête, malgré les nouvelles formes. Cette recherche conserve le graphisme publié et ne s’active que dans un aperçu distinct.

## Accès et portée

`apercu-accueil-scene.html` redirige vers `index.html?apercu=1&accueil=scene`. Les deux paramètres sont requis. Sans `apercu=1`, le module quitte immédiatement, sans classe ni feuille de style supplémentaire. Sans `accueil=scene`, l’aperçu v4.0 reste identique. Le numéro de version et le design normal restent v4.0.

Le module ne remplace que l’accueil, son en-tête et sa navigation. Les autres pages de l’aperçu gardent leur présentation v4.0. Les données sont celles de l’adaptateur fictif existant ; aucune requête Supabase, aucun tirage ni enregistrement sur le compte utilisateur.

## Intention graphique

Un seul panorama remonte derrière la marque et la navigation. Une atmosphère de lecture continue protège le texte à gauche ; la graine et les terrasses restent visibles à droite. La progression et la prochaine escale sont des repères posés dans cette scène. Un carnet d’expédition continu rejoint le paysage et rassemble mission, rythme, recherches du labo et mot du professeur. Les informations ne sont plus des fenêtres indépendantes.

Sources visuelles déjà validées : paysage de l’arène et géode générique v4.0. Aucun logo, carte, insigne ni personnage redessiné, aucune nouvelle génération raster.

## Calques et états

Calques distincts : panorama statique, atmosphère CSS pour le contraste, en-tête et navigation HTML, zone de lecture et actions, repère d’escale, carnet et contenus. Un repère commun est donné par la gouttière horizontale ; le cadrage du panorama s’adapte au format. L’illustration n’est pas présentée comme un objet animé.

Les actions sont les boutons et états déjà existants : accueil, étude, exploration, labo, carnet, mission, cours et exercice. Focus clavier conservé. Survol et focus natifs ; pas de nouvelle animation ni d’axe mobile à simuler. Le visuel de découverte reste statique. Les prototypes d’ouverture ne sont pas modifiés.

## Vérification

`tools/verifier_accueil_scene.cjs` : Edge, formats 320/390/768/1024/1440/1920/2560 px, images décodées, absence de débordement et d’erreur JavaScript. Isolation vérifiée avec et sans paramètres ; accueil v4.0 préservé. Navigation vers labo, cours, exercice et dialogue professeur testée sur données fictives ; collection et réponses identiques avant lancement d’exercice, zéro requête Supabase. Captures `accueil-390.png`, `accueil-1440.png`, `accueil-1920.png`, `accueil-2560.png` et rapport `verification.json` conservés localement.
