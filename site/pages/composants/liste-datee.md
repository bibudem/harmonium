---
titre: "Liste datée"
description: "Une liste de contenus datés : nouvelles, revue de presse, événements, formations. Chaque élément a une vignette ou la date en grand, une ligne avec la date et la source, un titre en lien et une pastille fléchée."
fichiers: "`harmonium/astro/ListeActualites.astro` · `harmonium/astro/Actualite.astro` · `harmonium/astro/ListeEvenements.astro` · `harmonium/astro/ListeFormations.astro` · `bib-actualite.min.css` · `bib-carte-lien.min.css` · `bib-listes-dynamiques.min.js` (sources dynamiques)"
statut: beta
ressources: "composants/liste-datee"
---

## Aperçu {#apercu}

::exemple[composants/liste-datee/01.html]

 

::exemple[composants/liste-datee/02.html]

 

::exemple[composants/liste-datee/03.html]

 

::exemple[composants/liste-datee/04.html]

## Étape 1 : ajouter le HTML {#html}

Le composant garde ses noms de code d’origine : `ListeActualites` et `Actualite` en Astro, `bib-actualites` et `bib-actualite` en CSS. Chaque élément repose sur le lien étiré et la pastille fléchée décrits dans [Carte à icône](@@/composants/carte-icone.html#lien-etire) : chargez `bib-carte-lien.min.css` avec `bib-actualite.min.css`. Les compositions de page qui assemblent cette liste (`ListeNouvelles`, `QuoiDeNeuf`, `ColonneActualites`) sont décrites ailleurs.

```
<ul class="bib-actualites">
  <li class="bib-actualite bib-carte-lien">
    <span class="bib-actualite__vignette"><img src="photo.jpg" alt="" width="300" height="300" loading="lazy"></span>
    <div class="bib-actualite__texte">
      <p class="bib-actualite__ligne"><span><strong>Les bibliothèques</strong>&nbsp;·&nbsp;<time datetime="2026-11-18">18 novembre 2026</time></span></p>
      <a class="bib-actualite__titre bib-lien-etire" href="/nouvelles/horaire-examens/"><span>Horaire prolongé pendant la période des examens</span></a>
    </div>
    <span class="bib-actualite__coin"><span class="bib-pastille-fleche bib-pastille-fleche--petite" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span></span>
  </li>
</ul>

<!-- Date en grand, à la place de la vignette -->
<time class="bib-actualite__vignette bib-actualite__vignette--date" datetime="2026-11-27">
  <span class="bib-actualite__jour">27</span><span class="bib-actualite__mois">nov.</span><span class="bib-actualite__annee">2026</span>
</time>

<!-- Article d’un autre site (revue de presse) -->
<a class="bib-actualite__titre bib-lien-etire" href="https://www.ledevoir.com/…" target="_blank" rel="noopener">
  <span>Titre de l’article</span><span class="bib-masque"> (nouvel onglet)</span>
</a>
…<span class="bib-pastille-fleche bib-pastille-fleche--externe bib-pastille-fleche--petite" aria-hidden="true">…</span>
```

La vignette est facultative : sans elle, le texte prend toute la largeur. Un titre dans une autre langue porte son `lang` sur le `<span>` du titre. Une icône de calendrier peut précéder la date : `<span class="bib-actualite__calendrier" aria-hidden="true"></span>` au début de la ligne.

Variantes :

-   **Date en grand** (`bib-actualite__vignette--date`) : la date occupe la case de la vignette (jour, mois abrégé, année) ; les titres restent alignés d’un élément à l’autre. La ligne ne garde alors que la source ou le lieu.
-   **`bib-actualite--compact`** : pour les colonnes d’une section « Quoi de neuf ». Il n’agit que dans le conteneur `quoi-de-neuf` d’une colonne (`bib-colonne-actualites__corps`) : marges resserrées et, dès 900 px dans une colonne d’au moins 17 em, hauteur minimale et titre coupé à trois lignes, pour que les rangées tombent au même niveau d’une colonne à l’autre. Ailleurs, l’élément garde sa forme habituelle.
-   **`bib-actualites-dynamique--deux-colonnes`** : sur le conteneur d’une source dynamique (voir plus bas), les éléments se rangent en deux colonnes dès 900 px, la moitié dans chacune, de haut en bas puis à droite. `--bib-actualites-rangees` donne le nombre de rangées (la moitié du nombre d’éléments, arrondie vers le haut).

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-actualite.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-carte-lien.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Le script fait fonctionner le composant : le charger sur chaque page qui l’utilise.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-listes-dynamiques.min.js"></script>
```

## Avec Astro {#astro}

**Liste lue à la construction du site** (nouvelles, revue de presse) :

```
---
import ListeActualites from 'harmonium/astro/ListeActualites.astro'
---
<ListeActualites elements={[
  { titre: 'Horaire prolongé pendant la période des examens', url: '/nouvelles/horaire-examens/', date: '2026-11-18', dateTexte: '18 novembre 2026' },
  { titre: 'Les archives de l’Université racontent un siècle de vie étudiante', url: 'https://www.ledevoir.com/…', date: '2026-11-04', dateTexte: '4 novembre 2026', source: 'Le Devoir', externe: true },
]} />
```

Chaque élément de la liste a un `titre`, une `url`, une `date` (AAAA-MM-JJ) et sa `dateTexte` (la date écrite en toutes lettres) ; facultativement, une `source` (le média d’un article de presse), `externe` (un autre site, ouvert dans un nouvel onglet) et `lang` (la langue du titre).

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| elements | Les éléments de la liste (voir ci-dessus). |  |
| dateEnGrand | La date passe dans la case de la vignette ; la ligne ne garde que la source. | non |
| compact | Éléments compacts, pour les colonnes d’une section « Quoi de neuf ». | non |
| sourceParDefaut | Source affichée quand un élément n’en a pas. | « Les bibliothèques » |
| vide | Texte affiché quand la liste est vide. | « Aucune nouvelle pour le moment » |

**Un élément à la fois**, pour une vignette ou une ligne sur mesure, dans un `<ul class="bib-actualites">` :

```
---
import Actualite from 'harmonium/astro/Actualite.astro'
---
<ul class="bib-actualites">
  <Actualite href="/nouvelles/salles-equipe/" vignette image="/images/salle-equipe.jpg">
    <span slot="ligne"><strong>Les bibliothèques</strong>&nbsp;·&nbsp;<time datetime="2026-11-10">10 novembre 2026</time></span>
    De nouvelles salles d’étude en équipe
  </Actualite>
  <Actualite href="/activites/zotero/" date="2026-11-27">
    <span slot="ligne"><strong>Bibliothèque des lettres et sciences humaines</strong></span>
    Atelier : gérer ses références avec Zotero
  </Actualite>
</ul>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| href | Adresse du titre. Sans elle, le titre n’est pas un lien. |  |
| slot | `ligne` : la ligne au-dessus du titre (date, source). Le slot par défaut est le titre. |  |
| vignette, image | Réserve la case carrée et, avec `image`, y place l’image (décorative, `alt=""`). Sans image, un carré vide. | non |
| date | AAAA-MM-JJ : la date en grand dans la case de la vignette. |  |
| calendrier | Icône de calendrier au début de la ligne. | non |
| externe | Autre site : nouvel onglet, annoncé en texte masqué, et flèche oblique. | non |
| target, rel | Cible et relation du lien, quand `externe` ne suffit pas. |  |
| compact | Élément compact, pour les colonnes d’une section « Quoi de neuf ». | non |
| squelette | Des barres à la place des textes, masquées aux lecteurs d’écran (attente d’une source dynamique). | non |
| lang | Langue du titre. |  |

## Sources dynamiques {#sources}

Les événements et les formations changent tous les jours : la liste n’est pas lue à la construction du site, mais dans le navigateur, par `bib-listes-dynamiques.min.js`. Ce sont deux sources de données de la même liste datée : un flux RSS (les événements du calendrier de l’Université) et une API JSON (les formations des bibliothèques). Le script remplit un gabarit d’élément pour chaque entrée : lien, titre, vignette et ligne de date.

```
<script type="module" src="…/harmonium@1/dist/bib-listes-dynamiques.min.js"></script>

<div class="bib-actualites-dynamique" data-liste-evenements data-service="https://calendrier.umontreal.ca/activites/export.rss?…"
     data-limite="3" data-repli-image="/images/evenement.svg" aria-busy="true">
  <ul class="bib-actualites" data-etat="chargement">…trois éléments bib-actualite--squelette…</ul>
  <p class="bib-masque" data-etat="chargement">Chargement des événements…</p>
  <ul class="bib-actualites" data-etat="pret" data-liste hidden></ul>
  <div class="bib-etat-erreur" data-etat="erreur" hidden>
    <p>Les événements ne sont pas disponibles pour le moment.</p>
    <button type="button" class="bib-etat-erreur__bouton" data-reessayer>…Réessayer</button>
  </div>
  <p data-etat="vide" hidden>Aucun événement à afficher pour le moment</p>
  <p class="bib-actualites-dynamique__sans-js">Les événements s’affichent avec JavaScript. Consultez-les dans le
    <a href="https://calendrier.umontreal.ca/activites?organisateurs=les-bibliotheques" target="_blank" rel="noopener noreferrer">calendrier de l’Université<span class="bib-masque"> (nouvel onglet)</span></a>.</p>
  <template data-gabarit>
    <li class="bib-actualite bib-carte-lien bib-actualite--compact">
      <span class="bib-actualite__vignette" data-champ="vignette"></span>
      <div class="bib-actualite__texte">
        <p class="bib-actualite__ligne"><span class="bib-actualite__calendrier" aria-hidden="true"></span><span data-champ="date"></span></p>
        <a class="bib-actualite__titre bib-lien-etire" href="#" target="_blank" rel="noopener" data-champ="lien"><span data-champ="titre"></span><span class="bib-masque"> (nouvel onglet)</span></a>
      </div>
      <span class="bib-actualite__coin"><span class="bib-pastille-fleche bib-pastille-fleche--externe bib-pastille-fleche--petite" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span></span>
    </li>
  </template>
</div>
```

-   **La source** : `data-liste-evenements` lit un flux RSS (titre, lien, date de publication, image en `<enclosure>`) et retire les doublons que le flux répète pour chaque type d’activité ; `data-liste-formations` lit un tableau JSON (`url`, `titre`, `date`, `debut`, `fin`, `imageVedette`) et écrit la ligne « date · début–fin ». `data-service` donne l’adresse, `data-limite` le nombre d’éléments (3 événements, 4 formations par défaut).
-   **Les états** : un seul élément `data-etat` est affiché à la fois. `chargement` : un squelette garde la place, pour que la page ne saute pas, et un texte masqué dit ce qui se charge ; `aria-busy="true"` sur le conteneur. `pret` : la liste remplie (`data-liste`). `erreur` : l’[état d’erreur](@@/composants/etat-erreur.html) et son bouton « Réessayer » (`data-reessayer`), qui relance le chargement. `vide` : une phrase quand il n’y a rien à venir.
-   **Les délais** : le flux RSS a 10 s par tentative et une seconde tentative avant l’erreur (il met 2 à 3 s à répondre) ; l’API des formations, 5 s. Le détail d’un échec reste dans la console.
-   **Les images** : `data-repli-image` (événements) donne une image décorative à un événement qui n’en a pas, ou dont l’image ne se charge pas. Sans repli, le carré reste vide plutôt que d’afficher une icône cassée.
-   **Sans JavaScript** : les états sont masqués et `bib-actualites-dynamique__sans-js` renvoie au calendrier complet.
-   **Navigation côté client** : le script branche aussi les listes ajoutées à l’événement `astro:page-load`, une seule fois par conteneur.

Les composants Astro produisent ce HTML dans une colonne titrée (`ColonneActualites`), avec un bouton « Tous nos… » vers le calendrier ; ils importent les feuilles de style. Chargez le script sur la page.

```
---
import ListeEvenements from 'harmonium/astro/ListeEvenements.astro'
---
<ListeEvenements limite={3} repliImage="/images/evenement.svg" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| service | Adresse absolue d’un autre flux RSS (une adresse invalide ramène le défaut). | flux des activités des bibliothèques au calendrier de l’Université |
| limite | Nombre d’événements. | `3` |
| repliImage | Image décorative d’un événement sans vignette, ou dont la vignette ne se charge pas. |  |
| titre | Titre de la colonne (`h3`). | « Événements » |
| titreMasque | Le titre reste pour les lecteurs d’écran seulement. | non |
| textePlus, lienPlus | Texte et adresse du bouton de fin, ouvert dans un nouvel onglet. | « Tous nos événements », le calendrier des bibliothèques |
| plusCentre | Bouton de fin plein, centré sous la liste. | non |
| id | `id` du titre de la colonne. | généré |

```
---
import ListeFormations from 'harmonium/astro/ListeFormations.astro'
---
<ListeFormations limite={6} colonnes={2} titreMasque plusCentre />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| service | Adresse d’une autre API ; elle reçoit `?limit=`. | `https://api.bib.umontreal.ca/formations/` |
| limite | Nombre de formations. | `4` |
| colonnes | `2` : les éléments se rangent en deux colonnes dès 900 px. | `1` |
| titre | Titre de la colonne (`h3`). | « Formations » |
| titreMasque | Le titre reste pour les lecteurs d’écran seulement. | non |
| textePlus, lienPlus | Texte et adresse du bouton de fin. | « Toutes nos formations », le calendrier des formations |
| nouvelOnglet | Ouvre `lienPlus` dans un nouvel onglet. | oui s’il mène hors du site |
| plusCentre | Bouton de fin plein, centré sous la liste. | non |
| id | `id` du titre de la colonne. | généré |

## Personnaliser {#variables}

{{habillage-actualite}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Les dernières nouvelles des bibliothèques sur une page d’accueil ou la page d’une bibliothèque, de la plus récente à la plus ancienne.
-   Une revue de presse : la ligne nomme le média, le lien mène à l’article.
-   Les prochains événements ou formations, lus dans le calendrier : la date en grand ou la ligne de date aide à repérer ce qui vient.
-   Trois à six éléments, suivis d’un lien vers la liste complète.

### À éviter

-   **Pour des liens sans date** (services, sous-pages) : la [liste de liens](@@/composants/liste-liens.html).
-   **Pour mettre en avant quelques contenus en image** : le [carrousel](@@/composants/carrousel.html) de cartes.
-   **Pour une longue liste à trier ou à filtrer** (toutes les nouvelles, un répertoire) : la [liste filtrable](@@/composants/liste-filtrable.html).
-   **Pour des contenus qui ne changent pas au fil du temps** : la date n’apporte rien et charge la lecture.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Liste réelle** (`<ul>`, `<li>`) : le lecteur d’écran annonce le nombre d’éléments (WCAG 1.3.1).
-   **Un lien par élément**, nommé par le titre, dont la zone couvre tout l’élément : un seul arrêt de tabulation, une grande cible (2.4.4, 2.5.8).
-   **Dates lisibles par les machines** : `<time datetime="…">`, en toutes lettres dans la ligne, en chiffres et en mois abrégé dans la date en grand.
-   **Images, pastille et icône décoratives** : vignette en `alt=""`, pastille fléchée et calendrier en `aria-hidden` ; l’information passe par le texte (1.1.1).
-   **Autre site annoncé** : un lien ouvert dans un nouvel onglet ajoute « (nouvel onglet) » en texte masqué et montre la flèche oblique, sans dépendre de la couleur (1.4.1). Un titre dans une autre langue porte son `lang` (3.1.2).
-   **Focus** : contour de 3 px autour de l’élément entier, que le lien couvre (2.4.7) ; le titre change de couleur au survol comme au focus.
-   **Contrastes** : date en grand, bleu foncé sur bleu pâle (15,7:1) (1.4.3).
-   **Texte agrandi** : la coupe du titre à trois lignes (`--compact`) ne s’applique que dans une colonne d’au moins 17 em, jamais avec le texte agrandi à 200 % (1.4.4) ; la hauteur minimale laisse l’élément grandir avec l’espacement du texte (1.4.12). Dans une colonne étroite en em, la vignette d’un élément compact passe au-dessus du texte (1.4.10).
-   **Sources dynamiques** : le squelette est masqué aux lecteurs d’écran (`aria-hidden`) et remplacé pour eux par « Chargement des… » ; le conteneur porte `aria-busy` pendant l’attente. En cas d’échec, le message est en texte et « Réessayer » rend le focus au conteneur au lieu du haut de la page (2.4.3). Sans JavaScript, un lien mène au calendrier complet.
-   **Mouvement réduit** : la pulsation du squelette s’arrête (2.3.3). En contraste élevé (Windows), barres et icône prennent la couleur du texte.

### Ce que l’intégrateur doit faire

-   Placer un titre avant la liste (« Nouvelles », « Prochaines formations ») : `ListeActualites` n’en produit pas ; `ListeEvenements` et `ListeFormations` en ont un.
-   Écrire des titres qui se comprennent seuls : ils sont la seule partie lue du lien (2.4.4).
-   Écrire la date en toutes lettres dans `dateTexte` (« 18 novembre 2026 ») et la nommer dans la ligne d’un élément fait à la main.
-   Ne mettre aucune information dans la vignette : elle est décorative.
-   Indiquer `externe` pour un article d’un autre site, et `lang` pour un titre dans une autre langue.
-   Pour une source dynamique, garder le lien de fin vers le calendrier complet : c’est le recours si le flux ne répond pas.
