---
titre: "Galerie d’images"
description: "Des images côte à côte, recadrées à la même hauteur, chacune avec sa légende : pièces d’une collection, photos d’un événement."
fichiers: "`harmonium/astro/Galerie.astro` · `harmonium/astro/FigureGalerie.astro` · `bib-galerie.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/galerie/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<div class="bib-galerie">
  <figure class="bib-galerie__figure">
    <img src="cartons.jpg" alt="" loading="lazy" decoding="async">
    <figcaption class="bib-typographie bib-typographie--texte-petit bib-galerie__legende">Cartons d’invitation, 1920</figcaption>
  </figure>
</div>
```

Chaque figure fait au moins 170 px de large ; la photo est recadrée à 200 px de haut.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-galerie.min.css">
```

## Avec Astro {#astro}

```
---
import Galerie from 'harmonium/astro/Galerie.astro'
import FigureGalerie from 'harmonium/astro/FigureGalerie.astro'
---
<Galerie>
  <FigureGalerie image={cartons}>Cartons d’invitation, 1920</FigureGalerie>
</Galerie>
```

| Propriété (FigureGalerie) | Rôle | Défaut |
| --- | --- | --- |
| image | Image importée ou adresse. Obligatoire. |  |
| alt | Texte de remplacement, seulement si l’image dit plus que sa légende. | vide |
| slot par défaut | La légende. |  |
| class | Classes ajoutées (aussi sur Galerie). |  |

## Personnaliser {#variables}

{{habillage-galerie}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Montrer plusieurs pièces d’une collection ou d’une exposition, chacune identifiée par sa légende.

### À éviter

-   **Pour une seule image** : une figure dans le texte (voir [Images](@@/fondations/images.html)).
-   **Quand chaque image mène à une page** : des [cartes à image](@@/composants/carte-image.html).
-   **Quand le recadrage trahit l’œuvre** (carte, affiche, document entier) : une figure à ses proportions.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Figure et légende** reliées par `<figure>` et `<figcaption>`.
-   **Chargement différé** (`loading="lazy"`) : la page reste rapide avec beaucoup d’images.
-   **Reflow** : les figures passent à la ligne ; aucune barre de défilement horizontale (WCAG 1.4.10).

### Ce que l’intégrateur doit faire

-   Écrire une légende qui identifie la pièce (titre, date, provenance).
-   Ajouter un `alt` seulement si l’image porte une information absente de la légende ; sinon `alt=""`.
