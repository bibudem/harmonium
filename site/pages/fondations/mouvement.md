---
titre: "Mouvement"
description: "Les durées et les courbes de Material 3. Une animation sert à comprendre un changement (ce qui apparaît, d’où ça vient), jamais à décorer ; elle est courte, et elle s’efface quand la personne demande moins de mouvement."
---

## Durées {#durees}

{{durees}}

## Courbes {#courbes}

{{courbes}}

Standard : la plupart des transitions. Décélérée : ce qui entre (part vite, arrive doucement). Accélérée : ce qui sort.

## Règles d’usage dans les sites {#regles}

-   **Moins de mouvement** : sous `@media (prefers-reduced-motion: reduce)`, couper les déplacements et les agrandissements ; un fondu court reste permis. Les aperçus de cette page le respectent.
-   Animer `transform` et `opacity` de préférence (pas de recalcul de la mise en page).
-   Rien qui clignote ni ne bouge seul plus de 5 secondes sans moyen de l’arrêter (WCAG 2.2.2).
-   Une ouverture déclenchée par une ancre (lien vers un volet fermé) se fait sans animation : la cible doit être en place tout de suite.
