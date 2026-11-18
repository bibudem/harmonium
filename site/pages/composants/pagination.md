---
titre: "Pagination"
description: "Des liens pour passer d’une page de résultats à l’autre : précédente, numéros autour de la page courante, suivante. Sur téléphone, deux grands boutons et « Page 6 sur 12 »."
fichiers: "`harmonium/astro/Pagination.astro` · `bib-pagination.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/pagination/01.html]

 

::exemple[composants/pagination/02.html]

## Utilisation {#utilisation}

### En HTML

```
<nav class="bib-pagination" aria-label="Pagination">
  <a class="bib-pagination__voisine bib-pagination__voisine--precedente" href="?page=5" rel="prev"><svg … aria-hidden="true">…</svg><span class="bib-masque">Page </span>Précédente</a>
  <ul class="bib-pagination__pages">
    <li><a class="bib-pagination__page" href="?page=1" aria-label="Page 1">1</a></li>
    <li class="bib-pagination__ellipse" aria-hidden="true">…</li>
    <li><a class="bib-pagination__page" href="?page=6" aria-label="Page 6" aria-current="page">6</a></li>
    <li><a class="bib-pagination__page" href="?page=12" aria-label="Page 12">12</a></li>
  </ul>
  <p class="bib-pagination__resume">Page 6 sur 12</p>
  <a class="bib-pagination__voisine bib-pagination__voisine--suivante" href="?page=7" rel="next"><span class="bib-masque">Page </span>Suivante<svg … aria-hidden="true">…</svg></a>
</nav>
```

Habillage : `--bib-pagination-courante-fond` et `--bib-pagination-courante-texte`.

### Avec Astro

```
---
import Pagination from 'harmonium/astro/Pagination.astro'
---
<Pagination page={6} total={12} url="/actualites/page/{n}/" premiere="/actualites/" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| page | Page courante. Obligatoire. |  |
| total | Nombre de pages. Une seule page : rien n’est rendu. Obligatoire. |  |
| url | Modèle d’adresse ; `{n}` devient le numéro. Obligatoire. |  |
| premiere | Adresse de la page 1, si elle diffère du modèle. |  |
| voisines | Pages affichées de part et d’autre de la page courante. | 1 |
| nom | Nom de la navigation (deux paginations sur une page : les distinguer). | Pagination |
| class | Classes ajoutées à la racine. |  |

### Variables d’habillage {#variables}

{{habillage-pagination}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Des listes longues dont on veut garder l’adresse de chaque page : actualités, archives d’événements, résultats.

### À éviter

-   **Pour moins de deux pages** : rien (le composant ne s’affiche pas).
-   **Pour une liste filtrée dans la page** : afficher tous les résultats, ou un bouton « Afficher plus ».
-   **Pour les étapes d’un formulaire** : un indicateur d’étapes, avec des boutons « Continuer ».

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Une navigation nommée** (`<nav aria-label>`), distincte du menu principal (WCAG 1.3.1).
-   **Page courante** annoncée par `aria-current="page"` et marquée autrement que par la couleur (fond plein) ; « Page 6 » plutôt que « 6 » (2.4.4).
-   **Liens « Page précédente » et « Page suivante »** : le nom commence par le texte visible (2.5.3) ; `rel="prev"` et `rel="next"`.
-   **Cibles de 44 px** au moins ; sur téléphone, deux boutons au pouce plutôt qu’une rangée de chiffres (2.5.8).
-   **Ellipses** masquées aux lecteurs d’écran.

### Ce que l’intégrateur doit faire

-   Indiquer le numéro de page dans le titre de la page (« Actualités, page 6 sur 12 »).
-   Placer la pagination sous la liste ; au besoin, aussi au-dessus, avec un `nom` différent.
