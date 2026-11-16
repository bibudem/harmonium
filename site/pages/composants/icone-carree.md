---
titre: "Icône carrée"
description: "Une icône dans un carré de couleur, pour illustrer une carte ou un bloc de texte. L’icône prend la couleur du fond, assombrie ; sur un fond très foncé, elle est éclaircie pour rester visible."
fichiers: "`harmonium/astro/IconeCarree.astro` · `harmonium/astro/IconeTexte.astro` · `bib-icone-carree.min.css`"
ressources: "composants/icone-carree"
---

## Aperçu {#apercu}

::exemple[composants/icone-carree/01.html]

 

::exemple[composants/icone-carree/02.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-icone-carree" style="--bib-icone-carree-fond: var(--vert-pale)">
  <div class="bib-icone-carree__icone" aria-hidden="true"><svg viewBox="0 0 256 256">…</svg></div>
</div>

<!-- Fond très foncé : icône éclaircie -->
<div class="bib-icone-carree bib-icone-carree--fonce" style="--bib-icone-carree-fond: var(--vert-fonce)">…</div>

<!-- Avec texte : le texte (2/3) et le carré (1/3) côte à côte -->
<div class="bib-icone-carree-texte">
  <div class="bib-icone-carree-texte__texte"><h3>Notre mission</h3><p>Texte.</p></div>
  <div class="bib-icone-carree" style="--bib-icone-carree-fond: var(--vert-pale)">…</div>
</div>
```

### Avec Astro

```
---
import IconeCarree from 'harmonium/astro/IconeCarree.astro'
---
<IconeCarree color="var(--vert-pale)">
  <svg viewBox="0 0 256 256">…</svg>
</IconeCarree>

---
import IconeTexte from 'harmonium/astro/IconeTexte.astro'
---
<!-- Avec texte -->
<IconeTexte Icone={TargetIcon} fond="vertPale">
  <h3>Notre mission</h3>
  <p>Texte.</p>
</IconeTexte>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `color` | Couleur du carré : une valeur CSS ou un jeton. En HTML : la variable `--bib-icone-carree-fond`. | transparent |
| `fonce` | Force l’icône éclaircie (`true`) ou assombrie (`false`). Reconnu seul : `--bleu-principal-fonce`, `--bleu-600`, `--vert-fonce`. En HTML : le modificateur `--fonce`. | automatique |

L’icône passe dans le slot, en SVG.

`<IconeTexte>` (avec texte) : `Icone`, le composant d’icône (obligatoire) ; `fond`, une clé de palette (`vertPale`) ou une couleur CSS. Le texte passe dans le slot.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Illustrer un bloc de présentation (mission, valeurs, engagement) par une idée visuelle simple.
-   Alterner des blocs texte et icône dans une page de type « À propos » (avec texte : un paragraphe important, mission ou vision, qu’une grande icône signale).

### À éviter

-   **Quand l’ensemble est un lien** : une [CarteIcone](@@/composants/carte-icone.html), qui est cliquable et nommée.
-   **Pour des renseignements courts en liste** : les [modalités](@@/composants/modalites.html), avec une petite icône par ligne.
-   **Quand une vraie photo existe** et montre le sujet : la photo dans le contenu, ou une [CarteImage](@@/composants/carte-image.html).
-   **Pour transmettre une information** par l’icône seule : elle est masquée aux lecteurs d’écran.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Icône masquée** aux technologies d’assistance (`aria-hidden`) : elle n’est pas annoncée, le texte voisin porte l’information (WCAG 1.1.1).
-   **Contrastes** : de 6,5:1 à 12,6:1 sur les fonds clairs ; 3,75:1 sur bleu 600 et 4,02:1 sur vert foncé, au-delà des 3:1 d’un élément graphique (1.4.11).
-   **Couleurs forcées** : l’icône prend la couleur du texte (`CanvasText`) et reste visible.
-   **Texte agrandi et 320 px** : le carré (10,875rem) ne dépasse jamais sa colonne, qui dépassait la largeur d’un téléphone à 200 % (1.4.4, 1.4.10).

### Ce que l’auteur doit faire

-   Placer un titre et un texte à côté du carré : sans eux, le bloc ne dit rien aux lecteurs d’écran.
-   Choisir une icône qui rejoint le titre, sans compter sur elle pour le sens.
-   Sur un fond foncé autre que bleu principal foncé ou vert foncé, ajouter `--fonce` (ou `fonce` en Astro) : l’icône assombrie ne s’y verrait pas.
