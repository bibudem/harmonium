---
titre: "Principes et qualité"
description: "Une base commune à la taille des bibliothèques de l’UdeM : les décisions qui se répètent vivent ici, les besoins particuliers restent dans leur site."
---

## Le socle commun {#socle}

Harmonium reprend la palette UdeM, Figtree pour l’interface, Lora pour les accents éditoriaux et une échelle d’espacements commune. Le thème est clair. Une bande bleu foncé peut mettre une section en valeur ; elle adapte localement le texte, les liens et le focus.

-   **Deux niveaux de jetons suffisent.** La palette et les échelles donnent les valeurs ; les rôles disent leur usage (`--couleur-texte`, `--espace-carte`). Les variables `--bib-*` restent des points d’adaptation ponctuels.
-   **Une hiérarchie d’actions.** Un bouton plein pour l’action principale d’un groupe, puis texte ou contour pour les autres. Les liens dans les paragraphes restent soulignés.
-   **Des formes prévisibles.** Cartes et champs : rayon de 12 px ; boutons : pilule. Les ombres servent à distinguer une surface, sans remplacer sa bordure.
-   **Une rédaction commune.** Appliquer les [conventions de rédaction des bibliothèques](@@/fondations/redaction.html) : procédures cohérentes, formulations épicènes et noms des services.
-   **Du contenu lisible.** Un titre garde le niveau logique de la page, indépendamment de sa taille. Les libellés longs passent à la ligne. Une grille ne change pas l’ordre de lecture.
-   **Le HTML d’abord.** Liens pour naviguer, boutons pour agir, `details` pour déplier, contrôles natifs pour filtrer. Charger un script seulement pour le comportement qu’il apporte.

## Quand un composant est prêt {#qualite}

La cible est WCAG 2.2 AA. Les tests automatiques couvrent des comportements précis ; ils ne remplacent pas une vérification au clavier et avec un lecteur d’écran.

| À vérifier | Critère concret |
| --- | --- |
| États | Repos, survol, focus, activation ; désactivé et erreur quand le composant les utilise. Le focus est visible sans feuille globale du site hôte. |
| Clavier et nom | Ordre de tabulation logique, nom compréhensible, commandes natives. Onglets : flèches selon l’orientation, Début et Fin ; le contenu reste lisible si leur script manque. |
| Contraste | 4,5:1 pour le texte courant, 3:1 pour le grand texte et les repères indispensables. Un message d’erreur ne repose jamais sur le rouge seul. |
| Taille et contenu | Commandes principales d’au moins 44 px ; pas de contenu perdu à 320 px ni avec le texte à 200 %. Vérifier un titre long, un résultat vide et une erreur de chargement. |
| Mouvement et contraste élevé | Respecter le mouvement réduit ; garder les bordures, le focus et les icônes utiles en couleurs forcées. |
| Intégration | Même HTML documenté et rendu Astro, export présent dans le paquet, CSS et médias présents dans `dist/`. Les scripts qui le prévoient restent fonctionnels après navigation Astro. |

## Faire évoluer sans alourdir {#evolution}

Commencer par réutiliser un composant. Ajouter une variante lorsque son rôle et son comportement restent identiques. Créer un composant partagé lorsqu’un même besoin apparaît dans plusieurs pages ou sites et peut être décrit sans dépendre de leurs données.

Les catalogues, branchements métier et chaînes de rédaction restent dans les sites. Une expérimentation peut y mûrir avant de rejoindre Harmonium. Les anciens noms (alias) servent seulement à la migration ; les nouveaux exemples utilisent les noms d’Harmonium.

Pour une correction : modifier `src/` et son adaptateur Astro, ajuster la fiche et un exemple représentatif, lancer les tests pertinents puis reconstruire `dist/` et le mini-site. Une modification incompatible se documente dans la migration et demande une version majeure.

## Repères d’Harmonium {#reperes}

Les fondations, les règles de contenu et les composants forment une base commune aux sites des bibliothèques de l’UdeM. Ces repères guident leur utilisation.

| Repère | Usage |
| --- | --- |
| Voix et ton | La tâche avant l’organisation : trouver, emprunter, réserver, obtenir de l’aide. Exemples en français dans [Rédaction et messages](@@/fondations/redaction.html). |
| Aide à la saisie | Libellé visible, aide persistante sous le champ, erreur expliquée. ChampListe conserve le contrôle natif et fournit les états communs. |
| Actions et liens | Une hiérarchie claire, un focus autonome, des noms explicites ; les liens restent reconnaissables dans le texte. |
| Évitement | Un petit composant sans script, utilisé par cette documentation et disponible pour les gabarits des sites. |
| Lisibilité | Conserver Figtree/Lora, les tailles relatives et la mesure de texte d’Harmonium ; laisser les titres longs revenir à la ligne. |
| Adoption progressive | Jetons seuls, feuilles ciblées, puis comportements facultatifs. HTML/CSS et Astro partagent la même source. |
| Mouvement intentionnel | Retour visuel discret, sélection clavier immédiate et mouvement réduit pris en charge dans les feuilles des primitives. |
| Accessibilité intégrée | Chaque fiche sépare le rôle du composant des responsabilités de la personne qui assemble la page. |

Ces choix guident tous les composants. La palette UdeM, les pastilles fléchées, les formes arrondies, les bandes éditoriales et les noms des services restent nos repères. Les signatures des sites sont réunies dans [Identité des sites des bibliothèques](@@/fondations/identite.html).

## Références retenues {#references}

Ces systèmes servent de repères de qualité ; Harmonium en retient les pratiques adaptées à ses moyens.

-   [IBM Carbon — Component checklist](https://www.carbondesignsystem.com/getting-started/contributing/component-checklist) : vérifier ensemble les états, le code, l’accessibilité, les tests et la documentation.
-   [Atlassian — Design tokens](https://atlassian.design/tokens/design-tokens/) : nommer les décisions par leur rôle et les partager entre produits.
-   [Adobe Spectrum — Design tokens](https://spectrum.adobe.com/foundations/design-data) : relier les décisions de design aux composants réutilisables.
-   [WAI-ARIA APG — Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) : suivre le comportement clavier attendu des onglets.
