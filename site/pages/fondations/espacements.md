---
titre-court: "Espacements"
titre: "Espacements et mise en page"
description: "Une échelle de base (pas de 0,5 rem, avec des demi-pas), et surtout des rôles : la même relation entre deux éléments a toujours le même écart, du plus petit au plus grand : élément < titre < bloc < blocs < bande."
---

## Échelle de base {#echelle}

{{echelle-espacements}}

## Rôles {#roles}

Les rôles règlent les écarts entre éléments ; les pas de l’échelle, les marges internes d’un composant. Aucune valeur en dur : un test le vérifie, sauf une place réservée à un autre élément, marquée « hors échelle ».

L’ordre élément < titre < bloc < blocs < bande vaut à toutes les largeurs.

{{roles-espacements}}

## Mise en page {#mise-en-page}

{{largeurs-contenu}}

### Points de rupture

| Seuil | Usage |
| --- | --- |
| `600px` | Téléphone / tablette : cartes en colonne, carrousels sur téléphone ; gouttière de 1,25 rem. |
| `900px` | Racine à 18 px, gouttière de 2,5 rem, titres au rapport 1,25, espacements de bande agrandis, pied de page en colonnes. |
| `1200px` | Barre de navigation de bureau, navigation secondaire en colonne ; gouttière de 4 rem. |
| `1536px` | Largeur maximale du contenu. |

Écriture commune : `@media (width >= 900px)`.

## Dimensions {#dimensions}

{{dimensions-composants}}

### Hauteur des commandes {#commandes}

Quatre niveaux, du plus discret au plus en vue. Choisir d’après le rôle de la commande, jamais une valeur en dur.

| Jeton | Hauteur | Pour |
| --- | --- | --- |
| `--taille-cible-min` | 24 px | Le minimum pour tout ce qui se clique (WCAG 2.5.8) : pastille, lien d’un fil d’Ariane. |
| `--hauteur-controle-compacte` | 2,25 rem | Commande secondaire dans une rangée serrée : onglets compacts, liens d’un pied de page. |
| `--hauteur-controle` | 44 px au moins | Commande courante : bouton, champ, filtre. C’est la cible des commandes principales sur téléphone. |
| `--hauteur-controle-grande` | 3,5 rem | Commande mise en avant : bouton grand, barre de recherche, poignée des liens rapides. |
