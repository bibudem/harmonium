---
titre: "Grille de logos"
description: "Une grille de logos centrés, chacun avec ou sans lien : partenaires, bailleurs de fonds, services des bibliothèques."
fichiers: "`harmonium/astro/Logos.astro` · `harmonium/astro/Logo.astro` · `bib-logos.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/grille-logos/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<div class="bib-logos">
  <div class="bib-logo"><img src="partenaire.png" alt="Partenaire" width="240" height="80"></div>
  <div class="bib-logo"><a class="bib-lien" href="https://…"><img src="autre.png" alt="Autre organisme" width="240" height="80"></a></div>
</div>
```

Un logo par rangée, deux dès 600 px, quatre dès 1200 px ; chaque logo est centré dans sa case et mesure 200 px de haut au plus. Donnez à chaque image ses attributs `width` et `height` : un SVG sans dimensions n’a pas de taille propre.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-logos.min.css">
```

## Avec Astro {#astro}

```
---
import Logos from 'harmonium/astro/Logos.astro'
import Logo from 'harmonium/astro/Logo.astro'
import partenaire from '../assets/partenaire.png'
---
<Logos>
  <Logo image={partenaire} alt="Partenaire" />
  <Logo image="/logos/autre.svg" alt="Autre organisme" href="https://…" />
</Logos>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| image | (`Logo`) Image importée (formats AVIF et WebP d’astro:assets, 200 px de haut au plus ; un SVG passe tel quel) ou adresse. Obligatoire. |  |
| alt | (`Logo`) Nom de l’organisme ; pour un logo lié, il nomme la destination et ne peut pas être vide. Obligatoire. |  |
| href | (`Logo`) Adresse du lien, rendu par le composant [Lien](@@/composants/lien.html). |  |
| class | (`Logos`, `Logo`) Classes ajoutées à la grille ou à la case du logo. |  |

## Personnaliser {#variables}

{{habillage-logos}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Les partenaires d’un projet ou d’un service.
-   Les bailleurs de fonds et les organismes qui soutiennent une collection, une exposition, une recherche.
-   Les logos des services des bibliothèques, côte à côte, chacun lié à son site.

### À éviter

-   **Pour orienter vers des pages avec une description** : la [liste de liens](@@/composants/liste-liens.html).
-   **Pour des éléments qui se reconnaissent à une icône** : la [liste à icônes](@@/composants/liste-icones.html).
-   **Pour la signature des bibliothèques en tête ou en pied de page** : l’[en-tête](@@/composants/entete.html), le [pied de page](@@/composants/pied-de-page.html) ou le [sceau](@@/composants/sceau.html).
-   **Pour une longue liste de noms** : une [liste simple](@@/composants/liste-simple.html) de noms en texte se lit et se cherche mieux.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Texte de remplacement exigé pour un logo lié** : la construction échoue si `alt` est vide, et le lien est nommé par le nom de l’organisme (WCAG 1.1.1, 2.4.4).
-   **Liens ordinaires** : le composant [Lien](@@/composants/lien.html) annonce en texte masqué un PDF ou un nouvel onglet ; un seul arrêt de tabulation par logo.
-   **Zone de lien élargie** : le lien occupe toute la largeur de sa case, pour une grande cible (2.5.8).
-   **Texte agrandi et 320 px** : la grille passe à un logo par rangée et l’image ne dépasse jamais sa case (1.4.10).

### Ce que l’intégrateur doit faire

-   Introduire la grille par un titre (« Nos partenaires ») : le composant n’en produit pas, et la grille n’est pas annoncée comme une liste (1.3.1, 2.4.6).
-   Écrire dans `alt` le nom de l’organisme, pas « logo de… » ; pour un logo lié, le nom de la destination (2.4.4).
-   Ne pas mettre de texte important dans l’image du logo seulement (slogan, date) ; le reprendre dans la page (1.4.5).
-   Choisir une version du logo lisible sur le fond de la section : au moins 3:1 pour le logo sur son fond (1.4.11).
