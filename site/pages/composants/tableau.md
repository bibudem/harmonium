---
titre: "Tableau"
description: "Un vrai `<table>`, cellules séparées par un filet, dans une zone sur surface claire qui défile à l’horizontale quand le tableau est plus large que l’écran."
fichiers: "`harmonium/astro/Tableau.astro` · `bib-tableau.min.css` · `bib-tableau.min.js` (facultatif)"
---

## Aperçu {#apercu}

::exemple[composants/tableau/01.html]

 

::exemple[composants/tableau/02.html]

 

::exemple[composants/tableau/03.html]

## Étape 1 : ajouter le HTML {#html}

```
<div class="bib-tableau-zone" role="region" aria-label="Frais de retard" tabindex="0" data-tableau-defilant>
  <table class="bib-tableau" aria-label="Frais de retard">
    <thead>
      <tr class="bib-tableau__rangee">
        <th scope="col" class="bib-tableau__cellule">Document</th>
        <th scope="col" class="bib-tableau__cellule bib-tableau__cellule--droite">Frais</th>
      </tr>
    </thead>
    <tbody>
      <tr class="bib-tableau__rangee">
        <th scope="row" class="bib-tableau__cellule">Livre</th>
        <td class="bib-tableau__cellule bib-tableau__cellule--droite">0,25 $</td>
      </tr>
    </tbody>
  </table>
</div>
```

Habillage : en-tête sur fond teinté et en graisse forte, filets gris clair entre rangées et colonnes, contour gris autour de la zone. Couleurs : `--bib-tableau-entete-fond` (`--couleur-teinte`), `--bib-tableau-filet` (`--gris-200`), `--bib-tableau-bordure` (`--couleur-bordure`). Variantes : `bib-tableau--compact` (cellules plus serrées), `bib-tableau__cellule--centre`, `--droite` et `--justifie` (alignement des colonnes), `bib-tableau__rangee--survol` (surligne la rangée au survol).

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-tableau.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Facultatif : le script ajoute le comportement interactif. Sans lui, le contenu reste lisible et utilisable.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-tableau.min.js"></script>
```

## Avec Astro {#astro}

```
---
import Tableau from 'harmonium/astro/Tableau.astro'
---
<Tableau titre="Frais de retard">
  <thead><tr><th>Document</th><th>Frais</th></tr></thead>
  <tbody><tr><th>Livre</th><td>0,25 $</td></tr></tbody>
</Tableau>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titre | Nom du tableau, repris par la zone défilante. | « Tableau » |
| taille | `compact` : cellules plus serrées. | `normal` |
| style | Style du `<table>` (largeur minimale). |  |

**Sémantique réglée à la construction.** Toutes les cellules de `<thead>` deviennent des `<th scope="col">`. Dans le corps, les `<th>` sans portée reçoivent `scope="row"`.

**En plusieurs composants.** `TableauConteneur` (la zone), `TableauTable` (le `<table>`), `TableauEntete`, `TableauCorps`, `TableauLigne` (`survol`) et `TableauCellule` (`alignement`, `balise="th"`) produisent le même HTML. La zone des morceaux est un `role="group"` plutôt qu’une région : plusieurs tableaux sans nom propre sur une page donneraient plusieurs repères identiques.

Le script facultatif `bib-tableau.min.js` ne garde la zone comme arrêt de tabulation et région nommée que si le tableau défile vraiment (sinon un arrêt inutile, et le nom annoncé deux fois).

## Personnaliser {#variables}

{{habillage-tableau}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Des données à comparer sur deux axes : durées de prêt par statut, tarifs par type d’établissement, horaires par bibliothèque.

### À éviter

-   **Pour mettre en page** (deux colonnes de texte, une image à côté d’un texte) : utiliser une grille, comme la [grille](@@/fondations/espacements.html).
-   **Pour une simple liste** de paires « libellé : valeur » : une liste se lit mieux sur téléphone.
-   **Pour un tableau très large** (plus de 6 ou 7 colonnes) : le scinder, ou pivoter les données.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **En-têtes associés** : `scope="col"` dans l’en-tête, `scope="row"` ailleurs. Le lecteur d’écran lit « Cycles supérieurs, Livres, 90 jours » en parcourant les cellules (WCAG 1.3.1).
-   **Zone défilante au clavier** : quand le tableau déborde, la zone reçoit le focus (`tabindex="0"`) et défile avec les flèches (2.1.1). Elle porte le nom du tableau (`role="region"` et `aria-label`), annoncé à l’arrivée du focus.
-   **Pas d’arrêt inutile** : quand le tableau tient dans la largeur, un petit script retire le focus, le rôle et le nom de la zone. Sans JavaScript, la zone reste atteignable.
-   **Pas de défilement de page** : la page reste lisible à 320 px de large et à 400 % de zoom (1.4.10, exception permise pour les tableaux).
-   **Texte masqué contenu** : la zone est en `position: relative`, pour que le texte masqué des liens du tableau ne déborde pas de la page.
-   **Couleurs forcées** : une bordure remplace l’ombre de la surface.

### Ce que l’intégrateur doit faire

-   Donner un nom au tableau (`titre`) qui dit ce qu’il contient ; sans lui, tous les tableaux s’appellent « Tableau ».
-   Mettre une vraie ligne d’en-tête et, si les rangées ont un intitulé, l’écrire en première colonne (`<th>`).
-   Éviter de fusionner des cellules (une cellule fusionnée casse la lecture par cellule des lecteurs d’écran), et garder des en-têtes courts.
-   Écrire les données en entier dans chaque cellule (« 21 jours », pas « id. ») : chaque cellule est lue seule.
