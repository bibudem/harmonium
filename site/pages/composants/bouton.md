---
titre: "Bouton"
description: "Une action ou un lien présenté comme un bouton : un `<a>` quand il mène quelque part, un `<button>` quand il déclenche quelque chose. Plein ou à contour ; la flèche dit si l’on reste chez les bibliothèques ou si l’on part ailleurs."
fichiers: "`harmonium/astro/Bouton.astro` · `bib-bouton.min.css`"
---

Un bouton secondaire conserve toujours un contour visible, au repos comme au survol. Pour une navigation discrète sans contour, utiliser un [lien](@@/composants/lien.html).

## Aperçu {#apercu}

::exemple[composants/bouton/01.html]

 

::exemple[composants/bouton/02.html]

 

::exemple[composants/bouton/03.html]

 

::exemple[composants/bouton/04.html]

 

::exemple[composants/bouton/05.html]

## Utilisation {#utilisation}

### En HTML

```
<a class="bib-bouton bib-bouton--plein bib-bouton--bleu-fonce" href="/services/">
  <span class="bib-bouton__libelle">Réserver une salle</span>
  <span class="bib-bouton__fin" aria-hidden="true"></span>
</a>

<!-- Autre site : flèche ↗, annonce du nouvel onglet en texte masqué -->
<a class="bib-bouton bib-bouton--contour bib-bouton--bleu-principal" href="https://exemple.ca/" target="_blank" rel="noopener">
  <span class="bib-bouton__libelle">Autre site</span>
  <span class="bib-masque"> (nouvel onglet)</span>
  <span class="bib-bouton__fin bib-bouton__fin--externe" aria-hidden="true"></span>
</a>

<button type="button" class="bib-bouton bib-bouton--contour bib-bouton--bleu-principal">
  <span class="bib-bouton__libelle">Annuler</span>
</button>
```

Habillage commun : bouton plein (`--bib-bouton-plein-fond`, `-texte`, `-fond-survol`), bouton secondaire à contour (`--bib-bouton-texte-fond`, `-couleur`, `-bordure`, `-fond-survol`) et plein sur fond foncé (`--bib-bouton-clair-fond`, `-texte`, `-fond-survol`). Les jetons `--action-*` permettent de choisir l’accent jaune sans changer le HTML.

### Avec Astro

