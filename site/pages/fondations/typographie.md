---
titre: "Typographie"
description: "Deux polices : Figtree pour le texte et la plupart des titres, Lora pour les titres de niveau 4 et quelques mises en valeur. Une échelle de huit tailles, et des titres qui grandissent sur grand écran."
fichiers: "`harmonium/astro/Typographie.astro` · `bib-typographie.min.css`"
---

## Polices {#polices}

::exemple[fondations/typographie/01.html]

Les deux sont des polices variables (graisses de 400 à 700, italique), sous licence SIL Open Font License. Dans les sites Astro : paquets `@fontsource-variable/figtree` et `@fontsource-variable/lora`.

## Texte courant {#texte-courant}

{{reglages-texte}}

## Échelle des tailles {#echelle}

Les huit paliers des composants. En rem : ils suivent la taille de texte choisie par la personne.

{{echelle-texte}}

## Titres {#titres}

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
<h2 class="bib-typographie bib-typographie--h2">Titre</h2>
<h1 class="bib-typographie bib-typographie--h2">Un h1 qui a l’apparence d’un h2</h1>
<p class="bib-typographie bib-typographie--body1">Texte courant.</p>
<p class="bib-typographie bib-typographie--body2 bib-typographie--marge-bas">Texte réduit, avec une marge basse.</p>
```

Habillage : les tailles se resserrent aux seuils de 600, 900 et 1200 px ; elles viennent des jetons de typographie (voir l’[échelle des tailles](#echelle) ci-dessus).

### Avec Astro

```
---
import Typographie from 'harmonium/astro/Typographie.astro'
---
<Typographie variant="h2" component="h1" gutterBottom>Titre</Typographie>
<Typographie variant="body2" color="text.secondary">Texte réduit</Typographie>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| variant | Apparence : `display1` à `display5`, `titreSuperHero`, `titreSuperHeroSmall`, `h1` à `h6`, `h4Figtree`, `subtitle1`, `subtitle2`, `body1`, `body2`, `button`, `caption`, `overline`, `legal`, `inherit`, `carteProfilLink`, `textWhite`. | `body1` |
| component | Balise rendue. Sans elle : h1 à h6 pour les titres, `p` pour body et subtitle, `span` pour le reste. | selon variant |
| gutterBottom, paragraph, noWrap | Marge basse ; paragraphe ; une seule ligne tronquée. | non |
| color | `text.primary`, `text.secondary`, `primary` ou un nom de la palette. |  |
| align | `left`, `center`, `right`, `justify`. |  |

subtitle1 et subtitle2 donnent un `<p>`, pas un faux titre ; `variant="p"` donne un `<p>` en body1.

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

-   **Structure indépendante de l’allure** : la balise vient de `component` ; un texte peut ressembler à un titre sans entrer dans la hiérarchie, et inversement (WCAG 1.3.1).
-   **Pas de faux titre** : `subtitle1` rend un paragraphe, plus un `<h6>`.
-   **Tailles en `rem`** : le texte suit la taille choisie dans le navigateur et s’agrandit à 200 % (1.4.4). Les titres coupent leurs lignes proprement (`text-wrap: pretty`).
-   **Chiffres alignés** : chiffres tabulaires, sauf en Lora (`h4`) où ils élargissaient aussi l’espace entre les mots.

### Ce que l’auteur doit faire

-   Choisir la balise d’après la place du texte dans la page, pas d’après sa taille : un seul `h1`, des niveaux sans saut (1.3.1, 2.4.6).
-   Éviter `noWrap` sur un texte utile : la fin coupée par « … » est perdue à l’écran, surtout sur téléphone et quand le texte est agrandi (1.4.10).
-   Avec `color`, vérifier le contraste de la couleur choisie sur son fond (1.4.3).

## Procédures et valeurs à saisir {#composant-procedures}

Le guide de rédaction des bibliothèques distingue le texte d’une étape, la commande à activer et la valeur à saisir. La feuille de typographie fournit deux classes légères : `bib-procedure` sur une liste numérotée et `bib-saisie` sur une valeur à reproduire.

```
<ol class="bib-procedure">
  <li>Ouvrir le menu <strong>Fichier</strong>.</li>
  <li>Saisir <code class="bib-saisie">rapport-<var>nom</var>.pdf</code>.</li>
</ol>
```

Les commandes sont en gras, les variables en italique et les valeurs à saisir en Courier (`--police-saisie`). Les formats sont en majuscules (PDF, DOCX) ; les extensions restent en minuscules (`.pdf`, `.docx`). Choisir l’infinitif ou le « vous » et terminer chaque étape par un point. Voir [Rédaction et messages](@@/fondations/redaction.html) pour l’exemple complet.
