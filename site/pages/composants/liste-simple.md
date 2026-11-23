---
titre: "Liste simple"
description: "Les listes natives du HTML, `<ul>` à puces et `<ol>` numérotée, dans le texte d’une page. Harmonium ne leur ajoute aucune classe : le site les met en forme ; cette fiche en donne les règles d’usage et de rédaction."
fichiers: "HTML natif, sans fichier"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/liste-simple/01.html]

## Étape 1 : ajouter le HTML {#html}

```
<p>Pour emprunter un document, présentez au comptoir :</p>
<ul>
  <li>votre carte UdeM valide ;</li>
  <li>le document à emprunter.</li>
</ul>

<ol>
  <li>La bibliothèque cherche un établissement prêteur.</li>
  <li>Vous recevez un courriel lorsque le document est prêt.</li>
</ol>
```

Harmonium ne fournit ni classe ni composant Astro pour ces listes, et ses feuilles ne touchent pas `ul`, `ol` ni `li` : puces, retrait et marges viennent du navigateur et de la feuille du site, qui règle en général l’espacement du texte courant. Les attributs natifs restent disponibles : `start` pour reprendre une numérotation, `reversed` pour un compte à rebours, `type` pour des lettres ou des chiffres romains.

Une liste peut en contenir une autre : placer le `<ul>` ou le `<ol>` imbriqué **dans** le `<li>` parent, jamais entre deux `<li>`. Deux niveaux suffisent.

## Étape 2 : ajouter le CSS {#css}

Aucune feuille propre à ce composant : il suit les jetons (`bib-jetons.min.css`) et les styles du site.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Trois éléments ou plus, parallèles et courts, qu’une phrase rendrait difficiles à lire : documents à apporter, services offerts, formats acceptés.
-   Une suite d’événements dans l’ordre, sans action de la personne (le traitement d’une demande de PEB) : une liste `<ol>`.
-   Une liste à l’intérieur d’un composant qui reçoit du texte libre : [accordéon](@@/composants/accordeons.html), [alerte](@@/composants/alertes.html).

### À éviter

-   **Pour des actions à faire dans l’ordre** (configurer le RPV, imprimer) : la [liste d’étapes](@@/composants/liste-etapes.html), avec ses commandes en gras et ses valeurs à saisir.
-   **Pour des renseignements précédés d’une icône** (durée du prêt, frais) : la [liste à icônes](@@/composants/liste-icones.html).
-   **Pour des paires terme et définition** (horaires, coordonnées, glossaire) : la [liste illustrée](@@/composants/liste-illustree.html).
-   **Pour orienter vers d’autres pages**, chacune décrite en une phrase : la [liste de liens](@@/composants/liste-liens.html).
-   **Pour comparer des valeurs entre catégories** : un [tableau](@@/composants/tableau.html).
-   **Pour un ou deux éléments** : une phrase suffit.
-   **Pour décaler du texte** : une liste sans éléments parallèles trompe le lecteur d’écran, qui annonce « liste ».

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique native** : `<ul>`, `<ol>` et `<li>` ; les lecteurs d’écran annoncent « liste, 3 éléments », la position de chaque élément, et permettent de sauter la liste (WCAG 1.3.1).
-   **Numérotation réelle** : les numéros de `<ol>` sont générés par le navigateur et lus avec chaque élément ; ils restent justes si on ajoute ou retire un élément.
-   **Rien à charger** : la liste fonctionne sans CSS ni JavaScript, et dans les couleurs forcées.

### Ce que l’intégrateur doit faire

-   Utiliser les vraies balises, jamais des tirets, des `<br>` ou des numéros tapés à la main : ils ne sont pas annoncés comme une liste (1.3.1).
-   Garder les puces visibles. Un `list-style: none` fait perdre le rôle de liste dans Safari avec VoiceOver ; si la feuille du site doit retirer les puces, ajouter `role="list"` au `<ul>` (1.3.1).
-   Introduire la liste par une phrase ou un titre qui dit de quoi il s’agit ; la phrase se termine par un deux-points.
-   Rédiger des éléments parallèles : même construction (tous des noms, ou tous des verbes), même ponctuation.
-   Choisir une ponctuation et la garder dans toute la liste : des éléments qui complètent la phrase d’introduction commencent par une minuscule et se terminent par un point-virgule, le dernier par un point ; des phrases complètes commencent par une majuscule et finissent par un point. Voir [Rédaction et messages](@@/fondations/redaction.html).
-   Vérifier que le retrait et l’interligne de la feuille du site laissent la liste lisible à 200 % et à 320 px de large (1.4.4, 1.4.10, 1.4.12).
