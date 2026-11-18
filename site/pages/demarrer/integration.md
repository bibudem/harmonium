---
titre: "Intégrer à un site"
description: "Harmonium se charge de la même façon dans tout site : WordPress, Drupal, HTML statique ou Astro. Les composants sont du HTML et du CSS, avec un peu de JavaScript quand il le faut."
---

## Les feuilles de style {#feuilles}

Deux fichiers suffisent pour tous les composants sans script. Les jetons de design (couleurs, espacements, tailles) se chargent d’abord : les composants ne contiennent aucune valeur en dur.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-jetons.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-composants.min.css">
```

`bib-composants.min.css` réunit tous les composants. Pour n’en charger qu’un, utiliser sa feuille seule (`bib-citation.min.css`, `bib-fil-ariane.min.css`…), indiquée au haut de chaque fiche.

## Avec Astro {#astro}

Un site Astro installe le dépôt comme paquet, une fois, puis importe les composants. Chaque composant Astro produit **exactement le HTML documenté** dans sa fiche et importe sa feuille : une seule source pour les sites Astro et les autres.

```
npm install github:bibudem/harmonium#v1.1.0
```

```
---
import 'harmonium/jetons.css'
import Citation from 'harmonium/astro/Citation.astro'
---
<Citation source="Dr Gilles Théorêt">…</Citation>
```

Le chemin d’un composant est `harmonium/astro/Nom.astro`. L’étiquette fixe la version ; pour en changer, relancer `npm install` avec la nouvelle. Les composants sont écrits en TypeScript et se compilent avec le site.

Les composants à script (urgence, avis, clavardage, rétroaction, consentement) se chargent par balise `<script>` dans tous les sites, Astro compris.

## Les scripts des composants {#scripts}

La plupart des composants ne sont que du HTML et du CSS. Certains ont aussi un petit fichier JavaScript (`bib-<nom>.min.js`), indiqué en haut de leur fiche. On ne le charge que si la page utilise le composant.

Ces scripts sont de deux sortes. Tous se relancent d’eux-mêmes après une navigation sans rechargement (`ClientRouter` d’Astro).

### Nécessaires {#scripts-necessaires}

Sans son script, le composant ne fonctionne pas ou n’apparaît pas.

| Script | Composant | Rôle |
| --- | --- | --- |
| `bib-onglets.min.js` | [Onglets](@@/composants/onglets.html) | Rôles ARIA, flèches du clavier, groupes synchronisés. Sans lui, les panneaux s’affichent l’un sous l’autre. |
| `bib-retour-haut.min.js` | [Retour en haut](@@/composants/retour-haut.html) | Affiche le bouton après un défilement et ramène en haut. |
| `bib-entete.min.js` | [En-tête](@@/composants/entete.html) | Montre les commandes et ouvre le menu. |
| `bib-integration.min.js` | [Intégration tierce](@@/composants/integration.html) | Charge le formulaire ou le clavardage du fournisseur. |
| `bib-horaire-semaine.min.js` | [Horaire d’un service](@@/composants/horaire-semaine.html) | Lit l’horaire dans l’API ; sans lui, le texte de repli reste. |
| `bib-avis.min.js`, `udem-urgence.min.js`, `bib-clavardage.min.js`, `bib-consentement.min.js`, `bib-retroaction-usager.min.js` | [Avis](@@/composants/avis.html), [urgence](@@/composants/urgence.html), [clavardage](@@/composants/clavardage.html), [consentement](@@/composants/consentement.html), [rétroaction](@@/composants/retroaction.html) | Le composant entier : il se charge par balise `<script>` dans tous les sites, Astro compris. |

### Facultatifs {#scripts-facultatifs}

Le composant marche sans eux ; le script ajoute un confort.

| Script | Composant | Ce qu’il ajoute |
| --- | --- | --- |
| `bib-accordeons.min.js` | [Accordéons](@@/composants/accordeons.html) | Ouvre le volet visé par une ancre ; le titre cliqué reste sous le pointeur. |
| `bib-carrousel.min.js` | [Carrousel](@@/composants/carrousel.html) | Flèches, annonce des cartes visibles, barre de progression, fondu du bord. |
| `bib-chiffres.min.js` | [Chiffres clés](@@/composants/chiffres.html) | Remplissage des barres et montée des nombres à l’affichage. |
| `bib-copier.min.js` | [Copier](@@/composants/copier.html) | Montre le bouton « Copier » si le presse-papiers est disponible. |
| `bib-infobulle.min.js` | [Infobulle](@@/composants/infobulle.html) | Échap ferme l’infobulle affichée. |
| `bib-liste-filtrable.min.js` | [Liste filtrable](@@/composants/liste-filtrable.html) | Recherche et filtre par catégorie ; sans lui, la liste complète reste lisible. |
| `bib-pied-de-page.min.js` | [Pied de page](@@/composants/pied-de-page.html) | Colonnes repliables sous 900 px ; bouton des témoins. |
| `bib-sceau.min.js` | [Sceau](@@/composants/sceau.html) | Le texte tourne autour du U au survol. |
| `bib-table-matieres.min.js` | [Table des matières](@@/composants/table-matieres.html) | Marque la section en cours de lecture. |
| `bib-tableau.min.js` | [Tableau](@@/composants/tableau.html) | La zone n’est un arrêt de tabulation que si le tableau défile. |
| `bib-video.min.js` | [Vidéo](@@/composants/video.html) | Remplace le lien vers la plateforme par le lecteur intégré. |

## Adopter progressivement {#adoption}

Commencer au niveau qui répond au besoin : jetons seuls pour rapprocher un site existant ; jetons et feuilles ciblées pour quelques composants ; feuille complète pour un nouveau site. Ajouter les scripts seulement aux composants interactifs utilisés. Les adaptateurs Astro produisent le même HTML : aucun framework n’est requis pour utiliser Harmonium.

Placer le [lien d’évitement](@@/composants/lien-evitement.html) en premier dans le `body` et donner `id="contenu" tabindex="-1"` au contenu principal.

## Page complète : où va chaque élément {#page-complete}

Le modèle ci-dessous place les feuilles et les cinq composants à script. Les autres composants ([alertes](@@/composants/alertes.html), citation…) s’utilisent dans le contenu, où il faut. Les scripts vont dans le `<head>` (sauf le clavardage, juste avant `</body>`) ; chaque élément va à sa place dans la page.

```
<!doctype html>
<html lang="fr-CA">
  <head>
    …
    <!-- Styles -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-jetons.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-composants.min.css">
    <!-- Composants à script (dans le <head>) -->
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/udem-urgence.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-avis.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-retroaction-usager.min.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-consentement.min.js"></script>
  </head>
  <body>
    <a class="bib-lien-evitement" href="#contenu">Aller au contenu</a>
    <!-- Tout en haut, dans cet ordre -->
    <udem-urgence></udem-urgence>
    <bib-avis bouton-fermer></bib-avis>

    <header>…en-tête du site…</header>

    <main id="contenu" tabindex="-1">
      …contenu de la page…

      <!-- À la fin du contenu -->
      <aside aria-label="Rétroaction sur la page">
        <bib-retroaction-usager></bib-retroaction-usager>
      </aside>
    </main>

    <footer>
      …
      <bib-consent-preferences-btn></bib-consent-preferences-btn>
    </footer>

    <!-- Juste avant </body> -->
    <bib-consentement gtm-id="GTM-K8BQPC" clarity-id="tfds44a7xa"></bib-consentement>
    <script defer src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-clavardage.min.js"></script>
  </body>
</html>
```

## Adresse des fichiers {#adresses}

Les fichiers sont servis par jsDelivr depuis le dépôt GitHub :

```
https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/
```

Le numéro placé après `@` choisit la version. Deux façons de l’écrire :

| Adresse | Ce que le site reçoit | Quand la choisir |
| --- | --- | --- |
| `harmonium@1/dist/…` | La dernière version 1.x. Les corrections arrivent seules, en 12 h environ (délai du cache de jsDelivr). | Cas courant : le site profite des correctifs sans rien changer. |
| `harmonium@1.1.0/dist/…` | Toujours le même fichier, figé. Rien ne change tant qu’on ne modifie pas le numéro. | Page qu’on ne peut pas revérifier souvent. |

Un changement qui casse l’usage passe à `@2` : avec `@1`, un site n’est jamais touché par une version majeure ; il migre quand il est prêt.

## Essais et démonstration {#essais}

Ce mini-site charge les fichiers de `dist/` du dépôt, ceux que publie jsDelivr. Les services réels (avis, urgence, LibChat) sont appelés pour de vrai ; les exemples d’avis et d’urgence utilisent des messages simulés.
