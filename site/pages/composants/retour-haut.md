---
titre: "Bouton de retour en haut"
description: "Un bouton fixé en bas à droite qui ramène en haut de la page. Il apparaît quand on a défilé de plus d’un écran et demi ; sur grand écran, c’est un onglet collé au bord, dans la marge."
fichiers: "`harmonium/astro/RetourHaut.astro` · `bib-retour-haut.min.css` · `bib-retour-haut.min.js` (facultatif)"
---

## Aperçu {#apercu}

::exemple[composants/retour-haut/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<button type="button" class="bib-retour-haut bib-infobulle bib-infobulle--gauche"
        data-retour-haut aria-label="Retour en haut de la page" data-infobulle="Retour en haut">
  <span class="bib-retour-haut__fleche" aria-hidden="true"></span>
</button>
```

Habillage : le placement est propre à chaque site (un clavardage, une barre de liens rapides ou une bannière de consentement occupent le coin) : `--bib-retour-haut-bas` (distance du bas sous 900 px), `--bib-retour-haut-bas-large` (dès 900 px) et `--bib-retour-haut-retrait` (décalage vers le bas quand une barre de liens rapides sort de l’écran, multiplié par `--bib-liens-rapides-retrait`, de 0 à 1). Par défaut, le bouton est à 1 rem du bas. L’infobulle est celle de la [fiche Infobulle](@@/composants/infobulle.html).

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-retour-haut.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Facultatif : le script ajoute le comportement interactif. Sans lui, le contenu reste lisible et utilisable.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-retour-haut.min.js"></script>
```

## Avec Astro {#astro}

```
---
import RetourHaut from 'harmonium/astro/RetourHaut.astro'
---
<RetourHaut />
<RetourHaut nom="Retour en haut de la page" libelle="Retour en haut" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| nom | Nom accessible du bouton. | « Retour en haut de la page » |
| libelle | Texte de l’infobulle. | « Retour en haut » |

**Le script est nécessaire à l’affichage.** `bib-retour-haut.min.js` pose `[data-visible]` quand on a défilé de plus d’un écran et demi. Sans lui, le bouton reste masqué (le défilement natif suffit : Début, ou le lien d’évitement). Sous 900 px, il se retire aussi après 2,5 s sans défilement, sauf s’il a le focus, le survol ou le toucher.

## Personnaliser {#variables}

{{habillage-retour-haut}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Toutes les pages du site, une fois, dans le gabarit commun ; il reste caché sur les pages courtes.

### À éviter

-   **Comme seul moyen de remonter** : la touche Début, le lien d’évitement et l’en-tête collant restent les moyens premiers ; le bouton est un raccourci.
-   **Pour revenir au début d’une section** : un sommaire (« Sur cette page », voir [NavigationSecondaire](@@/composants/navigation-secondaire.html)) mène où l’on veut.
-   **En double** : un seul par page, sinon deux boutons fixes se superposent.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Vrai bouton nommé** : `<button aria-label="Retour en haut de la page">`, la flèche est décorative (`aria-hidden`). Un lecteur d’écran annonce « Retour en haut de la page, bouton » (WCAG 4.1.2).
-   **Hors de l’ordre de tabulation quand il est caché** : `visibility: hidden` le retire du clavier et de l’arbre d’accessibilité ; il n’est jamais atteint invisible (2.4.7).
-   **Retour du focus** : après le défilement, le focus passe au début du document (`<body tabindex="-1">`, sans contour) ; le Tab suivant atteint le lien d’évitement, comme à l’arrivée sur la page (2.4.3).
-   **Reste affiché sous le clavier** : avec le focus, le survol ou le doigt, il ne se retire pas, même après 2,5 s sans défilement.
-   **Infobulle conforme** : « Retour en haut » apparaît au survol et au focus clavier ; Échap la ferme, le pointeur peut passer dessus sans qu’elle disparaisse (1.4.13). Elle n’est pas lue (texte de remplacement vide) : le nom est déjà porté par le bouton.
-   **Cible** : 48 × 48 px, ou 40 × 48 px en onglet (2.5.8 demande 24 px).
-   **Contraste** : flèche blanche sur bleu principal, 7,1:1 (1.4.11) ; anneau de focus marine doublé d’un liseré blanc, visible sur fond clair comme sur les bandes foncées (2.4.7).
-   **Couleurs forcées** : bordure et couleurs système (`ButtonFace`, `ButtonText`). **Impression** : masqué.
-   **Mouvement réduit** : le retour en haut est instantané (règle globale `scroll-behavior`), l’apparition sans glissement (2.3.3).
-   **Sans JavaScript** : il reste masqué ; la touche Début et le lien d’évitement suffisent.

### Ce que l’intégrateur doit faire

-   Garder un lien d’évitement en tout début de page : c’est lui que le Tab atteint après le retour.
-   Laisser une marge à droite du texte (au moins 40 px dès 900 px) : l’onglet s’y loge sans rien couvrir.
-   Pour un autre élément fixe en bas à droite, publier sa hauteur dans une variable, comme les liens rapides et le consentement, plutôt que de déplacer le bouton à la main.
