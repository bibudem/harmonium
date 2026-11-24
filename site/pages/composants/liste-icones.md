---
titre: "Liste à icônes"
description: "Une liste sans puces de renseignements courts, chacun précédé d’une icône décorative : conditions de prêt, équipements d’une salle, légende des icônes du site."
fichiers: "`harmonium/astro/ListeIcones.astro` · `bib-liste-icones.min.css`"
ressources: "composants/liste-icones"
---

## Aperçu {#apercu}

::exemple[composants/liste-icones/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<ul class="bib-liste-icones">
  <li class="bib-liste-icones__element">
    <span class="bib-liste-icones__icone" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor">…</svg></span>
    <span class="bib-liste-icones__texte">Durée du prêt : 3 jours</span>
  </li>
</ul>
```

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-liste-icones.min.css">
```

## Avec Astro {#astro}

```
---
import ListeIcones from 'harmonium/astro/ListeIcones.astro'
import ElementListeIcones from 'harmonium/astro/ElementListeIcones.astro'
---
<ListeIcones>
  <ElementListeIcones Icone={BooksIcon}>Nombre maximum de documents : 100</ElementListeIcones>
  <ElementListeIcones><svg slot="icone" …></svg>Icône sur mesure</ElementListeIcones>
</ListeIcones>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `Icone` | (`ElementListeIcones`) Un composant d’icône, rendu avec `size` et `color`. Une icône déjà prête (SVG, planche d’icônes du site) passe dans le slot `icone`, qui l’emporte. |  |
| `taille` | (`ElementListeIcones`) Taille de l’icône en pixels. | `32` |
| `couleur` | (`ElementListeIcones`) Couleur CSS de l’icône, de préférence un jeton. | `currentColor` |

L’icône vient toujours du site : Harmonium n’impose aucune bibliothèque d’icônes.

## Personnaliser {#variables}

{{habillage-liste-icones}}

### Ancien nom {#ancien-nom}

Jusqu’à la version 1.1, ce composant s’appelait « Modalités » : `Modalites.astro`, `Modalite.astro`, classes `bib-modalites` et `bib-modalite`, feuille `bib-modalites.min.css`. Ces noms fonctionnent encore, mais ils sont obsolètes et seront retirés en 2.0.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Des renseignements brefs et parallèles, d’une ligne chacun : durée de prêt, nombre de documents, frais, équipements.
-   La légende des icônes de l’interface (menu, recherche), où l’icône est justement le sujet.

### À éviter

-   **Pour des explications de plusieurs phrases** : des paragraphes sous des titres, ou un [accordéon](@@/composants/accordeons.html).
-   **Pour des liens vers d’autres pages** : une liste de liens ou des [cartes à icône](@@/composants/carte-icone.html).
-   **Pour comparer des valeurs entre catégories** (prêt selon le statut) : un [tableau](@@/composants/tableau.html).
-   **Pour mettre un chiffre en vedette** : les [chiffres clés](@@/composants/chiffres.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Liste sémantique** : `<ul>` et `<li>` ; les lecteurs d’écran annoncent « liste, 4 éléments » (WCAG 1.3.1).
-   **Icône décorative** : `aria-hidden="true"` et `focusable="false"` ; seul le texte est lu, l’icône n’est pas une information à part (1.1.1).
-   **Texte agrandi et 320 px** : le texte passe à la ligne et coupe au besoin un long mot (adresse, URL) ; rien ne déborde à 200 % (1.4.4, 1.4.10).
-   **Couleurs forcées** : l’icône suit la couleur du texte par défaut (`currentColor`) et reste visible.

### Ce que l’intégrateur doit faire

-   Écrire chaque ligne pour qu’elle se suffise sans l’icône : « Durée du prêt : 3 jours », pas « 3 jours » seul.
-   Choisir une icône dont le sens rejoint le texte, et garder la même icône pour la même idée d’une page à l’autre.
-   Garder une couleur d’icône d’au moins 3:1 sur le fond si l’icône aide à repérer l’information (1.4.11).
-   Introduire la liste par un titre ou une phrase qui dit de quoi il s’agit.
