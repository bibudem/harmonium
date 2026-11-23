---
titre: "Copier dans le presse-papiers"
description: "Un texte court à saisir tel quel (adresse de serveur, identifiant, commande), en code, suivi d’un bouton « Copier ». Tout est en ligne : il se place dans une phrase ou un élément de liste."
fichiers: "`harmonium/astro/Copier.astro` · `bib-copier.min.css` · `bib-copier.min.js`"
ressources: "composants/copier"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/copier/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<span class="bib-copier" data-copier><code class="bib-copier__code">https://proxy.umontreal.ca</code><button type="button" class="bib-copier__bouton" data-texte="https://proxy.umontreal.ca" aria-label="Copier https://proxy.umontreal.ca" hidden><svg class="bib-copier__icone" …></svg><svg class="bib-copier__icone-copie" …></svg><span class="bib-copier__libelle" aria-hidden="true">Copier</span></button><span class="bib-masque" role="status"></span></span>
```

Garder le HTML sur une seule ligne : un blanc entre les éléments deviendrait une espace visible. Le script `bib-copier.min.js` retire l’attribut `hidden` du bouton seulement si le presse-papiers est disponible.

Habillage : `--bib-copier-fond`, `--bib-copier-fond-survol`, `--bib-copier-texte`, `--bib-copier-contour`.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-copier.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Le script fait fonctionner le composant : le charger sur chaque page qui l’utilise.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-copier.min.js"></script>
```

## Avec Astro {#astro}

```
---
import Copier from 'harmonium/astro/Copier.astro'
---
<p>Adresse du serveur mandataire : <Copier texte="https://proxy.umontreal.ca" /></p>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| texte | Le texte affiché et copié. Obligatoire. |  |
| class | Classes ajoutées à la racine. |  |

## Personnaliser {#variables}

{{habillage-copier}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Une valeur que la personne doit recopier exactement : adresse de serveur, nom de réseau, commande, identifiant de ressource.

### À éviter

-   **Pour un lien** que la personne va suivre : un [lien](@@/composants/lien.html).
-   **Pour un long bloc de code** : un bloc `<pre>` avec son propre bouton.
-   **Pour un texte ordinaire** : la personne sait déjà le sélectionner.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Rien de promis sans moyen** : sans JavaScript ou sans presse-papiers (contexte non sécurisé), le bouton reste masqué et le texte reste sélectionnable.
-   **Nom du bouton** : « Copier https://… » ; il commence par le mot visible (WCAG 2.5.3). Le libellé visible est masqué aux lecteurs d’écran pour ne pas être lu deux fois.
-   **Confirmation** : « Copié » s’affiche deux secondes avec une coche et s’annonce dans une région `role="status"` (4.1.3). En cas d’échec, le message invite à sélectionner le texte.

### Ce que l’intégrateur doit faire

-   Introduire la valeur par une phrase qui dit à quoi elle sert.
-   Ne copier que la valeur, sans ponctuation ni texte autour.
