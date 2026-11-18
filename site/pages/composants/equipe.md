---
titre: "Équipe"
description: "Une grille de vignettes de personnes (photo ronde ou initiales, nom, fonction) ; chaque vignette mène à la fiche complète de la personne."
fichiers: "`harmonium/astro/Equipe.astro` · `bib-equipe.min.css` · `bib-carte-lien.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/equipe/01.html]

 

::exemple[composants/equipe/02.html]

## Utilisation {#utilisation}

### En HTML

```
<ul class="bib-equipe" aria-label="Équipe : Bibliothèque de droit">
  <li class="bib-equipe__vignette bib-carte-lien">
    <img class="bib-equipe__photo" src="marie.jpg" alt="" width="160" height="160" loading="lazy">
    <h3 class="bib-equipe__nom"><a class="bib-lien-etire" href="/equipe/marie-tremblay/">Marie Tremblay</a></h3>
    <p class="bib-equipe__fonction">Bibliothécaire</p>
  </li>
  <li class="bib-equipe__vignette bib-carte-lien">
    <span class="bib-equipe__photo bib-equipe__photo--initiales" aria-hidden="true">LG</span>
    <h3 class="bib-equipe__nom"><a class="bib-lien-etire" href="/equipe/lea-gagnon/">Léa Gagnon</a></h3>
    <p class="bib-equipe__fonction">Bibliothécaire, données de recherche</p>
  </li>
</ul>
```

Deux vignettes par rangée sur un téléphone, puis autant que la largeur le permet. Habillage des initiales : `--bib-equipe-initiales-fond`, `--bib-equipe-initiales-texte`.

### Avec Astro

```
---
import Equipe from 'harmonium/astro/Equipe.astro'
---
<Equipe nom="Équipe : Bibliothèque de droit" membres={[
  { nomComplet: 'Marie Tremblay', fonction: 'bibliothécaire', url: '/equipe/marie-tremblay/', photo: marie },
  { nomComplet: 'Léa Gagnon', fonction: 'bibliothécaire, données de recherche', url: '/equipe/lea-gagnon/' },
]} />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| membres | Liste de `{ nomComplet, fonction, url, photo?, service? }`. Sans `photo` : les initiales. `service` : un service ou une équipe (Soutien informatique) plutôt qu’une personne ; une icône de groupe remplace la photo et la fonction devient une courte description. La fonction prend une majuscule initiale. Liste vide : rien n’est rendu. |  |
| nom | Nom accessible de la liste. | Équipe |
| niveauTitre | Niveau du nom, de 3 à 5. | 3 |
| class | Classes ajoutées à la racine. |  |

Pour le répertoire complet du personnel (recherche, filtres), voir le répertoire du personnel, hors de ce catalogue.

### Variables d’habillage {#variables}

{{habillage-equipe}}

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
