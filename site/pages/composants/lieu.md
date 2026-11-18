---
titre: "Lieu"
description: "La fiche d’un studio, d’un local ou d’une salle réservable : son nom, son adresse, un lien vers la carte, un texte libre et des boutons d’action toujours alignés en bas."
fichiers: "`harmonium/astro/Lieu.astro` · `bib-lieu.min.css` · `bib-bouton.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/lieu/01.html]

## Utilisation {#utilisation}

### En HTML

```
<article class="bib-lieu">
  <h3 class="bib-lieu__titre"><a href="/espaces/studio-video/">Studio vidéo</a></h3>
  <p class="bib-lieu__adresse"><svg class="bib-lieu__epingle" … aria-hidden="true" focusable="false">…</svg><span>Pavillon Samuel-Bronfman, 2<sup>e</sup> étage, local 2078</span></p>
  <div class="bib-lieu__corps">
    <a class="bib-lieu__carte" href="https://maps.app.goo.gl/…" target="_blank" rel="noopener"><svg … aria-hidden="true">…</svg><span>Localiser sur Google Maps<span class="bib-masque"> (nouvel onglet)</span></span></a>
    <p>Pour vérifier la disponibilité et réserver, écrivez à l’équipe du studio.</p>
  </div>
  <div class="bib-lieu__pied">
    <a class="bib-bouton bib-bouton--plein bib-bouton--bleu-fonce" href="…"><span class="bib-bouton__libelle">Réserver</span><span class="bib-bouton__fin" aria-hidden="true"></span></a>
    <a class="bib-bouton bib-bouton--contour bib-bouton--bleu-fonce" href="…"><span class="bib-bouton__libelle">Guide d’utilisation</span><span class="bib-bouton__fin" aria-hidden="true"></span></a>
  </div>
</article>
```

Habillage : `--bib-lieu-adresse-fond` (fond de la ligne d’adresse), `--bib-lieu-largeur` (largeur maximale ; par défaut la mesure de lecture).

### Avec Astro

```
---
import Lieu from 'harmonium/astro/Lieu.astro'
import Bouton from 'harmonium/astro/Bouton.astro'
---
<Lieu titre="Studio vidéo" href="/espaces/studio-video/" carte="https://maps.app.goo.gl/…">
  <Fragment slot="adresse">Pavillon Samuel-Bronfman, 2<sup>e</sup> étage, local 2078</Fragment>
  <p>Pour vérifier la disponibilité et réserver, écrivez à l’équipe du studio.</p>
  <Fragment slot="pied">
    <Bouton href="/reserver/">Réserver</Bouton>
    <Bouton href="/guide/" variante="contour">Guide d’utilisation</Bouton>
  </Fragment>
</Lieu>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titre | Nom du lieu. Obligatoire. |  |
| href | Page du lieu ; le titre devient un lien. |  |
| carte | Adresse de la carte (« Localiser sur Google Maps »). |  |
| niveauTitre | Niveau du titre, de 2 à 6. | 3 |
| donnees | Attributs `data-*` ajoutés à la racine (filtres, scripts du site). |  |
| class | Classes ajoutées à la racine. |  |
| slot `adresse`, slot par défaut, slot `pied` | Adresse ; texte libre ; boutons. |  |

### Variables d’habillage {#variables}

{{habillage-lieu}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Présenter un espace réservable ou un local de service, seul ou en grille de fiches de même hauteur.

### À éviter

-   **Pour une bibliothèque entière** (horaires, services, accès) : sa page, avec ses horaires.
-   **Pour un simple lien vers un lieu** : une [carte à image](@@/composants/carte-image.html) ou une [liste de liens](@@/composants/liste-liens.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Structure** : un `<article>` dont le titre est un vrai niveau de titre ; le lien du titre est nommé par le nom du lieu.
-   **Lien externe annoncé** : « (nouvel onglet) » en texte masqué (WCAG 3.2.5) ; icônes décoratives (`aria-hidden`).
-   **Cibles au pouce** : sur téléphone, les boutons prennent toute la largeur ; dès 600 px, ils reprennent leur taille (2.5.8).
-   **Alignement** : le pied reste en bas, les fiches voisines restent alignées même avec des textes de longueurs différentes.

### Ce que l’intégrateur doit faire

-   Écrire l’adresse complète (pavillon, étage, local) : c’est ce qu’on cherche sur place.
-   Limiter le pied à deux actions ; l’action principale en premier, pleine.
