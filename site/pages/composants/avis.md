---
titre: "Bandeau d’avis"
fichiers: "`bib-avis.min.js` · `<bib-avis>`"
description: "Un bandeau jaune en haut de page pour informer d’une fermeture, de travaux ou d’un service perturbé. Le texte vient du service d’avis des bibliothèques : rien ne paraît quand il n’y a pas d’avis."
ressources: "composants/avis"
vignette: 2
---

## Aperçu {#apercu}

::exemple[composants/avis/01.html]

 

::exemple[composants/avis/02.html]

 

::exemple[composants/avis/03.html]

## Étape 1 : ajouter le script et l’élément {#html}

1.  **Dans le `<head>`**
    
    ```
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-avis.min.js"></script>
    ```
    
2.  **Tout en haut du `<body>`, au-dessus de l’en-tête du site**
    
    Juste après `<udem-urgence>` si la page l’a :
    
    ```
    <bib-avis bouton-fermer></bib-avis>
    ```
    

## Étape 2 : régler le composant (facultatif) {#reglages}

| Attribut | Rôle |
| --- | --- |
| `bouton-fermer` | Affiche le bouton « Fermer ». Un avis fermé ne revient plus. |
| `fluide` | Pleine largeur, sans largeur maximale ni marges latérales. |
| `service` | Adresse du service (par défaut `https://avis.bib.umontreal.ca/api/avis`). Changer l’attribut recharge l’avis. Une adresse `data:` sert aux essais. |

Un `<bib-avis>` qui contient du texte affiche ce texte au lieu d’appeler le service :

```
<bib-avis bouton-fermer><strong>Fermeture</strong> : la bibliothèque est fermée le 24 décembre.</bib-avis>
```

### Événements {#evenements}

Sur l’élément, propagés, annulables avec `preventDefault()` :

| Événement | Quand |
| --- | --- |
| `bib:show` | Juste avant l’affichage d’un avis. |
| `bib:hide` | Juste avant la fermeture. |

```
document.addEventListener('bib:hide', (e) => console.log('avis fermé', e.target))
```

### HTML permis {#securite}

Le texte du service est nettoyé avant d’être affiché, car il paraît sur des sites que nous ne contrôlons pas. Seule la mise en forme passe : `a`, `p`, `br`, `strong`, `em`, `b`, `i`, `u`, `s`, `ul`, `ol`, `li`, `span`, `div`, `small`, `sub`, `sup`, `abbr`, `time`, `code`.

-   Pas de `style`, de `class`, d’image ni de script.
-   Un lien accepte http, https, mailto, tel ou une adresse relative ; ouvert dans un nouvel onglet, il reçoit `rel="noopener noreferrer"`.
-   Le contenu écrit dans la page, lui, n’est pas nettoyé : il vient du site.

## Personnaliser {#habillage}

```
bib-avis {
  --bib-avis-fond: var(--jaune-40);   /* fond */
  --bib-avis-taille: 1rem;    /* taille du texte */
  --bib-avis-spacing-inline: 1rem;       /* marges latérales */
  --bib-btn-close-color: var(--bleu-fonce);
  --bib-btn-close-hover-color: var(--bleu-principal);
}
```

Ces valeurs sont un exemple. Sans réglage, le fond est `--jaune-40`, le texte garde la taille de la page, les marges latérales font 64 px et la croix est noire à 60 %.

## Quand l’utiliser {#quand}

### Pourquoi {#pourquoi}

Quand une bibliothèque ferme ou qu’un service est en panne, l’information doit paraître sur tous les sites des bibliothèques en même temps, sans que chaque équipe modifie son site. L’équipe écrit l’avis une fois, dans le service d’avis ; chaque site l’affiche grâce à une balise.

-   **Un seul composant pour tous les sites** : même bandeau, même texte, mêmes règles, quel que soit l’outil du site.
-   **Aucune dépendance** : un script autonome ; la fermeture est retenue dans le navigateur, sans témoin ni compte.
-   **Sûr** : le texte du service est nettoyé avant d’être affiché, car il paraît sur des sites que nous ne contrôlons pas.
-   **Choix d’accessibilité** : le focus ne se perd pas à la fermeture, la croix est contrastée, le texte est lu en français.

### À utiliser pour

-   Un message temporaire qui concerne tout le site ou tous les sites : fermeture, horaire exceptionnel, panne, travaux.
-   Toutes les pages publiques : le bandeau reste invisible tant qu’il n’y a pas d’avis.

### À éviter

-   **Pour une urgence de l’Université** (évacuation, menace) : c’est l’[urgence](@@/composants/urgence.html), publiée par le Bureau de la sûreté.
-   **Pour une information propre à une page** (salle fermée, conditions d’un service) : une [alerte](@@/composants/alertes.html) dans le contenu, près de ce qu’elle concerne.
-   **Pour un message permanent** : il a sa place dans le contenu du site, pas dans un bandeau qu’on peut fermer.
-   **Pour une promotion ou une nouvelle** : un bandeau trop souvent utilisé n’est plus lu.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique** : le bandeau est un `<aside>` ; le texte garde sa mise en forme (gras, listes, liens) (WCAG 1.3.1). Il n’a pas de rôle d’alerte : il est en tête de page et n’est pas annoncé de force au chargement.
-   **Bouton « Fermer »** : un vrai `<button>` nommé « Fermer l’avis » ; l’icône est cachée aux lecteurs d’écran (4.1.2). Cible de 24 × 24 px (2.5.8).
-   **Clavier et focus** : la croix s’atteint avec Tab et s’active avec Entrée ou Espace (2.1.1) ; contour de focus de 3 px (2.4.7). À la fermeture, le focus reste sur l’emplacement de l’avis : Tab continue juste après, au lieu de repartir du début de la page (2.4.3, testé).
-   **Contrastes** : texte `--bleu-fonce` sur `--jaune-40`, 15,3:1 ; croix à 5,4:1, au-delà des 3:1 demandés (1.4.3, 1.4.11).
-   **Contraste élevé** (couleurs forcées) : le bouton et son contour prennent les couleurs système ; aucune information ne passe par la seule couleur.
-   **Agrandissement et téléphone** : la hauteur suit le texte ; à 320 px de large, le texte passe à la ligne (1.4.4, 1.4.10). Sur un petit écran, préférer `--bib-avis-spacing-inline` plus petit que les 64 px par défaut.
-   **Mouvement** : seule la couleur de la croix change au survol (150 ms).
-   **Langue** : `lang="fr-CA"` sur le bandeau, même sur une page anglaise (3.1.2).

### Ce que l’intégrateur doit faire

-   Placer l’avis en haut du `<body>`, après `<udem-urgence>`, pour qu’il soit lu avant le contenu.
-   Garder `bouton-fermer` : un bandeau qu’on ne peut pas fermer prend de la place à chaque page, surtout avec un fort agrandissement.
-   Avec un habillage propre, vérifier le contraste du texte et de la croix sur le nouveau fond.
-   Pour un avis écrit dans la page : liens explicites, pas de « cliquez ici » ; un lien qui ouvre un onglet le dit dans son texte.

## Bon à savoir {#savoir}

-   Les avis fermés sont retenus dans le navigateur (base IndexedDB `bib-avis`).
-   Un avis corrigé par le service (même identifiant) paraît dans sa nouvelle version.
-   Sur un site en http, la fermeture est quand même retenue.
