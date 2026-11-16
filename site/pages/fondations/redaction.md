---
titre: "Rédaction et messages"
description: "Des textes cohérents pour les sites des bibliothèques de l’UdeM : procédures, rédaction épicène, noms des outils et messages d’interface."
---

Ces conventions reprennent les règles du guide de rédaction des bibliothèques. Elles s’appliquent aux textes et aux exemples d’Harmonium ; les fichiers de logo conservent leur dessin et leur signature.

## Une voix claire et accueillante {#voix}

Écrire en français, avec des mots courants et des phrases directes. Décrire d’abord ce que la personne peut faire, expliquer les sigles au premier emploi et conserver les noms des bibliothèques, des outils et des collections.

Le « vous » permet souvent une formulation courte et sans marque de genre. L’utiliser lorsque le contexte s’y prête, sans rendre inutilement directif un texte d’information.

| Avant | Après | Pourquoi |
| --- | --- | --- |
| Procéder à une demande de PEB | Demander un document par prêt entre bibliothèques (PEB) | Expliquer le sigle et nommer l’action. |
| Cliquez ici | Consulter les horaires | Le lien garde son sens hors contexte. |
| C’est facile et rapide | Préparer le titre et le nom de l’auteur. | Donner une information utile sans présumer des capacités de la personne. |
| Notre service de soutien documentaire | Obtenir de l’aide pour votre recherche | Partir du besoin plutôt que de l’organisation. |

## Rédiger une procédure {#procedures}

-   Choisir l’infinitif (« Ouvrir ») ou la deuxième personne du pluriel (« Ouvrez »), puis garder ce choix dans toute la procédure.
-   Utiliser une liste numérotée lorsque les actions doivent se suivre. Terminer chaque étape par un point.
-   Préférer une action par étape. Si un chemin de menus est nécessaire, séparer ses éléments par une flèche ou un chevron : **Fichier** › **Ouvrir**.
-   Mettre en **gras** les libellés des commandes à activer : menus, boutons et cases à cocher.
-   Mettre en *italique* une variable à adapter : nom de fichier, code d’identification ou autre valeur propre à la personne.
-   Présenter les valeurs à saisir en Courier, avec `code`. Dans Harmonium, utiliser `bib-saisie` ou placer le code dans une liste `bib-procedure`.
-   Écrire les formats de fichiers en majuscules (PDF, DOCX) et leurs extensions en minuscules (`.pdf`, `.docx`).
-   Réserver le soulignement aux liens hypertextes. Une commande mentionnée dans une étape est en gras, sans faux lien.

::exemple[fondations/redaction/01.html]

```
<ol class="bib-procedure">
  <li>Ouvrir le menu <strong>Fichier</strong>.</li>
  <li>Sélectionner <strong>Enregistrer sous</strong>.</li>
  <li>Saisir <code class="bib-saisie">rapport-<var>nom</var>.pdf</code>
      dans le champ <strong>Nom du fichier</strong>.</li>
  <li>Sélectionner <strong>Enregistrer</strong>.</li>
</ol>
```

Ces classes font partie de `bib-typographie.min.css`. Le composant `Copier` utilise aussi la police de saisie pour les valeurs à reproduire.

## Rédaction épicène {#epicene}

Choisir la formulation dès la conception du texte, plutôt que d’ajouter des formes féminines à un texte déjà rédigé au masculin. Alterner les stratégies tout en gardant la précision du message.

| Stratégie | Exemple |
| --- | --- |
| Nom collectif | La communauté étudiante peut emprunter des documents. |
| Nom neutre | L’emprunt est réservé aux personnes ayant une carte étudiante valide. |
| Sujet inanimé | La carte étudiante doit être récupérée au comptoir. |
| Deuxième personne du pluriel | Vous pouvez emprunter des documents avec votre carte étudiante. |
| Doublet complet, si nécessaire | Les étudiantes et les étudiants inscrits peuvent accéder au service. |

Éviter les doublets tronqués avec un point ou une puce. Les parenthèses sont réservées aux contraintes d’espace incontournables, comme un formulaire imprimé. Pour les interfaces web, privilégier les formulations neutres ou les doublets complets.

Le guide privilégie l’accord au masculin avec un doublet, en plaçant la forme masculine près du mot accordé. Il mentionne l’accord de proximité comme une autre possibilité ; garder un choix cohérent et une phrase facile à lire. Vérifier aussi les participes passés dans les phrases au « vous ».

## Noms et majuscules {#noms}

