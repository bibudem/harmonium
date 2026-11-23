---
titre: "Typographie"
description: "Deux polices : Figtree pour le texte et la plupart des titres, Lora pour le titre éditorial (variante `titre-editorial`) et les citations. Deux échelles régulières : le texte au rapport 1,125, les titres au rapport 1,2 sur mobile et 1,25 sur grand écran."
fichiers: "`harmonium/astro/Typographie.astro` · `bib-typographie.min.css`"
---

## Polices {#polices}

::exemple[fondations/typographie/01.html]

Les deux sont des polices variables (graisses de 400 à 700, italique), sous licence SIL Open Font License. Dans les sites Astro : paquets `@fontsource-variable/figtree` et `@fontsource-variable/lora`.

## Texte courant {#texte-courant}

| Réglage | Valeur | Pourquoi |
| --- | --- | --- |
| Taille de la racine | `106.25%` (17 px), `112.5%` (18 px) dès 900 px | En pourcentage : le réglage « taille du texte » du navigateur s’applique (WCAG 1.4.4). Toutes les tailles en rem en dépendent. |
| Graisse | `var(--graisse-moyenne)` (500) | |
| Interligne | `1.5` | WCAG 1.4.12. |
| Longueur de ligne | `--mesure-texte` : `52ch` | Environ 73 caractères en Figtree (75 au plus). |
| Chiffres | `lining-nums tabular-nums` | Chiffres alignés dans les tableaux et les horaires. |
| Ligatures | `liga` et `clig` désactivées | |

## Échelle des tailles {#echelle}

Six paliers au rapport 1,125 autour du texte courant (chaque palier vaut le précédent × 1,125). En rem : ils suivent la taille de texte choisie par la personne.

{{echelle-texte}}

## Titres {#titres}

Du h6 (1 rem) au h1, chaque niveau vaut le précédent × 1,2 sur mobile, × 1,25 dès 900 px : l’écart entre deux niveaux est partout le même. Les deux tailles d’affiche (bannières, accroches) prolongent l’échelle, un cran plus bas sur mobile.

{{tableau-titres}}

::exemple[fondations/typographie/02.html]

Les titres prennent toute la largeur de leur colonne (`text-wrap: pretty`) et coupent un mot trop long plutôt que de faire défiler la page de côté (texte à 200 %).

## Graisses {#graisses}

{{tableau-graisses}}

## Composant et variantes {#composant}

Le texte typographié des sites : une variante donne l’apparence, la balise reste au choix. Un `<h1>` peut avoir l’apparence d’un titre plus petit sans fausser la hiérarchie de la page.

## Aperçu {#composant-apercu}

::exemple[fondations/typographie/03.html]

 

::exemple[fondations/typographie/04.html]

 

::exemple[fondations/typographie/05.html]

 

::exemple[fondations/typographie/06.html]

## Utilisation {#composant-utilisation}

### En HTML

```
<h2 class="bib-typographie bib-typographie--titre-2">Titre</h2>
<h1 class="bib-typographie bib-typographie--titre-2">Un h1 qui a l’apparence d’un h2</h1>
<p class="bib-typographie bib-typographie--texte">Texte courant.</p>
<p class="bib-typographie bib-typographie--texte-petit bib-typographie--marge-bas">Texte réduit, avec une marge basse.</p>
```

