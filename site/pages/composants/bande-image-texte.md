---
titre: "Bande image-texte"
description: "Un appel à l’action : un texte, des boutons et une image côte à côte, dans une colonne décalée d’une demi-colonne de chaque côté. Sous 900 px, tout passe en une seule colonne."
fichiers: "`harmonium/astro/BandeImageTexte.astro` · `bib-bande-image-texte.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/bande-image-texte/01.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-colonne-decalee bib-bande-image-texte" style="--bib-decalage: 0.5">
  <div class="bib-colonne-decalee__colonne">
    <div class="bib-bande-image-texte__rangee bib-bande-image-texte__rangee--image-droite">
      <div class="bib-bande-image-texte__colonne-texte">
        <div class="bib-bande-image-texte__contenu"><h3>Titre</h3><p>Texte.</p></div>
        <div class="bib-bande-image-texte__pied"><a class="bib-bouton …" href="/services/">…</a></div>
      </div>
      <div class="bib-bande-image-texte__colonne-image"><img src="photo.jpg" alt="" loading="lazy"></div>
    </div>
  </div>
</div>
```

Habillage : dès 900 px : texte sur 5 colonnes de 12, espace d’une colonne, image sur 6, centrés verticalement ; `--image-gauche` met l’image à gauche et, sous 900 px, la place avant le texte. `bib-bande-image-texte__rangee--compact` (pages de texte) réduit l’image à une vignette carrée à côté du premier élément sous 900 px, pour qu’une page qui en enchaîne une douzaine ne s’allonge pas d’autant. `bib-bande-image-texte__titre-large` place le titre au-dessus des deux colonnes. La [colonne décalée](@@/composants/colonne-decalee.html) et les [boutons](@@/composants/bouton.html) sont ceux d’Harmonium.

### Avec Astro

```
---
import BandeImageTexte from 'harmonium/astro/BandeImageTexte.astro'
import Bouton from 'harmonium/astro/Bouton.astro'
---
<BandeImageTexte image={photo} alignement="gauche">
  <h3>Des espaces pour tous</h3>
  <p>Réservez une salle en quelques clics.</p>
  <Bouton slot="pied" href="/services/">Réserver</Bouton>
</BandeImageTexte>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| image | Image importée (formats et tailles d’astro:assets) ou adresse. Obligatoire. |  |
| alignement | `gauche` : texte à gauche, image à droite ; `droite` : l’inverse. | `gauche` |
| alt | Texte de remplacement, seulement si l’image porte un message ; décorative par défaut. | vide |
| compact | Vignette à côté du titre sous 900 px. | non |
| legende | Légende sous l’image (HTML) ; l’image et elle forment une `<figure>`. |  |
| decalage | Décalage de chaque côté, en colonnes ; 0 pour s’aligner sur les carrousels et les grilles. | `0.5` |
| slots | `titre` (au-dessus des deux colonnes), `pied` (les boutons, rendus une seule fois). |  |


### Variables d’habillage {#variables}

{{habillage-bande-image-texte}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Un appel à l’action illustré, dans une page de présentation : collections, service, campagne.
-   Dans une page de texte, une section qui présente un lieu ou un service avec sa photo.
-   Une petite image porteuse de sens (portrait, logo de campagne) à côté d’un paragraphe : `taille=petite`.

### À éviter

-   **Sans image pertinente** : une [grille](@@/fondations/espacements.html) avec une [icône carrée](@@/composants/icone-carree.html).
-   **Pour une photo de fond** sous un titre : une [section](@@/composants/section.html) avec photo voilée ou une [bannière](@@/composants/banniere.html).
-   **Pour plusieurs images** : une galerie ou un [carrousel](@@/composants/carrousel.html).
-   **Pour une image qui porte l’information** (schéma, affiche) dans le format normal : elle y est décorative ; la montrer en figure avec sa description.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Image décorative** (`alt=""`) par défaut ; une description n’est utile que si l’image porte un message : l’essentiel se dit dans le texte (WCAG 1.1.1).
-   **Ordre de lecture stable** : texte, puis image, puis boutons ; le pied n’est rendu qu’une fois, donc jamais lu deux fois (1.3.2).
-   **Légende liée** : avec `legende`, l’image et sa légende forment une `<figure>`.
-   **Contrastes de l’encart** : bleu foncé sur rose pâle (14,75:1), blanc sur vert foncé (11,26:1), sur bleu (7,1:1) ; liens et focus suivent la teinte (1.4.3, 2.4.7).
-   **Boutons sur fond foncé** : variante claire, le bouton bleu foncé ne s’y voyait pas (1.4.11).
-   **Encart en couleurs forcées** : cerné d’un filet.

### Ce que l’intégrateur doit faire

-   Dire dans le texte tout ce que la photo montre d’utile ; laisser les crochets vides dans le format normal.
-   Donner une description à une petite image qui porte un message (logo, affiche).
-   Écrire des boutons qui nomment leur destination ; un lien externe est signalé par la flèche ↗ et un texte masqué.
