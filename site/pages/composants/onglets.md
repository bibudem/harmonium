---
titre: "Onglets"
description: "Des panneaux qui partagent la même place, choisis par une rangée d’onglets au-dessus du contenu. Sans JavaScript, tous les panneaux restent lisibles, chacun sous son titre."
fichiers: "`harmonium/astro/Onglets.astro` · `bib-onglets.min.css` · `bib-onglets.min.js` (facultatif)"
ressources: "composants/onglets"
---

## Aperçu {#apercu}

::exemple[composants/onglets/01.html]

 

::exemple[composants/onglets/02.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-onglets" data-onglets>
  <div class="bib-onglets__liste" data-onglets-liste data-aria-label="Services">
    <span class="bib-onglets__indicateur" aria-hidden="true" data-indicateur></span>
    <button type="button" class="bib-onglets__onglet" data-onglet id="o-1" aria-controls="p-1" data-selectionne="true">Prêt</button>
    <button type="button" class="bib-onglets__onglet" data-onglet id="o-2" aria-controls="p-2" data-selectionne="false">Retour</button>
  </div>
  <div class="bib-onglets__panneaux">
    <div class="bib-onglets__panneau" id="p-1" data-selectionne="true"><h3 class="bib-onglets__titre-panneau" data-titre-panneau>Prêt</h3>…</div>
    <div class="bib-onglets__panneau" id="p-2" data-selectionne="false"><h3 class="bib-onglets__titre-panneau" data-titre-panneau>Retour</h3>…</div>
  </div>
</div>
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-onglets.min.js"></script>
```

Habillage : `--bib-onglets-texte` (libellé des onglets) et `--bib-onglets-accent` (onglet choisi) ; sur un fond foncé ou coloré, les redéfinir pour garder 4,5:1 (le bleu principal ne passe pas sur un fond moyen). Sous 900 px, les panneaux défilent à l’horizontale, aimantés, et une pastille (`bib-onglets__indicateur`) suit le doigt. `bib-onglets--compact` : la rangée alignée à gauche et moins haute, pour un jeu d’onglets dans le texte d’une page. Onglet choisi : `--bib-onglets-selection-fond` et `--bib-onglets-selection-texte` (par défaut les jetons `--selection-fond` et `--selection-texte` du site, sinon bleu foncé et blanc) ; survol : `--bib-onglets-survol`.

### Avec Astro

```
---
import Onglets from 'harmonium/astro/Onglets.astro'
---
<Onglets onglets={['Prêt', 'Retour']} niveauTitre={3}>
  <div><p>Trois semaines pour un livre.</p></div>
  <div><p>Au comptoir ou dans la chute à livres.</p></div>
</Onglets>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| onglets | Libellés des onglets, dans l’ordre des panneaux. |  |
| ongletOuvert | Onglet ouvert au départ, compté à partir de 1. | `1` |
| compact | Rangée alignée à gauche et moins haute, pour le texte d’une page. | non |
| niveauTitre | Niveau du titre de chaque panneau dans le rendu sans JavaScript (2 à 6). | `3` |
| ariaLabel | Nom de la liste d’onglets. |  |
| groupe | Nom d’un groupe de jeux synchronisés : tous les jeux de la page qui portent le même nom changent ensemble. |  |
| valeurs | Valeur de chaque onglet dans le groupe (sinon son libellé). |  |
| url | Le choix du groupe s’écrit aussi dans l’adresse (`?groupe=valeur`), qui l’emporte au chargement. | non |

**Chaque enfant de premier niveau du slot est un panneau** ; un libellé sans panneau est ignoré. Un jeu imbriqué dans un panneau descend ses titres d’un cran, pour garder la hiérarchie des titres.

**Jeux synchronisés.** Le choix de la personne est gardé dans `localStorage` (clé `bib.onglets.<groupe>`) ; le script émet l’événement `bib:onglets-groupe` (`detail : { groupe, valeur }`) sur `window` à chaque changement, pour qu’un autre composant le suive. Une ancre qui vise un onglet ou un élément d’un panneau l’affiche.

### Variables d’habillage {#variables}

{{habillage-onglets}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Des variantes d’un même contenu, qui s’excluent : un système d’exploitation, un logiciel (Zotero ou EndNote), un campus.
-   Des panneaux de longueur comparable, qu’on lit l’un *ou* l’autre, jamais l’un après l’autre.

### À éviter

-   **Pour des sujets différents** qu’on peut vouloir lire tous (questions fréquentes) : un [accordéon](@@/composants/accordeons.html), ou de simples titres.
-   **Pour des étapes successives** : une liste numérotée ; un onglet cache la suite.
-   **Pour plus de cinq ou six variantes**, ou des libellés longs : la rangée passe sur plusieurs lignes ; préférer des titres et un lien vers chaque section.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Rôles ARIA posés par le script** : `tablist`, `tab` avec `aria-selected`, `tabpanel` relié à son onglet par `aria-labelledby` (WCAG 1.3.1, 4.1.2). Les lecteurs d’écran annoncent « onglet, 2 sur 3, sélectionné ».
-   **Clavier selon l’APG** : tabindex itinérant (un seul onglet dans l’ordre de tabulation), Gauche et Droite, Début et Fin ; Haut et Bas gardent le défilement de la page (2.1.1).
-   **Panneau focalisable seulement s’il n’a rien à focaliser**, comme le recommande l’APG : Tab mène de l’onglet au contenu sans arrêt superflu.
-   **Sans JavaScript** : la liste d’onglets est masquée (elle ne ferait rien) et tous les panneaux se suivent, chacun sous un vrai titre.
-   **Lien direct** : une ancre qui vise un panneau, ou un élément d’un panneau, affiche cet onglet.
-   **Contrastes** : onglet choisi blanc sur bleu foncé et capsule bleu foncé sur blanc, 18:1 (1.4.3). Hauteur des onglets de la directive : 36 px, au-dessus des 24 px demandés (2.5.8).
-   **Couleurs forcées** : l’onglet actif garde un repère (bordure épaissie et soulignement, ou contour `Highlight`).
-   **Texte agrandi à 200 % et 320 px** : les onglets passent à la ligne au lieu de couper un mot ; la marge des panneaux est plafonnée pour ne pas faire défiler la page de côté (1.4.4, 1.4.10).
-   **Mouvement réduit** : sur téléphone, le passage d’un panneau à l’autre se fait d’un saut, sans glissement.

### Ce que l’intégrateur doit faire

-   Écrire des libellés courts et distincts (« Windows », « macOS »), qui disent ce qui change d’un panneau à l’autre.
-   Donner un `ariaLabel` à la liste quand le titre qui précède ne suffit pas à la nommer.
-   Régler `niveauTitre` en Astro pour que les titres du rendu sans JavaScript suivent la hiérarchie de la page.
-   Sur un fond foncé ou coloré, redéfinir `--bib-onglets-texte` et `--bib-onglets-accent` pour garder 4,5:1.
