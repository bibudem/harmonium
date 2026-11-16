---
titre: "Lien d’évitement"
description: "Le premier lien d’une page permet d’atteindre le contenu sans parcourir à nouveau tous les liens de navigation. Il apparaît dès qu’il reçoit le focus."
fichiers: "`harmonium/astro/LienEvitement.astro` · `bib-lien-evitement.min.css`"
---

## Essayer {#essayer}

Depuis le début de cette page, appuyer sur Tab : « Aller au contenu » apparaît. Entrée mène au contenu principal et la prochaine tabulation poursuit dans le contenu.

## En HTML {#html}

```
<body>
  <a class="bib-lien-evitement" href="#contenu">Aller au contenu</a>
  <header>…</header>
  <main id="contenu" tabindex="-1">…</main>
</body>
```

## En Astro {#astro}

```
---
import LienEvitement from 'harmonium/astro/LienEvitement.astro'
---
<body>
  <LienEvitement />
  <header>…</header>
  <main id="contenu" tabindex="-1">…</main>
</body>
```

`cible` vaut `contenu` par défaut et reçoit un id sans `#`. Le slot permet de changer le libellé. Aucun script n’est nécessaire.

## Accessibilité et usage {#accessibilite}

Ce lien concerne les pages ayant une navigation répétée (WCAG 2.4.1). Il est masqué visuellement au repos, reste dans l’ordre de tabulation et se montre aussi au focus programmatique. Sa cible existe, a un identifiant unique et porte `tabindex="-1"` pour recevoir le focus sans créer un arrêt supplémentaire.

Le placer directement au début du `body`, hors d’une zone qui rogne son contenu. Un en-tête fixe réserve assez de défilement pour garder la cible visible. Vérifier le trajet complet au clavier dans le gabarit du site hôte.
