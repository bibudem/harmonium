---
titre: "Citation"
description: "Une parole rapportée (témoignage, extrait d’archive, mot d’un donateur) mise en valeur : un filet bleu à gauche, le texte entre guillemets français et, dessous, sa source."
fichiers: "`harmonium/astro/Citation.astro` · `bib-citation.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/citation/01.html]

## Utilisation {#utilisation}

### En HTML

```
<figure class="bib-citation">
  <blockquote class="bib-citation__texte" cite="https://exemple.umontreal.ca/entrevue">
    <p>L’histoire peut se perdre ou être déformée par le temps.</p>
  </blockquote>
  <figcaption class="bib-citation__source">Dr Gilles Théorêt</figcaption>
</figure>
```

Habillage : `--bib-citation-filet` (couleur du filet, bleu principal par défaut) et `--bib-citation-marge`.

### Avec Astro

```
---
import Citation from 'harmonium/astro/Citation.astro'
---
<Citation source="Dr Gilles Théorêt" cite="https://exemple.umontreal.ca/entrevue">
  <p>L’histoire peut se perdre ou être déformée par le temps.</p>
</Citation>
```

| Propriété | Rôle |
| --- | --- |
| `source` | Attribution affichée sous la citation (`<figcaption>`). |
| `cite` | Adresse de la source, posée sur le `<blockquote>`. |

### Variables d’habillage {#variables}

{{habillage-citation}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Un témoignage, un extrait d’archive ou de document, une parole attribuée à une personne.

### À éviter

-   **Pour mettre une information en avant** (une condition, un avertissement) : c’est le rôle d’une [alerte](@@/composants/alertes.html).
-   **Pour une courte citation dans une phrase** : de simples guillemets dans le texte suffisent.
-   **Pour un chiffre clé ou un slogan** : ce n’est pas une citation ; voir les [chiffres](@@/composants/chiffres.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique** : `<blockquote>` annoncé comme citation par les lecteurs d’écran, source en `<figcaption>` rattachée à la figure (WCAG 1.3.1).
-   **Contraste de la source** : `--couleur-texte-secondaire`, d’un contraste suffisant sur le fond du thème (1.4.3).
-   **Couleurs forcées** : le filet passe en `CanvasText` et reste visible en mode contraste élevé.
-   **Guillemets décoratifs** : générés par le CSS ; ils ne sont pas dans le texte, la citation reste propre à copier.

### Ce que l’intégrateur doit faire

-   Toujours indiquer la source (`source`) : une citation anonyme ne dit pas qui parle.
-   Ne pas écrire de guillemets autour du texte : ils seraient doublés.
-   Garder la citation courte : le texte est mis en ligne (`display: inline`) pour suivre les guillemets ; plusieurs paragraphes s’y enchaîneraient sans coupure.
