---
titre: "Consentement"
fichiers: "`bib-consentement.min.js` · `<bib-consentement>`"
description: "Demande l’accord de la personne avant de mesurer la fréquentation (Google Analytics, Google Tag Manager, Microsoft Clarity). Rien n’est chargé ni envoyé avant sa réponse."
ressources: "composants/consentement"
---

## Aperçu {#apercu}

La carte paraît en bas de l’écran tant qu’aucun choix n’est enregistré ; ici, elle est retenue dans le cadre. Elle utilise des identifiants fictifs (`G-TEST000000`) : ne pas les copier.

::exemple[composants/consentement/01.html]

 

::exemple[composants/consentement/02.html]

Dernier choix : **aucun pendant cette visite**.

## Utilisation {#utilisation}

1.  **Dans le `<head>`**
    
    ```
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-consentement.min.js"></script>
    ```
    
2.  **Dans le `<body>`, une seule fois par page (juste avant `</body>`)**
    
    Site des bibliothèques :
    
    ```
    <bib-consentement gtm-id="GTM-K8BQPC" clarity-id="tfds44a7xa"></bib-consentement>
    ```
    
    Ne mettre que les identifiants des outils que le site utilise vraiment : sans identifiant, rien n’est chargé.
    
3.  **Dans le pied de page : bouton « Paramètres des témoins »**
    
    ```
    <bib-consent-preferences-btn></bib-consent-preferences-btn>
    ```
    
    Il prend la police et la couleur du pied de page. Ou, sur un bouton du site :
    
    ```
    <button type="button" onclick="window.dispatchEvent(new Event('bib:parametres-temoins'))">Paramètres des témoins</button>
    ```
    

## Réglages {#reglages}

| Attribut | Rôle |
| --- | --- |
| `gtm-id` | Conteneur Google Tag Manager (`GTM-XXXXXX`). Avec lui, `ga-id` est ignoré : le conteneur charge Google Analytics lui-même (sinon, chaque visite serait comptée deux fois). |
| `ga-id` | Mesure Google Analytics 4, chargée en direct (sans conteneur). Sans cet attribut, Google n’est jamais chargé. |
| `clarity-id` | Projet Microsoft Clarity. Sans cet attribut, Clarity n’est jamais chargé. |
| `url-vie-privee` | Page « Vie privée » (http ou https). Par défaut : `https://vie-privee.umontreal.ca/accueil/`. |

Le panneau ne nomme que les tiers réellement chargés :

| Attributs | Tiers nommés |
| --- | --- |
| `gtm-id` | Google (Google Tag Manager, Google Analytics) |
| `ga-id` seul | Google (Google Analytics) |
| `clarity-id` | Microsoft (Clarity) |
| aucun | « aucun outil de statistiques n’est utilisé sur ce site » |

## Fonctionnement {#fonctionnement}

-   **Rien avant la réponse** : aucun script de Google ou de Microsoft n’est chargé avant que la personne accepte.
-   **Refus** : les témoins de statistiques déjà posés (`_ga`, `_clck`…) sont effacés, sur le site et ses domaines parents.
-   **Retrait de l’accord pendant une visite** : la page se recharge, pour que les outils déjà chargés s’arrêtent tous.
-   **Un seul par page** : un second `<bib-consentement>` est ignoré (avertissement dans la console).
-   **Hauteur publiée** : tant que la carte est affichée, sa hauteur est publiée dans `--bib-consentement-hauteur` (sur `<html>`) ; le [clavardage](@@/composants/clavardage.html) se place au-dessus.

## Rouvrir, réagir, navigation {#api}

### Rouvrir le panneau depuis le code

```
window.dispatchEvent(new Event('bib:parametres-temoins'))
// ou : document.querySelector('bib-consentement').ouvrirParametres()
```

### Réagir au choix

```
window.addEventListener('bib:consentement', (e) => console.log(e.detail.statistiques)) // true | false
```

### Site à navigation côté client (conteneur GTM)

Une page vue est envoyée au chargement du conteneur. Un site qui change de page sans rechargement (Astro ClientRouter, application monopage) signale chaque nouvelle page :

```
window.dispatchEvent(new Event('bib:page-vue'))
```

## Habillage aux couleurs d’un site {#habillage}

Dans la feuille de style du site, une fois (toutes facultatives ; chaque propriété a une valeur par défaut neutre). Exemple avec les jetons communs :

```
bib-consentement {
  --bib-consentement-fond: var(--couleur-surface);
  --bib-consentement-texte: var(--couleur-texte);
  --bib-consentement-bordure: var(--couleur-bordure);
  --bib-consentement-bouton-fond: var(--couleur-fond-fort);
  --bib-consentement-bouton-texte: var(--couleur-sur-fonce);
  --bib-consentement-bouton-survol: var(--bleu-principal);
  --bib-consentement-focus: var(--couleur-focus);
  --bib-consentement-focus-contour: var(--couleur-focus-contour);
  --bib-consentement-rayon: var(--rayon-carte);
  --bib-consentement-z-index: var(--z-tiroir);
  --bib-consentement-ombre: var(--ombre-carte);
  --bib-consentement-voile: #000;            /* fond derrière le panneau (à 50 %) */
}
```

## Pourquoi {#pourquoi}

