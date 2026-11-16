---
titre: Identité des sites des bibliothèques
description: >-
  Les signatures qui identifient les bibliothèques de l’UdeM et leurs sites :
  logos de l’Université, des bibliothèques et des services, avec leurs variantes
  et leurs usages.
blocs:
  principaux:
    - fichier: '@@dist/logo-bibliotheques-horizontal.svg'
      nom: 'Les bibliothèques, Université de Montréal'
      libelle: Bibliothèques · fond clair · SVG
      largeur: 1080
      hauteur: 350
    - fichier: '@@dist/logo-bibliotheques-horizontal-blanc.svg'
      nom: 'Les bibliothèques, Université de Montréal'
      libelle: Bibliothèques · fond foncé · SVG
      largeur: 1080
      hauteur: 350
      fond: fonce
  universite:
    - fichier: '@@dist/logo-universite-montreal.svg'
      nom: Université de Montréal
      libelle: Université de Montréal · SVG
      largeur: 359
      hauteur: 157
  services:
    - fichier: '@@dist/logo-studio-bib-horizontal.svg'
      nom: 'Les bibliothèques, Studio•bib'
      libelle: Studio•bib · signature horizontale · SVG
      largeur: 297
      hauteur: 61
    - fichier: '@@dist/logo-studio-bib-rond.svg'
      nom: Studio•bib
      libelle: Studio•bib · emblème rond · SVG
      largeur: 328
      hauteur: 328
    - fichier: '@@dist/logo-boite-a-outils.svg'
      nom: Boîte à outils
      libelle: Boîte à outils · emblème · SVG
      largeur: 328
      hauteur: 328
  compacts:
    - fichier: '@@dist/logo-bibliotheques-sceau.svg'
      nom: 'Les bibliothèques, Université de Montréal'
      libelle: Bibliothèques · sceau · fond foncé · SVG
      largeur: 302
      hauteur: 302
      fond: fonce
---

Les fichiers SVG ci-dessous sont les fichiers de référence, à employer tels quels. Ils sont disponibles dans `dist/`.

## Bibliothèques : signature horizontale {#bibliotheques}

La signature horizontale est la version à privilégier lorsque la largeur disponible le permet. La version à texte blanc s’emploie dans les pieds de page et sur fond foncé.

::logos[principaux]

## Université de Montréal {#universite}

Le logo de l’Université marque l’appartenance institutionnelle. Il se place dans l’en-tête et s’emploie tel quel, avec ses tracés et couleurs d’origine.

::logos[universite]

## Signatures des sites de services {#services}

Ces signatures identifient les services concernés. Privilégier les compositions horizontales dans les en-têtes ; conserver le nom du service et son rattachement aux bibliothèques.

::logos[services]

## Sceau {#sceau}

Le sceau est un repère complémentaire, utilisé notamment dans le pied de page. Son anneau de texte est blanc : il se pose toujours sur un fond foncé. Il ne remplace pas la signature horizontale. Pour un sceau animé et lié, voir le composant [Sceau](@@/composants/sceau.html).

::logos[compacts]

## Utiliser les logos {#usage}

-   Choisir la signature horizontale en premier, avec une variante adaptée au fond. Préserver les proportions et laisser un espace libre autour du dessin.
-   Utiliser le fichier correspondant au service. Ne pas recomposer une signature en collant un nom à un logo existant.
-   Ne pas déformer, recadrer, recolorer ou ajouter d’effets aux fichiers. Les couleurs des SVG restent celles des sources.
-   Sur une page officielle, respecter les règles d’identification de l’Université. Le [guide de marque de l’UdeM](https://marque.umontreal.ca/) reste la référence pour les versions autorisées, les fonds et les espaces de protection.

La palette et la typographie communes sont documentées dans [Couleurs](@@/fondations/couleurs.html) et [Typographie](@@/fondations/typographie.html). Les logos gardent leurs propres tracés typographiques.

## Intégration et accessibilité {#integration}

Pour un logo lié, le texte de remplacement nomme sa destination. Si le nom figure déjà dans le même lien, utiliser un texte de remplacement vide pour éviter une répétition. Les dimensions explicites réservent la place du logo ; le CSS conserve ses proportions.

```
<a href="https://bib.umontreal.ca/">
  <img src="/assets/logo-bibliotheques-horizontal.svg"
       alt="Les bibliothèques, Université de Montréal – Accueil"
       width="1080" height="350" />
</a>
```

Copier le SVG de `dist/` dans les ressources du site, ou utiliser son adresse de distribution. Le composant [Logo](@@/fondations/identite.html) conserve les SVG importés au format vectoriel ; [SceauBibliotheques](@@/composants/sceau.html) fournit le sceau utilisé en pied de page.
