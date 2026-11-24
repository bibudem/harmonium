---
titre-court: "Accueil"
titre: Harmonium
logo: '@@dist/harmonium-horizontal.svg'
description: >-
  Le système de design des sites des bibliothèques de l’UdeM : une seule source
  pour les fondations (couleurs, typographie, espacements…) et les composants,
  utilisable dans tout site, Astro ou non.
blocs:
  demarrer:
    - titre: Principes et qualité
      url: '@@/demarrer/principes.html'
      description: >-
        Les choix communs et les critères qu’un composant doit remplir avant
        d’entrer dans Harmonium.
    - titre: Intégrer à un site
      url: '@@/demarrer/integration.html'
      description: >-
        Charger les feuilles et les scripts, dans un site Astro, WordPress ou
        statique.
    - titre: Marque et rédaction
      url: '@@/fondations/identite.html'
      description: >-
        Logos, sceau des bibliothèques et conventions de rédaction : procédures,
        écriture épicène, messages d’interface.
    - titre: Fondations
      url: '@@/fondations/couleurs.html'
      description: >-
        Les jetons de design et leurs règles : couleurs, typographie, formes,
        mouvement, icônes.
    - titre: Composants
      url: '@@/composants/index.html'
      description: >-
        Navigation, boutons, listes, cartes, messages et le reste, classés par
        catégorie.
    - titre: Services des Bibliothèques
      url: '@@/composants/index.html#services-des-bibliotheques'
      description: >-
        Urgence, avis, clavardage, rétroaction, consentement et horaire, prêts à
        ajouter à un site.
---

::cartes[demarrer]

## Principes {#principes}

-   **Accessible d’abord** : WCAG 2.2 AA comme cible de qualité ; chaque fiche dit ce que le composant fait pour le clavier, les lecteurs d’écran, le zoom et le mode contraste élevé.
-   **Sans dépendance** : du HTML et du CSS quand c’est possible, du JavaScript seulement quand il le faut.
-   **Une seule source** : les jetons et les composants vivent ici ; les sites les chargent plutôt que de les recopier.
-   **À la bonne taille** : une base claire, des composants éprouvés et des règles courtes ; [voir les critères de qualité](@@/demarrer/principes.html).

> Le nom : l’harmonium est l’instrument qui, à lui seul, donne l’harmonie d’un ensemble.
