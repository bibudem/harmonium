---
titre: "Bandeau d’urgence"
fichiers: "`udem-urgence.min.js` · `<udem-urgence>`"
description: "Le message d’urgence de l’Université de Montréal (Bureau de la sûreté), en haut de page. Rien ne s’affiche tant qu’il n’y a pas d’urgence en cours."
ressources: "composants/urgence"
vignette: 2
---

## Aperçu {#apercu}

::exemple[composants/urgence/01.html]

 

::exemple[composants/urgence/02.html]

 

::exemple[composants/urgence/03.html]

## Étape 1 : ajouter le script et l’élément {#html}

1.  **Dans le `<head>`**
    
    ```
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/udem-urgence.min.js"></script>
    ```
    
2.  **Premier élément du `<body>`, avant tout le reste**
    
    Avant `<bib-avis>` et l’en-tête du site :
    
    ```
    <udem-urgence></udem-urgence>
    ```
    

## Étape 2 : régler le composant (facultatif) {#reglages}

| Attribut | Rôle |
| --- | --- |
| `big` | Grand format. Le message peut aussi l’imposer (`bannerType: "large"`). |
| `service` | Adresse du message (par défaut `https://urgence.umontreal.ca/urgence-udem.json`). Changer l’attribut recharge le message. Une adresse `data:` sert aux essais. |

## Quand l’utiliser {#quand}

### Pourquoi {#pourquoi}

En cas d’urgence sur le campus (évacuation, fermeture, menace), le Bureau de la sûreté publie un message que tous les sites de l’Université doivent montrer, sans délai et de la même façon. Chaque site des bibliothèques n’a pas à recoder ce bandeau : il ajoute une balise, et le message paraît dès qu’il est publié.

-   **Un seul composant pour tous les sites** : même apparence, même source, même comportement, que le site soit en Astro, WordPress ou Drupal.
-   **Aucune dépendance** : un script autonome, sans bibliothèque à charger.
-   **Accessible d’emblée** : message jamais coupé, un seul arrêt au clavier, ouverture dans un nouvel onglet annoncée, urgence publiée pendant la visite annoncée aux lecteurs d’écran.
-   **Prudent avec le service** : seules les adresses http(s) sont acceptées pour le lien, et une panne passagère n’efface pas une urgence déjà affichée.

### À utiliser pour

-   Toutes les pages publiques des sites des bibliothèques, en permanence : le bandeau reste invisible tant qu’il n’y a pas d’urgence.

### À éviter

-   **Pour un message des bibliothèques** (fermeture d’une bibliothèque, panne d’un service, travaux) : utiliser l’[avis](@@/composants/avis.html). L’urgence est réservée au Bureau de la sûreté ; le site n’en écrit pas le contenu.
-   **Pour une information dans le contenu d’une page** : utiliser une [alerte](@@/composants/alertes.html).
-   **Plus d’une fois par page**, ou ailleurs qu’en tout début de page.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique** : le bandeau est une région `<aside>` nommée « Message d’urgence de l’Université de Montréal », que les lecteurs d’écran listent parmi les régions de la page (WCAG 1.3.1). L’heure est un élément `<time>` avec sa date machine.
-   **Clavier** : un seul arrêt avec Tab, le lien, qui couvre tout le bandeau (2.1.1, 2.4.3). Son contour de focus blanc de 3 px se voit sur le fond rouge (2.4.7).
-   **Nom du lien** : le texte du message, suivi de « (nouvel onglet) » en texte masqué : la personne sait que le lien ouvre un onglet (3.2.5, 2.4.4).
-   **Annonce** : au chargement, le message n’est pas annoncé, puisqu’il est en tête de page. Une urgence publiée pendant la visite (relecture toutes les 5 minutes et au retour sur l’onglet) est annoncée par une région `role="alert"` : « Message d’urgence de l’Université de Montréal : … » (4.1.3).
-   **Contrastes** : texte blanc sur rouge `#b60000` (7:1) et date blanche sur gris `#40474f` (9,4:1) (1.4.3).
-   **Contraste élevé** (couleurs forcées) : le filet du bas et le contour de focus passent aux couleurs système.
-   **Agrandissement et téléphone** : la hauteur suit le texte, le message n’est jamais coupé ni masqué par la date ; sous 600 px, la date passe au-dessus. À 375 px, rien ne déborde (testé) ; à 320 px de large, le texte passe à la ligne sans défilement horizontal (1.4.4, 1.4.10).
-   **Mouvement** : aucune animation.
-   **Langue** : `lang="fr-CA"` sur le bandeau et l’annonce, même sur une page anglaise : la synthèse vocale lit le français correctement (3.1.2).

### Ce que l’intégrateur doit faire

-   Placer `<udem-urgence>` au début du `<body>`, avant l’en-tête du site (un lien d’évitement peut le précéder) : c’est l’une des premières choses lues et atteintes au clavier.
-   Ne pas le cacher avec du CSS du site, ni le recouvrir d’un en-tête fixe.
-   Les tailles de texte sont en pixels : le bandeau grandit avec le zoom du navigateur, mais pas avec la seule taille de police par défaut.

## Bon à savoir {#savoir}

-   Le message est relu toutes les 5 minutes tant que la page est visible, et au retour sur l’onglet.
-   Le lien s’ouvre dans un nouvel onglet et n’accepte que les adresses http(s) ; sinon, il mène à `https://urgence.umontreal.ca/`.
-   Si le service ne répond pas au chargement, rien ne paraît (erreur dans la console) ; pendant la visite, une panne passagère n’efface pas une urgence déjà affichée.
