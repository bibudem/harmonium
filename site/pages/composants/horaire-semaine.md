---
titre: "Horaire d’un service"
description: "L’horaire de la semaine d’un service qui a ses propres heures (soutien informatique, référence) : un onglet par jour, l’horaire du jour choisi et deux boutons pour changer de semaine."
fichiers: "`harmonium/astro/HoraireSemaine.astro` · `bib-horaire-semaine.min.css` · `bib-etat-erreur.min.css` · `bib-horaire-semaine.min.js`"
ressources: "composants/horaire-semaine"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/horaire-semaine/01.html]

## Étape 1 : ajouter le HTML {#html}

Le HTML de départ contient le titre, un texte de repli, l’état de chargement, l’[état d’erreur](@@/composants/etat-erreur.html) et la vue vide ; le script lit l’API des horaires et construit les onglets des jours. Le HTML complet est dans l’en-tête de `src/composants/horaire-semaine.css`.

```
<section class="bib-horaire-semaine" aria-labelledby="hs-titre" data-horaire-semaine data-bibliotheque="ss" data-service="soutien-informatique">
  <div class="bib-horaire-semaine__entete">…titre, période, boutons de semaine…</div>
  <p class="bib-horaire-semaine__repli" data-repli>Consultez les <a href="/horaires/">heures d’ouverture des bibliothèques</a>.</p>
  <p class="bib-horaire-semaine__repli" role="status" data-chargement hidden>Chargement de l’horaire…</p>
  <div class="bib-etat-erreur" hidden>…</div>
  <div class="bib-horaire-semaine__vue" data-vue hidden>…onglets et panneau…</div>
</section>
```

Habillage : `--bib-horaire-semaine-choisi-fond` et `-texte`, `--bib-horaire-semaine-action-survol`, `--bib-horaire-semaine-panneau-fond`, `--bib-horaire-semaine-aujourdhui`.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-horaire-semaine.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-etat-erreur.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Le script fait fonctionner le composant : le charger sur chaque page qui l’utilise.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-horaire-semaine.min.js"></script>
```

## Avec Astro {#astro}

```
---
import HoraireSemaine from 'harmonium/astro/HoraireSemaine.astro'
---
<HoraireSemaine bibliotheque="ss" service="soutien-informatique" titre="Horaire du soutien informatique" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| bibliotheque | Code de la bibliothèque dans l’API. Obligatoire. |  |
| service | Code du service dans l’API. Obligatoire. |  |
| titre | Titre de la section. | Horaire de la semaine |
| niveauTitre | Niveau du titre, de 2 à 6. | 3 |
| api | Autre adresse de l’API (essais). | API des bibliothèques |
| class | Classes ajoutées à la racine. |  |

## Personnaliser {#variables}

{{habillage-horaire-semaine}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Un service dont les heures diffèrent de celles de la bibliothèque, sur la page de ce service.

### À éviter

-   **Pour les heures d’ouverture des bibliothèques** : le bandeau des horaires et les pages d’horaires.
-   **Pour un horaire fixe qui ne change jamais** : une phrase ou un [tableau](@@/composants/tableau.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sans script ou sans API**, le texte de repli renvoie à la page des horaires ; en cas d’échec, l’état d’erreur propose de réessayer.
-   **Onglets des jours** (`role="tablist"`, `tab`, `tabpanel`) : flèches gauche et droite, Début, Fin (patron APG).
-   **Période annoncée** (`aria-live="polite"`) quand la semaine change ; boutons de semaine nommés (« Semaine suivante »).

### Ce que l’intégrateur doit faire

-   Donner un titre qui nomme le service.
-   Vérifier que le service existe dans l’API avant de publier ; sinon, la page n’affiche que le repli.
