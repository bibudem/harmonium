---
titre: "Carte à image"
description: "Une carte-lien avec une photo recadrée, un titre en Figtree et un texte d’appel. Toute la carte est cliquable ; le lien porte sur le titre."
fichiers: "`harmonium/astro/CarteImage.astro` · `bib-carte-image.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/carte-image/01.html]

 

::exemple[composants/carte-image/02.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-carte-image bib-carte-lien bib-anneau-carte surface-claire">
  <img class="bib-carte-image__photo" src="photo.jpg" alt="" loading="lazy">
  <div class="bib-carte-image__contenu">
    <h3 class="bib-carte-image__titre"><a class="bib-lien-etire" href="/etudes/" aria-describedby="plus-1">Apprendre à chercher</a></h3>
    <div class="bib-carte-image__pied">
      <div class="bib-carte-image__plus" id="plus-1" aria-hidden="true">En savoir plus</div>
      <span class="bib-pastille-fleche" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span>
    </div>
  </div>
</div>
```

Les titres utilisent Figtree dans toutes les variantes.

Habillage : la carte fait 330 × 500 px, la photo 220 px de haut ; la flèche (→ ou ↗) suit l’adresse. Texte et flèche en bleu principal sur le fond : 6,8:1. Modificateur `--surface` : carte blanche à contour et ombre, 280 × 400 px, photo de 170 px, titre sans empattement en gras, texte d’appel en description sous le titre, pastille à contour (active : `--bib-pastille-active-fond`, voir [Lien étiré et pastille](@@/composants/carte-icone.html#lien-etire)). Plusieurs cartes : `<div class="bib-carte-image-grille">`, rangée qui défile sous 600 px, grille de trois au plus ensuite.

### Avec Astro

```
---
import CarteImage from 'harmonium/astro/CarteImage.astro'
---
<CarteImage title="Apprendre à chercher" Image={photo} href="/etudes/" moreText="En savoir plus" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| surface | Carte blanche à contour. | non |
| title, href | Titre (qui porte le lien) et adresse. Obligatoires. |  |
| Image | Image importée (formats et tailles d’astro:assets) ou adresse. Obligatoire. |  |
| moreText | Texte d’appel. | « En savoir plus » |
| alt | Texte de remplacement, seulement si la photo porte un message. | vide |
| niveauTitre | 2 à 6 ; la police et la taille restent celles de la carte. | `3` |

## Quand l’utiliser {#quand}

### À utiliser pour

-   Trois à six pages dont le sujet se montre bien en photo : bibliothèques, salles, collections, expositions.
-   Une rangée de mise en avant, seule ou dans un [carrousel](@@/composants/carrousel.html).

### À éviter

-   **Sans photo de qualité**, ou pour un service abstrait (authentification, impression) : la [CarteIcone](@@/composants/carte-icone.html).
-   **Pour une longue liste** de pages : une liste de liens, plus compacte et plus facile à parcourir.
-   **Quand la photo porte une information** (plan, affiche) : la montrer dans le contenu, avec un texte de remplacement.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Un seul lien**, nommé par le titre ; la cible couvre toute la carte (WCAG 2.4.4, 2.5.8). Lecteur d’écran : « Salles de travail en équipe, lien, Réserver une salle ».
-   **Titre réel** (`h2` à `h6`), trouvé par la navigation par titres (1.3.1).
-   **Photo décorative** par défaut, pour ne pas lire deux fois le titre (1.1.1).
-   **Focus** : anneau double autour de toute la carte ; la carte cesse de rogner son contenu pendant le focus pour ne pas couper l’anneau (2.4.7).
-   **Contraste** : texte d’appel et flèche en bleu principal sur le fond, 6,8:1 (1.4.3).
-   **Texte agrandi et 320 px** : hauteur minimale plutôt que fixe, titre jamais coupé ; la carte ne dépasse jamais sa colonne (1.4.4, 1.4.10).
-   **Couleurs forcées** : un contour délimite la carte et la pastille.

### Ce que l’auteur doit faire

-   Écrire un titre qui nomme la destination ; ne pas mettre l’information seulement dans la photo.
-   Donner un `alt` seulement si la photo apporte une information que le titre ne donne pas.
-   Régler `niveauTitre` d’après le titre qui précède les cartes.
-   Choisir des photos sans texte incrusté, et dont le sujet reste visible une fois recadré.
