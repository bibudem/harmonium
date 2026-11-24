---
titre: "Navigation latérale"
description: "La navigation de la section courante : une liste imbriquée de liens, où la page courante est marquée et la branche qui la contient ouverte. En colonne de gauche sur grand écran, en volet « Dans cette section » sur écran étroit."
fichiers: "`harmonium/astro/NavigationSecondaire.astro` · `bib-navigation-secondaire.min.css`"
---

Pour les titres du contenu et le repère « Sur cette page », voir le composant [Table des matières](@@/composants/table-matieres.html).

## Aperçu {#apercu}

::exemple[composants/navigation-secondaire/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<nav class="bib-navigation-secondaire" aria-labelledby="titre-nav">
  <a id="titre-nav" class="bib-navigation-secondaire__titre" href="/etudes/">Études</a>
  <ul>
    <li><a href="/etudes/chercher/" aria-current="page">Apprendre à chercher</a>
      <ul><li><a href="…">Citer ses sources</a></li></ul>
    </li>
    <li><a href="https://…">Autre site<span class="bib-navigation-secondaire__externe" aria-hidden="true"></span></a></li>
  </ul>
</nav>

<!-- Variante repliable : le même <nav> dans un <details> -->
<details class="bib-navigation-secondaire-repliable">
  <summary><span>Dans cette section</span><span class="bib-navigation-secondaire__chevron" aria-hidden="true"></span></summary>
  <nav class="bib-navigation-secondaire bib-navigation-secondaire--dans-repliable" aria-labelledby="titre-nav-2">…</nav>
</details>
```

Habillage : `bib-navigation-secondaire--sommaire` : un sommaire « Sur cette page », où la section en cours de lecture porte `aria-current="true"`, en gras, avec le trait épais et un fond pâle. Un lien vers un autre site porte la flèche oblique `bib-navigation-secondaire__externe`.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-navigation-secondaire.min.css">
```

## Avec Astro {#astro}

```
---
import NavigationSecondaire from 'harmonium/astro/NavigationSecondaire.astro'
---
<NavigationSecondaire racine={arbre} courante={Astro.url.pathname} />
<NavigationSecondaire racine={arbre} courante={Astro.url.pathname} variante="repliable" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| racine | L’arbre de la section : `{ titre, url?, lang?, sommaire?, enfants: [{ titre, url, lang?, enfants }] }`. Le site le calcule d’après son contenu. Sans `url`, le titre n’est pas un lien. |  |
| courante | Adresse de la page courante (marquée `aria-current="page"`). |  |
| variante | `colonne` ou `repliable`. | `colonne` |
| resume | Libellé du volet repliable. | « Dans cette section » |
| lang | Langue de la navigation : la remet en français sur une page étrangère. |  |
| idTitre | Id du titre, à donner quand la page porte plusieurs navigations de même variante. |  |

Le composant reçoit l’arbre de navigation du site (`navigationDeSection` dépend du contenu du site) : le site le passe en propriété.

## Personnaliser {#variables}

{{habillage-navigation-secondaire}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Les pages de niveau 2 et plus d’une section (la colonne de gauche dès 1200 px, le volet en dessous).
-   Un groupe de pages sans section commune (« À propos du site ») : racine sans lien.
-   Le sommaire d’une longue page autonome, à partir de quelques intertitres.

### À éviter

-   **Pour situer la page** dans tout le site : c’est le rôle du [fil d’Ariane](@@/composants/fil-ariane.html).
-   **Pour une section d’une seule page** : la liste n’aurait qu’un lien.
-   **Pour des liens d’action** (réserver, s’inscrire) : un [bouton](@@/composants/bouton.html) ou des [cartes](@@/composants/carte-icone.html) dans le contenu.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Repère nommé par son titre** : `<nav aria-labelledby>` pointe vers le titre de la section (« Études ») ; un lecteur d’écran annonce « Études, navigation » (WCAG 1.3.1, 2.4.6). Quand le titre serait identique au libellé du volet (« Sur cette page »), il n’est pas répété : le libellé du `<summary>` nomme la navigation.
-   **Jamais deux repères du même nom** : une seule variante est affichée à une largeur donnée ; l’autre est en `display: none`, retirée de l’arbre d’accessibilité.
-   **Page courante** : `aria-current="page"` (ou `"true"` pour la section lue du sommaire), lu « page actuelle ». À l’écran, gras et trait de 4 px en plus de la couleur (1.4.1).
-   **Listes imbriquées** : la hiérarchie des pages est celle des listes ; seule la branche de la page courante est ouverte, la liste reste courte.
-   **Volet natif** : `<details>` et `<summary>`, annoncé « réduit » ou « développé », ouvert avec Entrée ou Espace (2.1.1). Cible de 48 px de haut (2.5.8). Le chevron est décoratif (`aria-hidden`).
-   **Lien externe** : flèche oblique décorative ; le libellé du lien dit où il mène (« Confidentialité (site de l’UdeM) »).
-   **Reflow** : les libellés longs se coupent (`overflow-wrap: anywhere`) ; rien ne déborde à 320 px ni avec le texte à 200 % (1.4.4, 1.4.10).
-   **Mouvement** : seule la rotation du chevron est animée ; coupée si la personne réduit les animations (règle globale du site).

### Ce que l’intégrateur doit faire

-   Donner aux pages des titres courts et distincts : ils deviennent les libellés de la liste.
-   Écrire le libellé d’un lien externe pour qu’il dise sa destination (la flèche n’est pas lue).
-   Donner un `idTitre` distinct quand une page affiche deux navigations de même variante (navigation de section et sommaire), sinon deux éléments auraient le même id.
-   Placer la colonne dans un `<aside>` nommé, dans la colonne de contenu.
