---
titre: "Licence"
description: "La mention de licence CC BY 4.0 du pied de page, avec les deux logos Creative Commons. Le lien ne porte que sur le texte ; les logos sont décoratifs."
fichiers: "`harmonium/astro/Licence.astro` · `bib-licence.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/licence/01.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-licence" prefix="cc: http://creativecommons.org/ns# dct: http://purl.org/dc/terms/">
  <span class="bib-licence__cc" aria-hidden="true"></span>
  <span class="bib-licence__cc bib-licence__cc--by" aria-hidden="true"></span>
  <a href="/conditions-utilisation/" rel="license">Sauf indications contraires, ce site est sous licence CC BY 4.0</a>
</div>
```

### Avec Astro

```
---
import Licence from 'harmonium/astro/Licence.astro'
---
<Licence />
<Licence href="/licence/" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| href | Page des conditions d’utilisation (le lien n’ouvre pas de nouvel onglet : c’est une page du site). | `/conditions-utilisation/` |
| texte | Libellé du lien. | « Sauf indications contraires, ce site est sous licence CC BY 4.0 » |

Le préfixe RDFa passe par `prefix` : les attributs `xmlns:cc` et `xmlns:dct` ne sont pas valides en HTML. Sur téléphone, les logos se placent dans le fil du texte, à la hauteur des lettres, et le lien devient un texte en ligne.

### Variables d’habillage {#variables}

{{habillage-licence}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Dans le pied de page, pour dire sous quelle licence le contenu du site est publié.

### À éviter

-   **Pour une mention de droits d’auteur** ou d’un contenu tiers : un texte ordinaire, avec sa source.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   Le lien fait au moins 24 px de haut (17 px de texte, plus 2 × 4 px de marge, WCAG 2.5.8) ; le focus reste visible sur le fond bleu. Les logos Creative Commons sont décoratifs (`aria-hidden`) : le texte du lien dit la licence.

### Ce que l’intégrateur doit faire

-   Garder un libellé qui nomme la licence (« CC BY 4.0 ») : un lien « En savoir plus » ne dit rien hors contexte.