La Loi sur l’accès (art. 65.0.1) exige l’accord de la personne avant d’activer des outils qui la profilent ou la localisent, comme les statistiques de fréquentation. Le texte présenté, la durée du choix et l’effacement des témoins sont fixés une fois, avec la personne responsable de la vie privée, au lieu d’être refaits sur chaque site.

-   **Un seul composant pour tous les sites** : même texte légal, même témoin ; sur `bib.umontreal.ca`, une réponse vaut pour tous les sites des bibliothèques.
-   **Rien avant la réponse** : aucun script de Google ou de Microsoft n’est chargé avant l’accord, et un refus efface les témoins déjà posés.
-   **Aucune dépendance** : pas de plateforme de consentement externe ; le script est autonome.
-   **Choix d’accessibilité** : carte non bloquante, panneau en vraie boîte de dialogue, focus rendu après le choix, choix annoncé, place gardée pour le focus en bas de l’écran.

## Quand l’utiliser {#quand}

### À utiliser pour

-   Tout site des bibliothèques qui mesure sa fréquentation avec Google Analytics, Google Tag Manager ou Microsoft Clarity.
-   Un site sans outil de statistiques qui veut quand même offrir le bouton « Paramètres des témoins » : le panneau dit alors qu’aucun outil n’est utilisé.

### À éviter

-   **Avec un autre bandeau de consentement** sur la même page (extension WordPress, plateforme externe) : la personne répondrait deux fois.
-   **Pour des témoins nécessaires au fonctionnement** (session, panier, préférences) : ils n’ont pas besoin d’accord et ne sont pas gérés ici.
-   **En chargeant soi-même** Google Analytics, Tag Manager ou Clarity dans la page : ils partiraient avant la réponse. Passer seulement par les attributs du composant.
-   **Plus d’une fois par page** : un second élément est ignoré.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Carte non bloquante** : une région (`<section>`) nommée par son titre, en bas à droite (bande pleine largeur sous 600 px). Elle ne prend pas le focus et n’empêche pas de lire la page ; on l’atteint avec Tab, à la fin de la page (WCAG 1.3.1, 2.1.1).
-   **Panneau des préférences** : une vraie boîte de dialogue modale (`<dialog>`), nommée « Personnaliser les témoins ». Le focus y entre et y reste ; Échap ou « Fermer » la referme et rend le focus au bouton qui l’a ouverte (2.1.2, 2.4.3).
-   **Choix** : boutons « Accepter » et « Refuser » de même poids ; dans le panneau, une case à cocher étiquetée « Statistiques de fréquentation » et des détails repliables (`<details>`) (3.3.2, 4.1.2).
-   **Après le choix** : la carte disparaît et le focus revient à l’élément de la page d’où il venait, sinon sur l’emplacement du composant, jamais au début de la page (2.4.3, testé). « Choix enregistré : statistiques acceptées. » (ou refusées) est annoncé (`role="status"`) (4.1.3).
-   **Focus jamais caché** : tant que la carte est affichée, la page garde une marge en bas (`scroll-padding-bottom`) : un élément atteint au clavier ne passe pas sous la carte, même à 400 % (2.4.11, testé). Le contour de focus, jaune `#ffca40` bordé de `#0b113a`, se voit sur fond clair comme sur fond foncé (2.4.7).
-   **Lien externe annoncé** : « Vie privée à l’UdeM » dit en texte masqué qu’il ouvre une nouvelle fenêtre (3.2.5).
-   **Contrastes** (couleurs par défaut) : texte `#0b113a` sur blanc et texte blanc sur les boutons `#0b113a`, 18:1 (1.4.3).
-   **Contraste élevé** (couleurs forcées) : les boutons gardent une bordure, transparente en temps normal, qui devient visible.
-   **Agrandissement et téléphone** : sur un écran bas (téléphone couché, zoom à 400 %), la carte se compacte ; le panneau défile s’il dépasse la hauteur de l’écran (1.4.4, 1.4.10).
-   **Mouvement** : aucune animation.
-   **Langue** : `lang="fr-CA"` sur la carte, le panneau, l’annonce et le bouton « Paramètres des témoins » (3.1.2).

### Ce que l’intégrateur doit faire

-   Placer `<bib-consent-preferences-btn>` (ou un bouton du site) dans le pied de page de chaque page : le panneau le promet (« en bas de chaque page »). Ce bouton n’a pas de style propre : vérifier qu’il est visible et contrasté dans le pied de page.
-   Placer `<bib-consentement>` juste avant `</body>` : la carte arrive à la fin de l’ordre de tabulation, après le contenu.
-   Les titres de la carte et du panneau sont des `h2` : ils s’ajoutent à la liste des titres de la page.
-   Si le site règle déjà `scroll-padding-bottom`, le composant n’y touche pas : prévoir la hauteur de la carte (`--bib-consentement-hauteur`).
-   Avec un habillage propre, garder 4,5:1 pour le texte et les boutons, et un focus visible sur le fond de la carte.

## Bon à savoir {#savoir}

### Le témoin et le texte légal {#temoin}

Le choix est gardé dans le témoin `bib-consentement` (`{ statistiques: 'accepte' | 'refuse', date, version }`), valide 182 jours (Loi sur l’accès, art. 53.1). Sur `bib.umontreal.ca` et ses sous-domaines, il est partagé : une réponse vaut pour tous les sites des bibliothèques. Ailleurs (localhost, préproduction), il reste propre au site.

::exemple[composants/consentement/03.html]
