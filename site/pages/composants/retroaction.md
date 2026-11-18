---
titre: "Rétroaction"
fichiers: "`bib-retroaction-usager.min.js` · `<bib-retroaction-usager>`"
description: "« Cette page vous a été utile? » en bas du contenu. Un pouce en haut envoie la réponse tout de suite ; un pouce en bas ouvre un champ de commentaire facultatif."
ressources: "composants/retroaction"
---

## Aperçu {#apercu}

::exemple[composants/retroaction/02.html]

 

::exemple[composants/retroaction/03.html]

## Utilisation {#utilisation}

1.  **Dans le `<head>`**
    
    ```
    <script type="module" src="https://cdn.jsdelivr.net/gh/bibudem/harmonium@1/dist/bib-retroaction-usager.min.js"></script>
    ```
    
2.  **À la fin du contenu de la page, avant le pied de page**
    
    Par exemple, juste avant `</main>` :
    
    ```
    <aside aria-label="Rétroaction sur la page">
      <bib-retroaction-usager></bib-retroaction-usager>
    </aside>
    ```
    

### Déroulement {#deroulement}

Textes et étapes du composant commun :

| Étape | Ce que voit la personne |
| --- | --- |
| Pouce en haut | La réponse part tout de suite, sans commentaire. |
| Pouce en bas | « Merci. Dites-nous ce qui manquait ou ce qui a rendu cette page moins utile. », un champ « Commentaire (optionnel) » de 500 caractères avec compteur, la mise en garde sur les renseignements personnels, le lien « contactez-nous directement », puis « Envoyer mon retour ». Le focus va au champ. |
| Pendant l’envoi | « Envoi en cours… », annoncé aux lecteurs d’écran ; le focus reste où il était. |
| Envoyé | « Merci, votre retour a été envoyé. Il nous aide à améliorer le site. » remplace le formulaire et reçoit le focus. |
| Erreur | « Une erreur est survenue lors de l’envoi. Veuillez réessayer. » (serveur, réseau, ou pas de réponse en 15 s), annoncé ; le commentaire est gardé. |

### Données envoyées {#donnees}

-   Formulaire LibWizard : vote (« oui » ou « non ») et commentaire.
-   L’adresse complète de la page (paramètres et ancre compris).
-   L’heure de la réponse, à l’heure de Montréal.
-   Pas d’adresse IP.

## Habillage {#habillage}

Le composant utilise les jetons communs quand la page les définit : boutons, champ et focus suivent le thème du site. C’est le cas de cette page.

| Jeton du site | Utilisé pour |
| --- | --- |
| `--couleur-fond-fort`, `--couleur-fond-fort-survol` | Pouce choisi, bouton d’envoi (et survol) |
| `--couleur-sur-fonce` | Texte sur ces boutons |
| `--couleur-focus` | Contour de focus |
| `--couleur-texte`, `--couleur-bordure`, `--couleur-surface` | Champ de commentaire, pouces |
| `--couleur-accent` | Icône du remerciement |
| `--rayon-plein`, `--rayon-petit`, `--taille-cible`, `--graisse-moyenne` | Formes et tailles |

Sans ces jetons, il prend ses propres valeurs par défaut. Pour régler un seul site, ces propriétés l’emportent sur les jetons :

```
bib-retroaction-usager {
  --bib-retroaction-couleur: var(--bleu-fonce);          /* pouce choisi, bouton d'envoi */
  --bib-retroaction-couleur-survol: var(--bleu-principal);
  --bib-retroaction-sur-couleur: var(--blanc);
  --bib-retroaction-accent: var(--bleu-principal);           /* icône du remerciement */
  --bib-retroaction-focus: var(--bleu-principal);
  --bib-retroaction-texte: var(--gris-600);            /* question et pouces (texte secondaire) */
  --bib-retroaction-taille: 0.875rem;          /* taille du texte */
  --bib-retroaction-graisse-titre: 500;        /* graisse de la question */
  --bib-retroaction-taille-boutons: 0.875em;   /* texte du bouton */
}
```

Les classes et ids internes (`.survey-title`, `.radio-group`, `#btn-vote-y`, `.input-sm`, `.write-us`, `.form-group-submit`…) sont stables : une feuille ajoutée par un site peut les viser.

## Quand l’utiliser {#quand}

