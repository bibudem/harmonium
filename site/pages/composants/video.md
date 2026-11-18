---
titre: "Vidéo"
description: "Une vidéo YouTube, Loom ou d’une autre plateforme, derrière une façade légère : rien n’est chargé de la plateforme avant le clic. Une photo peut se placer derrière le bouton de lecture, et la transcription se lie juste sous la vidéo."
fichiers: "`harmonium/astro/Video.astro` · `bib-video.min.css` · `bib-video.min.js` (facultatif)"
ressources: "composants/video"
---

## Aperçu {#apercu}

::exemple[composants/video/01.html]

 

::exemple[composants/video/02.html]

## Utilisation {#utilisation}

### En HTML

```html
<div class="bib-video bib-video--photo bib-video--avec-transcription" data-video
     data-lecteur="https://www.youtube-nocookie.com/embed/3cMdFZbivdg?autoplay=1&amp;rel=0"
     data-titre-video="Ouvrages d’exception">
  <img class="bib-video__image" src="/images/ouvrages.webp" alt="" loading="lazy">
  <a class="bib-video__lecture" href="https://www.youtube.com/watch?v=3cMdFZbivdg">
    <span class="bib-video__pastille" aria-hidden="true"><svg viewBox="0 0 256 256" width="32" height="32" fill="currentColor">…</svg></span>
    <span class="bib-video__texte">
      <span class="bib-video__action">Lire la vidéo</span>
      <span class="bib-video__titre">Ouvrages d’exception</span>
      <span class="bib-video__plateforme">YouTube</span>
    </span>
  </a>
</div>
<p class="bib-video__transcription"><a href="/transcriptions/ouvrages/">Lire la transcription de la vidéo</a></p>

<script type="module" src="…/dist/bib-video.min.js"></script>
```

Sans photo, retirer `bib-video--photo` et l’image : le fond est bleu foncé. Un fichier du site s’affiche avec le lecteur natif : `<figure class="bib-video bib-video--fichier">` contenant `<video class="bib-video__cadre" controls preload="metadata">` et sa légende.

Habillage : `--bib-video-fond` (bleu foncé, aussi la couleur du voile sur la photo), `--bib-video-texte` (blanc), `--bib-video-pastille` (rouge orangé), `--bib-video-largeur` (45 rem).

### Avec Astro

```astro
---
import Video from 'harmonium/astro/Video.astro'
import photo from './images/ouvrages.webp'
---
<Video titre="Ouvrages d’exception" youtube="3cMdFZbivdg"
  image={photo.src} transcription="/transcriptions/ouvrages/" />

<Video titre="Démonstration du prompteur" fichier="/videos/prompteur.mp4" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| titre | Titre de la vidéo : affiché sur la façade, il nomme aussi le lien et le lecteur. Obligatoire. | |
| youtube | Identifiant YouTube (les 11 caractères après `watch?v=`). | |
| loom | Identifiant Loom. | |
| integration | Adresse d’intégration (iframe) d’une autre plateforme. | |
| fichier | Fichier vidéo du site : lecteur natif. | |
| image | Photo décorative derrière le bouton de lecture, sous un voile bleu foncé. | aucune |
| transcription | Adresse de la transcription, liée sous la vidéo. | aucune |

Une seule source parmi `youtube`, `loom`, `integration` et `fichier`.

### Variables d’habillage {#variables}

{{habillage-video}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Présenter un lieu, une collection ou un service en quelques minutes, dans une [bande de couleur](@@/composants/section.html) avec un titre et une phrase d’introduction.
-   Un tutoriel court, dans le corps d’une page d’aide.

### À éviter

-   **Sans titre ni contexte** : la vidéo complète un texte, elle ne le remplace pas. Les informations essentielles (horaires, adresses, procédures) restent écrites dans la page.
-   **Plusieurs vidéos à la suite** : choisir la plus utile et lier les autres.
-   **Une photo chargée ou très claire** : le voile garde le texte lisible, mais un sujet net et sombre se lit mieux.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Rien avant le clic** : ni lecteur, ni vignette, ni témoin de la plateforme. La page reste légère et ne transmet rien sans geste de la personne.
-   **Fonctionne sans JavaScript** : le bouton de lecture est un lien vers la vidéo sur la plateforme. Avec le script, il est remplacé par le lecteur, qui démarre et reçoit le focus. Ctrl, Cmd ou Maj-clic ouvrent la plateforme comme tout lien.
-   **Nom** : le lien et le lecteur portent le titre de la vidéo (WCAG 4.1.2).
-   **Contraste** : texte blanc sur bleu foncé ; sur une photo, un voile bleu foncé et une ombre portée gardent le texte lisible (1.4.3). Icône blanche sur rouge orangé : 3,4:1 (1.4.11).
-   **Focus** visible à l’intérieur du cadre ; la pastille grossit au survol et au focus, sans mouvement quand la personne réduit les animations.
-   **Couleurs forcées** : le cadre reçoit un contour et le voile laisse place au fond du système.
-   **Téléphone** : sous 600 px, seul le titre reste sur la façade, pour tenir en 16:9.

### Ce que l’intégrateur doit faire

-   Donner un titre qui dit ce que montre la vidéo.
-   Fournir une transcription, et des sous-titres sur la plateforme (WCAG 1.2.2, 1.2.3) ; la lier avec `transcription`.
-   Laisser la photo décorative (`alt=""`) : le titre dit déjà ce que montre la vidéo.
