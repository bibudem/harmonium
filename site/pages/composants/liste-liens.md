---
titre: "Liste de liens"
description: "Une liste de liens en cartes séparées : un titre, une description et, à droite, un texte d’appel ou une pastille fléchée. Toute la carte est cliquable, en grille ou empilée."
fichiers: "`harmonium/astro/ListeLiens.astro` · `harmonium/astro/ElementListeLiens.astro` · `bib-liste-liens.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/liste-liens/01.html]

 

::exemple[composants/liste-liens/02.html]

## Utilisation {#utilisation}

Chaque carte de la liste repose sur le lien étiré et la pastille fléchée, décrits dans [Carte à icône](@@/composants/carte-icone.html#lien-etire).

### En HTML

```
<ul class="bib-liste-liens">
  <li class="bib-element-liste-liens bib-carte-lien">
    <div class="bib-element-liste-liens__texte">
      <h3 class="bib-element-liste-liens__titre"><a class="bib-lien-etire bib-element-liste-liens__lien" href="/prets/" aria-describedby="appel-1">Prêts</a></h3>
      <div class="bib-element-liste-liens__description">Durées, renouvellements et frais.</div>
    </div>
    <span class="bib-element-liste-liens__bouton" aria-hidden="true"><span id="appel-1">Voir</span><span class="bib-element-liste-liens__fleche"></span></span>
  </li>
</ul>
```

Habillage : `bib-liste-liens--grille` : sans retrait, les cartes côte à côte (14 rem au moins chacune), puis empilées sur écran étroit ; une carte seule garde sa pastille à droite, centrée. `bib-element-liste-liens--vert-fonce` (sur une section vert foncé) : pastille vert pâle avec une flèche bleu foncé (7,32:1). Sans `bib-element-liste-liens__bouton`, une pastille fléchée.

### Avec Astro

```
---
import ListeLiens from 'harmonium/astro/ListeLiens.astro'
import ElementListeLiens from 'harmonium/astro/ElementListeLiens.astro'
---
<ListeLiens>
  <ElementListeLiens title="Prêts" description="Durées, renouvellements et frais." href="/prets/" linkText="Voir" />
  <ElementListeLiens title="Collections" description="Livres, revues." href="/collections/" />
</ListeLiens>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| grille | (`ListeLiens`) Cartes côte à côte, sans retrait. | non |
| offset | (`ListeLiens`) Décalage de chaque côté, en colonnes. | `0.5` (0 en grille) |
| title, href | (`ElementListeLiens`) Titre (qui porte le lien) et adresse. Obligatoires. |  |
| description | (`ElementListeLiens`) Texte sous le titre. |  |
| linkText | (`ElementListeLiens`) Texte d’appel à droite, qui décrit le lien ; sans lui, une pastille fléchée. |  |
| color | (`ElementListeLiens`) `vertFonce` sur une section vert foncé. | `default` |
| niveauTitre | (`ElementListeLiens`) 2 à 6, sans changer la taille. | `3` |

## Quand l’utiliser {#quand}

### À utiliser pour

-   Une page d’accueil de section qui oriente vers ses sous-pages (« Nous joindre », « À propos », « Obtenir »).
-   Trois à huit services voisins, chacun décrit en une phrase.
-   Des liens vers d’autres sites de la famille (guides, dépôts), annoncés par la flèche oblique.

### À éviter

-   **Pour mettre en avant trois pages en image** : la [CarteImage](@@/composants/carte-image.html).
-   **Pour des liens en couleur, sans description** : la [GrilleElargissable](@@/fondations/espacements.html) de [CarteLienCompacte](@@/composants/carte-icone.html#compacte).
-   **Pour une seule action** : un [bouton](@@/composants/bouton.html) ou un [lien](@@/composants/lien.html) dans le texte.
-   **Pour des liens dans une phrase** : de simples liens ; la liste interrompt la lecture.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Liste réelle** (`<ul>`, `<li>`) : le lecteur d’écran annonce le nombre d’éléments (WCAG 1.3.1).
-   **Un lien par élément**, nommé par le titre, dont la zone couvre la carte : un arrêt de tabulation, une grande cible (2.4.4, 2.5.8).
-   **Titres réels**, d’un niveau réglable, trouvés par la navigation par titres (1.3.1, 2.4.6).
-   **Pastille et bouton décoratifs** (`aria-hidden`) ; le texte d’appel est relié au lien comme description et n’est pas lu deux fois.
-   **Annonces** : un PDF ou un nouvel onglet est ajouté au nom en texte masqué (« (PDF) »). La flèche oblique distingue les autres sites, sans dépendre de la couleur (1.4.1).
-   **Focus** : anneau dessiné à l’intérieur de l’élément (liste) ou anneau double autour de la carte (présentation cartes), toujours visible (2.4.7). Le fond fonce au focus comme au survol.
-   **Contrastes** : contour des cartes neutres et des pastilles 3,7:1 sur blanc (1.4.11) ; variante vert foncé, flèche bleu foncé sur vert pâle 7,32:1 (la flèche blanche de la source n’atteignait que 2,48:1).
-   **Texte agrandi** : le texte d’appel passe à la ligne au lieu de pousser la page hors de l’écran (1.4.10).
-   **Survol réservé aux pointeurs fins** : au toucher, il ne reste pas d’état fantôme après le tapotement.

### Ce que l’auteur doit faire

-   Écrire des titres qui nomment la destination (« Nous écrire »), jamais « En savoir plus ».
-   Garder la description à une phrase : elle est lue après le titre, à chaque élément.
-   Ne pas répéter le titre dans le texte d’appel ; l’appel dit l’action (« Consulter le guide »).
-   Choisir une icône qui illustre, sans porter seule l’information : elle est masquée aux lecteurs d’écran.
