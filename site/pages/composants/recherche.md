---
titre: Recherche
description: "Un formulaire de recherche natif dans une capsule : une étiquette visible en surtitre, le champ et un bouton loupe. La destination et les résultats appartiennent au site."
fichiers: "`harmonium/astro/Recherche.astro` · `bib-recherche.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/recherche/01.html]

 

::exemple[composants/recherche/02.html]

## Utilisation {#utilisation}

### En HTML

```
<form class="bib-recherche" action="/recherche/" method="get" role="search" aria-label="Rechercher dans le site">
  <label class="bib-recherche__etiquette" for="q">Rechercher dans le site</label>
  <div class="bib-recherche__champ">
    <input class="bib-recherche__saisie" type="search" id="q" name="q" placeholder="Services, guides, soutien informatique" autocomplete="off" enterkeyhint="search" required>
    <button type="submit" class="bib-recherche__bouton">
      <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">…loupe…</svg>
      <span class="bib-recherche__libelle-bouton">Rechercher</span>
    </button>
  </div>
</form>
```

Le bouton est une pastille ronde pleine qui ne montre que la loupe ; son libellé reste son nom accessible. `bib-recherche--bouton-texte` : bouton à contour avec son libellé visible dès 600 px, et la loupe passe dans le champ (en dessous, le bouton redevient une loupe seule ; ajouter alors `<svg class="bib-recherche__loupe">` avant le champ).

Un sélecteur de portée (par exemple « Nos sites » et « Catalogue ») peut précéder le champ dans la capsule, qui devient un bloc arrondi sur deux rangées. Des suggestions peuvent suivre la capsule : une liste `role="listbox"` placée dans le formulaire flotte sous elle.

Habillage : `--bib-recherche-etiquette` (couleur de l’étiquette ; `--couleur-accent`), `--bib-recherche-bouton` et `--bib-recherche-bouton-survol` (fond du bouton rond ; bleu principal).

### Avec Astro

```
---
import Recherche from 'harmonium/astro/Recherche.astro'
---
<Recherche action="/recherche/" libelle="Rechercher dans le site"
  placeholder="Services, guides, soutien informatique" valeur={requete}
  aide="Saisir un titre, un sujet ou un nom." />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| action | Adresse du service de recherche. Requise. |  |
| libelle | Étiquette visible du champ. | `Rechercher` |
| nom | Nom du repère « recherche » : deux recherches dans une page doivent se distinguer. | `libelle` |
| parametre | Nom du paramètre envoyé. | `q` |
| valeur | Recherche déjà saisie (page de résultats). |  |
| placeholder | Exemples de recherches, dans le champ vide. |  |
| aide | Consigne reliée au champ. |  |
| caches | Champs cachés `[nom, valeur][]` envoyés avec la requête. | `[]` |
| libelleBouton | Nom du bouton. | `Rechercher` |
| boutonTexte | Bouton à contour avec son libellé visible dès 600 px. | non |
| id | id du champ. | généré |
| slot `portee` | Sélecteur de l’endroit où chercher, dans la capsule avant le champ. |  |
| slot | Après la capsule : suggestions, liens qui suivent la recherche. |  |

Les attributs `data-*` passent au `<form>` : un script du site peut ainsi le repérer pour ajouter des suggestions.

## Accessibilité {#accessibilite}

- L’étiquette reste visible ; le texte d’exemple du champ ne la remplace pas.
- Entrée et le bouton envoient le même formulaire GET, sans JavaScript.
- Le focus est dessiné autour de la capsule entière.
- Texte du champ à 16 px au moins : la page ne s’agrandit pas à la saisie sur iOS.
- Les suggestions, si elles sont ajoutées, suivent le motif « combobox avec liste » de l’APG : flèches, Entrée, Échap qui ferme la liste seule.
