---
titre: Icônes
description: "Phosphor pour l’interface et quelques signes propres aux bibliothèques. Une icône complète le texte ; elle ne remplace pas une information essentielle."
fichiers: "`harmonium/astro/IconeSvg.astro` · `bib-icone-svg.min.css`"
---

## Usage {#usage}

- Employer une même icône pour une même action. Taille courante : 24 px.
- Utiliser `currentColor` pour suivre la couleur du contexte.
- Une commande à icône seule garde un nom accessible : « Rechercher », « Fermer »…
- Préférer un libellé visible aux symboles ambigus. Ne pas compter uniquement sur une infobulle.

::exemple[fondations/icones/01.html]

## Avec Astro {#astro}

```astro
import IconeSvg from 'harmonium/astro/IconeSvg.astro'

<button type="submit">
  <IconeSvg viewBox="0 0 256 256">
    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
  </IconeSvg>
  Rechercher
</button>
```

| Propriété | Usage |
| --- | --- |
| `viewBox` | Coordonnées du dessin SVG, requises. |
| `taille` | Largeur et hauteur ; `1.5rem` par défaut. |
| `nom` | Nom accessible si l’icône porte seule une information. Sans nom, elle est décorative. |

Les icônes Phosphor peuvent aussi être rendues à la construction du site. Éviter d’ajouter une bibliothèque JavaScript au navigateur uniquement pour afficher des tracés SVG.

## Icônes maison {#icones-maison}

Signes propres aux Bibliothèques, en plus des icônes Phosphor. Harmonium en est la seule source : chaque icône existe sous un seul nom, et les sites l’importent plutôt que d’en garder une copie.

::exemple[fondations/icones/maison.html]

### Norme {#norme}

- **Nom du composant** : `Icone` + la forme, en PascalCase (`IconeFlecheDroiteCercle`). Le nom décrit le dessin, pas l’usage : une même flèche sert à plusieurs endroits.
- **Nom en Markdown** : le même nom sans `Icone`, en minuscules et avec des traits d’union (`:icone[fleche-droite-cercle]`).
- **Couleur** : `currentColor` seulement. Les pastilles reprennent la couleur de l’icône à 10 % d’opacité ; aucune couleur n’est inscrite dans le tracé.
- **Taille** : 24 px (`1.5rem`) par défaut, réglable par `taille`.
- **Accessibilité** : décorative par défaut ; `nom` la rend informative (`role="img"`).
- **Ajout** : une nouvelle icône maison n’entre dans Harmonium que si Phosphor n’offre rien d’équivalent. Elle reçoit un composant dans `astro/` et une carte sur cette page.

```astro
import IconeFlecheDroiteCercle from 'harmonium/astro/IconeFlecheDroiteCercle.astro'
import IconeSofia from 'harmonium/astro/IconeSofia.astro'

<IconeFlecheDroiteCercle taille="2rem" />
<IconeSofia nom="Sofia" />
```

## Accessibilité {#accessibilite}

```html
<!-- L’icône complète un libellé : elle reste décorative. -->
<a href="/recherche/">
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">…</svg>
  Rechercher
</a>
```

Une icône informative porte `role="img"` et un nom. Le bouton ou le lien qui la contient conserve son propre libellé. Vérifier le contraste des signes nécessaires à la compréhension, y compris au focus et dans les états actifs.
