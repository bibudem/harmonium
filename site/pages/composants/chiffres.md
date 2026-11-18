---
titre: "Chiffres clés"
description: "Des nombres qui se lisent d’un coup d’œil : des barres de répartition entre deux ou trois parts (imprimé, électronique), ou une tuile par chiffre. Les nombres montent de 0 à leur valeur quand le bloc entre à l’écran."
fichiers: "`harmonium/astro/Chiffres.astro` · `bib-chiffres.min.css` · `bib-chiffres.min.js` (facultatif)"
ressources: "composants/chiffres"
---

## Aperçu {#apercu}

::exemple[composants/chiffres/01.html]

 

::exemple[composants/chiffres/02.html]

 

::exemple[composants/chiffres/03.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-chiffres bib-chiffres--barres" data-chiffres>
  <figure class="bib-chiffres__groupe" data-chiffres-unite>
    <figcaption class="bib-chiffres__entete">
      <span class="bib-chiffres__titre">Livres</span>
      <span class="bib-chiffres__total bib-chiffres__nombre">
        <span class="bib-chiffres__reserve">1 500</span>
        <span class="bib-chiffres__compteur" aria-hidden="true" data-compteur="1500">1 500</span>
      </span>
    </figcaption>
    <div class="bib-chiffres__barre" aria-hidden="true" data-chiffres-barre>
      <span class="bib-chiffres__part" style="--couleur: var(--bleu-principal); flex-grow: 900" data-part="0"></span>
      <span class="bib-chiffres__part" style="--couleur: var(--rouge-orange); flex-grow: 600" data-part="1"></span>
    </div>
    <ul class="bib-chiffres__parts"><li>… pastille, libellé, valeur, proportion …</li></ul>
  </figure>
</div>
```

Habillage : les parts prennent le bleu principal, le rouge orangé et le jaune, dans cet ordre (distincts sous daltonisme) ; la couleur suit la part (`--couleur` de chaque pastille et barre).

### Avec Astro

```
---
import Chiffres from 'harmonium/astro/Chiffres.astro'
---
<Chiffres
  forme="barres"
  groupes={[
    { titre: 'Livres', elements: [{ valeur: 900, libelle: 'imprimés' }, { valeur: 600, libelle: 'électroniques' }] },
  ]}
/>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| forme | `barres` (un groupe par titre, avec sa barre de répartition) ou `tuiles` (un chiffre par tuile : des unités différentes ne se comparent pas sur un même axe). | `barres` |
| groupes | Les groupes : `{ titre?, elements: [{ valeur, libelle }] }`. Les totaux, les pourcentages et la légende commune (quand tous les groupes ont les mêmes parts dans le même ordre) se calculent à la construction. |  |

**Animation.** Le script `bib-chiffres.min.js` remplit les barres de gauche à droite et fait monter les nombres, une seule fois, quand le bloc entre à l’écran. Le nombre animé est masqué aux lecteurs d’écran, qui lisent la valeur finale ; une copie invisible réserve sa largeur, donc rien ne bouge autour. Rien ne s’anime avec le mouvement réduit, sur un rechargement ou à l’impression.

### Variables d’habillage {#variables}

{{habillage-chiffres}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Trois à six chiffres marquants d’une page de présentation : taille des collections, fréquentation, formations données.
-   La répartition d’un total en deux ou trois parts (papier et numérique).

### À éviter

-   **Pour des données détaillées ou à comparer ligne par ligne** : un [tableau](@@/composants/tableau.html).
-   **Pour plus de trois parts** : la barre devient illisible ; un tableau ou un graphique dédié.
-   **Pour des conditions de service** (durée de prêt, frais) : les [modalités](@@/composants/modalites.html).
-   **Pour un chiffre isolé dans une phrase** : le laisser dans le texte.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Structure** : chaque groupe est une `<figure>` dont la légende (`<figcaption>`) donne le titre et le total ; les parts sont une liste (WCAG 1.3.1).
-   **Pas d’information par la couleur seule** : chaque part est écrite avec son libellé, sa valeur et son pourcentage (1.4.1). La barre et la légende commune sont masquées aux lecteurs d’écran, qui lisent la liste.
-   **Lecteurs d’écran** : ils lisent toujours la valeur finale ; le nombre qui monte est une copie masquée (`aria-hidden`) posée sur la vraie valeur.
-   **Contrastes** : couleurs des parts (bleu principal, rouge orangé, jaune) choisies pour rester distinctes en cas de daltonisme. Le jaune n’atteint pas 3:1 sur le blanc : la barre est décorative (`aria-hidden`), chaque part est donnée en texte avec son nombre et son pourcentage, la couleur n’est jamais seule (1.4.1, 1.4.11). Les nombres restent dans la couleur du texte.
-   **Couleurs forcées** : les parts se distinguent par un motif (plein, hachures à 45° et à 135°), dans la barre comme dans la légende.
-   **Texte agrandi et 320 px** : la grille ne déborde pas ; dans une carte étroite, la valeur passe sous le libellé ; le grand total peut se couper en dernier recours (1.4.4, 1.4.10).
-   **Mouvement** : aucune animation si la personne réduit les animations, à l’impression, sur un rechargement ou un retour arrière (2.3.3). Les nombres gardent leur largeur pendant qu’ils montent : rien ne bouge autour.

### Ce que l’intégrateur doit faire

-   Écrire des libellés complets (« en format numérique »), compréhensibles sans la couleur ni la légende.
-   Garder les mêmes parts, dans le même ordre, d’un groupe à l’autre pour profiter de la légende commune.
-   Dater les chiffres dans le texte qui précède (« au 31 mai 2026 ») et donner la source s’il y a lieu.
-   Placer un titre de section au-dessus du bloc : les titres des groupes ne sont pas des titres de la page.
