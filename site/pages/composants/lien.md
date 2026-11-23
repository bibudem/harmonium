---
titre: "Lien"
description: "Un lien du contenu : souligné pour se distinguer autrement que par la couleur, avec en option une flèche, et l’annonce d’un PDF ou d’un nouvel onglet."
fichiers: "`harmonium/astro/Lien.astro` · `bib-lien.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/lien/01.html]

 

::exemple[composants/lien/02.html]

 

::exemple[composants/lien/03.html]

## Étape 1 : ajouter le HTML {#html}

```
<a class="bib-lien" href="/services/">Voir les services</a>

<a class="bib-lien bib-lien--icone" href="/services/">Voir les services<span class="bib-lien__icone" aria-hidden="true"></span></a>

<!-- Autre site dans le texte (flecheExterne) : reste souligné, petite flèche collée -->
<a class="bib-lien" href="https://exemple.ca/">Autre site<span class="bib-masque"> (lien externe)</span><span class="bib-lien__icone bib-lien__icone--externe" aria-hidden="true"></span></a>

<!-- Un PDF : icône ajoutée par la feuille, annonce en texte masqué -->
<a class="bib-lien" href="guide.pdf" target="_blank" rel="noopener">Guide<span class="bib-masque"> (PDF, nouvel onglet)</span></a>
```

Habillage : `--bib-lien-couleur` et `--bib-lien-couleur-survol` (ceux des liens du thème par défaut), `--bib-lien-pdf` (rouge orangé, couleur de l’icône PDF). `bib-lien--sans-pdf` retire l’icône PDF d’un lien.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-lien.min.css">
```

## Avec Astro {#astro}

```
---
import Lien from 'harmonium/astro/Lien.astro'
---
<Lien href="/services/">Voir les services</Lien>
<Lien href="/services/" Icone>Voir les services</Lien>
<Lien href="https://exemple.ca/" flecheExterne>Autre site</Lien>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| href | Adresse du lien. |  |
| Icone | `true` pour la flèche → ; sinon un composant d’icône, rendu avec `proprietesIcone`. |  |
| flecheExterne | Un lien vers un autre site (hors famille des bibliothèques) porte la flèche ↗ et l’annonce « (lien externe) » ; jamais pour un PDF, un courriel ni un téléphone. | non |
| target, rel | `target="_blank"` reçoit `rel="noopener"` ; un PDF s’ouvre dans un nouvel onglet. |  |

## Personnaliser {#variables}

{{habillage-lien}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Renvoyer vers une page, un document ou un autre site au fil du texte.
-   Un lien isolé sous un bloc (« Toutes les heures d’ouverture → »), avec l’icône flèche (`Icone`).

### À éviter

-   **Pour l’action principale de la page** : un [bouton](@@/composants/bouton.html) se voit mieux.
-   **Pour déclencher une action sur place** (ouvrir un panneau, envoyer un formulaire) : c’est un `<button>`, pas un lien.
-   **Pour une liste de destinations mises en valeur** : des [cartes à icône](@@/composants/carte-icone.html) ou une liste de liens.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Distinct sans la couleur** : souligné dans le texte (WCAG 1.4.1) ; le soulignement s’épaissit au survol. Le lien à icône n’est pas souligné : la flèche le signale.
-   **Annonces en texte masqué** : « (PDF) », « (nouvel onglet) » et « (lien externe) » complètent le nom du lien (2.4.4, 3.2.5).
-   **Icônes muettes** : flèches `aria-hidden` et `focusable="false"` ; l’icône PDF est un fond CSS, jamais lu.
-   **Clavier et focus** : un `<a href>` ordinaire, atteint par Tab, avec le contour de focus du site (2.1.1, 2.4.7).
-   **Contraste** : `--couleur-lien` (bleu principal) sur fond clair dépasse 4,5:1 (1.4.3).

### Ce que l’intégrateur doit faire

-   Écrire un texte de lien qui dit où il mène : « conditions de prêt », jamais « cliquez ici » ni une adresse brute (2.4.4).
-   Ne pas ouvrir de nouvel onglet sans raison ; s’il le faut, passer `target="_blank"` : l’annonce est ajoutée seule.
-   Donner à deux liens au texte identique la même destination.
-   Ne pas écrire « (PDF) » dans le texte : le composant l’annonce déjà.
