---
titre: "Étiquettes"
description: "De petites étiquettes arrondies, en texte ou en lien : le statut d’un événement (complet, liste d’attente), les caractéristiques d’une ressource, un lieu, un compte."
fichiers: "`harmonium/astro/Pastilles.astro` · `bib-pastilles.min.css`"
statut: beta
---

## Aperçu {#apercu}

::exemple[composants/etiquettes/01.html]

## Utilisation {#utilisation}

### En HTML

```
<ul class="bib-pastilles" aria-label="Places">
  <li class="bib-pastille bib-pastille--succes">Places disponibles</li>
  <li class="bib-pastille bib-pastille--erreur">Complet</li>
</ul>

<ul class="bib-pastilles" aria-label="Caractéristiques">
  <li class="bib-pastille bib-pastille--jaune"><svg width="16" height="16" aria-hidden="true" focusable="false">…</svg>Logiciel libre</li>
  <li><a class="bib-pastille bib-pastille--rose" href="/connexion-distance/">…Accès à distance<span class="bib-masque"> : Zotero</span></a></li>
</ul>
```

Variantes :

| Variante | Usage |
| --- | --- |
| `--succes` | Disponible, confirmé, ouvert. |
| `--avertissement` | Presque complet, liste d’attente, bientôt fermé. |
| `--erreur` | Complet, annulé, fermé. |
| `--info` | En ligne, nouveau, information neutre. |
| `--jaune`, `--rose`, `--bleu` | Caractéristiques d’une ressource, sans sens de statut. |
| `--lieu` | Une bibliothèque ou un local, avec l’icône d’épingle. |
| `--neutre` | Un compte (« 6 postes »), plus petit. |

Habillage : `--bib-pastille-fond`, `--bib-pastille-bordure`, `--bib-pastille-texte`, `--bib-pastille-point`.

### Avec Astro

```
---
import Pastilles from 'harmonium/astro/Pastilles.astro'
---
<Pastilles nom="Places" pastilles={[
  { libelle: 'Places disponibles', variante: 'succes' },
  { libelle: 'Accès à distance', variante: 'rose', icone: 'distance', lien: '/connexion-distance/', masque: ' : Zotero' },
]} />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| nom | Nom de la liste : ce qu’elle énumère. Obligatoire. |  |
| pastilles | Liste de `{ libelle, lien?, variante?, icone?, masque? }`. `icone` : `libre`, `distance`, `lien`, `lieu`. `masque` : texte ajouté pour les lecteurs d’écran. |  |
| class | Classes ajoutées à la racine. |  |

### Variables d’habillage {#variables}

{{habillage-pastilles}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Signaler un statut à côté d’un titre (événement, formation, salle).
-   Résumer les caractéristiques d’une ressource en quelques mots.

### À éviter

-   **Pour une action** : un [bouton](@@/composants/bouton.html). Une étiquette en lien mène à une page, elle ne fait rien.
-   **Pour un message important** : une [alerte](@@/composants/alertes.html).
-   **Plus de quatre ou cinq par élément** : elles ne se lisent plus.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Le statut se lit en mots** ; la couleur et le point ne font que le souligner (WCAG 1.4.1). Texte foncé à 11:1 ou plus sur tous les fonds.
-   **Liste nommée** (`aria-label`) : on entend ce qu’elle énumère et combien d’éléments elle compte.
-   **Liens distincts** : des liens au même libellé reçoivent en texte masqué ce qui les distingue (2.4.4).
-   **Une étiquette en texte n’a ni curseur ni soulignement** : elle ne promet pas d’action.

### Ce que l’intégrateur doit faire

-   Écrire des libellés de un à trois mots.
-   Utiliser les variantes de statut seulement pour un statut, toujours avec le même sens sur tout le site.
