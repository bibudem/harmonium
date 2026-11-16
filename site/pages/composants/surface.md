---
titre: "Surface"
description: "Un fond « papier » posé sur la page : fond et texte du thème, coins de 4 px, ombre légère ou contour. Une boîte neutre, qui ne dit rien de son contenu et ne pose aucune marge intérieure."
fichiers: "`harmonium/astro/Surface.astro` · `bib-surface.min.css`"
ressources: "composants/surface"
---

## Aperçu {#apercu}

::exemple[composants/surface/01.html]

## Utilisation {#utilisation}

### En HTML

```
<section class="bib-surface bib-surface--contour" aria-labelledby="titre-salles">
  <h3 id="titre-salles">Salles de travail</h3>
  …
</section>
```

### Avec Astro

```
---
import Surface from 'harmonium/astro/Surface.astro'
---
<Surface component="section" variant="outlined" aria-labelledby="titre-salles">
  <h3 id="titre-salles">Salles de travail</h3>
  …
</Surface>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `variant` | `elevation` (ombre) ou `outlined` (contour de 1 px). | `elevation` |
| `elevation` | `0` retire l’ombre ; toute autre valeur donne l’ombre légère du thème (`--ombre-1`). | `1` |
| `square` | Coins droits. | non |
| `component` | Balise rendue : `div`, `section`, `article`, `aside`, `li`, `nav`, `header` ou `footer`. | `div` |

En HTML, les modificateurs sont `--contour`, `--sans-ombre` et `--carre`.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Détacher un bloc de la page sans lui donner de sens particulier : conteneur de tableau, encart de formulaire.

### À éviter

-   **Pour un lien vers une autre page** : une [carte à icône](@@/composants/carte-icone.html) ou une [carte à image](@@/composants/carte-image.html) gère déjà le lien, le survol et le focus.
-   **Pour un message** (information, mise en garde) : une [alerte](@@/composants/alertes.html), dont le type est annoncé.
-   **Pour un tableau** : le [tableau](@@/composants/tableau.html) a déjà sa surface et sa zone défilante.
-   **Pour une grande zone de couleur** : une [section](@@/composants/section.html) avec fond.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Neutre** : un `<div>` par défaut, sans rôle ni nom ; rien n’est annoncé en trop.
-   **Couleurs forcées** : l’ombre disparaît en mode contraste élevé ; une bordure `CanvasText` la remplace et la boîte reste visible.
-   **Contraste** : texte `--couleur-texte` sur `--couleur-fond`, bien au-delà de 4,5:1 (WCAG 1.4.3).

### Ce que l’auteur doit faire

-   Choisir la balise qui correspond au contenu (`component`) ; une `<section>` doit alors avoir un titre et un nom (`aria-labelledby`) (1.3.1).
-   Ne pas faire de la surface un lien ou un bouton en y ajoutant un gestionnaire de clic : utiliser une carte.
-   Ne pas signaler une information par l’ombre ou le contour seul.
