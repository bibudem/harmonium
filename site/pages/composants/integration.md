---
titre: "Intégration tierce"
description: "Le conteneur où un service externe vient se loger dans la page : formulaire LibWizard ou LibAnswers, fenêtre de clavardage LibChat, iframe. Il garde la place du contenu avant son arrivée, affiche « Chargement… » et annonce un échec au lieu de laisser un trou."
fichiers: "`harmonium/astro/Integration.astro` · `bib-integration.min.css` · `bib-integration.min.js`"
ressources: "composants/integration"
---

## Aperçu {#apercu}

::exemple[composants/integration/01.html]

 

::exemple[composants/integration/02.html]

## Utilisation {#utilisation}

### En HTML

```
<div class="bib-integration" style="--bib-integration-hauteur: 860px; --bib-integration-hauteur-large: 650px"
     data-integration data-src="https://unequestion.bib.umontreal.ca/1.0/widgets/7159"
     data-message-erreur="Le formulaire n’a pas pu être chargé. Rechargez la page ou réessayez plus tard.">
  <div id="s-la-widget-7159" class="bib-integration__cible"></div>
  <p class="bib-integration__chargement">Chargement du formulaire…</p>
  <p class="bib-integration__erreur" role="status"></p>
  <noscript><p>Ce formulaire a besoin de JavaScript pour s’afficher.</p></noscript>
</div>

<!-- Clavardage intégré : la cible porte l’id que LibChat attend -->
<div class="bib-integration bib-integration--clavardage" data-integration
     data-src="https://unequestion.bib.umontreal.ca/load_chat.php?hash=9ee6ed73…"
     data-message-erreur="Le service de clavardage est temporairement indisponible.">
  <div id="libchat_9ee6ed73…" class="bib-integration__cible"></div>
  <p class="bib-integration__chargement">Chargement du clavardage…</p>
  <p class="bib-integration__erreur" role="status"></p>
</div>
```

La cible reste vide dans le HTML : elle porte l’`id` que le script du fournisseur cherche. `bib-integration.min.js` charge `data-src` (à chaque visite de la page, navigation côté client comprise), garde le contenu arrivé masqué jusqu’au chargement de ses feuilles de style, puis retire « Chargement… » ; si le script échoue, il écrit `data-message-erreur` dans la région `role="status"` et lève la réserve. **Sans `data-src`**, la page remplit la cible elle-même (une iframe ajustée à son contenu, par exemple) : le composant garde la place et retire le message à l’arrivée du contenu.

**Régler la place réservée** : mesurer le contenu chargé à 390 et à 1440 px de large, puis prendre un peu moins, pour ne jamais laisser de vide sous lui. En `rem` si le contenu suit la taille du texte du navigateur (iframe LibWizard : `120rem`), en `px` s’il est en pixels fixes (widget LibAnswers). À refaire quand le formulaire change.

### Avec Astro

```
---
import Integration from 'harmonium/astro/Integration.astro'
---
<Integration cibleId="s-la-widget-7159" src="https://unequestion.bib.umontreal.ca/1.0/widgets/7159"
  hauteur="860px" hauteurLarge="650px" />

<Integration clavardage="9ee6ed73a6fb1854335aacfa8a7497ef4acaff4303c125783909dacc7b3200b9" />

<!-- La page charge elle-même l’iframe dans #formulaire-consentement -->
<Integration cibleId="formulaire-consentement" hauteur="150rem" />
```

| Propriété | Rôle | Défaut |
| --- | --- | --- |
| cibleId | `id` de l’élément que le script tiers remplit. Obligatoire sans `clavardage`. |  |
| src | Adresse du script tiers. Absente : la page remplit la cible elle-même. |  |
| clavardage | Identifiant (hash) d’un widget LibChat : donne la cible, le script, la variante `--clavardage` et ses messages. |  |
| hauteur, hauteurLarge | Place réservée, puis dès 1200 px (longueur CSS). | `auto` (402 px avec `clavardage`) |
| chargement, erreur, sansScript | Messages d’attente, d’échec et sans JavaScript. | ceux du formulaire ou du clavardage |

### Variables d’habillage {#variables}

{{habillage-integration}}

## Quand l’utiliser {#quand}

### À utiliser pour

-   Un formulaire LibWizard (suggestion d’achat, réserve de cours) ou le widget LibAnswers (Nous écrire) : tout script tiers qui remplit un `<div id="…">`.
-   Une fenêtre de clavardage intégrée dans le contenu (page Clavarder, Soutien informatique).
-   Une iframe dont la page règle elle-même l’adresse et la hauteur (formulaire de consentement à l’inscription).

### À éviter

-   **Pour le bouton de clavardage présent sur toutes les pages** : le [clavardage](@@/composants/clavardage.html) d’Harmonium.
-   **Pour un script de mesure ou de suivi** : il n’affiche rien ; voir la [demande de consentement](@@/composants/consentement.html).
-   **Quand un lien suffit** : un formulaire long, rarement rempli, peut rester chez le fournisseur, derrière un [bouton](@@/composants/bouton.html).

## Accessibilité {#accessibilite}

### Ce que fait le composant

-   **Échec annoncé** : le message s’écrit dans un `<p role="status">` présent, vide, dès le HTML : une région live doit exister avant qu’on y écrive pour être annoncée (WCAG 4.1.3). Jamais de boîte `alert()`.
-   **Attente visible** : « Chargement du formulaire… » s’affiche en texte dans la place réservée et disparaît à l’arrivée du contenu.
-   **Rien ne bouge sous le doigt** : la place réservée et le masquage jusqu’aux styles évitent que le contenu suivant se déplace pendant qu’on lit ou qu’on vise un lien (décalages mesurés de 0,09 à 0,56 sans eux).
-   **Pas de défilement horizontal de la page** : un formulaire à largeur fixe défile dans son conteneur (1.4.10).
-   **Cibles agrandies** dans le widget LibAnswers, injecté dans la page : étiquettes des boutons radio portées à 24 px (2.5.8), bouton d’envoi de 44 px sous 900 px. Une iframe d’un autre domaine (LibWizard) ne peut pas être corrigée.
-   **Sans JavaScript** : le `<noscript>` dit que le contenu en a besoin, et la réserve est levée (`scripting: none`).

### Ce que l’intégrateur doit faire

-   Placer un titre avant le conteneur (« Nous écrire ») : le contenu tiers n’en apporte pas toujours.
-   Donner un autre moyen de joindre l’équipe (courriel, téléphone) sur la page : un bloqueur ou une panne peut empêcher le contenu de s’afficher.
-   Nommer une iframe (`title`, « Formulaire de consentement à l’inscription ») (4.1.2).
-   Écrire, dans l’outil du fournisseur, des étiquettes et des messages d’erreur clairs : le site ne contrôle pas le balisage de LibWizard.
