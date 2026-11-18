# Cervonaute v4.0 — l’interface reprend les formes du Cortex

Demande du 18 novembre : refonte beaucoup plus expressive des formes et de la disposition, sans se limiter à changer la taille des fenêtres. Conserver la palette et les neuf paysages V2 ; remplacer le vieux coffre par une illustration de découverte cohérente. Cartes et insignes conservés.

## Construction

- Accueil : découpe du paysage, cartouche de lecture en négatif avec un contour courbe, repère de région et actions distinctes.
- Objectif : silhouette de pétale, anneau de progression existant, typographie claire et contraste inchangé.
- Mission : étiquette à découpes latérales, progression et action en zones séparées.
- Navigation : dock vertical, repères en forme de pétale ; dock inférieur sur mobile.
- Expéditions : formes sculptées, grands numéros de repérage, durées détachées et défis facultatifs distincts.
- Étude : onglets et feuillets à coins courbes ; labo : alcôves et repères de famille ; carnet : surfaces de statistiques harmonisées.

Calques : surfaces et découpes CSS, paysage raster statique, repères et contenu HTML, boutons sémantiques et focus accessibles. La géode est une illustration statique générique, distincte du catalogue des 24 cartes, pas un mécanisme d’ouverture. États de la récompense : visuel d’attente + bouton, activation désactivant le bouton, affichage de la carte attribuée par le parcours existant. Aucune animation d’ouverture ni halo artificiel n’est ajouté. L’ancien effet de jointure est écarté du parcours par l’adaptateur courant. Le prototype volumétrique validé du coffre est conservé intact pour recherche ultérieure.

## Asset généré

Outil intégré **imagegen**, sortie transparente. Source conservée : `docs/cortex/direction-creative/sources/decouverte-v40.png`. Export : `assets/cortex-ui/creatif/decouverte-v40.webp` (850 × 850, alpha conservé, WebP qualité 90). Aucun redessin des cartes.

### Prompt exact

undefined

## Vérification

Edge : cinq pages principales sur neuf largeurs (320, 390, 768, 1024, 1100, 1280, 1440, 1920, 2560 px), parcours mobile jusqu’à une question, neuf ambiances, contraste des panneaux d’objectif, absence de débordement et de ressource manquante. Révélation en simulation : nouveau visuel chargé, ancien coffre/halo absents, carte affichée, aucune modification de la collection. Aucune requête Supabase pendant les essais. Captures desktop/mobile inspectées. Pas d’envoi d’e-mail ni de tirage réel déclenché.
