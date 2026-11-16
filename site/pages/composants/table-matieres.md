---
titre: "Table des matières"
description: "Le repère « Sur cette page » donne accès aux titres du contenu et indique la section en cours de lecture. Il reste visible en colonne sur grand écran et devient un volet repliable sur petit écran."
fichiers: "`harmonium/astro/TableMatieres.astro` · `bib-table-matieres.min.css` · `bib-navigation-secondaire.min.css` · `bib-table-matieres.min.js` (facultatif)"
ressources: "composants/table-matieres"
---

## Aperçu {#apercu}

::exemple[composants/table-matieres/01.html]

## Deux navigations distinctes {#distinction}

| Composant | Destination des liens | Usage |
| --- | --- | --- |
| Table des matières | Les titres de la page en cours. | Lire et parcourir une page longue. |
| [Navigation secondaire](@@/composants/navigation-secondaire.html) | Les autres pages de la section. | Se déplacer dans un groupe de pages. |

## Avec Astro {#astro}

```
---
import { render } from 'astro:content'
import TableMatieres from 'harmonium/astro/TableMatieres.astro'
const { Content, headings } = await render(page)
---
<div class="bib-page-avec-sommaire">
  <TableMatieres titres={headings} niveauMax={3} />
  <article class="bib-page-avec-sommaire__contenu"><Content /></article>
</div>
```

Sur grand écran, placer « Sur cette page » à droite lorsqu’une navigation secondaire occupe la gauche. Sans navigation secondaire, cas plus rare, le placer à gauche. Sur petit écran, les repères se replient avant le contenu, après le titre de page. Le composant reprend les styles de `NavigationSecondaire`. Son rendu HTML est partagé avec cette documentation : les tables des matières des fiches utilisent ce même composant.

La grille `bib-page-avec-sommaire` applique cette règle automatiquement. Ajouter l’enveloppe suivante uniquement lorsqu’une navigation secondaire existe ; le sommaire passe alors à droite :

```
<div class="bib-page-avec-sommaire">
  <div class="bib-page-avec-sommaire__navigation">
    <NavigationSecondaire racine={section} courante={url} />
    <NavigationSecondaire racine={section} courante={url} variante="repliable" />
  </div>
  <TableMatieres titres={headings} />
  <article class="bib-page-avec-sommaire__contenu"><Content /></article>
</div>
```

Dans Harmonium, le menu des pages occupe déjà la gauche, hors de la grille du contenu. Le gabarit applique `bib-page-avec-sommaire--navigation-externe` pour placer « Sur cette page » à droite. Toutes les fiches ayant au moins deux sections utilisent le composant commun.

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titres | Les titres d’`astro:content` : `depth`, `slug`, `text`. Les identifiants doivent exister dans le contenu. | Requis |
| niveauMax | 2 pour les h2 ; 3 pour ajouter les h3 sous leur h2. | 2 |
| minimum | Nombre minimal de sections h2 pour afficher le composant, au moins deux. | 2 |
| nom | Nom du repère et libellé du volet. | Sur cette page |
| id | Préfixe des identifiants des deux variantes. | Unique, généré |

## En HTML {#html}

Charger les jetons, les deux feuilles et, pour le suivi de lecture, le script :

```
<link rel="stylesheet" href="…/dist/bib-jetons.min.css">
<link rel="stylesheet" href="…/dist/bib-navigation-secondaire.min.css">
<link rel="stylesheet" href="…/dist/bib-table-matieres.min.css">
<script type="module" src="…/dist/bib-table-matieres.min.js"></script>

<div class="bib-table-matieres" data-table-matieres>
  <nav class="bib-navigation-secondaire bib-navigation-secondaire--sommaire"
       aria-label="Sur cette page">
    <ul>
      <li><a href="#emprunter">Emprunter</a></li>
      <li><a href="#retourner">Retourner</a></li>
    </ul>
  </nav>
  <details class="bib-navigation-secondaire-repliable">
    <summary>Sur cette page</summary>
    <nav class="bib-navigation-secondaire bib-navigation-secondaire--sommaire"
         aria-label="Sur cette page">
      <ul>
        <li><a href="#emprunter">Emprunter</a></li>
        <li><a href="#retourner">Retourner</a></li>
      </ul>
    </nav>
  </details>
</div>
```

## Usage et accessibilité {#usage}

-   Avec une navigation secondaire : sommaire à droite. Sans navigation secondaire : sommaire à gauche. Réserver cette dernière disposition aux pages autonomes.
-   Afficher un sommaire quand les sections aident à parcourir une page longue. Garder les libellés identiques aux titres visés.
-   Se limiter aux h2 par défaut ; ajouter les h3 lorsque la longueur et la structure du contenu le justifient.
-   Une seule variante est visible à la fois : volet sous 1200 px, colonne dès 1200 px. Les liens et le volet natif fonctionnent sans JavaScript.
-   La section lue porte `aria-current="true"`, distinct du `aria-current="page"` de la navigation entre pages. Le suivi de lecture ne déplace ni le focus ni l’adresse.
-   Dans le volet, Échap referme le sommaire et rend le focus au résumé. Activer un lien referme le volet et poursuit la lecture sur le titre ciblé.
-   Le site hôte réserve un retrait sous son en-tête fixe (`scroll-padding-top` ou `scroll-margin-top`) pour garder les cibles visibles.
