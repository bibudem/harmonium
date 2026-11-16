---
titre: "Carrousel"
description: "Une rangée de cartes qui défile à l’horizontale, avec un titre, une description, des flèches, une barre de progression et un bouton « voir tout ». Le défilement est natif : il marche au doigt, à la souris et au clavier même sans JavaScript."
fichiers: "`harmonium/astro/Carrousel.astro` · `harmonium/astro/BoutonsCarrousel.astro` · `harmonium/astro/ProgressionCarrousel.astro` · `bib-carrousel.min.css` · `bib-carrousel.min.js` (facultatif)"
ressources: "composants/carrousel"
---

## Aperçu {#apercu}

::exemple[composants/carrousel/01.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-carrousel" role="region" aria-roledescription="carrousel" aria-labelledby="car-titre" data-carrousel>
  <div class="bib-carrousel__entete">
    <div class="bib-carrousel__titre" id="car-titre"><h2>Pour étudier</h2></div>
    <div class="bib-carrousel__rangee">
      <div class="bib-carrousel__description">Des guides, des outils et des experts.</div>
      <div class="bib-carrousel__commandes bib-carrousel__commandes-entete" hidden data-commandes>
        <button type="button" class="bib-carrousel__commande" aria-controls="car-piste" aria-disabled="true" data-precedent>
          <svg viewBox="0 0 50 50" width="50" height="50" aria-hidden="true">…</svg><span class="bib-masque">Cartes précédentes</span>
        </button>
        <button type="button" class="bib-carrousel__commande" aria-controls="car-piste" data-suivant>
          <svg class="bib-carrousel__vers-droite" viewBox="0 0 50 50" width="50" height="50" aria-hidden="true">…</svg><span class="bib-masque">Cartes suivantes</span>
        </button>
        <span class="bib-masque" role="status" data-position></span>
      </div>
    </div>
  </div>
  <div class="bib-carrousel__piste" tabindex="0" role="group" aria-label="Contenus du carrousel" id="car-piste" data-piste>
    <div class="bib-carrousel__diapositive" role="group" aria-roledescription="diapositive" aria-label="1 sur 5" data-diapositive>…une carte…</div>
  </div>
  <div class="bib-carrousel__progression bib-carrousel__progression-piste" aria-hidden="true" hidden data-progression><span class="bib-carrousel__curseur" data-curseur></span></div>
  <div class="bib-carrousel__plus"><a class="bib-bouton …" href="/services/">Voir tout</a></div>
</div>
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-carrousel.min.js"></script>
```

Habillage : l’espace entre les groupes vient de `--espace-bloc` et celui entre les cartes de `--espace-grille`. Tant qu’il reste des cartes à droite, la piste porte `data-suite` et son bord droit s’efface en fondu (discret : 40 % d’opacité au plus bas). Les cartes qui défilent sont celles d’Harmonium : [à image](@@/composants/carte-image.html), [à icône](@@/composants/carte-icone.html)…

### Avec Astro

```
---
import Carrousel from 'harmonium/astro/Carrousel.astro'
import 'harmonium/dist/bib-carrousel.min.js'  // les flèches et la progression (facultatif)
---
<Carrousel title="Pour étudier" description="Des guides, des outils et des experts." moreText="Voir tout" moreLink="/etudes/">
  <CarteImage title="Apprendre à chercher" Image={photo} href="/etudes/chercher/" />
  <CarteImage title="Citer ses sources" Image={photo2} href="/etudes/citer/" />
</Carrousel>
```

| Propriété | Rôle |
| --- | --- |
| title | Titre, rendu en h2 ; un autre titre passe en slot `title`. |
| description | Chaîne ; un élément passe en slot `description`. |
| moreText, moreLink, moreTarget | Bouton « voir tout » sous la piste ; `moreTarget="_blank"` l’ouvre dans un nouvel onglet (annoncé). |
| ariaLabel | Nom accessible : le titre seul. À donner quand le titre est un élément (qui doublerait le nom). |

**Chaque enfant de premier niveau du slot est une diapositive** : le composant les redécoupe et les numérote (« n sur N »). Sans le script, les flèches et la barre restent masquées (attribut `hidden`) ; la rangée se parcourt au doigt ou à la barre de défilement.

**Les flèches** avancent d’une « page » : la première diapositive coupée à droite vient au début (l’inverse en reculant). Elles sont désactivées aux extrémités et masquées quand tout tient dans la largeur.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Une sélection de cartes de même nature, à parcourir sans ordre imposé : nouveautés, expositions, cartes à photo d’une page d’accueil.
-   Un aperçu qui renvoie à une page complète (« Toutes les nouveautés »).

### À éviter

-   **Pour du contenu que tout le monde doit voir** : les cartes cachées à droite sont peu consultées. Une [grille](@@/fondations/espacements.html) montre tout d’un coup.
-   **Pour trois cartes ou moins** : elles tiennent dans une grille, sans commandes.
-   **Pour des étapes ou un ordre de lecture** : une liste numérotée.
-   **Pour une seule image à la fois** (diaporama) : ce composant n’en est pas un.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Motif Carrousel de l’APG** : région nommée par le titre, `aria-roledescription="carrousel"` ; chaque diapositive est un groupe « 3 sur 8 » (WCAG 1.3.1, 4.1.2).
-   **Commandes** : vrais boutons nommés « Cartes précédentes » et « Cartes suivantes », reliés à la rangée (`aria-controls`). Aux extrémités, ils passent en `aria-disabled` : ils restent dans l’ordre de tabulation et le focus ne se perd pas (2.1.1, 2.4.3).
-   **Annonce** : après un clic sur une flèche, une région `role="status"` dit les cartes visibles (« Cartes 4 et 5 sur 8 »), une fois le défilement arrêté (4.1.3).
-   **Pas de mouvement automatique** (2.2.2). Le défilement des flèches est instantané quand la personne réduit les animations (2.3.3).
-   **Sans JavaScript** : flèches et barre de progression restent masquées, la barre de défilement native reste visible.
-   **Contrastes** : flèches dans la couleur des liens ; curseur de progression d’au moins 3:1 sur blanc et sur bleu pâle (1.4.11). La barre est visuelle seulement (`aria-hidden`).
-   **Couleurs forcées** : contour plein autour des flèches, en pointillé et `GrayText` quand elles sont désactivées.
-   **320 px** : les flèches passent sous la description ; aucune marge négative ne fait déborder la page (1.4.10).

### Ce que l’auteur doit faire

-   Donner un titre au carrousel : il nomme la région. Sinon, fournir `ariaLabel`.
-   Mettre dans chaque diapositive un seul lien, nommé clairement (une carte-lien).
-   Offrir un lien « voir tout » quand la rangée n’est qu’un extrait.
-   Garder les cartes de même hauteur et de même nature.
