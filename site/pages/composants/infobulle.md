---
titre: "Infobulle"
description: "Une petite pilule bleu foncé qui apparaît au survol et au focus clavier d’un élément, avec un texte d’appoint. Elle sert aux boutons dont l’icône seule suffit à la vue mais qu’un mot précise."
fichiers: "`bib-infobulle.min.css` · `bib-infobulle.min.js` (facultatif)"
ressources: "composants/infobulle"
---

## Aperçu {#apercu}

::exemple[composants/infobulle/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<button type="button" class="bib-infobulle bib-infobulle--gauche"
        aria-label="Retour en haut de la page" data-infobulle="Retour en haut">…</button>
```

Habillage : la position se choisit par le modificateur : `--gauche` (centrée en hauteur, pour les boutons du bord droit), `--dessus` (centrée), `--dessous` (alignée à gauche, pour les liens d’en-tête). L’élément est positionné en `relative` par défaut pour ancrer la bulle au bon endroit ; un positionnement explicite (`fixed`, `absolute`…) reste prioritaire. Pour taire l’infobulle dans un état (rangée ouverte, bouton masqué) : `--bib-infobulle-visibilite: hidden` et `--bib-infobulle-opacite: 0`.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-infobulle.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Facultatif : le script ajoute le comportement interactif. Sans lui, le contenu reste lisible et utilisable.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-infobulle.min.js"></script>
```

## Avec Astro {#astro}

```
---
import 'harmonium/dist/bib-infobulle.min.css'  // la feuille ; pas de composant Astro
---
<button class="bib-infobulle bib-infobulle--gauche" data-infobulle="Retour en haut">…</button>
```

Un utilitaire, pas un composant Astro : la classe et l’attribut `data-infobulle` suffisent. Le script facultatif `bib-infobulle.min.js` ferme l’infobulle avec Échap, comme l’exige WCAG 1.4.13 (contenu au survol ou au focus).

## Personnaliser {#variables}

{{habillage-infobulle}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Préciser en un ou deux mots un bouton à icône seule (retour en haut, aide).
-   Nommer un lien d’en-tête resserré.

### À éviter

-   **Pour une information importante** : elle ne s’affiche qu’au survol ou au focus, jamais au toucher ; la mettre dans le texte.
-   **Pour remplacer le nom de l’élément** : le nom accessible reste l’`aria-label` ou le texte du bouton.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Contenu visible au survol et au focus** : l’infobulle reste affichée quand le pointeur passe sur elle (une bande transparente la relie à l’élément) et se ferme avec Échap (WCAG 1.4.13).
-   **Pas de double lecture** : le texte est du contenu généré avec un texte de remplacement vide, donc ignoré des lecteurs d’écran.
-   **Focus clavier** : elle s’affiche aussitôt au focus visible, sans délai.
-   **Contraste élevé** : une bordure système délimite la bulle.

### Ce que l’intégrateur doit faire

-   Écrire un texte court qui complète le nom du bouton, sans le répéter.
-   Ne rien mettre d’essentiel dans une infobulle : au toucher, elle ne s’affiche pas.