### Pourquoi {#pourquoi}

Savoir quelles pages aident et lesquelles déçoivent permet de corriger le contenu là où il compte. Une question en un clic, au bas de chaque page, recueille cet avis sans demander d’effort.

-   **Un seul composant pour tous les sites** : les réponses de tous les sites arrivent dans le même formulaire LibWizard, avec l’adresse de la page.
-   **Textes et étapes communs** : la personne retrouve partout la même question.
-   **Aucune dépendance** : un script autonome, qui parle directement à LibWizard.
-   **Choix d’accessibilité** : boutons à état, focus guidé à chaque étape, envoi et erreur annoncés, cibles de 44 px.

### À utiliser pour

-   Les pages de contenu : guides, procédures, pages de service, questions fréquentes.

### À éviter

-   **Pour poser une question ou demander de l’aide** : la personne ne recevra pas de réponse. Offrir le [clavardage](@@/composants/clavardage.html) ou une page « Nous joindre » ; le composant y renvoie déjà.
-   **Sur les pages d’accueil, de recherche ou les formulaires** : « Cette page vous a été utile? » n’y a pas de sens.

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Sémantique** : la question nomme un groupe (`role="group"`) de deux boutons, « Oui » et « Non » ; les icônes de pouces sont cachées aux lecteurs d’écran (WCAG 1.1.1, 1.3.1).
-   **État des boutons** : le pouce choisi est annoncé « enfoncé » (`aria-pressed`) ; le pouce en bas indique qu’il ouvre le champ de commentaire (`aria-expanded`, `aria-controls`) (4.1.2).
-   **Champ de commentaire** : une vraie étiquette « Commentaire (optionnel) », reliée à la mise en garde « N’inscrivez pas de renseignements personnels. » (`aria-describedby`) ; la limite de 500 caractères est visible avec un compteur (1.3.1, 3.3.2).
-   **Focus guidé** : il va au champ quand il paraît, puis au remerciement après l’envoi, qui est ainsi lu ; il ne se perd jamais (2.4.3, testé).
-   **Pendant l’envoi** : les boutons restent atteignables au clavier (`aria-disabled` plutôt que `disabled`, qui ferait perdre le focus) et « Envoi en cours… » est annoncé (`role="status"`) (4.1.3, testé).
-   **Erreur** : le message est annoncé (`role="alert"`), accompagné d’une icône, et le commentaire est gardé pour réessayer (3.3.1, 4.1.3, testé).
-   **Clavier et cibles** : tout se fait avec Tab, Entrée et Espace (2.1.1) ; contour de focus de 3 px (2.4.7). Pouces et bouton d’envoi mesurent 44 px (2.5.8 en demande 24).
-   **Contrastes** : couleurs et focus suivent les jetons du site ; le pouce choisi est aussi une pastille pleine, pas seulement une couleur (1.4.1).
-   **Contraste élevé** (couleurs forcées) : le pouce choisi reçoit un contour en couleur système, le bouton d’envoi une bordure.
-   **Agrandissement et téléphone** : sous 768 px, le compteur et le bouton d’envoi s’empilent ; les tailles sont en `rem` (1.4.4, 1.4.10).
-   **Mouvement** : seules les couleurs changent, en 200 ms (`--duree-courte`).
-   **Langue** : `lang="fr-CA"` sur tout le composant, même sur une page anglaise (3.1.2).

### Ce que l’intégrateur doit faire

-   Placer le composant dans un `<aside aria-label="Rétroaction sur la page">`, à la fin du contenu : la région est nommée et se trouve après ce qu’elle évalue.
-   Définir les jetons du site (ou les propriétés `--bib-retroaction-*`) avec des contrastes suffisants : 4,5:1 pour le texte du bouton, 3:1 pour le contour de focus et le pouce choisi.
-   Une feuille qui vise les classes internes ne doit pas retirer le contour de focus ni réduire les cibles.

## Bon à savoir {#savoir}

-   Le lien « contactez-nous directement » mène à `https://bib.umontreal.ca/nous-joindre`.
-   Le pouce en bas n’envoie rien tant que la personne n’a pas cliqué « Envoyer mon retour ». Si elle se ravise et choisit le pouce en haut, le champ se referme et seul un « oui » part, sans commentaire : aucun « non » n’est enregistré.
