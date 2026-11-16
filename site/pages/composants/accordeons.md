---
titre: "Accordéons"
description: "Des volets repliables, pour une foire aux questions ou des renseignements qu’on ne lit pas tous. Ils s’ouvrent au clavier et sans JavaScript, et un groupe n’en ouvre qu’un à la fois."
fichiers: "`harmonium/astro/GroupeAccordeons.astro` · `harmonium/astro/Accordeon.astro` · `harmonium/astro/AccordeonTitre.astro` · `harmonium/astro/AccordeonContenu.astro` · `bib-accordeons.min.css` · `bib-accordeons.min.js` (facultatif)"
ressources: "composants/accordeons"
---

## Aperçu {#apercu}

::exemple[composants/accordeons/01.html]

 

::exemple[composants/accordeons/02.html]

 

::exemple[composants/accordeons/03.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-accordeons">
  <details class="bib-accordeon" name="faq" open>
    <summary class="bib-accordeon__titre">
      <h3 class="bib-accordeon__intitule">Qui peut emprunter?</h3>
      <span class="bib-accordeon__indicateur" aria-hidden="true"></span>
    </summary>
    <div class="bib-accordeon__contenu"><p>Toute personne inscrite.</p></div>
  </details>
  <details class="bib-accordeon" name="faq">…</details>
</div>
```

Habillage : bleu par défaut ; `bib-accordeons--neutre` (pastille jaune, filet gris), `bib-accordeons--rose` et `bib-accordeons--vert` sur le groupe (ou sur un volet). Les quatre variables `--bib-accordeon-accent` (titre ouvert, icône), `-filet` (trait sous le titre), `-pastille` (rond derrière l’icône) et `-fond` (fond du contenu) donnent un autre habillage.

### Avec Astro

```
---
import { GroupeAccordeons, Accordeon, AccordeonTitre, AccordeonContenu } from 'harmonium/astro/…'  // un fichier par composant
---
<GroupeAccordeons color="rose">
  <Accordeon defaultExpanded>
    <AccordeonTitre niveauTitre={3}>Qui peut emprunter?</AccordeonTitre>
    <AccordeonContenu><p>Toute personne inscrite.</p></AccordeonContenu>
  </Accordeon>
</GroupeAccordeons>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| color | (`GroupeAccordeons`, `Accordeon`) `bleuPrincipal`, `neutre`, `rose` ou `vertPale`. | `bleuPrincipal` |
| defaultExpanded | (`Accordeon`) Ouvert au premier affichage ; dans un groupe, le premier l’emporte. | non |
| niveauTitre | (`AccordeonTitre`) Niveau du titre, de 2 à 6 ; 0 pour un `<span>`. | `3` |


Le script facultatif `bib-accordeons.min.js` ouvre le volet qui contient la cible d’une ancre, et garde le titre cliqué sous le pointeur quand un autre volet se ferme plus haut. Sans lui, tout fonctionne sauf ces deux finesses.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Une série de sujets indépendants, de même niveau, dont la personne n’a besoin que d’un ou deux : FAQ, conditions par catégorie d’usager, détails techniques.
-   Un contenu secondaire qui alourdirait la page s’il était toujours visible.

### À éviter

-   **Pour l’information essentielle** que tout le monde doit lire (heures, conditions d’accès) : la laisser visible.
-   **Pour des étapes à suivre dans l’ordre** : une liste numérotée sous des titres simples se lit mieux.
-   **Pour comparer des variantes d’un même contenu** (Windows, macOS…) : les [onglets](@@/composants/onglets.html) d’Harmonium conviennent mieux.
-   **Pour un seul volet** : un paragraphe ou un lien « En savoir plus » suffit.
-   **Pour un message important** : une [alerte](@@/composants/alertes.html), toujours visible.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique native** : `<details>` et `<summary>`. Les lecteurs d’écran annoncent un bouton « réduit » ou « développé » ; aucun attribut ARIA à maintenir (`aria-controls` a été retiré, `<details>` fait le lien).
-   **Clavier** : chaque titre est atteignable avec Tab et s’ouvre avec Entrée ou Espace (WCAG 2.1.1). Le contour de focus est celui du site (2.4.7).
-   **Titres réels** : le titre du volet est un `h2` à `h6` ; la navigation par titres des lecteurs d’écran le trouve (1.3.1).
-   **État visible sans la couleur** : l’icône passe de plus à moins ; la pastille seule ne suffirait pas (1.4.1). En mode contraste élevé, la pastille reçoit une bordure.
-   **Contrastes** : couleurs « rose » et « vert pâle » corrigées (titre en `#b33410`, 5,5:1 sur rose 100 ; vert foncé au lieu du vert pâle à 2,5:1) (1.4.3).
-   **Mouvement** : l’animation de hauteur est coupée quand la personne réduit les animations ; une ouverture par ancre n’est jamais animée, pour que la cible soit en place.
-   **Sans JavaScript** : tout fonctionne ; le script ne sert qu’à ouvrir le volet visé par une ancre.

### Ce que l’auteur doit faire

-   Écrire des titres qui se comprennent seuls, comme une question ou un sujet (« Combien de documents puis-je emprunter? »), jamais « Cliquez ici ».
-   Respecter la hiérarchie : le niveau des titres des volets suit celui du titre qui précède l’accordéon (`niveauTitre`). Le niveau est celui que l’auteur écrit ; il n’est pas deviné.
-   Ne pas mettre de lien ni de bouton dans un titre de volet : ce serait un élément interactif dans un autre.
