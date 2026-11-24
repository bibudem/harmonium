---
titre: "Liste illustrée"
description: "Une liste où chaque élément a un visuel, un nom en gras et une description, avec des sous-niveaux possibles : légende des icônes d’un site, gestes d’une interface."
fichiers: "`harmonium/astro/LegendeIcones.astro` · `harmonium/astro/ElementLegende.astro` · `bib-legende-icones.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/liste-illustree/01.html]

 

::exemple[composants/liste-illustree/02.html]

## Étape 1 : ajouter le HTML {#html}

Le composant s’appelle encore `LegendeIcones` dans le code (classes `bib-legende-icones`) ; seul le nom de la fiche change pour l’instant.

```
<div class="bib-legende-icones">
  <ul class="bib-legende-icones__liste">
    <li>
      <span class="bib-legende-icones__visuel"><svg width="40" height="40" aria-hidden="true" focusable="false">…</svg></span>
      <span class="bib-legende-icones__texte"><strong>Un doigt</strong> Pour manipuler le modèle affiché.</span>
      <ul class="bib-legende-icones__sous">
        <li>
          <span class="bib-legende-icones__visuel"><img src="glisser.webp" alt=""></span>
          <span class="bib-legende-icones__texte"><strong>Glisser</strong> Faire tourner le modèle</span>
        </li>
      </ul>
    </li>
  </ul>
</div>
```

Les éléments simples vont deux par rangée (dès 2 × 17 rem), le visuel au-dessus du texte. Un élément qui a des sous-niveaux (`bib-legende-icones__sous`) prend toute la largeur, le visuel à côté du texte, et ses sous-niveaux s’affichent dessous en tuiles plus petites ; un troisième niveau est marqué d’un filet à gauche. Le nom, en `<strong>` au début du texte, va sur sa propre ligne. Le visuel est une icône SVG ou une capture (largeur fixe, hauteur selon l’image).

`bib-legende-icones--panneau` : un seul cadre, une rangée par élément séparée par un filet, pour une longue série d’éléments simples (les icônes d’un menu).

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-legende-icones.min.css">
```

## Avec Astro {#astro}

```
---
import LegendeIcones from 'harmonium/astro/LegendeIcones.astro'
import ElementLegende from 'harmonium/astro/ElementLegende.astro'
---
<LegendeIcones>
  <ElementLegende nom="Un doigt" description="Pour manipuler le modèle affiché.">
    <svg slot="visuel" …>…</svg>
    <ElementLegende nom="Glisser" description="Faire tourner le modèle" image={glisser} />
  </ElementLegende>
  <ElementLegende nom="Menu" description="Ouvre le menu du site."><svg slot="visuel" …>…</svg></ElementLegende>
</LegendeIcones>

<LegendeIcones forme="panneau">…</LegendeIcones>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| forme | (`LegendeIcones`) `cartes` : une carte par élément ; `panneau` : un seul cadre, une rangée par élément. | `cartes` |
| class, style | (`LegendeIcones`) Classes et styles ajoutés à la racine. |  |
| nom | (`ElementLegende`) Nom affiché en gras au début du texte. Obligatoire. |  |
| description | (`ElementLegende`) Texte qui suit le nom. |  |
| image | (`ElementLegende`) Visuel : une image importée (formats et tailles d’astro:assets) ou une adresse. |  |
| alt | (`ElementLegende`) Texte de remplacement de l’image ; vide, car le nom la décrit déjà. | vide |
| slot | `visuel` : une icône SVG, utilisée sans la propriété image ; `description` : une description riche (liens, mise en forme), à la place de la propriété. Les enfants, d’autres ElementLegende, forment les sous-niveaux. |  |

## Personnaliser {#variables}

{{habillage-legende-icones}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   La légende des icônes d’un site ou d’une application : ce que fait chaque bouton du menu, de la barre d’outils.
-   Les gestes d’une interface, regroupés par famille : un logiciel d’anatomie (un doigt, deux doigts, puis chaque geste).
-   Une série de termes courts à définir, chacun reconnaissable à son visuel.

### À éviter

-   **Pour des renseignements d’une ligne sans nom à définir** (durée de prêt, frais) : la [liste à icônes](@@/composants/liste-icones.html).
-   **Pour orienter vers d’autres pages** : la [liste de liens](@@/composants/liste-liens.html) ; les éléments d’une liste illustrée ne sont pas des liens.
-   **Pour une simple énumération sans visuel** : une [liste simple](@@/composants/liste-simple.html).
-   **Pour comparer des valeurs entre catégories** : un [tableau](@@/composants/tableau.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Liste réelle, imbriquée** (`<ul>`, `<li>`) sans puces : le lecteur d’écran annonce « liste, 4 éléments », puis la liste des sous-niveaux dans chaque élément (WCAG 1.3.1).
-   **Nom en `<strong>`** au début du texte, suivi de la description dans le même élément : le nom et sa définition sont lus ensemble.
-   **Visuel décoratif** : l’image reçoit `alt=""` par défaut ; le nom, en texte, porte l’information (1.1.1).
-   **Texte agrandi et 320 px** : les cartes passent sur une colonne et le texte coupe au besoin un long mot ; rien ne déborde à 200 % (1.4.4, 1.4.10).
-   **Couleurs forcées** : les tuiles et les visuels reçoivent un contour, pour rester distincts sans fond.

### Ce que l’intégrateur doit faire

-   Introduire la liste par un titre (« Gestes », « Icônes du site ») : le composant n’en produit pas (1.3.1, 2.4.6).
-   Marquer l’icône SVG du slot `visuel` `aria-hidden="true"` et `focusable="false"` : le composant ne l’ajoute pas.
-   Écrire un nom qui se suffit sans le visuel (« Glisser », « Pincer ») ; le visuel illustre, il n’informe pas seul (1.1.1).
-   Si une capture contient une information absente du texte, la décrire dans `alt` ou, mieux, dans la description.
-   Garder des icônes d’au moins 3:1 sur la tuile si elles servent à reconnaître l’élément à l’écran (1.4.11).
