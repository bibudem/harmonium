---
titre: "Alertes"
fichiers: "`astro/Alerte.astro` · `bib-alertes.min.css`"
description: "Une alerte est un encadré qui met en avant une information, une confirmation, une mise en garde ou une erreur dans le contenu d’une page. C’est le composant commun aux sites des bibliothèques."
---

## Aperçu {#apercu}

::exemple[composants/alertes/01.html]

 

::exemple[composants/alertes/02.html]

 

::exemple[composants/alertes/03.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-alerte bib-alerte--avertissement">
  <span class="bib-alerte__icone" aria-hidden="true"></span>
  <div class="bib-alerte__message">
    <span class="bib-masque">Avertissement : </span>
    <p>La salle 1 est fermée pour travaux.</p>
  </div>
</div>
```

Changer le type à deux endroits : la classe (`bib-alerte--info`, `--succes`, `--avertissement`, `--erreur`) et le libellé masqué (« Information : », « Succès : », « Avertissement : », « Erreur : »). Avec un titre : `<p class="bib-alerte__titre">Titre</p>` juste après le libellé masqué. Sans icône : retirer la ligne `bib-alerte__icone`.

### Avec Astro

```
---
import Alerte from 'harmonium/astro/Alerte.astro'
---
<Alerte type="avertissement">La salle 1 est fermée pour travaux.</Alerte>

<Alerte type="succes" titre="Réservation confirmée">
  <p>Votre salle est réservée pour le 3 décembre.</p>
</Alerte>
```

### Propriétés (Astro) {#proprietes}

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| `type` | `info`, `succes`, `avertissement` ou `erreur`. | `info` |
| `titre` | Titre facultatif, au-dessus du texte. Pour un titre avec du balisage : `<Fragment slot="titre">…</Fragment>`. | aucun |
| `icone` | `false` retire l’icône. | `true` |
| `class`, autres attributs | Ajoutés à l’élément (`id`, `data-*`…). |  |

## Habillage {#habillage}

L’encadré utilise les jetons communs quand la page les définit : `--alerte-fond`, `--alerte-info-fond`, `--alerte-info-icone` (et de même pour `succes`, `avertissement`, `erreur`), `--couleur-texte-neutre`, `--couleur-bordure`, `--rayon-petit`, `--espace-element`, `--texte-petit`, `--texte-courant`, `--graisse-moyenne`. Sans eux, il prend les couleurs claires du socle (comme sur cette page).

Pour un autre habillage, des propriétés propres l’emportent :

```
.bib-alerte {
  --bib-alerte-fond: var(--bleu-10);              /* fond du message */
  --bib-alerte-texte: var(--gris-700);
  --bib-alerte-bordure: var(--gris-300);
  --bib-alerte-rayon: 12px;
  --bib-alerte-marge: 1rem;                /* espace au-dessus et au-dessous */
  --bib-alerte-taille: 0.875rem;           /* taille du texte */
  --bib-alerte-taille-titre: 1rem;
  --bib-alerte-info-fond: var(--bleu-20);        /* bandeau de l'icône */
  --bib-alerte-info-icone: var(--bleu-principal);        /* idem : -succes-, -avertissement-, -erreur- */
}
```

## Quand l’utiliser {#quand}

### Pourquoi {#pourquoi}

Un composant commun sert les sites des bibliothèques, avec les mêmes types de message et les mêmes règles d’accessibilité.

-   **Pas de JavaScript** : l’alerte est du HTML et du CSS. Les sites Astro utilisent le composant `<Alerte>` ; les autres copient le HTML et chargent la feuille de style. Les deux produisent exactement le même code.
-   **Aucune dépendance** : les icônes Phosphor (licence MIT) sont intégrées à la feuille de style.
-   **Le type ne repose pas sur la couleur** : il est aussi dit en texte, pour les lecteurs d’écran.

### À utiliser pour

-   Une information à mettre en avant dans le contenu d’une page, près de ce qu’elle concerne : heures modifiées, salle fermée, service interrompu.
-   Une confirmation ou une erreur affichée sur une page après une action (réservation confirmée, formulaire indisponible).

### À éviter

-   **Pour un message qui concerne tout le site** (fermeture, panne) : l’[avis](@@/composants/avis.html) en haut de page.
-   **Pour une urgence de l’UdeM** : l’[urgence](@@/composants/urgence.html).
-   **Pour décorer ou varier la mise en page** : une page couverte d’encadrés n’en fait plus ressortir aucun. Un paragraphe suffit le plus souvent.
-   **Pour annoncer un changement qui survient pendant la visite** (résultat d’un envoi sans rechargement) : l’alerte est statique et n’est pas annoncée ; il faut alors une région `role="status"` ou `role="alert"` gérée par le script de la page.

### Choisir le type {#choisir}

| Type | Pour | Exemple |
| --- | --- | --- |
| `info` | Une information utile, sans urgence. | Heures modifiées, nouveau service. |
| `succes` | Une confirmation, un résultat positif. | Réservation confirmée. |
| `avertissement` | Une mise en garde : quelque chose à savoir avant d’agir. | Salle fermée, délai prolongé. |
| `erreur` | Un problème, un service interrompu. | Service en panne, formulaire indisponible. |

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Type dit en texte** : l’icône et la couleur portent le type ; un libellé masqué (« Avertissement : ») le dit aussi aux lecteurs d’écran. L’icône est cachée (`aria-hidden`) (WCAG 1.1.1, 1.3.1, 1.4.1, testé).
-   **Pas de rôle « alert »** : le contenu est statique ; avec ce rôle, il serait annoncé au chargement comme une urgence, et interromprait la lecture (testé).
-   **Titre hors hiérarchie** : le titre de l’encadré est un paragraphe, pas un `h2`–`h6` ; il ne fausse pas la structure des titres de la page (1.3.1).
-   **Clavier** : l’encadré n’est pas interactif et ne prend pas le focus ; les liens qu’il contient suivent l’ordre de la page.
-   **Contrastes** (couleurs par défaut) : texte `--gris-700` sur `--bleu-10`, 12,5:1 (1.4.3). Icônes sur leur bandeau : info 5,1:1, succès 9,5:1, avertissement 5,1:1, erreur 5,9:1, au-delà des 3:1 demandés (1.4.11).
-   **Contraste élevé** (couleurs forcées) : l’icône est redessinée en couleur système et un filet sépare le bandeau du texte (testé).
-   **Agrandissement et téléphone** : l’encadré épouse son texte et ne dépasse jamais la colonne ; un mot très long passe à la ligne, sans défilement horizontal à 320 px (1.4.4, 1.4.10, testé). Les tailles sont en `rem` : elles suivent la taille de police choisie.
-   **Mouvement** : aucune animation.
-   **Impression** : un encadré n’est pas coupé entre deux pages.

### Ce que l’intégrateur doit faire

-   En HTML, garder le libellé masqué et l’accorder au type ; avec le composant Astro, c’est automatique.
-   Garder l’`aria-hidden="true"` de l’icône.
-   Écrire un texte qui se comprend sans la couleur ni l’icône (« La salle 1 est fermée », pas « Attention! »).
-   Ne pas ajouter `role="alert"` à un encadré présent au chargement.
-   Avec un habillage propre, vérifier les contrastes : 4,5:1 pour le texte, 3:1 pour l’icône.
-   La page doit déclarer sa langue (`lang`) : le libellé masqué est en français.

## Bon à savoir {#savoir}

-   L’encadré ne s’étire pas sur toute la largeur : il prend la largeur de son texte.
-   Icônes Phosphor (licence MIT), intégrées à la feuille de style : aucune dépendance.
