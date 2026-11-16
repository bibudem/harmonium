---
titre: "Formes, ombres, empilement"
description: "Des coins arrondis à six paliers, deux ombres teintées de bleu foncé, et un ordre d’empilement qui évite la course aux `z-index`."
---

## Rayons {#rayons}

::exemple[fondations/formes/01.html]

Toutes les cartes : `--rayon-carte` (= `--rayon-petit`, 12 px). Boutons et pastilles : `--rayon-plein`. Les [alertes](@@/composants/alertes.html) n’arrondissent que leurs coins de droite.

## Ombres {#ombres}

::exemple[fondations/formes/02.html]

 {{tableau-ombres}}

En mode contraste élevé, une ombre disparaît : la remplacer par une bordure `CanvasText`.

## Empilement {#empilement}

Ordre local, dans un composant (fond, calque, plan, éléments posés dessus), puis ordre global de la page.

{{empilement}}
