---
titre: "Liste filtrable"
description: "Une liste de fiches (logiciels, ressources, bases de données) rendue en entier dans la page, avec une recherche sans accents, un filtre par catégorie et un compte annoncé."
fichiers: "`harmonium/astro/ListeFiltrable.astro` · `harmonium/astro/FicheFiltrable.astro` · `bib-liste-filtrable.min.css` · `bib-champ-liste.min.css` · `bib-liste-filtrable.min.js` (facultatif)"
ressources: "composants/liste-filtrable"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/liste-filtrable/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<div class="bib-liste-filtrable" data-liste-filtrable data-unite="logiciel" data-unites="logiciels">
  <form class="bib-liste-filtrable__filtres" role="search" aria-label="Logiciels" data-filtres hidden>
    <p class="bib-liste-filtrable__consigne">Recherchez un logiciel ou filtrez par catégorie :</p>
    <div class="bib-liste-filtrable__champs">
      <div class="bib-champ-liste bib-champ-liste--recherche">
        <label class="bib-champ-liste__etiquette" for="lf-q">Rechercher</label>
        <div class="bib-champ-liste__boite"><input id="lf-q" type="search" autocomplete="off" data-recherche></div>
      </div>
      <div class="bib-champ-liste">
        <label class="bib-champ-liste__etiquette" for="lf-cat">Catégorie</label>
        <div class="bib-champ-liste__boite"><select id="lf-cat" data-categorie><option value="">Toutes</option><option>Bureautique</option></select></div>
      </div>
    </div>
  </form>
  <p class="bib-liste-filtrable__compte" role="status" data-compte>73 logiciels</p>
  <ul class="bib-liste-filtrable__liste" data-liste>
    <li class="bib-liste-filtrable__fiche" data-categorie="Gestion bibliographique" data-texte="Zotero Gestionnaire de références">
      <h3 class="bib-liste-filtrable__nom"><a href="/logiciels/zotero">Zotero</a></h3>
      <p class="bib-liste-filtrable__categorie">Gestion bibliographique</p>
      <p class="bib-liste-filtrable__description">Gestionnaire de références bibliographiques</p>
    </li>
  </ul>
  <p class="bib-liste-filtrable__vide" data-vide hidden><span data-vide-texte></span> Vérifiez l’orthographe ou <a href="mailto:…">écrivez-nous</a>.</p>
</div>
```

La recherche ignore la casse et les accents et porte sur `data-texte` ; le filtre porte sur `data-categorie`. Deux colonnes de fiches dès que le composant a 36 rem de large (requête de conteneur).

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-liste-filtrable.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-champ-liste.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Facultatif : le script ajoute le comportement interactif. Sans lui, le contenu reste lisible et utilisable.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-liste-filtrable.min.js"></script>
```

## Avec Astro {#astro}

```
---
import ListeFiltrable from 'harmonium/astro/ListeFiltrable.astro'
import FicheFiltrable from 'harmonium/astro/FicheFiltrable.astro'
---
<ListeFiltrable nom="Logiciels" total={logiciels.length} categories={categories} unite="logiciel" unites="logiciels">
  {logiciels.map((l) => <FicheFiltrable nom={l.nom} href={l.url} categorie={l.categorie} description={l.description} />)}
</ListeFiltrable>
```

| Propriété (ListeFiltrable) | Rôle | Défaut |
| --- | --- | --- |
| nom | Nom du formulaire de recherche. Obligatoire. |  |
| total | Nombre de fiches, pour le compte initial. Obligatoire. |  |
| categories | Choix du filtre ; sans elles, pas de filtre. |  |
| unite, unites | Mot du compte, au singulier et au pluriel. | résultat, résultats |
| consigne, placeholder, toutes | Textes du formulaire. | —, Nom ou description, Toutes |
| videRecherche, videCategorie | Messages quand rien ne correspond (`{q}` : la recherche). |  |

| Propriété (FicheFiltrable) | Rôle | Défaut |
| --- | --- | --- |
| nom | Nom de la fiche. Obligatoire. |  |
| href | Page de la fiche. |  |
| categorie, description | Textes affichés. |  |
| texte | Texte cherché, s’il diffère du nom et de la description. |  |
| niveauTitre | Niveau du titre, de 2 à 6. | 3 |

## Personnaliser {#variables}

{{habillage-liste-filtrable}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Une liste de 15 à quelques centaines de fiches que les personnes parcourent par nom ou par catégorie.

### À éviter

-   **Pour des données tabulaires** à comparer en colonnes : le tableau filtrable.
-   **Pour moins d’une quinzaine d’éléments** : une simple liste, sans formulaire.
-   **Pour une recherche dans le catalogue des bibliothèques** : la [barre de recherche](@@/composants/recherche.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sans JavaScript**, le formulaire reste masqué et la liste complète se lit telle quelle.
-   **Compte annoncé** (`role="status"`) 400 ms après la dernière touche, pour ne pas interrompre la frappe (WCAG 4.1.3).
-   **Champs étiquetés** : libellés visibles, `role="search"` nommé.
-   **Résultat vide expliqué**, avec une piste (orthographe, contact).

### Ce que l’intégrateur doit faire

-   Remplir `data-texte` avec les synonymes utiles (sigles, anciens noms).
-   Garder des noms de catégorie courts et mutuellement exclusifs.