Habillage : les tailles se resserrent aux seuils de 600, 900 et 1200 px ; elles viennent des jetons de typographie (voir l’[échelle des tailles](#echelle) ci-dessus).

### Avec Astro

```
---
import Typographie from 'harmonium/astro/Typographie.astro'
---
<Typographie variante="titre-2" balise="h1" margeBas>Titre</Typographie>
<Typographie variante="texte-petit" couleur="text.secondary">Texte réduit</Typographie>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| variante | Apparence : `titre-1` à `titre-6`, `titre-editorial`, `titre-banniere`, `titre-banniere-petit`, `affiche-1` à `affiche-5`, `sous-titre`, `sous-titre-petit`, `texte`, `texte-petit`, `bouton`, `legende`, `surtitre`, `mention-legale`, `herite`, `lien-profil`, `sur-fonce`. | `texte` |
| balise | Balise rendue. Sans elle : h1 à h6 pour les titres, `p` pour le texte et les sous-titres, `span` pour le reste. | selon la variante |
| margeBas, paragraphe, surUneLigne | Marge basse ; paragraphe ; une seule ligne tronquée. | non |
| couleur | `text.primary`, `text.secondary`, `primary` ou un nom de la palette. |  |
| alignement | `left`, `center`, `right`, `justify`. |  |

Les sous-titres donnent un `<p>`, pas un faux titre ; `variante="p"` donne un `<p>` en texte courant.

## Quand l’utiliser {#composant-quand}

### À utiliser pour

-   Le texte d’un composant qui doit suivre l’échelle typographique (bannière, carte, chiffre clé).
-   Un titre dont l’allure ne correspond pas à son niveau dans la page.

### À éviter

-   **Dans un texte courant** : les titres et les paragraphes ordinaires de la page reçoivent déjà le bon style par la feuille de base ; `bib-typographie` sert à donner l’apparence d’une variante à une autre balise.
-   **Pour grossir un texte qui n’est pas un titre** au point de le faire passer pour un titre : la mise en valeur doit rester cohérente avec la structure.
-   **Pour une valeur chiffrée mise en vedette** : les [chiffres](@@/composants/chiffres.html) ont leur composant.

## Accessibilité {#composant-accessibilite}

### Ce que fait le composant

-   **Structure indépendante de l’allure** : la balise vient de `balise` ; un texte peut ressembler à un titre sans entrer dans la hiérarchie, et inversement (WCAG 1.3.1).
-   **Pas de faux titre** : `sous-titre` rend un paragraphe, pas un `<h6>`.
-   **Tailles en `rem`** : le texte suit la taille choisie dans le navigateur et s’agrandit à 200 % (1.4.4). Les titres coupent leurs lignes proprement (`text-wrap: pretty`).
-   **Chiffres alignés** : chiffres tabulaires, sauf en Lora (`titre-editorial`) où ils élargissaient aussi l’espace entre les mots.

### Ce que l’intégrateur doit faire

-   Choisir la balise d’après la place du texte dans la page, pas d’après sa taille : un seul `h1`, des niveaux sans saut (1.3.1, 2.4.6).
-   Éviter `surUneLigne` sur un texte utile : la fin coupée par « … » est perdue à l’écran, surtout sur téléphone et quand le texte est agrandi (1.4.10).
-   Avec `couleur`, vérifier le contraste de la couleur choisie sur son fond (1.4.3).

## Procédures et valeurs à saisir {#composant-procedures}

Le guide de rédaction des bibliothèques distingue le texte d’une étape, la commande à activer et la valeur à saisir. La feuille de typographie fournit deux classes légères : `bib-saisie` sur une valeur à reproduire et `bib-procedure` sur une liste numérotée.

```
<p>Adresse du serveur : <code class="bib-saisie">vpn-cisco.umontreal.ca</code></p>
<p>Nommer le fichier <code class="bib-saisie">rapport-<var>nom</var>.pdf</code>.</p>
```

`bib-saisie` met la valeur en Courier (`--police-saisie`) et la laisse passer à la ligne au besoin ; une variable à adapter se place en `var`, en italique. Les formats sont en majuscules (PDF, DOCX) ; les extensions restent en minuscules (`.pdf`, `.docx`).

La liste `bib-procedure` (commandes en gras, variables en italique, valeurs en Courier) a sa propre fiche : [Liste d’étapes](@@/composants/liste-etapes.html). Voir aussi [Rédaction et messages](@@/fondations/redaction.html#procedures).
