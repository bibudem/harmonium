---
titre: "Bannière"
description: "Une photo sous un voile, avec le titre de la page en bas à gauche. En grand format pour l’accueil et les pages de premier niveau, en petit format ou en bande basse pour les sous-pages."
fichiers: "`harmonium/astro/Banniere.astro` · `bib-banniere.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/banniere/01.html]

 

::exemple[composants/banniere/02.html]

 

::exemple[composants/banniere/03.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-banniere bib-banniere--vague surface-foncee">
  <img class="bib-banniere__image" src="photo.jpg" alt="" fetchpriority="high">
  <div class="bib-banniere__texte">
    <div class="bib-banniere__colonne">
      <h1 class="bib-typographie bib-typographie--titre-banniere bib-banniere__titre">Les bibliothèques</h1>
      <div class="bib-banniere__sous-titre">Étudier, chercher, créer.</div>
    </div>
  </div>
  <div class="bib-banniere__enfants">…sommaire, boutons…</div>
</div>

<!-- Sous-pages : bande basse, titre en paragraphe -->
<section class="bib-banniere bib-banniere--vague bib-banniere--section surface-foncee" aria-label="Études">
  <img class="bib-banniere__image" src="photo.jpg" alt="">
  <div class="bib-banniere__texte"><div class="bib-banniere__colonne"><p class="bib-banniere__titre-section">Études</p></div></div>
</section>
```

Habillage : `--bib-banniere-voile` (voile uniforme, 50 %), `--bib-banniere-cadrage` (hauteur de la photo à garder, « 20 % » : les visages restent sous l’en-tête). Modificateurs : `--vague` (dégradé bleu foncé qui monte du coin bas gauche, avec une ombre diffuse sous les lettres), `--petite` (15 / 16 / 18 rem), `--titre-long` (titre de plus de 45 caractères : environ 70 % de la taille), `--section` (bande basse). Hauteurs minimales : 26 / 30 / 34 rem, puis le quart de la largeur dès 1536 px. **Placement propre à chaque site** : `--bib-banniere-entete` (hauteur d’un en-tête transparent que la bannière glisse sous elle dès 1200 px) et `--bib-banniere-marge-basse` (chevauchement avec le contenu suivant) valent 0 par défaut. Les deux réglages s’adaptent au gabarit du site.

### Avec Astro

```
---
import Banniere from 'harmonium/astro/Banniere.astro'
---
<Banniere titre="Les bibliothèques" image={photo} sousTitre="Étudier, chercher, créer." cadrage="20%" />
<Banniere variante="section" titre="Études" image={photo} />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titre, image | Titre de la page (`<h1>`) et photo. Obligatoires. |  |
| sousTitre | Texte sous le titre ; ou le slot `sousTitre`. Le contenu par défaut (sommaire, boutons) passe sous le texte. |  |
| alt | Texte de remplacement, seulement si la photo porte un message. | vide |
| cadrage | Hauteur de la photo à garder (« 20% »). En petit format sans cadrage, la photo est recadrée à la construction en 5:2. | le centre |
| taille | `normale` ou `petite`. | `normale` |
| vague | Dégradé bleu foncé à la place du voile noir uniforme. | oui |
| titreReduit | Police réduite pour le titre (aussi automatique au-delà de 45 caractères). | non |
| variante | `page` ou `section` (bande basse des sous-pages, titre en paragraphe). | `page` |

La photo est chargée en priorité (`fetchpriority="high"`, `loading="eager"`) : elle est en haut de page.

Le site garde, de son côté, le choix des images (par nom de fichier) et le cadrage propre à chaque photo : il les passe en propriétés.

### Variables d’habillage {#variables}

{{habillage-banniere}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Les pages de premier niveau (pages principales), en grand format, pour porter le titre de la page.
-   Les sous-pages, en bande basse (`--section`), pour nommer la section sans répéter le `<h1>` du contenu.
-   Une page de service qui doit montrer son contenu vite : le petit format.

### À éviter

-   **Une photo porteuse d’information** (plan, affiche) : elle est recadrée et voilée ; la mettre dans le contenu, avec son texte de remplacement.
-   **Un titre long en bannière de section** : la bande est courte ; un nom de section court suffit.
-   **Un message temporaire** : une [alerte](@@/composants/alertes.html) ou un [avis](@@/composants/avis.html), pas le sous-titre de la bannière.
-   **Deux bannières dans une page** : pour une image dans le contenu, la [bande image-texte](@@/composants/bande-image-texte.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Titres** : le titre est le `<h1>` de la page ; en bande basse, le nom de la section, répété sur toutes ses pages, devient un paragraphe à l’apparence d’un h2 et la bande une région nommée (WCAG 1.3.1, 2.4.6).
-   **Contraste sur photo** : le voile uniforme garde 4,5:1 même devant les zones claires de la photo ; la vague bleu foncé assombrit la partie basse à environ 70 %, là où est le titre (1.4.3).
-   **Texte agrandi** : hauteurs minimales, coupure des mots longs ; le titre n’est jamais rogné à 200 % (1.4.4, 1.4.10).
-   **Images décoratives** : `alt=""` par défaut ; la photo est en haut de page, chargée en priorité.
-   **Mouvement** : seul le fondu de la photo à son chargement ; il est coupé avec le mouvement réduit.

### Ce que l’intégrateur doit faire

-   Choisir une photo dont la zone du titre est calme, et remesurer le contraste quand la photo change.
-   Régler `cadrage` pour garder les visages, plutôt que de laisser la bannière couper au cou.
-   Donner un `alt` seulement si la photo apporte une information que le texte ne donne pas.
-   Écrire un titre court : au-delà de 45 caractères, il passe en police réduite.
