---
titre: "Section"
description: "Une bande pleine largeur qui donne le rythme vertical d’une page : un fond de couleur ou une photo, une marge verticale régulière et un contenu centré. La couleur du texte, des liens et du focus suit le fond."
fichiers: "`harmonium/astro/Section.astro` · `bib-section.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/section/01.html]

 

::exemple[composants/section/02.html]

 

::exemple[composants/section/03.html]

## Utilisation {#utilisation}

### En HTML

```
<section class="bib-section bib-section--vert-fonce bib-section--fonce surface-foncee">
  <div class="bib-section__interieur">…</div>
</section>

<!-- Ton « moyen » : poser aussi la classe theme-clair -->
<section class="bib-section bib-section--jaune bib-section--moyen theme-clair">…</section>

<!-- Photo de fond -->
<section class="bib-section bib-section--image surface-foncee">
  <img class="bib-section__image" src="photo.jpg" alt="" loading="lazy">
  <div class="bib-section__interieur">…</div>
</section>
```

Habillage : un modificateur de couleur (`--bleu-principal`, `--bleu-fonce`, `--bleu-principal-fonce`, `--vert-fonce`, `--rouge-orange`, `--orange`, `--vert`, `--jaune`, `--rouge-orange-40`, `--bleu-10`, `--bleu-20`, `--jaune-40`, `--rose-50`, `--rose`) **et** son ton (`--fonce`, `--moyen` ou `--clair`, voir le tableau ci-dessous). Pour une autre couleur : `--bib-section-fond` avec le ton qui convient. `--bib-section-voile` règle le voile d’une photo (60 %), `--bib-section-cadrage` son cadrage (50 %).

### Avec Astro

```
---
import Section from 'harmonium/astro/Section.astro'
---
<Section couleur="vertFonce">…</Section>
<Section image={photo} imageAlt="" voile="droite">…</Section>
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| couleur | Clé de couleur du thème (`vertFonce`, `jaune`, `bleu10`…) ; le ton est choisi seul. Exclusif avec `image`. |  |
| image | Photo en fond sous un voile noir, texte blanc : une image importée passe par `<Picture>` (formats et tailles d’astro:assets), une chaîne par un `<img>`. |  |
| imageAlt | Texte de remplacement ; photo décorative par défaut. | vide |
| voile | `droite` : dès 900 px, la photo sans voile remplit la moitié gauche et le texte est sur le bleu principal. | `uniforme` |
| margeHaut | Marge haute de 3 rem dès 900 px. | non |
| suite | Prolonge la bande précédente de même fond, sans marge haute. | non |
| largeurFixe | Largeur du palier atteint (600, 900, 1200, 1536 px), sans marges internes. | non |
| hauteurMin, alignementTexte | Hauteur minimale et alignement du texte. |  |
| revelation | Pose `data-revelation` sur l’intérieur, pour l’animation d’apparition du site. | non |

### Les tons

Le ton règle la couleur du texte, des liens et du focus d’après le contraste calculé (WCAG, 4,5:1). Le jaune et le rose 500 sont « moyens » à cause du texte orange et du lien sur rose 500.

| Ton | Fonds | Texte et liens |
| --- | --- | --- |
| `--fonce` | bleu principal, bleu foncé, bleu principal foncé, vert foncé | Blancs (blanc ≥ 7,1:1 sur le fond) ; texte orange remplacé par le jaune. |
| `--moyen` | rouge orangé, orange, vert pâle, jaune, rose 500 | Texte foncé ; liens de la couleur du texte, soulignés (le blanc et le lien bleu ne passent pas). |
| `--clair` | bleu 100, bleu 200, jaune pâle, rose 100, rose 300 | Texte foncé, liens bleus. |

### Variables d’habillage {#variables}

{{habillage-section}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Séparer les grands blocs d’une page d’accueil ou de présentation : présentation, appel à l’action, actualités.
-   Mettre en valeur un seul appel (« Prendre rendez-vous ») sur un fond fort.

### À éviter

-   **Dans une page de texte**, pour encadrer un paragraphe : une [surface](@@/composants/surface.html) ou un encadré suffit.
-   **Pour un message d’état** (fermeture, panne) : une [alerte](@@/composants/alertes.html), qui a une icône et un libellé pour les lecteurs d’écran.
-   **Deux bandes foncées de suite** : la séparation ne se voit plus ; alterner les tons ou utiliser `suite` pour prolonger la même bande.
-   **Pour une photo porteuse de sens** : sous un voile, elle devient décor ; la montrer plutôt dans le contenu.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Contraste du texte** : au moins 4,5:1 sur chaque fond, par le ton calculé (WCAG 1.4.3). Le texte secondaire, illisible en gris sur fond foncé (environ 1,5:1), passe au blanc atténué.
-   **Liens et focus** : sur fond foncé ou moyen, le lien prend la couleur du texte et reste souligné (1.4.1) ; le contour de focus change de couleur pour rester visible (2.4.7, 2.4.13). Les cartes posées sur la bande tracent leur anneau dans cette couleur.
-   **Photo** : décorative par défaut (`alt=""`), sous un voile qui garde le texte blanc à 4,5:1 même sur du blanc pur.
-   **Couleurs forcées** : le fond disparaît ; un filet en haut et en bas délimite la bande.
-   **Texte agrandi et 320 px** : marges latérales de 16 px sur téléphone ; la bande grandit avec son contenu (1.4.4, 1.4.10).
-   **Mouvement** : l’apparition au défilement (`revelation`) est réservée aux pages d’accueil et de présentation, et coupée quand la personne réduit les animations.

### Ce que l’intégrateur doit faire

-   Commencer la bande par un titre du bon niveau (souvent `##`) : la couleur ne remplace pas la structure (1.3.1).
-   Donner un `imageAlt` seulement si la photo apporte une information ; sinon la laisser décorative.
-   Ne pas poser de texte coloré (orange, bleu) sur un fond moyen ou foncé : le composant ne corrige que les couleurs du thème.
-   Donner un `id` à la bande si un lien doit y mener.
