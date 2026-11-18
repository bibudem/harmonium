---
titre: "Clavardage"
fichiers: "`bib-clavardage.min.js`"
description: "Un bouton rond, en bas à droite, ouvre le clavardage LibChat des bibliothèques. Après 30 secondes, une bulle invite discrètement à poser une question, si le service est en ligne."
ressources: "composants/clavardage"
---

## Aperçu {#apercu}

Le rond est en bas à droite de cette page. L’invitation paraît ici après **5 secondes**, si le service est en ligne.

::exemple[composants/clavardage/01.html]

 

::exemple[composants/clavardage/02.html]

Une invitation fermée ne revient pas pendant la visite (onglet ouvert). Sur un écran de moins de 700 px, le rond reste en bas à droite et la conversation s’ouvre dans un nouvel onglet.

## Utilisation {#utilisation}

1.  **Juste avant `</body>`, sur toutes les pages**
    
    ```
    <script defer src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-clavardage.min.js"></script>
    ```
    
    C’est tout : le rond, le panneau et l’invitation sont créés par le script. Par défaut, c’est le widget des bibliothèques.
    

### Réglages (facultatifs) {#reglages}

En attributs `data-*` sur la même balise `<script>` :

| Attribut | Rôle | Défaut |
| --- | --- | --- |
| `data-hash` | Hash du widget (code d’intégration LibAnswers). | widget des bibliothèques |
| `data-id` | Id du widget (`s-lch-widget-<id>`). | `9467` |
| `data-hote` | Domaine LibAnswers. | `unequestion.bib.umontreal.ca` |
| `data-version` | À changer après une modification du widget dans LibAnswers (son script reste une heure en cache). | `1` |
| `data-invitation` | Délai de l’invitation, en secondes. `0` : pas d’invitation. | `30` |
| `data-texte-invitation` | Texte de la bulle d’invitation. | « Une question? Un technicien… » |
| `data-langue` | Langue du widget LibChat tel que configuré dans LibAnswers (pour les lecteurs d’écran). Les textes ajoutés par le script restent en français et le disent. | `fr-CA` |

Exemple :

```
<script defer src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-clavardage.min.js" data-invitation="0"></script>
```

### Ouvrir depuis le site {#ouvrir}

N’importe quel bouton du site (menu, page « Nous joindre »…) peut ouvrir le clavardage :

```
<button type="button" onclick="window.dispatchEvent(new Event('bib:ouvrir-clavardage'))">Clavarder avec nous</button>
```

## Habillage {#habillage}

Dans la feuille de style du site (toutes facultatives) :

```
:root {
  --bib-clavardage-couleur: var(--bleu-principal);          /* rond */
  --bib-clavardage-couleur-survol: var(--bleu-fonce);   /* rond au survol, anneau de focus */
  --bib-clavardage-sur-couleur: var(--blanc);         /* icône dans le rond */
  --bib-clavardage-surface: var(--blanc);             /* panneau, libellé, bulle */
  --bib-clavardage-texte: var(--bleu-fonce);
  --bib-clavardage-texte-secondaire: var(--gris-600);
  --bib-clavardage-bordure: var(--gris-300);
  --bib-clavardage-pastille: var(--rouge-orange);        /* nouveau message */
  --bib-clavardage-rayon: 12px;
  --bib-clavardage-police: 'Figtree Variable', sans-serif;
  --bib-clavardage-droite: 1.5rem;            /* distance au bord, ≥ 900 px */
  --bib-clavardage-bas: 1.5rem;
  --bib-clavardage-droite-mobile: 1rem;       /* < 900 px */
  --bib-clavardage-bas-mobile: 1rem;
  --bib-clavardage-z-index: 1100;
  --bib-clavardage-z-index-ouvert: 1300;
}
```

Si le site a déjà un élément fixe en bas à droite (bouton « Retour en haut »…), augmenter `--bib-clavardage-droite` ou `--bib-clavardage-bas` pour lui laisser la place.

## Quand l’utiliser {#quand}

### Pourquoi {#pourquoi}

Le widget LibChat de Springshare se colle tel quel dans une page, mais son apparence dépend alors de chaque site et il présente des défauts d’accessibilité : région et iframe nommées « Chat Widget », nouveau message signalé par un simple point rouge, invitation automatique qui déplace le focus. Ce script l’intègre de la même façon sur tous les sites des bibliothèques.

-   **Une balise pour tous les sites** : même rond, même place, même invitation, quel que soit l’outil du site ; les réglages du widget restent dans LibAnswers.
-   **Aucune dépendance** : seul le script de LibChat est chargé, comme avec le code d’origine.
-   **Corrections d’accessibilité** : libellé visible, noms en français, nouveau message annoncé, focus toujours visible, Échap, invitation qui ne vole pas le focus.
-   **Cohabitation** : le rond se place au-dessus de la [carte de consentement](@@/composants/consentement.html) et résiste aux styles hostiles du site.

### À utiliser pour

