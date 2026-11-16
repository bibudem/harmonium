---
titre: "Utiliser les jetons"
description: "Les jetons sont des variables CSS : couleurs, polices, tailles, espacements, durées. Un site qui les charge peut utiliser les composants d’Harmonium et ses propres composants avec la même apparence."
---

## Les charger {#charger}

### Site Astro

```astro
---
// Dans le gabarit principal (Base.astro)
import 'harmonium/jetons.css'
---
```

### Autre site

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-jetons.min.css">
```

Le fichier définit les jetons sur `:root`. Il ne change aucun style à lui seul : il faut ensuite les employer.

## Les employer {#employer}

```css
.ma-carte {
  padding: var(--espace-carte);
  border: 1px solid var(--couleur-bordure);
  border-radius: var(--rayon-carte);
  background: var(--couleur-surface);
  color: var(--couleur-texte);
  font-family: var(--police-sans);
  transition: box-shadow var(--duree-courte-4) var(--courbe-standard);
}
.ma-carte:hover { box-shadow: var(--ombre-2); }
```

-   Employer les **rôles** (`--couleur-*`, `--espace-element`…), pas la palette ni l’échelle de base : un changement de couleur ou d’espacement suit tout seul.
-   `.theme-clair` rétablit les couleurs de lecture sur une zone (pied de page) ; `.surface-claire` sert à une carte posée sur une bande foncée.

## Avec les composants d’Harmonium {#composants}

Les [alertes](@@/composants/alertes.html) et la [rétroaction](@@/composants/retroaction.html) lisent ces jetons : avec eux, elles prennent l’allure du site ; sans eux, des valeurs par défaut identiques s’appliquent.

## Liste complète {#liste}

Générée à partir de `src/jetons/jetons.css` ({{nombre-jetons}} déclarations).

{{liste-jetons}}
