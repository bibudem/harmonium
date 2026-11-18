---
titre: "Carte à icône"
description: "Une carte-lien pleine couleur, avec une icône, un titre et un texte d’appel : toute la carte est cliquable. Sur les sites, elle sert surtout en pleine largeur, en grille de deux colonnes ; le grand format (353 × 400 px) s’élargit de 10 % au survol et se range en rangée qui défile."
fichiers: "`harmonium/astro/CarteIcone.astro` · `harmonium/astro/PastilleFleche.astro` · `bib-carte-icone.min.css` · `bib-carte-lien.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/carte-icone/01.html]

 

::exemple[composants/carte-icone/02.html]

 

::exemple[composants/carte-icone/03.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-carte-icone bib-carte-icone--bleu-principal bib-carte-lien bib-anneau-carte">
  <div class="bib-carte-icone__icone"><svg width="55" height="55" aria-hidden="true">…</svg></div>
  <div class="bib-carte-icone__titre">
    <a class="bib-lien-etire" href="/services/" aria-describedby="plus-1">Services</a>
  </div>
  <div class="bib-carte-icone__pied">
    <div class="bib-carte-icone__plus" id="plus-1" aria-hidden="true">Voir les services</div>
    <span class="bib-pastille-fleche bib-carte-icone__pastille" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span>
  </div>
</div>
```

Habillage : cinq couleurs : `--bleu-principal`, `--vert-fonce`, `--rose`, `--jaune` et `--neutre`, blanche à contour (ajouter `surface-claire` sur les trois dernières, qui sont claires) ; `--petite` pour le petit format. La carte est bâtie sur le [lien étiré et pastille](#lien-etire), dont la feuille se charge aussi.

### Avec Astro

```
---
import CarteIcone from 'harmonium/astro/CarteIcone.astro'
---
<CarteIcone titre="Services" Icone={BooksIcon} couleur="bleuPrincipal" textePlus="Voir les services" href="/services/" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titre | Titre de la carte, qui porte le lien. Obligatoire. |  |
| Icone | Composant d’icône (55 px). |  |
| couleur | `bleuPrincipal`, `vertFonce`, `rose`, `jaune` ou `neutre` (blanc à contour). | `bleuPrincipal` |
| textePlus | Texte d’appel, qui décrit le lien (aria-describedby) sans être relu. |  |
| href, target, rel | Adresse. Sans `href` : une carte d’annonce, sans lien ni pastille, qui ne s’élargit pas (le texte d’appel, « Bientôt », reste lu). |  |
| petite | Petit format (290 × 332 px). | non |
| niveauTitre | Niveau du titre, de 2 à 6 ; `null` pour un libellé sans titre. | 3 |
| pleineLargeur | Carte compacte en rangée : voir [Carte compacte](@@/composants/carte-icone.html#compacte). | non |
| etiquette | Avec `pleineLargeur` : libellé collé sous le titre, hors du lien (« Méthode recommandée »). |  |

### Variables d’habillage {#variables}

{{habillage-carte-icone}}

### Variante compacte {#compacte}

La carte compacte est une variante de `CarteIcone`, pour une rangée de liens. La pastille est décorative : le titre porte l’unique lien.

::exemple[composants/carte-compacte/01.html]

```astro
<CarteIcone titre="Nous joindre" href="/nous-joindre/" pleineLargeur
  textePlus="Par téléphone, courriel ou clavardage." />
```

Ne pas ajouter un bouton ou un second lien dans la zone cliquable.

### Lien étiré et pastille {#lien-etire}

Toutes les cartes reposent sur les deux mêmes éléments : **le lien étiré** (`bib-lien-etire`), le seul lien de la carte, posé sur son titre et qui couvre toute la surface ; et **la pastille fléchée** (`bib-pastille-fleche`), → vers une page du site, ↗ vers un autre site. La [Carte à image](@@/composants/carte-image.html) et la [Liste de liens](@@/composants/liste-liens.html) les emploient aussi.

#### Choisir une carte {#choisir-carte}

| Besoin | Composant |
| --- | --- |
| Service avec pictogramme | [Carte à icône](@@/composants/carte-icone.html). |
| Rangée courte avec titre et description | [Variante compacte](@@/composants/carte-icone.html#compacte) de la même carte. |
| Contenu illustré par une photo | [Carte à image](@@/composants/carte-image.html). |
| Série de liens descriptifs | [Liste de liens](@@/composants/liste-liens.html). |

#### Exemples {#lien-etire-apercu}

::exemple[composants/carte-lien/01.html]

 

::exemple[composants/carte-lien/02.html]

#### Code {#lien-etire-utilisation}

#### En HTML

```
<div class="bib-carte-lien bib-anneau-carte">
  <a class="bib-lien-etire" href="/services/">Titre de la carte</a>
  <span class="bib-pastille-fleche" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span>
</div>

<!-- Autre site : modificateur --externe, et annonce en texte masqué -->
<span class="bib-pastille-fleche bib-pastille-fleche--externe" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span>
```

Habillage : la taille vient de `--taille-pastille` (`--taille-pastille-petite` avec le modificateur `--petite`). Les couleurs viennent de la carte qui contient la pastille, par variables : `--bib-pastille-fleche-fond`, `--bib-pastille-fleche-encre`, `--bib-pastille-fleche-contour` et leurs variantes « -actif » (survol et focus), plus `--bib-pastille-fleche-echelle-active` ; sans elles, la pastille est transparente, de la couleur du texte. Toutes les cartes d’Harmonium ([à icône](@@/composants/carte-icone.html), [à image](@@/composants/carte-image.html), [compacte](@@/composants/carte-icone.html#compacte), [liste de liens](@@/composants/liste-liens.html)) s’appuient sur ce motif.

#### Avec Astro

```
---
import PastilleFleche from 'harmonium/astro/PastilleFleche.astro'
---
<PastilleFleche externe petite />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| externe | Flèche ↗ (autre site) au lieu de →. | non |
| petite | Petite taille. | non |

**Le motif.** `bib-lien-etire` : le seul lien de la carte, sur son titre ; son `::after` couvre la carte (`--bib-lien-etire-rayon` règle l’arrondi). `bib-carte-lien` : la carte qui le contient. Avec `bib-anneau-carte`, le focus du lien est tracé sur toute la carte : un anneau double (contour de focus de la bande, liseré `--bib-carte-anneau-interieur`), lisible sur tout fond. Au survol (pointeurs fins seulement : au toucher, il resterait après le tapotement) et au focus, la flèche avance d’un cran vers sa destination.

Pastille à contour des cartes neutres : à l’état actif, elle se remplit de `--bib-pastille-active-fond` (défaut : bleu foncé) avec une flèche `--bib-pastille-active-encre` (défaut : blanc) ; un site les règle une fois sur `:root` (par exemple : jaune et bleu foncé).

Le clic traverse la pastille jusqu’au lien : elle n’est qu’un repère visuel (`pointer-events: none`, `aria-hidden`).

Ce fichier définit aussi `bib-masque`, le texte masqué qui annonce un PDF ou un nouvel onglet.

#### Quand l’employer {#lien-etire-quand}

#### À utiliser pour

-   Toute carte ou rangée dont la surface entière est un lien : [CarteImage](@@/composants/carte-image.html), [CarteIcone](#apercu), [CarteLienCompacte](#compacte), [liste de liens](@@/composants/liste-liens.html).

#### À éviter

-   **Seule, comme bouton** : elle n’a ni nom ni rôle. Pour une action, un [bouton](@@/composants/bouton.html).
-   **Dans un texte** : un [lien](@@/composants/lien.html) ordinaire.
-   **Sur une carte qui n’est pas un lien** (tuile « Bientôt », carte dépliable) : la pastille promettrait une destination qui n’existe pas.

#### Accessibilité {#lien-etire-accessibilite}

#### Ce que fait le composant

-   **Masquée aux technologies d’assistance** (`aria-hidden`) : le nom vient du lien de la carte, qui annonce aussi un PDF ou un nouvel onglet en texte masqué (WCAG 1.1.1, 2.4.4).
-   **Forme, pas seulement couleur** : → ou ↗ dit la destination (1.4.1).
-   **Contraste des objets** : contour gris 3,7:1 sur blanc ; flèche blanche 18:1 sur bleu foncé ; flèche bleu foncé sur vert pâle 7,32:1 (1.4.11).
-   **Focus** : l’état actif s’affiche au focus clavier comme au survol ; l’anneau est tracé autour de la carte (2.4.7).
-   **Survol réservé aux pointeurs fins** : au toucher, il ne reste pas d’état fantôme.
-   **Mouvement** : 3 px seulement, et coupé quand la personne réduit les animations.
-   **Couleurs forcées** : la pastille reçoit un contour et la flèche prend la couleur du texte du système (elle disparaissait).

#### Ce que l’intégrateur doit faire

-   Toujours la placer dans une carte dont le lien a un nom ; jamais seule.
-   Poser les couleurs par variables sur la carte et vérifier le contraste de la flèche sur la pastille, et de la pastille sur la carte.
-   Laisser le composant choisir la flèche d’après l’adresse ; signaler séparément l’ouverture dans un nouvel onglet.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Trois à six portes d’entrée vers des services, sur une page d’accueil ou de section.
-   Annoncer une page à venir (sans `href`, avec « Bientôt »).
-   En `pleineLargeur`, une liste de liens de service qui mérite plus de poids qu’une simple liste.

### À éviter

-   **Quand une photo aide à reconnaître le sujet** (lieux, collections, événements) : la [CarteImage](@@/composants/carte-image.html).
-   **Pour une longue liste de liens** ou des liens secondaires : une liste de liens, plus sobre et plus rapide à parcourir.
-   **Pour une action** (envoyer, réserver sur place) : un [bouton](@@/composants/bouton.html).
-   **Pour une icône purement décorative à côté d’un texte** : l’[IconeCarree](@@/composants/icone-carree.html).
-   **Pour faire défiler beaucoup de cartes** : une grille plutôt qu’un [carrousel](@@/composants/carrousel.html), sauf si l’espace manque.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Un seul arrêt de tabulation** par carte, nommé par le titre ; la cible couvre toute la carte (WCAG 2.4.4, 2.5.8).
-   **Lecteur d’écran** : « Authentification, lien, Accédez à vos comptes ». Un lien qui ouvre un nouvel onglet ou un PDF l’annonce en texte masqué.
-   **Focus** : un anneau double (contour de focus et liseré) est tracé autour de la carte entière, lisible sur tout fond (2.4.7, 2.4.13).
-   **Contrastes** : texte blanc à 7,10:1 sur bleu principal et 11,26:1 sur vert foncé ; bleu foncé à 11:1 ou plus sur rose 300 et jaune (1.4.3). Flèche rouge orangé foncé à 3,74:1 sur sa pastille rose (1.4.11).
-   **Icône et pastille décoratives** (`aria-hidden`).
-   **Texte agrandi à 200 %** : hauteur minimale plutôt que fixe, la carte grandit au lieu de laisser déborder le titre (1.4.4). Sur téléphone, la carte fait au plus 78 % de la largeur de l’écran (1.4.10).
-   **Couleurs forcées** : un contour délimite la carte.
-   **Mouvement** : l’élargissement au survol est coupé quand la personne réduit les animations.

### Ce que l’intégrateur doit faire

-   Écrire un titre qui nomme la destination (« Authentification »), jamais « En savoir plus ».
-   Garder le texte d’appel court : il complète le titre, il ne le répète pas.
-   Choisir la même couleur pour toutes les cartes d’un groupe, sauf si la couleur a un sens expliqué dans le texte.
-   Placer les cartes sous un titre de section qui dit ce qu’elles regroupent.
