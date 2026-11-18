---
titre: "Séparateur"
description: "Un filet fin, de la couleur des bordures, qui sépare deux parties d’un contenu. Il remplace le `<hr>` du navigateur, gris, en relief et aux marges variables."
fichiers: "`harmonium/astro/Separateur.astro` · `bib-separateur.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/separateur/01.html]

## Utilisation {#utilisation}

### En HTML

```
<hr class="bib-separateur">

<div style="display: flex">
  <span>Prêts</span>
  <hr class="bib-separateur bib-separateur--vertical" aria-orientation="vertical">
  <span>Réservations</span>
</div>
```

Habillage : `--bib-separateur-couleur` (couleur des bordures par défaut).

### Avec Astro

```
---
import Separateur from 'harmonium/astro/Separateur.astro'
---
<Separateur />
<Separateur orientation="vertical" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `orientation` | `horizontal` ou `vertical` ; vertical pose `aria-orientation` et s’étire sur la hauteur d’une rangée flex. | `horizontal` |

### Variables d’habillage {#variables}

{{habillage-separateur}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Marquer un changement de sujet à l’intérieur d’une section, quand un titre serait de trop.
-   Séparer des éléments en ligne dans une rangée flex (`orientation="vertical"`, `dansRangee`).

### À éviter

-   **Pour structurer une page** : des titres (`h2`, `h3`) se naviguent, un filet non.
-   **Avant ou après chaque titre** : la marge et le titre suffisent ; les filets répétés hachent la lecture.
-   **Pour séparer de grandes zones** : une [section](@@/composants/section.html) avec fond fait mieux la coupure.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique** : `<hr>` a le rôle implicite `separator` ; certains lecteurs d’écran annoncent « séparateur » et marquent la coupure (WCAG 1.3.1).
-   **Orientation** : un séparateur vertical reçoit `aria-orientation="vertical"` ; l’horizontal n’en a pas besoin, c’est la valeur par défaut.
-   **Non focalisable** : il n’est pas un arrêt de tabulation.
-   **Couleurs forcées** : le filet passe en `CanvasText` pour rester visible.

### Ce que l’intégrateur doit faire

-   Ne pas compter sur le filet seul pour dire qu’on change de sujet : un lecteur d’écran ne l’annonce pas toujours ; un titre ou une phrase d’introduction reste plus sûr.
-   Le filet `--couleur-bordure` est décoratif et pâle (moins de 3:1) : rien d’important ne doit en dépendre (1.4.11).
