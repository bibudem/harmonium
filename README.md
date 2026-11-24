<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/marque/harmonium-horizontal-inverse.svg">
    <img src="src/marque/harmonium-horizontal.svg" alt="Harmonium" width="340">
  </picture>
</h1>

Harmonium est le système de design des sites des bibliothèques de l’Université de Montréal. Comme
l’instrument qui donne à lui seul l’harmonie d’un ensemble, il donne aux sites une base commune :
jetons de design (couleurs, typographie, espacements), composants, règles de rédaction et
d’accessibilité.

- **Pour tout site**, Astro ou non (WordPress, HTML statique…) : chaque composant est du HTML et
  du CSS documentés, publiés dans `dist/` et servis par jsDelivr. Ceux qui ont besoin de
  JavaScript sont un fichier minifié, sans dépendance.
- **Pour les sites Astro** : des composants (`astro/`) produisent le même HTML. Le paquet
  s’installe avec `npm install github:bibudem/harmonium#v1.x.y`.

La documentation est publiée sur <https://bibudem.github.io/harmonium/>.

> **Travail en cours, non officiel.** Harmonium n’est pas encore validé ni adopté par les
> Bibliothèques : son contenu peut changer à tout moment.

## Prérequis

- Node.js 22.18 ou plus récent
- Google Chrome, pour les tests dans le navigateur (autre exécutable : variable `CHROME_PATH`)

## Commandes

```sh
npm install
npm start                # documentation sur http://127.0.0.1:8000/demo/, rechargée à chaque modification
npm run build            # construit dist/
npm test                 # tests unitaires
npm run test:site        # tests du mini-site
npm run test:navigateur  # tests dans Chrome
npm run pages            # construit le site publié dans _site/
```

## Licence

© Université de Montréal, Bibliothèques. Usage réservé aux sites de l’Université de Montréal : voir [LICENCE.md](LICENCE.md).
