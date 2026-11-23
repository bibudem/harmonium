---
titre: "Fil d’Ariane"
description: "Le chemin de la page dans l’arborescence, de l’accueil à la page courante, en haut de la colonne de contenu. Il dit où l’on est et permet de remonter d’un ou de plusieurs niveaux d’un clic."
fichiers: "`harmonium/astro/FilAriane.astro` · `bib-fil-ariane.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/fil-ariane/01.html]

 

::exemple[composants/fil-ariane/02.html]

## Étape 1 : ajouter le HTML {#html}

```
<nav class="bib-fil-ariane" aria-label="Fil d’Ariane">
  <ol>
    <li><a href="/">Accueil</a></li>
    <li><span>Groupe sans page</span></li>
    <li><a href="/etudes/" lang="en">Studies</a></li>
    <li><span aria-current="page">Page courante</span></li>
  </ol>
</nav>
```

Habillage : `--bib-fil-ariane-lien`, `--bib-fil-ariane-lien-survol` et `--bib-fil-ariane-transition` : couleur des liens (celle des liens du thème par défaut), au survol, et transition (aucune par défaut). Exemple d’habillage dans l’aperçu.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-fil-ariane.min.css">
```

## Avec Astro {#astro}

```
---
import FilAriane from 'harmonium/astro/FilAriane.astro'
---
<FilAriane
  maillons={[
    { url: '/', libelle: 'Accueil' },
    { libelle: 'Groupe sans page' },
    { url: '/etudes/', libelle: 'Studies', lang: 'en' },
    { libelle: 'Page courante' },
  ]}
/>
```

| Propriété | Rôle |
| --- | --- |
| `maillons` | Les maillons, dans l’ordre ; le dernier est la page courante. Un maillon sans `url` est du texte, sans lien. `lang` d’un maillon se pose sur son libellé s’il est dans une autre langue. |
| `lang` | Langue du fil lui-même : le remet en français sur une page écrite dans une autre langue. |

C’est le site qui calcule les maillons (cela dépend de son contenu).

## Personnaliser {#variables}

{{habillage-fil-ariane}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Toute page de niveau 2 et plus (sous une section), et les pages autonomes d’un groupe (« À propos du site ») : le gabarit de page le place avant le contenu.

### À éviter

-   **Sur l’accueil et les pages de premier niveau** : le fil n’aurait qu’un ou deux maillons et répéterait le menu principal.
-   **Pour naviguer entre pages sœurs** : c’est le rôle de la [navigation secondaire](@@/composants/navigation-secondaire.html).
-   **Pour retracer l’historique de la visite** : le fil montre la place de la page dans le site, pas le parcours de la personne (le bouton Précédent s’en charge).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Repère nommé** : `<nav aria-label="Fil d’Ariane">`. Les lecteurs d’écran le listent parmi les repères de navigation et l’annoncent par son nom (WCAG 1.3.1, 2.4.1).
-   **Liste ordonnée** : le nombre de maillons est annoncé (« liste, 4 éléments ») et l’ordre a un sens (1.3.1).
-   **Page courante** : `aria-current="page"` sur un `<span>`, sans lien. Un lecteur d’écran lit « page actuelle » ; à l’écran, le gras la distingue, pas la seule couleur (1.4.1).
-   **Séparateurs muets** : pseudo-élément sans texte, ignoré par les lecteurs d’écran.
-   **Cibles** : chaque lien fait au moins 24 px de haut ; le texte seul en faisait 17 (2.5.8).
-   **Reflow** : la liste passe à la ligne (`flex-wrap`) ; à 320 px ou avec le texte à 200 %, rien ne déborde (1.4.4, 1.4.10).
-   **Langue** : le titre d’une page dans une autre langue porte son `lang`, et `lang` sur le `<nav>` remet le reste en français (3.1.2).
-   **Contraste** : liens en `--couleur-lien` et page courante en `--couleur-texte` sur le fond de page (1.4.3). En couleurs forcées, les liens prennent la couleur système des liens.

### Ce que l’intégrateur doit faire

-   Donner à chaque page un titre court : il devient le libellé de son maillon.
-   Garder une arborescence d’adresses qui reflète les sections : le fil suit l’adresse, pas le menu.
-   Ne pas ajouter un second fil d’Ariane sur la même page : deux repères du même nom se confondent.

::exemple[composants/fil-ariane/04.html]
