---
titre: "État vide"
description: "Ce qui s’affiche à la place d’une liste qui n’a rien à montrer : un titre qui dit ce qui se passe, une phrase qui dit quoi faire, et au besoin une action."
fichiers: "`harmonium/astro/EtatVide.astro` · `bib-etat-vide.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/etat-vide/01.html]

 

::exemple[composants/etat-vide/02.html]

## Étape 1 : ajouter le HTML {#html}

```
<div class="bib-etat-vide">
  <span class="bib-etat-vide__icone" aria-hidden="true"><svg viewBox="0 0 256 256" width="32" height="32" fill="currentColor" focusable="false">…</svg></span>
  <h3 class="bib-etat-vide__titre">Aucun logiciel ne correspond à « zotro »</h3>
  <p class="bib-etat-vide__texte">Vérifiez l’orthographe ou essayez un terme plus général.</p>
  <div class="bib-etat-vide__actions">…un ou deux boutons…</div>
</div>
```

`bib-etat-vide--compact` : sans icône ni fond, aligné à gauche, pour une colonne ou un encadré. Habillage : `--bib-etat-vide-fond`, `--bib-etat-vide-icone-fond`.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-etat-vide.min.css">
```

## Avec Astro {#astro}

```
---
import EtatVide from 'harmonium/astro/EtatVide.astro'
import Bouton from 'harmonium/astro/Bouton.astro'
---
<EtatVide titre="Aucun logiciel ne correspond à « zotro »" niveauTitre={3} icone="recherche">
  Vérifiez l’orthographe ou essayez un terme plus général.
  <Fragment slot="actions"><Bouton href="/logiciels/" variante="contour">Voir tous les logiciels</Bouton></Fragment>
</EtatVide>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titre | Ce qui se passe, en une phrase. Obligatoire. |  |
| niveauTitre | 2 à 6 : un vrai titre (l’état remplace une section) ; sans valeur : un paragraphe en gras. |  |
| icone | `recherche`, `calendrier` ou `boite`. | `boite` |
| compact | Sans icône ni fond. | non |
| slot par défaut, slot `actions` | Quoi faire ; boutons. |  |
| class | Classes ajoutées à la racine. |  |

## Personnaliser {#variables}

{{habillage-etat-vide}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Une recherche ou un filtre sans résultat, une liste d’événements vide, un dossier personnel encore vide.

### À éviter

-   **Quand le contenu n’a pas pu être chargé** : l’[état d’erreur](@@/composants/etat-erreur.html), avec « Réessayer ».
-   **Pour annoncer une fermeture ou une panne** : une [alerte](@@/composants/alertes.html) ou un [avis](@@/composants/avis.html).

## Rédaction {#redaction}

Le titre dit ce qui se passe, sans reproche (« Aucun événement n’est prévu cette semaine. », pas « Vous n’avez rien trouvé »). Le texte propose une suite : un autre terme, une autre période, une page plus générale. Rappeler la recherche entre guillemets aide à repérer une faute de frappe.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Le message est du texte**, pas une illustration ; l’icône est décorative (`aria-hidden`).
-   **Annonce** : quand un script remplace une liste par cet état, le placer dans la région annoncée par le script (compte ou `role="status"`) pour que le changement soit entendu (WCAG 4.1.3).
-   **Lisibilité** : lignes courtes (48 caractères au plus), titre équilibré sur deux lignes.

### Ce que l’intégrateur doit faire

-   Choisir un niveau de titre qui suit la hiérarchie de la page.
-   Proposer au plus deux actions.