```
---
import Bouton from 'harmonium/astro/Bouton.astro'
---
<Bouton href="/services/">Réserver une salle</Bouton>
<Bouton href="https://exemple.ca/" secondary>Autre site</Bouton>
<Bouton type="submit" variant="outlined">Envoyer</Bouton>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| href | Avec une adresse, un `<a>` ; sans, un `<button>`. |  |
| primary, secondary | Plein (par défaut) ou à contour. | primary |
| variant | `contained` (plein) ou `outlined` (contour). `text` reste un alias du contour. | selon primary |
| color | `bleuFonce` ou `bleuPrincipal` (`blue` et `primary` aussi). | `bleuFonce` |
| light | Variante pour fond foncé. | non |
| retour | Flèche vers la gauche avant le texte, au lieu de la flèche de fin. | non |
| disableEndIcon | Retire la flèche de fin. | non |
| target, rel, type | Comme sur l’élément HTML ; `rel` fourni n’est jamais écrasé. |  |

**La flèche et l’annonce suivent l’adresse.** → pour une page du même site (un chemin ou une adresse du site hôte) ; ↗ pour un autre site, y compris ses sous-domaines, ou un nouvel onglet ; aucune flèche pour un PDF, un courriel ou un téléphone. Un PDF s’ouvre dans un nouvel onglet. PDF et nouvel onglet sont annoncés en texte masqué, et `rel="noopener"` est ajouté.

Les classes `blueOutlineNoIcon`, `whiteOutlineNoIcon`, `mt1`, `mt4`, `right`, `center` et `left` que le Markdown des sites écrit sont reconnues dans le composant Astro ; en HTML : `bib-bouton--contour-bleu`, `--contour-blanc`, `--mt1`, `--mt4`, `--droite`, `--centre`, `--gauche`.

## Quand l’utiliser {#quand}

### À utiliser pour

-   L’action principale d’une page ou d’une section : « Réserver une salle », « Prendre rendez-vous ».
-   Une ou deux actions côte à côte, la plus importante en plein, l’autre en texte (`secondary`).
-   Le retour vers l’accueil d’une page d’erreur (`retour`).

### À éviter

-   **Dans une phrase** : un [lien](@@/composants/lien.html) souligné s’insère dans le texte, le bouton le casse.
-   **Pour une longue liste de destinations** : une série de boutons perd tout poids ; préférer une liste de liens ou des [cartes à icône](@@/composants/carte-icone.html).
-   **Plusieurs boutons pleins côte à côte** : plus rien ne ressort ; un seul bouton plein par groupe.
-   **Un `<button>` pour naviguer** (ou un lien pour envoyer un formulaire) : passer `href` quand on change de page, et seulement dans ce cas.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Bonne balise** : `<a>` avec `href`, `<button type="button">` sinon. Le lecteur d’écran annonce « lien » ou « bouton », et le clavier se comporte comme attendu (Entrée pour un lien, Entrée ou Espace pour un bouton) (WCAG 4.1.2, 2.1.1).
-   **Annonces en texte masqué** : « (PDF) », « (nouvel onglet) » ou les deux s’ajoutent au nom du lien, puisque l’ouverture d’un onglet ne doit pas surprendre (3.2.5).
-   **Icônes muettes** : les flèches sont `aria-hidden` ; seul le libellé est lu.
-   **Focus** : contour de 3 px fourni par le composant, avec un liseré qui le sépare du fond (2.4.7).
-   **Cible** : au moins 44 px de haut (50 px environ par défaut) (2.5.8).
-   **Contrastes** : blanc sur bleu foncé ; au survol, blanc sur bleu principal, 7,10:1 (1.4.3).
-   **Agrandissement** : le libellé passe à la ligne et le bouton ne dépasse jamais son conteneur à 320 px ou à 200 % (1.4.4, 1.4.10).
-   **Couleurs forcées** : une bordure `ButtonText` trace le bouton, dont le fond disparaît en mode contraste élevé.
-   **Survol au toucher** : l’avance de la flèche au survol est réservée aux pointeurs fins ; elle ne reste pas collée après un tapotement.

### Ce que l’auteur doit faire

-   Écrire un libellé qui dit l’action et se comprend hors contexte : « Réserver une salle », pas « Cliquez ici » ni « En savoir plus » (2.4.4).
-   Choisir la balise selon le rôle : `href` pour naviguer, rien (ou `type="submit"`) pour agir.
-   Poser `light` sur un fond foncé : sans lui, le bouton secondaire bleu y serait illisible.
-   L’état `disabled` bloque l’action native. Expliquer dans un texte voisin pourquoi elle est indisponible ; un lien désactivé perd son `href` et porte `aria-disabled="true"`.

## Tailles et états {#etats}

Trois tailles partagent une cible d’au moins 44 px. Garder `medium` dans le contenu ; `small` sert aux commandes denses et `large` à une action isolée.

::exemple[composants/bouton/06.html]

```
<Bouton size="small">Filtrer</Bouton>
<Bouton disabled aria-describedby="raison">Réserver</Bouton>
<p id="raison">Les inscriptions ouvrent lundi.</p>
```

`size` : `small`, `medium` (défaut), `large`. En HTML : `bib-bouton--petit` ou `bib-bouton--grand`. `disabled` : booléen, faux par défaut. Le style seul `aria-disabled` ne bloque pas un lien HTML : retirer aussi son `href`.

## Regrouper des actions {#groupes}

Réserver une seule action principale par groupe. Les commandes suivent l’ordre de lecture et passent à la ligne sur petit écran.

::exemple[composants/groupe-boutons/01.html]

```astro
import GroupeBoutons from 'harmonium/astro/GroupeBoutons.astro'

<GroupeBoutons><Bouton type="submit">Enregistrer</Bouton><Bouton secondary>Annuler</Bouton></GroupeBoutons>
```
