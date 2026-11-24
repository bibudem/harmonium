---
titre: "Pied de page"
description: "Le pied de page des sites des bibliothèques : le titre, deux colonnes de liens (« Besoin d’aide? », « Sites connexes »), le sceau, puis une barre du bas avec la licence et les liens légaux. Sous 900 px, tout s’empile et les colonnes se replient."
fichiers: "`harmonium/astro/PiedDePage.astro` · `bib-pied-de-page.min.css` · `bib-pied-de-page.min.js` (facultatif)"
ressources: "composants/pied-de-page"
vignette: place
---

## Aperçu {#apercu}

::exemple[composants/pied-de-page/01.html]

> Le mode Bureau rend le pied de page dans une fenêtre de 1440 px, puis adapte son aperçu à l’espace disponible. « Ouvrir à taille réelle » permet de le consulter sans réduction. Le mode Téléphone montre sa disposition mobile et les volets repliables.

## Étape 1 : ajouter le HTML {#html}

```
<footer class="bib-pied-de-page theme-clair">
  <div class="bib-pied-de-page__local"><div class="bib-pied-de-page__interieur">
    <div class="bib-pied-de-page__signature">
      <a class="bib-pied-de-page__signature-sceau" href="/"><img src="logo-horizontal-blanc.svg" alt="Les bibliothèques, Université de Montréal – Accueil" width="1080" height="350"></a>
      <h2 class="bib-pied-de-page__titre">Les bibliothèques de l’Université de Montréal</h2>
    </div>
    <div class="bib-pied-de-page__colonnes">
      <div class="bib-pied-de-page__colonne" data-pliable-pied>
        <h3 class="bib-pied-de-page__sous-titre">Sites connexes</h3>
        <ul class="bib-pied-de-page__liste bib-pied-de-page__liste--sites" id="pied-liste-1">
          <li><a href="https://…"><span class="bib-pied-de-page__point" style="--point: var(--jaune)" aria-hidden="true"></span><span>Studio•bib<span class="bib-pied-de-page__fonction">Informatique et création numérique</span></span></a></li>
        </ul>
      </div>
      <div class="bib-pied-de-page__colonne bib-pied-de-page__colonne--logo"><a href="/"><!-- sceau --></a></div>
    </div>
  </div></div>
  <div class="bib-pied-de-page__queue"><div class="bib-pied-de-page__interieur bib-pied-de-page__rangee-queue">
    <div class="bib-pied-de-page__groupe-queue"><!-- licence --></div>
    <div class="bib-pied-de-page__groupe-queue bib-pied-de-page__liens-queue">
      <a href="/accessibilite/">Accessibilité</a>
      <button type="button" class="bib-pied-de-page__parametres-temoins" data-parametres-temoins>Paramètres des témoins</button>
    </div>
  </div></div>
</footer>
```

Habillage : le fond est le bleu foncé du thème et la barre du bas le bleu principal ; la classe `theme-clair` garde ces couleurs sur les différentes bandes. La première colonne porte, sous ses liens, l’urgence (`bib-pied-de-page__urgence`, avec une icône de sirène dans `bib-pied-de-page__sirene`) puis les réseaux (`<ul class="bib-pied-de-page__reseaux">`) ; un lien à pictogramme porte un `<svg>` de 18 px, un lien de « Sites connexes » une pastille (`--point`).

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-pied-de-page.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Facultatif : le script ajoute le comportement interactif. Sans lui, le contenu reste lisible et utilisable.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-pied-de-page.min.js"></script>
```

## Avec Astro {#astro}

```
---
import PiedDePage from 'harmonium/astro/PiedDePage.astro'
---
<PiedDePage
  colonnes={[
    { titre: "Besoin d'aide?", liens: [{ libelle: 'Nous joindre', href: '/nous-joindre/', Icone: PaperPlaneTiltIcon }] },
    { titre: 'Sites connexes', liens: [{ libelle: 'Studio•bib', fonction: 'Création numérique', href: 'https://…', point: 'var(--jaune)' }] },
  ]}
  urgence={{ href: 'https://urgence.umontreal.ca/', libelle: 'Urgence', Icone: SirenIcon }}
  reseaux={[{ libelle: 'YouTube', href: 'https://…', Icone: YoutubeLogoIcon }]}
  liensQueue={[{ libelle: 'Accessibilité', href: '/accessibilite/' }]}
  logo={{ src: '/img/logo-bibliotheques-horizontal-blanc.svg' }}
