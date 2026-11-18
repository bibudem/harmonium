---
titre: "Couleurs"
description: "La palette de l’UdeM, les nuances qu’on en tire par une seule règle, et des rôles qui disent à quoi sert chaque couleur. Les composants emploient les rôles (`--couleur-texte`, `--couleur-fond-fort`…), jamais une valeur en dur : une décision commune se corrige ainsi à la source."
---

## Palette {#teintes}

La palette réunit les couleurs du [guide de marque de l’UdeM](https://marque.umontreal.ca/) (consulté le {{date-guide-marque}}), les nuances qui en dérivent, quelques couleurs complémentaires et une gamme de gris. L’étiquette dit d’où vient chacune ; une couleur officielle ne se modifie pas.

{{statuts-couleurs}}

**Une seule règle pour les nuances.** Éclaircir, c’est mélanger avec le blanc : le nombre est la part de la couleur (`--bleu-20` = 20 % de bleu principal, 80 % de blanc). Assombrir, c’est ajouter 30 % de noir (suffixe `-fonce`). Les gris forment une gamme de 50 (fond des pages) à 700 (texte fort).

{{nuances-couleurs}}

### Règles du guide de marque {#marque}

{{regles-marque}}

## Rôles {#roles}

Ce sont eux qu’on utilise. Harmonium fournit un thème clair unique.

{{roles-couleurs}}

## États {#etats}

Succès, information, avertissement et erreur ont chacun une couleur de texte et d’icône, un fond et une bordure. Un état ne repose jamais sur la couleur seule : une icône ou un mot l’accompagne. Les [alertes](@@/composants/alertes.html) les emploient.

{{roles-etats}}

## Fond foncé {#fond-fonce}

Sur une bande bleu foncé, bleu principal, vert foncé ou une photo sous voile, ajouter la classe `surface-foncee` : texte courant, liens et focus passent au blanc, le texte d’accent au jaune, le texte secondaire au blanc atténué. Les bandes, bannières et cartes foncées d’Harmonium la portent déjà.

À l’inverse, `surface-claire` rétablit les couleurs de lecture dans une zone claire posée sur une bande foncée (une carte blanche, un encadré).

```
<section class="bib-section bib-section--bleu-fonce bib-section--fonce surface-foncee">
  …
  <div class="bib-encadre surface-claire">…</div>
</section>
```

## Règles d’usage dans les sites {#regles}

-   **Un rôle plutôt qu’une couleur** : `color: var(--couleur-texte)`, pas `#0b113a` ni `var(--bleu-fonce)`.
-   **Rouge orangé** : `--rouge-orange` pour les icônes et les éléments graphiques ; `--couleur-texte-accent` pour du texte (le premier n’atteint pas 4,5:1).
-   **Liens** : `--couleur-lien` et toujours soulignés dans le texte (le bleu seul ne se distingue pas assez du texte, WCAG 1.4.1).
-   **Sur un fond foncé ou coloré** (bouton plein, bande bleue) : `--couleur-sur-fonce`, ou `surface-foncee` pour une zone entière.
-   **Mode contraste élevé** : prévoir une bordure (`border: 1px solid transparent` devient visible) pour tout ce qui ne se distingue que par son fond.

