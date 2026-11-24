---
titre-court: "Barre de navigation"
titre: "En-tête et barre de navigation"
description: "La barre du haut de chaque page : les deux marques, la navigation principale, la recherche et le menu. Sous 1200 px, une barre compacte ouvre un rideau qui descend sous l’en-tête ; dès 1200 px, la navigation est dans la barre."
fichiers: "`harmonium/astro/Entete.astro` · `bib-entete.min.css` · `bib-entete.min.js`"
ressources: composants/entete
vignette: place
---

## Aperçu {#apercu}

::exemple[composants/entete/01.html]

> Le mode Bureau rend l’en-tête dans une fenêtre de 1440 px, puis adapte son aperçu à l’espace disponible. « Ouvrir à taille réelle » permet de le consulter sans réduction. Le mode Téléphone montre la barre compacte et le rideau du menu.

 

::exemple[composants/entete/03.html]

 

::exemple[composants/entete/02.html]

## Étape 1 : ajouter le HTML {#html}

La barre porte deux marques séparées d’un filet : l’institution, puis le nom du site (texte ou logo), qui ramène à l’accueil. Viennent ensuite la navigation principale, une action facultative (« Je donne ») et deux commandes :

- **Rechercher** (loupe) ouvre le rideau en mode recherche : la recherche seule, le focus dans le champ, puis « Afficher le menu », qui déplie le reste. La loupe devient un X tant que ce mode est ouvert.
- **Menu** (burger) ouvre le rideau entier : la recherche, « Explorer » (Accueil et les pages principales, en grand), les groupes propres au site, puis l’action. Le burger devient un X.

Sous 1200 px, la barre est compacte et collante ; le rideau couvre la fenêtre et se referme par la poignée du bas (tapotement, ou glissé vers le haut au doigt). Dès 1200 px, les pages principales et l’action sont dans la barre ; la loupe seule reste, et le rideau se réduit à la recherche.

```
<header class="bib-entete" data-entete>
  <div class="bib-entete__barre">
    <div class="bib-entete__marque">
      <a class="bib-entete__institution" href="https://www.umontreal.ca/"><img src="…/logo-universite-montreal.svg" alt="Université de Montréal" width="135" height="59"></a>
      <a class="bib-entete__site" href="/">Les bibliothèques<span class="bib-entete__masque">, accueil</span></a>
    </div>
    <nav class="bib-entete__navigation" aria-label="Navigation principale">
      <ul><li><a href="/espaces/" aria-current="page">Espaces</a></li>…</ul>
    </nav>
    <div class="bib-entete__outils" data-entete-outils hidden>
      <button type="button" class="bib-entete__bouton bib-entete__bouton--recherche" aria-label="Rechercher" aria-expanded="false" aria-controls="menu" data-entete-recherche>…</button>
      <button type="button" class="bib-entete__bouton bib-entete__bouton--menu" aria-label="Menu" aria-expanded="false" aria-controls="menu" data-entete-menu>…</button>
    </div>
  </div>
  <div class="bib-entete__voile" data-entete-voile hidden></div>
  <div class="bib-entete__rideau" id="menu" data-entete-rideau data-mode="complet" hidden>
    <div class="bib-entete__feuille">
      <div class="bib-entete__groupe bib-entete__groupe--recherche"><form class="bib-recherche" …>…</form></div>
      <div class="bib-entete__deplier"><button type="button" data-entete-deplier>Afficher le menu …</button></div>
      <nav class="bib-entete__groupe bib-entete__explorer" aria-labelledby="menu-explorer">
        <p class="bib-entete__surtitre" id="menu-explorer">Explorer</p>
        <ul class="bib-entete__pages"><li><a href="/"><span>Accueil</span> …</a></li>…</ul>
      </nav>
      <div class="bib-entete__pied"><button type="button" class="bib-entete__poignee" aria-label="Fermer le menu" data-entete-poignee><span aria-hidden="true"></span></button></div>
    </div>
  </div>
</header>
<script>document.currentScript?.previousElementSibling?.setAttribute('data-entete-pret', '')</script>
```

La ligne qui suit l’en-tête lui donne sa forme compacte dès l’analyse de la page : sans elle, la barre s’affiche d’abord avec sa navigation, puis se compacte, et le contenu saute. Le script `bib-entete.min.js` montre ensuite les commandes et branche le rideau. Sans lui, la navigation reste dans la barre.

Les icônes complètes (loupe et burger qui se changent en croix, flèches et chevron) sont dans l’aperçu : le code de chaque exemple est celui que produit le composant Astro.

## Étape 2 : ajouter le CSS {#css}

