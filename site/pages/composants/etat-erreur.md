---
titre: "État d’erreur"
description: "Le message affiché à la place d’un contenu chargé dans le navigateur (événements, formations, horaires) qui n’a pas pu s’afficher, avec un bouton « Réessayer »."
fichiers: "`harmonium/astro/EtatErreur.astro` · `bib-etat-erreur.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/etat-erreur/01.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-etat-erreur" data-etat="erreur" hidden>
  <p>Les formations ne sont pas disponibles pour le moment.</p>
  <button type="button" class="bib-etat-erreur__bouton" data-reessayer><svg width="18" height="18" aria-hidden="true">…</svg>Réessayer</button>
</div>
```

Le script du contenu (par exemple `bib-listes-dynamiques.min.js`) affiche l’état voulu et branche le bouton. Pendant le nouveau chargement, le focus passe au conteneur plutôt que de se perdre en haut de la page.

### Avec Astro

```
---
import EtatErreur from 'harmonium/astro/EtatErreur.astro'
---
<EtatErreur message="Les formations ne sont pas disponibles pour le moment." />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| message | Phrase complète. Obligatoire. |  |
| etat | Valeur de `data-etat`, lue par le script du contenu. | erreur |
| libelle | Texte du bouton. | Réessayer |
| class | Classes ajoutées à la racine. |  |

### Variables d’habillage {#variables}

{{habillage-etat-erreur}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Tout contenu chargé après la page (API, flux) : la personne doit savoir que le contenu manque et pouvoir réessayer.

### À éviter

-   **Pour une erreur de formulaire** : le message d’erreur du champ concerné.
-   **Pour une information de service** (fermeture, panne annoncée) : une [alerte](@@/composants/alertes.html) ou un [avis](@@/composants/avis.html).
-   **Pour une liste simplement vide** : dire qu’il n’y a rien (« Aucune formation n’est prévue ce mois-ci. »), sans bouton « Réessayer ».

## Rédaction {#redaction}

Toujours la même formule : « Les … ne sont pas disponibles pour le moment. » Ne pas parler d’erreur technique, de serveur ni de code d’état. Si un autre moyen existe (page complète, calendrier), ajouter un lien.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Message en texte** : l’erreur ne repose ni sur la couleur ni sur une icône seule (WCAG 1.4.1).
-   **Focus conservé** : au nouvel essai, le focus va au conteneur (`tabindex="-1"`, sans contour) au lieu de revenir en haut de la page (2.4.3).
-   **Bouton natif** : activable au clavier, nommé par son texte.

### Ce que l’intégrateur doit faire

-   Nommer le contenu qui manque (« Les formations… »), pas « Le contenu ».
-   Placer l’état à l’endroit exact où le contenu aurait paru.
