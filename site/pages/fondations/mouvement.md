---
titre: "Mouvement"
description: "Quatre durées et quatre courbes. Une animation sert à comprendre un changement (ce qui apparaît, d’où ça vient), jamais à décorer ; elle est courte, et elle s’efface quand la personne demande moins de mouvement."
---

## Durées {#durees}

{{durees}}

## Courbes {#courbes}

{{courbes}}

Standard : la plupart des transitions. Entrée : ce qui apparaît (part vite, arrive doucement). Sortie : ce qui disparaît. Icône : la métamorphose des icônes de l’en-tête.

## Règles d’usage dans les sites {#regles}

-   **Moins de mouvement** : sous `@media (prefers-reduced-motion: reduce)`, les quatre durées passent à 1 ms et le décalage à 0. Toute transition écrite avec les jetons s’arrête donc d’elle-même ; une durée en dur y échappe. Une animation en boucle ou pilotée par un script doit vérifier la préférence elle-même. Les aperçus de cette page la respectent.
-   Animer `transform` et `opacity` de préférence (pas de recalcul de la mise en page).
-   Rien qui clignote ni ne bouge seul plus de 5 secondes sans moyen de l’arrêter (WCAG 2.2.2).
-   Une ouverture déclenchée par une ancre (lien vers un volet fermé) se fait sans animation : la cible doit être en place tout de suite.
