---
titre: "Liste d’étapes"
description: "La liste numérotée d’une procédure : une action par étape, les commandes en gras, les variables en italique et les valeurs à saisir en Courier. Une classe, `bib-procedure`, sur un `<ol>` natif."
fichiers: "`bib-typographie.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/liste-etapes/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<ol class="bib-procedure">
  <li>Ouvrir le menu <strong>Fichier</strong>.</li>
  <li>Sélectionner <strong>Enregistrer sous</strong>.</li>
  <li>Saisir <code class="bib-saisie">rapport-<var>nom</var>.pdf</code>
      dans le champ <strong>Nom du fichier</strong>.</li>
  <li>Sélectionner <strong>Enregistrer</strong>.</li>
</ol>
```

La classe `bib-procedure` garde la numérotation native du `<ol>` et règle le reste : texte en Figtree, interligne 1,6, retrait `--espace-3`, espace `--espace-element` entre les étapes. Dans la liste, `strong` passe en gras (700, commande à activer), `var` en italique (valeur propre à la personne), les liens sont soulignés et tout `code` prend la police de saisie (`--police-saisie`, Courier). L’espace entre les étapes ne vise que les `<li>` directs : une liste de sous-étapes, imbriquée dans une étape, hérite du reste sans s’espacer autant.

Hors d’une procédure, `bib-saisie` donne la même police de saisie à une valeur isolée, dans une phrase ou un tableau ; voir [Procédures et valeurs à saisir](@@/fondations/typographie.html#composant-procedures). Pour une valeur à copier telle quelle (adresse de serveur, commande), le composant [Copier dans le presse-papiers](@@/composants/copier.html) se place aussi dans une étape.

Harmonium ne fournit pas de composant Astro pour cette liste : écrire le `<ol class="bib-procedure">` directement dans la page.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-typographie.min.css">
```

## Quand l’utiliser {#quand}

### À utiliser pour

-   Des actions que la personne doit faire dans l’ordre : configurer le RPV, se connecter au Proxy, imprimer depuis son portable, déposer une thèse dans Papyrus.
-   Une procédure qui cite des menus, des boutons ou des valeurs à taper, qu’il faut distinguer du texte de l’étape.

### À éviter

-   **Pour des éléments sans ordre** (documents à apporter, services) : une [liste simple](@@/composants/liste-simple.html) à puces.
-   **Pour une suite d’événements où la personne n’agit pas** (le traitement d’une demande de PEB) : une [liste simple](@@/composants/liste-simple.html) numérotée.
-   **Pour des conditions brèves précédées d’une icône** : la [liste à icônes](@@/composants/liste-icones.html).
-   **Pour des paires terme et valeur** (paramètres d’un logiciel) : la [liste illustrée](@@/composants/liste-illustree.html).
-   **Pour une seule action** : une phrase, ou un [bouton](@@/composants/bouton.html).
-   **Pour des procédures selon le système** (Windows, macOS, iOS) : une liste d’étapes par panneau d’[onglets](@@/composants/onglets.html), plutôt qu’une longue liste ponctuée de « si ».

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Liste numérotée réelle** : `<ol>` et `<li>` ; le lecteur d’écran annonce le nombre d’étapes et la position de chacune (WCAG 1.3.1).
-   **Numéros natifs** : la classe ne retire pas les numéros, donc le rôle de liste est conservé dans Safari avec VoiceOver ; les numéros restent justes si une étape est ajoutée.
-   **Liens reconnaissables sans la couleur** : soulignés dans les étapes (1.4.1).
-   **Valeurs longues** : une adresse ou une commande en `code` passe à la ligne au besoin, sans faire déborder la page à 320 px ni à 200 % (1.4.4, 1.4.10).
-   **Espacement** : interligne 1,6 et espace entre les étapes, sans hauteur fixe ; le texte suit un espacement agrandi par la personne (1.4.12).

### Ce que l’intégrateur doit faire

-   Choisir l’infinitif (« Ouvrir ») ou le « vous » (« Ouvrez ») et garder ce choix dans toute la procédure ; terminer chaque étape par un point. Voir [Rédiger une procédure](@@/fondations/redaction.html#procedures).
-   Écrire une action par étape et nommer les commandes exactement comme dans l’interface ; un chemin de menus se sépare par un chevron : **Fichier** › **Ouvrir**.
-   Ne pas compter sur la mise en forme seule : le gras, l’italique et la police de saisie ne sont pas annoncés par les lecteurs d’écran. Dire « saisir », « sélectionner », et expliquer une variable dans le texte (« Remplacer *nom* par… ») (1.3.1).
-   Réserver le soulignement aux liens ; une commande mentionnée dans une étape est en gras, pas en faux lien.
-   Donner un texte de remplacement à chaque capture d’écran qui illustre une étape, ou la marquer décorative si l’étape se suffit (1.1.1).
-   Introduire la procédure par un titre qui dit ce qu’elle permet de faire, et les prérequis avant la première étape.
-   Découper une longue procédure en parties sous des titres, chacune avec sa liste ; reprendre la numérotation avec `start` si l’ordre continue.
