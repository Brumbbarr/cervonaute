# Cervonaute v3.9 — composition et grandes résolutions

Demande : conserver les couleurs de la V2, revoir la disposition trop uniforme en panneaux arrondis et utiliser davantage l’espace d’un écran 27 pouces. La limite précédente était `max-width:1160px`, avec centrage et marges automatiques.

Les pages principales occupent désormais la largeur disponible. À partir de 1100 px, navigation latérale de 200 px, marges intérieures fluides et espaces de travail distincts : paysage d’accueil immersif avec texte intégré, objectifs et mission compacts sur le côté, collection et professeur en second niveau ; exploration avec départs de proportions différentes et défis dans une colonne distincte ; étude en sommaire ouvert avec introduction latérale ; laboratoire avec filtres de famille à gauche. Bordures et arrondis largement réduits au profit d’espaces ouverts et de séparateurs.

Sous 1100 px, la navigation redevient basse. Sous 750 px, accueil et modes sont réorganisés en colonne ; le catalogue de leçons passe en entrées horizontales. La connexion et les exercices gardent une largeur de lecture bornée, sans transformer leurs formulaires en lignes de 2500 pixels.

Palette, neuf images, cartes, insignes, logo, Supabase et règles conservés. Aucun nouveau mécanisme interactif ni animation graphique. Les actions existantes et les simulations réservées à l’aperçu sont conservées.

Vérification locale Edge : cinq pages principales sur 320, 390, 768, 1024, 1100, 1280, 1440, 1920 et 2560 px ; absence de débordement, largeur disponible utilisée, navigation latérale bornée. Parcours mobile jusqu’à une question, neuf régions/palettes, contrastes du panneau d’objectif, conservation des données de démonstration et aucune requête Supabase. Captures desktop et mobile inspectées. L’authentification par e-mail et l’attribution réelle de récompenses n’ont pas été déclenchées.
