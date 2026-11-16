/*
 * Gabarit commun des pages du mini-site : en-tête de la barre latérale, menu groupé (avec
 * filtre), fil d'Ariane, sommaire « Sur cette page », liens Précédent / Suivant, pied.
 *
 * Le site se sert de ce qu'il documente : jetons et polices, alertes Harmonium pour les
 * encadrés, urgence de l'UdeM en haut de chaque page (comme sur les sites).
 *
 * Les fragments écrivent les liens internes « @@/chemin.html » et les fichiers publiés
 * « @@dist/fichier » : remplacés ici par des chemins relatifs à la page (« @/ » seul reste
 * libre pour les exemples de code Astro).
 */
import { integrationComposant } from './integration.mjs'
import { readFileSync } from 'node:fs'
import { rendreTableMatieres } from '../astro/table-matieres.ts'
import { NAVIGATION, HORS_CATALOGUE, pagesAPlat } from './navigation.mjs'

const composantsCommuns = new Set(JSON.parse(readFileSync(new URL('./donnees/composants.json', import.meta.url), 'utf8')))

const marque = readFileSync(new URL('../src/marque/harmonium-horizontal.svg', import.meta.url), 'utf8')
  .replace('role="img" aria-label="Harmonium horizontal"', 'aria-hidden="true" focusable="false" width="238" height="56"')
  // Seul le texte devient blanc : le symbole conserve les couleurs du logo standard.
  .replace(/(<text\b[^>]*\bfill=)"[^"]*"/, '$1"#FFFFFF"')
  .replace('font-family="Figtree,Arial,sans-serif"', 'font-family="Figtree Variable,Figtree,Arial,sans-serif"')

const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/** Préfixe relatif de la page vers la racine du site (« », « ../ ») */
export const versRacine = (chemin) => '../'.repeat(chemin.split('/').length - 1)

function menu(noeuds, courant, racine, niveau = 0) {
  let html = ''
  for (const n of noeuds) {
    if (Array.isArray(n)) {
      const [chemin, titre] = n
      const actuel = chemin === courant ? ' aria-current="page"' : ''
      html += `<li><a href="${racine}${chemin}"${actuel}>${titre}</a></li>`
      continue
    }
    const contient = pagesAPlat(n.pages).some((p) => p.chemin === courant)
    if (niveau === 0) {
      html += `<li class="nav-section"><span class="nav-section-titre">${n.titre}</span><ul>${menu(n.pages, courant, racine, 1)}</ul></li>`
    } else {
      html += `<li class="nav-groupe"><details${contient ? ' open' : ''}><summary>${n.titre}</summary><ul>${menu(n.pages, courant, racine, niveau + 1)}</ul></details></li>`
    }
  }
  return html
}

/** Le composant TableMatieres partage son rendu avec Astro. */
function sommaire(contenu) {
  const entites = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' }
  const texte = (html) => html.replace(/<[^>]+>/g, '').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (source, code) => {
    if (!code.startsWith('#')) return entites[code.toLowerCase()] ?? source
    const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : source
  })
  const titres = [...contenu.matchAll(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/gs)]
    .map(([, slug, titre]) => ({ depth: 2, slug, text: texte(titre) }))
  return rendreTableMatieres({ titres, id: 'table-matieres-doc', classe: 'table-matieres-doc' })
}

/**
 * @param {{ chemin: string, contenu: string, tete?: string, fin?: string, titre?: string }} page
 * @param {{ rechargement: boolean, dist: string }} options  dist : chemin de dist/ depuis la racine du site
 */
