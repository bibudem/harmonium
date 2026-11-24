---
titre: "Sceau des bibliothèques"
description: "Le sceau des bibliothèques de l’UdeM, le « U » entouré du nom en cercle. Au survol ou au focus du lien qui le contient, le texte tourne autour du U, puis ralentit en douceur."
fichiers: "`harmonium/astro/SceauBibliotheques.astro` · `bib-sceau.min.css` · `bib-sceau.min.js` (facultatif)"
---

## Aperçu {#apercu}

::exemple[composants/sceau/01.html]

::exemple[composants/sceau/02.html]

## Étape 1 : ajouter le HTML {#html}

```
<a href="/">
  <span class="bib-sceau" role="img" aria-label="Les bibliothèques, Université de Montréal – Accueil">
    <img class="bib-sceau__u" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-sceau-u.svg" alt="" width="302" height="302" loading="lazy">
    <img class="bib-sceau__anneau" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-sceau-anneau.svg" alt="" width="302" height="302" loading="lazy">
  </span>
</a>
```

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-sceau.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Facultatif : le script ajoute le comportement interactif. Sans lui, le contenu reste lisible et utilisable.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-sceau.min.js"></script>
```

## Avec Astro {#astro}

```
---
import SceauBibliotheques from 'harmonium/astro/SceauBibliotheques.astro'
---
<a href="/"><SceauBibliotheques /></a>
<a href="/"><SceauBibliotheques fond="clair" /></a>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| fond | `fonce` : texte de l’anneau blanc ; `clair` : texte noir. | `fonce` |
| nom | Nom accessible du sceau : le lien parent n’a pas d’autre texte. | « Les bibliothèques, Université de Montréal – Accueil » |

Sur fond clair, remplacer `bib-sceau-anneau.svg` par `bib-sceau-anneau-noir.svg`. Deux fichiers SVG empilés (le U, l’anneau de texte) plutôt qu’un SVG en ligne : l’anneau pèse 21 Ko, et en fichier le navigateur le garde en cache. Le script facultatif `bib-sceau.min.js` fait tourner l’anneau ; il ne fait rien si l’appareil limite les animations.

## Personnaliser {#variables}

{{habillage-sceau}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Le pied de page des sites des bibliothèques, sur fond foncé.
-   Une page ou un document sur fond clair, avec l’anneau noir.

### À éviter

-   **L’anneau blanc sur fond clair** (ou le noir sur fond foncé) : le texte disparaît. Choisir l’anneau selon le fond.
-   **Dans l’en-tête** : le logo de l’UdeM et « Les bibliothèques » y tiennent ce rôle (voir [Entete](@@/composants/entete.html)).
-   **Sur téléphone** : le [pied de page](@@/composants/pied-de-page.html) montre plutôt le logo horizontal en tête ; le sceau, petit, serait illisible.
-   **Hors d’un lien** : sans lien parent, le script n’anime rien.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Image nommée** : la racine porte `role="img"` et `aria-label`. Le lien n’ayant pas d’autre texte, ce nom devient le sien : « Les bibliothèques, Université de Montréal – Accueil, lien » (WCAG 1.1.1, 2.4.4).
-   **Clavier** : l’animation démarre aussi au focus, mais seulement au focus visible (`:focus-visible`), pas après un clic (2.1.1).
-   **Mouvement réduit** : si l’appareil demande de réduire les animations, le script ne s’installe pas du tout ; l’anneau reste immobile (2.3.3).
-   **Pas de mouvement automatique** : la rotation ne dure que le temps du survol ou du focus et s’arrête d’elle-même ; rien à mettre en pause (2.2.2).
-   **Pointeur** : seule la souris déclenche la rotation (`pointerType === 'mouse'`) ; un toucher sur téléphone suit le lien sans animation parasite.

### Ce que l’intégrateur doit faire

-   Placer le sceau dans un lien, sans autre texte (sinon le nom serait répété) ; changer `nom` si le lien ne mène pas à l’accueil des bibliothèques.
-   Le poser sur un fond foncé : le texte de l’anneau est blanc, figé dans le dessin (un logo n’est pas soumis au critère de contraste 1.4.3, mais il doit rester lisible).
-   Donner au lien un contour de focus visible sur ce fond (le pied de page le passe en blanc).
