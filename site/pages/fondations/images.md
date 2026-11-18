---
titre: Images
description: "Choisir un texte de remplacement selon le rôle de l’image, puis préserver ses proportions et sa place dans la page."
---

## Texte de remplacement {#texte}

- **Image informative** : décrire brièvement l’information utile dans `alt`.
- **Image décorative** ou répétant le texte voisin : `alt=""`.
- **Image dans un lien** : nommer la destination, sauf si le même lien contient déjà ce texte.
- **Graphique ou schéma complexe** : donner une courte identification et une description ou des données à proximité.

Ne pas commencer par « Image de ». Une légende donne le contexte ou le crédit ; elle ne remplace pas automatiquement le texte alternatif.

## Dimensions et affichage {#dimensions}

```html
<figure>
  <img src="salle.webp" alt="Tables individuelles avec prises électriques."
       width="1200" height="800" loading="lazy" decoding="async">
  <figcaption>Salle de travail individuel, niveau 2.</figcaption>
</figure>
```

Conserver les dimensions intrinsèques et appliquer `max-width: 100%; height: auto` dans la présentation. Réserver le chargement différé aux images hors du premier écran. Fournir des sources adaptées à l’écran lorsque nécessaire.
