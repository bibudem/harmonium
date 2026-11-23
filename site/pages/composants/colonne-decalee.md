---
titre: "Conteneur"
description: "Un bloc centré, avec des marges égales à gauche et à droite mesurées en colonnes d’une grille de 12. Il resserre un contenu sans changer sa structure, à toutes les largeurs d’écran."
fichiers: "`harmonium/astro/ColonneDecalee.astro` · `bib-colonne-decalee.min.css`"
ressources: "composants/colonne-decalee"
---

## Aperçu {#apercu}

::exemple[composants/colonne-decalee/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<div class="bib-colonne-decalee" style="--bib-decalage: 0.5">
  <div class="bib-colonne-decalee__colonne">
    …
  </div>
</div>
```

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-colonne-decalee.min.css">
```

## Avec Astro {#astro}

```
---
import ColonneDecalee from 'harmonium/astro/ColonneDecalee.astro'
---
<ColonneDecalee decalage={0.5}>
  …
</ColonneDecalee>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `decalage` | Colonnes laissées de chaque côté, de 0 à 6 (demi-valeurs permises). En HTML : la variable `--bib-decalage`. | `0` |


## Personnaliser {#variables}

{{habillage-colonne-decalee}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Resserrer un bloc pleine largeur (accordéons, liste de liens) pour qu’il s’aligne avec les colonnes voisines.

### À éviter

-   **Pour limiter la longueur des lignes de texte** : la mesure du texte (`--mesure-texte`) le fait déjà sur les paragraphes.
-   **Pour placer plusieurs blocs côte à côte** : utiliser une [grille](@@/fondations/espacements.html).
-   **Avec un grand décalage sur un contenu dense** : sur téléphone, la même proportion s’applique et la colonne devient très étroite (à `decalage={3}`, la moitié de l’écran).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Invisible pour les technologies d’assistance** : deux `<div>` sans rôle ; l’ordre de lecture est celui du code.
-   **Pas de saut de mise en page** au chargement : la largeur est connue avant tout script, le texte ne bouge pas sous les yeux ni sous le pointeur.
-   **Pas de débordement** : largeur en pourcentage et `min-width: 0` ; le contenu reste dans la colonne à 320 px et à 200 % de texte (WCAG 1.4.10).

### Ce que l’intégrateur doit faire

-   Choisir un petit décalage (0,5 à 1) : la proportion ne change pas sur téléphone, un grand décalage y écrase le contenu.
-   Vérifier le rendu à 320 px de large avec le texte agrandi.
