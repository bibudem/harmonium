---
titre: "Liste de profils"
description: "Une grille de profils : des personnes ou des services (photo ronde ou initiales, nom, fonction) ; chaque vignette mène à la fiche complète."
fichiers: "`harmonium/astro/ListeProfils.astro` · `bib-liste-profils.min.css` · `bib-carte-lien.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/liste-profils/01.html]

 

::exemple[composants/liste-profils/02.html]

## Étape 1 : ajouter le HTML {#html}

```
<ul class="bib-liste-profils" aria-label="Équipe : Bibliothèque de droit">
  <li class="bib-liste-profils__profil bib-carte-lien">
    <img class="bib-liste-profils__photo" src="marie.jpg" alt="" width="160" height="160" loading="lazy">
    <h3 class="bib-liste-profils__nom"><a class="bib-lien-etire" href="/equipe/marie-tremblay/">Marie Tremblay</a></h3>
    <p class="bib-liste-profils__fonction">Bibliothécaire</p>
  </li>
  <li class="bib-liste-profils__profil bib-carte-lien">
    <span class="bib-liste-profils__photo bib-liste-profils__photo--initiales" aria-hidden="true">LG</span>
    <h3 class="bib-liste-profils__nom"><a class="bib-lien-etire" href="/equipe/lea-gagnon/">Léa Gagnon</a></h3>
    <p class="bib-liste-profils__fonction">Bibliothécaire, données de recherche</p>
  </li>
</ul>
```

Deux vignettes par rangée sur un téléphone, puis autant que la largeur le permet. Habillage des initiales : `--bib-liste-profils-initiales-fond`, `--bib-liste-profils-initiales-texte`.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-liste-profils.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-carte-lien.min.css">
```

## Avec Astro {#astro}

```
---
import ListeProfils from 'harmonium/astro/ListeProfils.astro'
---
<ListeProfils nom="Équipe : Bibliothèque de droit" profils={[
  { nomComplet: 'Marie Tremblay', fonction: 'bibliothécaire', url: '/equipe/marie-tremblay/', photo: marie },
  { nomComplet: 'Léa Gagnon', fonction: 'bibliothécaire, données de recherche', url: '/equipe/lea-gagnon/' },
]} />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| profils | Liste de `{ nomComplet, fonction, url, photo?, service? }`. Sans `photo` : les initiales. `service` : un service ou une équipe (Soutien informatique) plutôt qu’une personne ; une icône de groupe remplace la photo et la fonction devient une courte description. La fonction prend une majuscule initiale. Liste vide : rien n’est rendu. |  |
| nom | Nom accessible de la liste. | Équipe |
| niveauTitre | Niveau du nom, de 3 à 5. | 3 |
| class | Classes ajoutées à la racine. |  |

Pour le répertoire complet du personnel (recherche, filtres), voir le répertoire du personnel, hors de ce catalogue.

## Personnaliser {#variables}

{{habillage-liste-profils}}

### Ancien nom {#ancien-nom}

Jusqu’à la version 1.1, ce composant s’appelait « Équipe » : `Equipe.astro` (propriété `membres`), classes `bib-equipe` et `bib-equipe__vignette`, feuille `bib-equipe.min.css`. Ces noms fonctionnent encore, mais ils sont obsolètes et seront retirés en 2.0.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Présenter les personnes-ressources d’une bibliothèque, d’un service ou d’une discipline.

### À éviter

-   **Pour plus d’une vingtaine de personnes** : un répertoire avec recherche.
-   **Pour une seule personne-ressource dans un texte** : son nom en lien, avec sa fonction.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Un seul lien par vignette**, sur le nom, qui couvre toute la vignette ; le focus est tracé autour de la vignette (WCAG 2.4.7).
-   **Photo et initiales décoratives** (`alt=""`, `aria-hidden`) : le nom est juste dessous, il n’est pas lu deux fois.
-   **Texte agrandi** : largeur minimale en rem ; à 200 %, une colonne plutôt que des noms qui débordent (1.4.10). Les noms longs passent à la ligne.

### Ce que l’intégrateur doit faire

-   Utiliser des photos cadrées sur le visage, de même format et de même traitement.
-   Écrire la fonction en minuscules dans les données ; le composant met la majuscule.
