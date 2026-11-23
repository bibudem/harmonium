---
titre-court: "Principes"
titre: "Principes et qualité"
description: "Une base commune à la taille des bibliothèques de l’UdeM : les décisions qui se répètent vivent ici, les besoins particuliers restent dans leur site."
---

## Le socle commun {#socle}

Trois principes guident chaque décision d’Harmonium.

-   **Partir des besoins réels.** Un composant répond à une tâche observée dans les sites : trouver un document, réserver une salle, obtenir de l’aide. Il s’appuie sur les normes d’accessibilité et sur l’usage observé des sites.
-   **Soutenir les équipes.** Harmonium donne des composants prêts, accessibles et documentés, avec des consignes claires, pour que chaque site se concentre sur son contenu.
-   **Évoluer avec les sites.** Le système change par petites étapes annoncées. Un besoin qui revient dans plusieurs sites le rejoint ; ce qui ne sert plus en sort.

Sur ces principes, tous les sites partagent le même socle :

-   **L’image de marque UdeM.** Couleurs, polices, logo et sceau de l’Université, appliqués de la même manière partout. Le détail est dans [Identité](@@/fondations/identite.html).
-   **Une rédaction commune.** Appliquer les [conventions de rédaction des bibliothèques](@@/fondations/redaction.html) : langage clair, tâche avant l’organisation, procédures cohérentes, formulations épicènes et noms des services.
-   **L’accessibilité intégrée.** Chaque composant vise WCAG 2.2 AA dès sa conception. Sa fiche sépare ce que le composant garantit de ce qui revient à la personne qui assemble la page.
-   **Le HTML d’abord.** Liens pour naviguer, boutons pour agir, `details` pour déplier, contrôles natifs pour saisir. Un script n’ajoute que le comportement qui manque, et la page reste utilisable sans lui.
-   **Des décisions nommées par leur rôle.** Les jetons disent l’usage d’une valeur (`--couleur-texte`, `--espace-carte`) ; les variables `--bib-*` servent aux adaptations ponctuelles.
-   **Des formes prévisibles.** Un bouton plein pour l’action principale, des liens soulignés dans le texte, des cartes et des champs aux coins arrondis, des titres qui gardent le niveau logique de la page.

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

## Statuts de maturité {#maturite}

Chaque fiche affiche le statut du composant sous son titre. L’intégration dans les sites est suivie à part, dans le [suivi d’intégration](@@/sites/index.html).

| Statut | Sens | Engagement |
| --- | --- | --- |
| <span class="bib-pastille bib-pastille--bleu">Stable</span> | Éprouvé, documenté, testé. | Une modification incompatible demande une version majeure et une note de migration. |
| <span class="bib-pastille bib-pastille--jaune">Bêta</span> | Utilisable ; son HTML, ses classes, ses propriétés ou son apparence peuvent encore changer. | Les changements sont annoncés à chaque version ; ils peuvent arriver dans une version mineure. |
| <span class="bib-pastille bib-pastille--rose">Déconseillé</span> | Conservé pour les pages existantes. | Retiré à la version majeure suivante ; la fiche nomme le remplaçant. |

Un composant entre en bêta quand il remplit les critères ci-dessus ; il devient stable après un usage réel dans un site, quand son HTML, ses classes et ses propriétés n’ont plus changé depuis au moins une version.

## Faire évoluer sans alourdir {#evolution}

Avant d’ajouter, réutiliser : un composant existant, puis une variante s’il garde le même rôle. Un nouveau composant partagé se justifie quand le même besoin revient dans plusieurs sites.

Ce qui est propre à un seul site y reste : ses catalogues, ses liens avec ses propres outils (réservations, horaires, bases de données) et sa façon de publier le contenu. Une idée peut y mûrir avant de rejoindre Harmonium.

Une modification qui casse l’existant demande une version majeure et une note de migration.

## Noms et structure des fiches {#nomenclature}

Les noms des composants reprennent le vocabulaire de W3Schools, traduit en français : un nom d’objet reconnu (« Accordéon », « Infobulle », « Barre de recherche »), jamais le nom d’un contenu particulier. Les menus suivent ses catégories « How To » : menus et navigation, boutons, formulaires, images, tableaux, listes, cartes, messages.

Un composant nommé « Liste » est toujours une `<ul>` ou une `<ol>` ; un `<div>` autour n’est permis que pour ajouter des commandes à la liste, comme les filtres de la liste filtrable. Ce qui n’est pas une liste HTML porte un autre nom et se range ailleurs : la grille de logos, la galerie d’images et le carrousel sont dans « Images et médias ». À l’inverse, un fil d’Ariane, une pagination ou des étiquettes sont des listes HTML, mais ils gardent le nom de leur objet, comme chez W3Schools.

| Harmonium | W3Schools |
| --- | --- |
| Accordéon | Accordion |
| Onglets | Tabs |
| Fil d’Ariane | Breadcrumbs |
| Pagination | Pagination |
| Barre de navigation | Navbar, Top Navigation |
| Navigation latérale | Side Navigation |
| Barre de recherche | Search Bar |
| Bouton de retour en haut | Scroll To Top Button |
| Pied de page | Footer |
| Bouton | Buttons |
| Copier dans le presse-papiers | Copy Text to Clipboard |
| Liste filtrable | Filter List |
| Bannière | Hero Image |
| Galerie d’images | Image Gallery |
| Tableau | Tables |
| Carte, carte de profil | Cards, Profile Card |
| Alerte | Alerts |
| Étiquette | Tags |
| Infobulle | Tooltips |
| Citation | Quotes |
| Conteneur | Containers |
| Panneau | Panels |
| Séparateur | Dividers |
| Fenêtre de clavardage | Popup Chat Window |
| Contenu intégré | Responsive Iframes |

Chaque fiche suit le même plan, celui des pages « How To » : un aperçu, puis **Étape 1 : ajouter le HTML**, **Étape 2 : ajouter le CSS**, **Étape 3 : ajouter le JavaScript** quand il y en a, la version Astro, la personnalisation (variables d’habillage), l’usage et l’accessibilité.

Les noms dans le code (composants Astro, classes `bib-*`) rejoignent ces noms au fil des versions ; un ancien nom reste disponible, déconseillé, jusqu’à la version majeure suivante.
