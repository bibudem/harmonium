---
titre: Harmonium
logo: '@@dist/harmonium-horizontal.svg'
description: >-
  Le système de design des sites des bibliothèques de l’UdeM : une seule source
  pour les fondations (couleurs, typographie, espacements…) et les composants,
  utilisable dans tout site, Astro ou non.
blocs:
  demarrer:
    - titre: Fondations
      url: '@@/fondations/couleurs.html'
      description: >-
        Les jetons de design et leurs règles : couleurs, typographie, formes,
        mouvement, icônes.
    - titre: Composants
      url: '@@/composants/index.html'
      description: >-
        Alertes, citation, fil d’Ariane, urgence, clavardage et le reste, par
        famille.
    - titre: Rédaction et messages
      url: '@@/fondations/redaction.html'
      description: >-
        Procédures, rédaction épicène, noms des outils et messages
        d’interface.
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
---

::cartes[demarrer]

## Principes {#principes}

-   **Accessible d’abord** : WCAG 2.2 AA comme cible de qualité ; chaque fiche dit ce que le composant fait pour le clavier, les lecteurs d’écran, le zoom et le mode contraste élevé.
-   **Sans dépendance** : du HTML et du CSS quand c’est possible, du JavaScript seulement quand il le faut.
-   **Une seule source** : les jetons et les composants vivent ici ; les sites les chargent plutôt que de les recopier.
-   **À la bonne taille** : une base claire, des composants éprouvés et des règles courtes ; [voir les critères de qualité](@@/demarrer/principes.html).

> Le nom : l’harmonium est l’instrument qui, à lui seul, donne l’harmonie d’un ensemble.