export function rendre(page, { rechargement, dist }) {
  const racine = versRacine(page.chemin)
  const liste = pagesAPlat()
  const i = liste.findIndex((p) => p.chemin === page.chemin)
  const info = liste[i]
  if (!info) throw new Error(`${page.chemin} : absente de site/navigation.mjs`)
  const titreH1 = page.contenu.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<[^>]+>/g, '').trim()
  const titre = page.chemin === 'index.html' ? 'Harmonium' : `${titreH1 ?? info.titre} · Harmonium`

  const ariane = info.parents.length
    ? `<nav class="ariane" aria-label="Fil d’Ariane"><ol><li><a href="${racine}index.html">Harmonium</a></li>${info.parents.map((p) => `<li>${p}</li>`).join('')}</ol></nav>`
    : ''
  const prec = liste[i - 1]
  const suiv = liste[i + 1]
  const voisins = `<nav class="voisins" aria-label="Pages voisines">${
    prec ? `<a class="voisin precedent" href="${racine}${prec.chemin}"><span>Précédent</span>${prec.titre}</a>` : '<span></span>'
  }${suiv ? `<a class="voisin suivant" href="${racine}${suiv.chemin}"><span>Suivant</span>${suiv.titre}</a>` : ''}</nav>`

  // Le sommaire se place juste après le h1 et ce qui le suit immédiatement (chapeau)
  const horsCatalogue = HORS_CATALOGUE.some(([chemin]) => chemin === page.chemin)
  const avecIntegration = composantsCommuns.has(page.chemin) && !horsCatalogue
    ? page.contenu.replace('</h1>', '</h1>\n' + integrationComposant(page.chemin))
    : page.contenu
  const contenu = horsCatalogue
    ? avecIntegration.replace('</h1>', '</h1>\n<p class="note"><strong>Hors catalogue — non retenu dans le système de design.</strong> Cet exemple est conservé pour référence. Pour une nouvelle page, choisir un composant du <a href="@@/composants/index.html">catalogue actif</a>. <a href="@@/hors-catalogue/index.html">Voir les alternatives</a>.</p>')
    : avecIntegration
  const som = sommaire(contenu)
  // Sur petit écran, le volet suit l’introduction ; en bureau, le même composant est dans la colonne droite.
  const debutSections = som ? contenu.search(/<h2 id="/) : -1
  const introduction = debutSections >= 0 ? contenu.slice(0, debutSections) : ''
  const corps = debutSections >= 0 ? contenu.slice(debutSections) : contenu

  const html = `<!doctype html>
<html lang="fr-CA">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="@@dist/harmonium-symbole.svg" />
    <title>${echapper(titre)}</title>
    <script>if (/[?&]apercu=/.test(location.search)) document.documentElement.classList.add('mode-apercu')</script>
    <link rel="stylesheet" href="@@dist/bib-jetons.min.css" />
    <link rel="stylesheet" href="@@dist/bib-composants.min.css" />
    <script type="module" src="@@dist/udem-urgence.min.js"></script>
    <link rel="stylesheet" href="@@/site.css" />
${som ? '    <script type="module" src="@@dist/bib-table-matieres.min.js"></script>\n' : ''}${page.tete ? page.tete.replace(/^/gm, '    ') + '\n' : ''}${rechargement ? '    <script type="module" src="@@/rechargement.js"></script>\n' : ''}  </head>
  <body>
    <a class="bib-lien-evitement" href="#contenu">Aller au contenu</a>
    <udem-urgence></udem-urgence>
    <div class="mise-en-page">
      <aside class="barre">
        <a class="marque" href="@@/index.html" aria-label="Harmonium, accueil">${marque}</a>
        <p class="marque-sous-titre">Système de design des sites des Bibliothèques UdeM</p>
        <details class="nav-mobile" open>
          <summary>Menu</summary>
          <div class="filtre">
            <label for="filtre-nav">Filtrer les pages</label>
            <input id="filtre-nav" type="search" autocomplete="off" placeholder="Bouton, couleurs…" />
            <p class="filtre-etat masque" role="status"></p>
          </div>
          <nav aria-label="Pages du site"><ul class="nav-liste">${menu(NAVIGATION, page.chemin, '@@/')}</ul></nav>
        </details>
      </aside>
      <div class="colonne">
        <main id="contenu" tabindex="-1">
          ${ariane}
          <div class="page${som ? ' avec-sommaire bib-page-avec-sommaire bib-page-avec-sommaire--navigation-externe' : ''}">
            ${introduction ? `<div class="page-introduction">${introduction}</div>` : ''}
            ${som}
            <div class="page-contenu${som ? ' bib-page-avec-sommaire__contenu' : ''}">
${corps}
            </div>
          </div>
          ${voisins}
        </main>
        <footer class="pied">
          <p>Harmonium : composants et système de design des sites des bibliothèques de l’UdeM.</p>
          <p>Polices Figtree et Lora : SIL Open Font License 1.1.</p>
        </footer>
      </div>
    </div>
    <script type="module" src="@@/site.js"></script>
${page.fin ? page.fin.replace(/^/gm, '    ') + '\n' : ''}  </body>
</html>
`
  return html.replaceAll('@@dist/', racine + dist).replaceAll('@@/', racine)
}