/>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| colonnes | Les colonnes de liens : `{ titre, liens: [{ libelle, href, rel?, Icone?, point?, fonction? }] }`. Les colonnes après la première sont repliables sous 900 px. |  |
| urgence | Lien d’urgence sous la première colonne : `{ href, libelle, Icone? }`. |  |
| reseaux | Liens à icône (YouTube, Instagram), nommés par `libelle` : `{ libelle, href, Icone }`. |  |
| liensQueue | Liens légaux de la barre du bas. |  |
| accueil | Adresse du sceau et du logo. | `/` |
| logo | Logo horizontal blanc, affiché sur téléphone : `{ src, alt?, width?, height? }`. |  |
| titre | Titre du pied. | « Les bibliothèques de l’Université de Montréal » |
| licence | Réglages de [Mention de licence](@@/composants/licence.html) : `{ href?, texte? }`. |  |
| parametresTemoins | Texte du bouton des témoins ; `null` le retire. | « Paramètres des témoins » |

**Volets repliables.** Sous 900 px, le pied reste court : « Besoin d’aide? » reste ouvert, les autres colonnes (attribut `data-pliable-pied`) deviennent un volet replié (motif Disclosure de l’APG : le titre porte un bouton `aria-expanded`). Le bouton n’est ajouté que par le script `bib-pied-de-page.min.js` (facultatif), et seulement sous 900 px : sans lui, ou sur grand écran, les listes sont visibles.

Le bouton « Paramètres des témoins » (`data-parametres-temoins`) émet l’événement `bib:parametres-temoins` sur `window`, que [`<bib-consentement>`](@@/composants/consentement.html) écoute pour rouvrir ses réglages.

Le [sceau](@@/composants/sceau.html) et la [mention de licence](@@/composants/licence.html) sont des composants à part entière.

## Personnaliser {#variables}

{{habillage-pied-de-page}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Toutes les pages des sites des bibliothèques, une fois, après le contenu.

### À éviter

-   **Pour des liens de navigation principaux** : ils vont dans l’[en-tête](@@/composants/entete.html) ; le pied ne répète pas le menu.
-   **Pour des avis ou des messages temporaires** : un [avis](@@/composants/avis.html) en haut de page.
-   **Pour la demande de consentement** : c’est [`<bib-consentement>`](@@/composants/consentement.html) ; le pied n’en porte que le bouton de réglage.
-   **Sur les pages utilitaires sans coquille** (fenêtre intégrée, page de service minimale).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Repère** : `<footer>` placé hors de `<main>`, donc repère « informations sur le contenu » (`contentinfo`) (WCAG 1.3.1).
-   **Titres** : un `h2` pour le pied, des `h3` pour les colonnes (un `h4` sautait des niveaux). Sur téléphone, le titre est masqué visuellement mais reste lu : le logo porte déjà le nom (1.3.1, 2.4.6).
-   **Volet « Sites connexes »** : motif Disclosure de l’APG. Le `h3` contient un `<button aria-expanded aria-controls>`, annoncé « Sites connexes, bouton, réduit ». Le bouton n’est ajouté par le script que sur petit écran ; sans JavaScript ou sur grand écran, la liste est visible et le titre reste un titre (4.1.2).
-   **Icônes nommées** : YouTube et Instagram, des icônes seules, ont un `aria-label` ; elles n’avaient aucun nom dans l’ancien pied (1.1.1, 2.4.4). Les autres icônes et les pastilles de couleur sont décoratives (`aria-hidden`) : le nom du service porte le sens (1.4.1).
-   **Sceau et logo** : un seul est visible à une largeur donnée ; l’autre est en `display: none`, donc absent de l’arbre d’accessibilité. Chacun est nommé « Les bibliothèques, Université de Montréal – Accueil ».
-   **Cibles** : liens de 36 px de haut, icônes sociales de 40 px, liens légaux de 24 px ; sur petit écran, la zone de « Paramètres des témoins » déborde à 44 px sans changer son aspect (2.5.8).
-   **Focus** : anneau blanc sur les fonds bleus (le bleu global s’y perdait) (2.4.7). Ordre du focus identique à l’ordre visuel (2.4.3).
-   **Reflow** : à 320 px ou avec le texte à 200 %, le titre passe sous le logo, les liens se coupent ; aucun défilement horizontal (le logo pouvait déborder de 4 px) (1.4.4, 1.4.10).
-   **Licence** : le lien porte seulement sur le texte ; les logos CC, décoratifs, sont hors du lien. Il n’ouvre plus de nouvel onglet sans le dire.
-   **Mouvement** : ouverture du volet animée seulement après un clic, jamais au chargement ; coupée si la personne réduit les animations, comme la rotation du sceau (2.3.3).

### Ce que l’intégrateur doit faire

-   Garder des libellés de liens explicites ; une icône seule doit recevoir un `libelle`, qui devient son nom.
-   Ne pas ajouter de second `<footer>` hors de `<main>` : il créerait un second repère `contentinfo`.
-   Charger un composant qui écoute `bib:parametres-temoins` (le consentement d’Harmonium), sinon le bouton ne fait rien.
-   Vérifier le contraste d’une nouvelle pastille de couleur : le liseré clair la garde visible, mais le nom doit suffire.