Ajouter la feuille du composant dans le `<head>`, après les jetons (`bib-jetons.min.css`). Un site qui charge déjà `bib-composants.min.css` n’a rien à ajouter : cette feuille les réunit toutes.

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-entete.min.css">
```

## Étape 3 : ajouter le JavaScript {#javascript}

Le script fait fonctionner le composant : le charger sur chaque page qui l’utilise.

```
<script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-entete.min.js"></script>
```

## Avec Astro {#astro}

```
---
import Entete from 'harmonium/astro/Entete.astro'
import Recherche from 'harmonium/astro/Recherche.astro'
import logoUdem from 'harmonium/dist/logo-universite-montreal.svg'
---
<Entete nom="Les bibliothèques" courante={Astro.url.pathname}
  institution={{ href: 'https://www.umontreal.ca/', libelle: 'Université de Montréal', logo: logoUdem.src }}
  liens={[{ libelle: 'Espaces', href: '/espaces/' }, { libelle: 'Études', href: '/etudes/' }]}
  action={{ libelle: 'Je donne', href: '/nous-soutenir/' }} menuBureau>
  <Recherche slot="recherche" action="/resultats/" libelle="Rechercher" placeholder="Services, guides, soutien informatique" />
  <Fragment slot="menu">…groupes propres au site…</Fragment>
</Entete>
<script>import 'harmonium/dist/bib-entete.min.js'</script>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| nom | Nom du site : texte de la marque, ou texte de remplacement de `logoSite`. Requis. |  |
| accueil | Lien d’accueil du site. | `/` |
| logoSite | Logo du nom du site, à la place du texte : adresse, ou `{ src, largeur, hauteur }`. |  |
| institution | Première marque, avant le filet : `{ href, libelle, logo }`. |  |
| liens | Pages principales `{ libelle, href }` : dans la barre dès 1200 px, sous « Explorer » dans le rideau. | `[]` |
| courante | Adresse de la page : `aria-current="page"` sur son lien, `"true"` sur la section qui la contient. |  |
| libelleAccueil | Libellé du lien d’accueil en tête d’« Explorer » ; `false` pour l’omettre. | `Accueil` |
| action | Action mise en avant `{ libelle, href }` : capsule dans la barre dès 1200 px, en fin de rideau dessous. |  |
| menuBureau | Garde le bouton Menu dès 1200 px (avec son libellé « Menu ») ; le rideau montre alors les groupes du slot `menu` sous la recherche. | non |
| bandeau | Bandeau de couleur au-dessus de la barre ; dès 1200 px, la barre devient une carte aux coins hauts arrondis. | non |
| superpose | Dès 1200 px, la barre se pose sur la bannière de la page (voile bleu foncé, texte et logos blancs), puis devient blanche et ombrée après 50 px de défilement. | non |
| soulignement | Liens de la barre soulignés au survol et pour la page courante, plutôt que sur une pastille. | non |
| id | id du rideau. | généré |
| slot `recherche` | Le haut du rideau, seul visible en mode recherche : un formulaire [Barre de recherche](@@/composants/recherche.html), et au besoin les liens qui suivent la recherche. Sans lui, pas de loupe. |  |
| slot `menu` | Groupes propres au site, sous « Explorer » (accès rapides, catalogue de services…). Titrer chaque groupe avec `bib-entete__surtitre` et nommer sa liste par `aria-labelledby`. |  |

Habillage : `--bib-entete-accent` (surtitres, « Afficher le menu », flèches ; `--couleur-accent` par défaut), `--bib-entete-survol` (fond des commandes au survol ; `--couleur-teinte`), `--bib-entete-bandeau` (jaune par défaut), `--bib-entete-courante` (pastille de la page courante dans « Explorer » ; rouge orangé). Le script tient `--hauteur-entete` à jour, pour la marge de défilement des ancres.

## Personnaliser {#variables}

{{habillage-entete}}

## Quand l’utiliser {#quand}

- Une fois par page, avant le contenu principal et après le [lien d’évitement](@@/composants/lien-evitement.html).
- Cinq ou six pages principales au plus, aux libellés courts : au-delà, la barre de bureau passe sur deux lignes.
- `superpose` seulement au-dessus d’une bannière photo ; sur une page sans bannière, garder la barre blanche.
- Les données du menu (pages, groupes, catalogue) restent dans le site ; le composant n’en donne que la forme.

## Accessibilité {#accessibilite}

- Les commandes suivent le motif « disclosure navigation » de l’APG : `aria-expanded`, `aria-controls`, et un nom qui suit l’état (« Menu » ou « Fermer le menu », « Rechercher » ou « Fermer la recherche »).
- Échap ferme le rideau et rend le focus à la commande qui l’a ouvert. Le rideau se ferme aussi quand le focus quitte l’en-tête (WCAG 2.4.11), au clic sur le voile et quand la barre change de forme.
- Ouvert, le reste de la page devient inerte : la tabulation ne passe pas sous le rideau.
- En mode recherche, le focus va dans le champ ; « Afficher le menu » le porte au premier lien apparu.
- Page courante : graisse, pastille ou soulignement, jamais la couleur seule. En couleurs forcées, elle est soulignée et les logos gardent une plaque claire.
- Texte agrandi à 200 % : le nom du site se coupe, la barre de bureau passe sur deux rangées, et `--hauteur-entete` suit.
- Mouvement réduit : le rideau et les icônes changent d’état sans animation.
