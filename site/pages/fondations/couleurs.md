---
titre: "Couleurs"
description: "La palette officielle de l’UdeM, les nuances qu’en tirent les sites, et des rôles qui disent à quoi sert chaque couleur. Les composants emploient les rôles (`--couleur-texte`, `--couleur-fond-fort`…), jamais une valeur en dur : une décision commune se corrige ainsi à la source."
---

## Palette officielle de l’UdeM {#officielle}

Les couleurs de la marque de l’Université de Montréal, telles que les publie le [guide de marque](https://marque.umontreal.ca/) (section « Couleurs » et nuancier téléchargeable, consultés le {{date-guide-marque}}). Elles priment sur tout le reste : une couleur officielle ne se modifie pas.

### Couleurs dominantes

::exemple[fondations/couleurs/01.html]

### Couleurs secondaires (accents)

::exemple[fondations/couleurs/02.html]

### Fond et neutres

::exemple[fondations/couleurs/03.html]

### Règles du guide de marque

{{regles-marque}}

## Toutes les couleurs, par teinte {#teintes}

La palette des jetons regroupe les couleurs officielles et les nuances que les sites ont ajoutées pour leurs besoins (survols, fonds pâles, texte assez contrasté). L’étiquette dit d’où vient chacune :

{{statuts-couleurs}} {{nuances-couleurs}}

## Rôles {#roles}

Ce sont eux qu’on utilise. Harmonium fournit un thème clair unique ; les bandes foncées adaptent localement le texte et les commandes.

{{roles-couleurs}}

## Alertes {#alertes}

Fonds et icônes des [alertes](@@/composants/alertes.html).

{{roles-alertes}}

## Règles d’usage dans les sites {#regles}

-   **Un rôle plutôt qu’une couleur** : `color: var(--couleur-texte)`, pas `#0b113a` ni `var(--bleu-fonce)`.
-   **Rouge orangé** : `--rouge-orange` pour les icônes et les éléments graphiques ; `--rouge-orange-texte` pour du texte (le premier n’atteint pas 4,5:1).
-   **Liens** : `--couleur-lien` et toujours soulignés dans le texte (le bleu seul ne se distingue pas assez du texte, WCAG 1.4.1).
-   **Sur un fond foncé ou coloré** (bouton plein, bande bleue) : `--couleur-sur-fonce`.
-   **Mode contraste élevé** : prévoir une bordure (`border: 1px solid transparent` devient visible) pour tout ce qui ne se distingue que par son fond.
