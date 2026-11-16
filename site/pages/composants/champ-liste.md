---
titre: Champs et filtres
description: "Des contrôles natifs avec un libellé visible, une aide et une erreur reliées au champ. Pour la saisie et les filtres des deux sites."
fichiers: "`harmonium/astro/Champ.astro` · `bib-champ.min.css`"
---

## Aperçu {#apercu}

::exemple[composants/champ-liste/02.html]

## Utilisation {#utilisation}

```astro
import Champ from 'harmonium/astro/Champ.astro'

<Champ name="courriel" type="email" libelle="Adresse courriel" required
  autocomplete="email" aide="Pour recevoir la réponse."
  erreur={erreurs.courriel} />

<Champ name="categorie" libelle="Catégorie" options={[
  { valeur: '', libelle: 'Toutes les catégories' },
  { valeur: 'formation', libelle: 'Formations' }
]} />
```

| Propriété | Usage |
| --- | --- |
| `name`, `libelle` | Nom envoyé et libellé visible, requis. |
| `type` | Type natif de l’input ; `text` par défaut. |
| `valeur` | Valeur du champ. |
| `aide`, `erreur` | Reliées au contrôle par `aria-describedby`. |
| `options` | Liste de `{ valeur, libelle }` pour un select natif. |
| `multiligne` | Rend un textarea. |
| `required`, `disabled` | Attributs natifs ; l’obligation est aussi écrite. |
| Autres attributs | Transmis au contrôle : `autocomplete`, `min`, `max`… |

## Accessibilité {#accessibilite}

- Ne pas utiliser le placeholder comme libellé.
- Décrire l’erreur en texte, sans se limiter au rouge, et conserver la valeur saisie.
- Préférer les boutons radio pour quelques choix, les cases à cocher pour plusieurs valeurs et le select pour une liste plus longue.
- La validation serveur reste nécessaire. Une erreur dynamique doit être annoncée par le formulaire ; le champ ne crée pas d’annonce au chargement.

## Choix simples et multiples {#choix}

Employer les contrôles natifs ; un `fieldset` et sa `legend` donnent le contexte du groupe. Chaque option garde son propre libellé.

::exemple[composants/champ-liste/03.html]

```html
<fieldset class="bib-choix">
  <legend>Format de la formation</legend>
  <label><input type="radio" name="format" value="salle"> En salle</label>
  <label><input type="radio" name="format" value="distance"> À distance</label>
</fieldset>
```

Pour plusieurs choix indépendants, utiliser `type="checkbox"` et un nom de groupe adapté au formulaire.
