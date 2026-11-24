---
titre: "Grille"
description: "Une grille de 12 colonnes pour placer des blocs côte à côte : chaque bloc dit combien de colonnes il occupe, seuil par seuil, et les blocs s’empilent sur téléphone. Sans JavaScript, sur le modèle de la grille de Material Design."
fichiers: "`harmonium/astro/Grille.astro` · `bib-grille.min.css`"
ressources: "composants/grille"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/grille/01.html]

::exemple[composants/grille/02.html]

## Étape 1 : ajouter le HTML {#html}

Un conteneur (`bib-grille bib-grille--conteneur`) porte les écarts ; chaque bloc (`bib-grille`) dit sa largeur pour chaque seuil avec un attribut `data-taille-<seuil>` et la variable qui l’accompagne.

```
<div class="bib-grille bib-grille--conteneur" style="--bib-grille-ecart-lig: var(--espace-2); --bib-grille-ecart-col: var(--espace-2)">
  <div class="bib-grille" data-taille-xs="n" data-taille-md="n" style="--bib-grille-taille-xs: 12; --bib-grille-taille-md: 6">…</div>
  <div class="bib-grille" data-taille-xs="n" data-taille-md="n" style="--bib-grille-taille-xs: 12; --bib-grille-taille-md: 6">…</div>
</div>
```

| Attribut | Valeurs |
| --- | --- |
| `data-taille-<seuil>` | `n` : le nombre de colonnes (0 à 12), dans `--bib-grille-taille-<seuil>` ; `grow` : remplit la place restante ; `auto` : largeur du contenu. |
| `data-decalage-<seuil>` | `n` : colonnes laissées à gauche, dans `--bib-grille-decalage-<seuil>` ; `auto` : pousse le bloc à droite. |

Les seuils sont ceux des composants d’Harmonium ; un seuil plus large l’emporte sur les précédents.

| Seuil | À partir de |
| --- | --- |
| `xs` | 0 px |
| `sm` | 600 px |
| `md` | 900 px |
| `lg` | 1200 px |
| `xl` | 1536 px |

### Série de cartes {#cartes}

Une suite de cartes est une liste : le conteneur est un `<ul>`, chaque carte un `<li>` qui est aussi un bloc de la grille. Retirer les puces et ajouter `role="list"`, qui garde le rôle de liste dans Safari avec VoiceOver.

::exemple[composants/grille/03.html]

```
<ul class="bib-grille bib-grille--conteneur" role="list" style="--bib-grille-ecart-lig: var(--espace-grille); --bib-grille-ecart-col: var(--espace-grille); margin: 0; padding: 0; list-style: none">
  <li class="bib-grille bib-carte-compacte …" data-taille-xs="n" data-taille-sm="n" style="--bib-grille-taille-xs: 12; --bib-grille-taille-sm: 6">…</li>
  <li class="bib-grille bib-carte-compacte …" data-taille-xs="n" data-taille-sm="n" style="--bib-grille-taille-xs: 12; --bib-grille-taille-sm: 6">…</li>
</ul>
```

### Colonnes de texte {#colonnes-texte}

Deux blocs de 6 colonnes, chacun avec son titre, son texte et son bouton : le contenu de chaque colonne reste groupé.

::exemple[composants/grille/04.html]

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-grille.min.css">
```

## Avec Astro {#astro}

```
---
import Grille from 'harmonium/astro/Grille.astro'
---
<Grille conteneur ecart={2}>
  <Grille taille={{ xs: 12, md: 6 }}>…</Grille>
  <Grille taille={{ xs: 12, md: 6 }}>…</Grille>
</Grille>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `conteneur` | Fait du bloc le parent des colonnes. | `false` |
| `taille` | Colonnes occupées : un nombre de 0 à 12, `grow` ou `auto` ; un objet par seuil (`{ xs: 12, md: 6 }`). | — |
| `decalage` | Colonnes laissées à gauche, ou `auto` ; un objet par seuil. | — |
| `ecart` | Écart entre les blocs du conteneur, en pas de l’échelle d’espacement (`3` = `--espace-grille`) ou en valeur CSS. | `0` |
| `ecartRangees`, `ecartColonnes` | Écart vertical ou horizontal seul, à la place d’`ecart`. | — |
| `direction` | Sens des blocs : `row`, `row-reverse`, `column`, `column-reverse`. | `row` |
| `retour` | Passage à la ligne : `wrap`, `nowrap`, `wrap-reverse`. | `wrap` |
| `alignementVertical`, `alignementHorizontal` | Alignement des blocs (valeurs de `align-items` et `justify-content`). | — |
| `ecartDirect` | Écart CSS qui ne change pas le calcul des largeurs. | — |
| `balise` | Balise rendue, par exemple `ul` et `li` pour une série de cartes. | `div` |

Seule la valeur `xs` d’un écart est retenue : l’écart ne change pas d’un seuil à l’autre.

Une série de cartes en Astro :

```
<Grille conteneur balise="ul" role="list" ecart={3} style={{ margin: 0, padding: 0, listStyle: 'none' }}>
  <Grille balise="li" taille={{ xs: 12, sm: 6 }}>…</Grille>
  <Grille balise="li" taille={{ xs: 12, sm: 6 }}>…</Grille>
</Grille>
```

## Personnaliser {#variables}

{{habillage-grille}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Placer deux à quatre blocs de contenu côte à côte : colonnes de texte, formulaire et aide.
-   Ranger une série de cartes de même largeur.
-   Donner des largeurs différentes aux blocs selon l’écran : pleine largeur sur téléphone, moitiés ou tiers en bureau.

### À éviter

-   **Pour resserrer un seul bloc** : utiliser le [conteneur](@@/composants/colonne-decalee.html).
-   **Pour une image et un texte** : la [bande image-texte](@@/composants/bande-image-texte.html) est faite pour cela.
-   **Pour changer l’ordre de lecture** : `direction` inverse l’ordre visuel, pas l’ordre du code ; la lecture au clavier et au lecteur d’écran suit toujours le code.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Invisible pour les technologies d’assistance** : des `<div>` sans rôle (ou la balise choisie) ; l’ordre de lecture et du focus est celui du code.
-   **Empilement sur téléphone** : avec `xs` à 12, les blocs passent l’un sous l’autre ; le contenu reste lisible à 320 px et à 200 % de texte (WCAG 1.4.10).
-   **Pas de débordement** : `min-width: 0` sur chaque bloc ; un mot long passe à la ligne au lieu d’élargir la colonne.

### Ce que l’intégrateur doit faire

-   Donner une taille `xs` (12 pour empiler) : sans elle, sous 600 px, les blocs gardent la largeur de leur contenu.
-   Garder le même ordre visuel et logique : éviter `row-reverse` et `column-reverse` sur un contenu qui se lit dans l’ordre.
-   Pour une série de cartes, utiliser `<ul role="list">` et `<li>`.