Dans les communications à la communauté et au public, employer « Bibliothèques UdeM » ou « bibliothèques de l’UdeM ». « Direction des bibliothèques » désigne l’unité administrative et convient aux documents administratifs.

Le mot « Bibliothèque » prend une majuscule lorsqu’il désigne une entité précise : « la Bibliothèque de musique », « la Bibliothèque de droit ». Il reste en minuscule lorsqu’il désigne un lieu ou un ensemble générique : « une bibliothèque moderne », « les bibliothèques de l’UdeM ».

Conserver le nom complet des entités : « Bibliothèque de mathématiques et informatique », « Bibliothèque Marguerite-d’Youville », « Médiathèque J.-A.-DeSève » et « Service Accessibilité ».

## Nommer les outils publics {#outils}

Présenter le rôle de l’outil au premier emploi quand il aide à comprendre le texte. Dans une interface, le libellé court peut être accompagné d’une description. Les noms techniques internes ne remplacent pas les noms connus du public.

| Nom à employer | Rôle ou précision utile |
| --- | --- |
| Boîte à outils | Guides thématiques et disciplinaires ; LibGuides est le nom de la plateforme. |
| Bases de données de A à Z | Liste des bases de données. « Liste des bases de données de A à Z » et « Liste A-Z » sont aussi possibles selon le contexte. |
| Mon dossier ou dossier Sofia | Prêts, réservations et autres informations du dossier. |
| Sofia | Outil de recherche des bibliothèques ; le nom s’emploie au masculin. |
| Proxy | Accès hors campus aux ressources électroniques. Garder la majuscule pour nommer cet outil. |
| Papyrus | Dépôt institutionnel de l’UdeM. |
| Studio•bib | Soutien informatique et création numérique. |
| StudiUM | Plateforme de cours ; conserver cette casse. |

Développer un sigle à son premier emploi, par exemple « prêt entre bibliothèques (PEB) ». Garder le sigle pour les mentions suivantes lorsque le contexte est clair.

## Titres, liens et commandes {#libelles}

-   Un titre décrit sa section. Suivre h1, h2, h3 dans l’ordre ; choisir la taille visuelle séparément.
-   Commencer un bouton d’action par un verbe : « Réserver une salle », « Envoyer la demande ». Distinguer « Effacer les filtres » de « Annuler la demande ».
-   Utiliser une casse de phrase : « Consulter les horaires ». Les majuscules ne créent pas la hiérarchie.
-   Nommer la destination d’un lien et garder le soulignement dans le texte. Une flèche n’explique pas à elle seule où le lien mène.
-   Garder des libellés courts, tout en permettant le retour à la ligne avec le zoom et les petits écrans.

Les liens ordinaires restent dans le même onglet. Les PDF s’ouvrent dans un nouvel onglet avec une annonce explicite, selon le comportement d’Harmonium. Réserver les autres ouvertures à un besoin réel et les annoncer.

## Accompagner la saisie {#champs}

Le libellé reste visible au-dessus du champ. Mettre les exemples et les conditions dans une aide sous le contrôle, reliée par `aria-describedby`. Une indication temporaire dans le champ ne remplace pas cette aide.

Après validation, expliquer ce qui manque et comment le corriger. Garder les valeurs déjà saisies. Lier l’erreur au contrôle avec `aria-describedby` et poser `aria-invalid="true"`. La couleur renforce le message sans le remplacer.

## Les états font partie du contenu {#messages}

| Situation | Exemple de message | Comportement attendu |
| --- | --- | --- |
| Chargement | Chargement des horaires… | Ne pas afficher « Fermé » tant que les données sont inconnues. |
| Aucun résultat | Aucune bibliothèque ne correspond à ces filtres. Modifiez la discipline ou effacez les filtres. | Conserver les critères et proposer une suite utile. |
| Erreur de saisie | Choisissez une bibliothèque de retrait. | Nommer le champ et la correction ; afficher le message près du contrôle. |
| Erreur de service | Les horaires sont indisponibles. Réessayez ou consultez la page de la bibliothèque. | Distinguer l’indisponibilité d’un résultat vide et proposer une issue. |
| Confirmation | Votre demande a été envoyée. | Dire ce qui est confirmé, puis la prochaine étape si elle est connue. |

Un compte de résultats peut utiliser `role="status"`. Éviter de déplacer le focus ou de lancer une annonce à chaque caractère tapé. Réserver `role="alert"` à une information urgente qui demande une attention immédiate.