-   Les sites des bibliothèques où une personne peut avoir une question pendant sa visite : site principal, guides, catalogue.
-   Toutes les pages d’un même site, pour que le rond soit toujours au même endroit.

### À éviter

-   **Comme seul moyen de nous joindre** : le clavardage n’est offert qu’aux heures de service. Une page « Nous joindre » (courriel, téléphone, comptoirs) reste nécessaire ; elle peut aussi ouvrir le clavardage avec un bouton (voir [Ouvrir depuis le site](#ouvrir)).
-   **Pour recueillir un avis sur une page** : la [rétroaction](@@/composants/retroaction.html), qui ne demande pas de réponse.
-   **Sur une page déjà chargée en éléments fixes** en bas à droite, sans régler la place (voir [Habillage](#habillage)).
-   **Deux fois sur une page** : un second chargement est ignoré.

## Accessibilité {#accessibilite}

Le script règle tout ce qui est autour de la conversation. Le contenu du panneau (l’iframe de LibChat) appartient à Springshare : ses couleurs et ses textes se règlent dans LibAnswers.

### Ce que fait le composant

-   **Rond et libellé** : le rond est un bouton ; à partir de 900 px, son nom (fourni par LibChat) est aussi écrit sous lui, sur une à trois lignes selon la police et l’espacement choisis par la personne (WCAG 2.5.3, 1.4.12). Sous 900 px, le libellé visible est masqué mais reste le nom du bouton. Le rond mesure 56 px (48 px sous 900 px) (2.5.8).
-   **Noms en français** : la région s’appelle « Clavardage » (au lieu de « Chat Widget ») et l’iframe aussi ; le bloc porte la langue du widget (`data-langue`), et les textes ajoutés par le script portent `lang="fr-CA"` (3.1.2, 4.1.2).
-   **Nouveau message** : la pastille rouge de LibChat n’a pas de texte. Quand elle paraît, le rond reçoit la description « Nouveau message » et « Nouveau message dans le clavardage. » est annoncé poliment (`role="status"`) (1.3.1, 1.4.1, 4.1.3).
-   **Clavier** : Échap ferme le panneau et rend le focus au rond, quand le focus est dans le clavardage ou nulle part ; Échap dans un menu du site ne le ferme pas (2.1.1, 2.4.3, testé).
-   **Focus visible** : anneau de 3 px, imposé même si le site retire les contours avec `outline: none !important` (2.4.7, testé avec une feuille hostile). Le rond reste au-dessus de la carte de consentement, donc jamais caché par elle (2.4.11).
-   **Invitation** : la bulle ne prend pas le focus. C’est une région `role="status"` dont le texte est ajouté juste après son apparition, pour être annoncé. Sa croix est un bouton nommé « Fermer l’invitation au clavardage » (28 px) ; fermée au clavier, elle rend le focus au rond. Elle ne revient pas de la visite et disparaît quand le panneau s’ouvre.
-   **Mouvement** : le rond pulse trois fois (moins de 5 s) à l’arrivée de l’invitation (2.2.2). Avec « réduire les animations », pulsation, glissements et agrandissements sont retirés ; la bulle apparaît en fondu (2.3.3).
-   **Contrastes** (couleurs par défaut) : icône blanche sur rond `--bleu-principal`, 7,1:1 ; libellé `--bleu-fonce` sur blanc, 18:1 ; libellé hors ligne `#4a5160`, 8:1 (1.4.3, 1.4.11).
-   **Contraste élevé** (couleurs forcées) : le rond et la croix de la bulle reçoivent une bordure et une icône en couleur système.
-   **Téléphone et agrandissement** : sous 700 px de large (règle de LibChat), le rond ouvre la conversation dans un nouvel onglet au lieu d’un panneau ; la bulle ne dépasse pas la largeur de l’écran (1.4.10).
-   **Impression** : le clavardage n’est pas imprimé.

### Ce que l’intégrateur doit faire

-   Dans LibAnswers, laisser l’invitation automatique du widget **désactivée** (délai 0) : sinon elle ouvre le panneau et y déplace le focus.
-   Régler `data-langue` si le widget LibChat est configuré dans une autre langue que le français.
-   Dans LibAnswers, vérifier les contrastes et les textes du panneau, qui échappent au script.
-   Laisser la place au rond : aucun élément fixe du site ne doit le recouvrir, ni être recouvert par lui (régler `--bib-clavardage-droite` et `--bib-clavardage-bas`).
-   Avec un habillage propre, garder 3:1 entre le rond et le fond de page, et 4,5:1 pour le libellé.
-   Garder une page « Nous joindre » accessible sans le clavardage.

## Bon à savoir {#savoir}

-   Avec `defer` ou `type="module"`, les réglages sont lus de la même façon.
-   Si LibChat ne se charge pas (script bloqué, service en panne), un avertissement paraît dans la console après 30 s au plus.
-   Le widget LibChat ne répond que sur les domaines qu’il accepte ; `localhost` fonctionne.
-   Une invitation fermée est retenue pour l’onglet (`sessionStorage`) ; hors ligne au moment voulu, elle attend que le service ouvre.
