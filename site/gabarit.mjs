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
import { statutComposant } from './integration.mjs'
import { readFileSync } from 'node:fs'
import { rendreTableMatieres } from '../astro/table-matieres.ts'
import { NAVIGATION, libelle, pagesAPlat } from './navigation.mjs'

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
    if (typeof n === 'string') {
      const chemin = n
      const titre = libelle(n)
      const actuel = chemin === courant ? ' aria-current="page"' : ''
      html += `<li><a href="${racine}${chemin}"${actuel}>${titre}</a></li>`
      continue
    }
    // Volets repliables : la première section, puis la section et le groupe de la page courante sont
    // ouverts ; `name` fait des autres un accordéon (ouvrir un volet referme les autres du même niveau).
    // La première section reste hors de l'accordéon : sinon le navigateur fermerait celle de la page.
    const contient = pagesAPlat(n.pages).some((p) => p.chemin === courant)
    if (niveau === 0) {
      const premiere = n === noeuds[0]
      html += `<li class="nav-section"><details${premiere ? '' : ' name="nav-section"'}${contient || premiere ? ' open' : ''}><summary class="nav-section-titre">${n.titre}</summary><ul>${menu(n.pages, courant, racine, 1)}</ul></details></li>`
    } else {
      html += `<li class="nav-groupe"><details name="nav-groupe"${contient ? ' open' : ''}><summary>${n.titre}</summary><ul>${menu(n.pages, courant, racine, niveau + 1)}</ul></details></li>`
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
 * Les tableaux de la doc sont des zones défilantes comme celles du composant Tableau : région nommée
 * d’après le titre qui les précède, arrêt de tabulation (bib-tableau.min.js le retire s’ils ne défilent pas).
 */
function nommerTableaux(html) {
  let titre = 'Tableau'
  return html.replace(/<h[2-4][^>]*>(.*?)<\/h[2-4]>|<div class="bib-tableau-zone">/gs, (bloc, texte) => {
    if (texte !== undefined) { titre = texte.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || titre; return bloc }
    return `<div class="bib-tableau-zone" role="region" tabindex="0" aria-label="${titre.replace(/"/g, '&quot;')}" data-tableau-defilant>`
  })
}

/**
 * @param {{ chemin: string, contenu: string, tete?: string, fin?: string, titre?: string, statut?: string }} page
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

  // Composant Fil d'Ariane : accueil, groupes (sans page), page courante
  const ariane = info.parents.length
    ? `<nav class="bib-fil-ariane" aria-label="Fil d’Ariane"><ol><li><a href="${racine}index.html">Harmonium</a></li>${info.parents.map((p) => `<li><span>${p}</span></li>`).join('')}<li><span aria-current="page">${echapper(info.titre)}</span></li></ol></nav>`
    : ''
  const prec = liste[i - 1]
  const suiv = liste[i + 1]
  // Composant Bouton : à contour, flèche de retour ou flèche de fin
  const voisin = (p, sens) => `<a class="bib-bouton bib-bouton--contour bib-bouton--bleu-principal voisin voisin--${sens}" href="${racine}${p.chemin}">${sens === 'precedent' ? '<span class="bib-bouton__debut" aria-hidden="true"></span>' : ''}<span class="bib-bouton__libelle"><span class="bib-masque">${sens === 'precedent' ? 'Page précédente' : 'Page suivante'} : </span>${echapper(p.titre)}</span>${sens === 'suivant' ? '<span class="bib-bouton__fin" aria-hidden="true"></span>' : ''}</a>`
  const voisins = `<nav class="voisins" aria-label="Pages voisines">${prec ? voisin(prec, 'precedent') : ''}${suiv ? voisin(suiv, 'suivant') : ''}</nav>`

  // Le sommaire se place juste après le h1 et ce qui le suit immédiatement (chapeau)
  const contenu = composantsCommuns.has(page.chemin)
    ? page.contenu.replace('</h1>', '</h1>\n' + statutComposant(page.statut))
    : page.contenu
  const contenuNomme = nommerTableaux(contenu)
  const som = sommaire(contenuNomme)
  // Sur petit écran, le volet suit l’introduction ; en bureau, le même composant est dans la colonne droite.
  const debutSections = som ? contenuNomme.search(/<h2 id="/) : -1
  const introduction = debutSections >= 0 ? contenuNomme.slice(0, debutSections) : ''
  const corps = debutSections >= 0 ? contenuNomme.slice(debutSections) : contenuNomme

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
    <script type="module" src="@@dist/bib-tableau.min.js"></script>
    <link rel="stylesheet" href="@@/site.css" />
${som ? '    <script type="module" src="@@dist/bib-table-matieres.min.js"></script>\n' : ''}${page.tete ? page.tete.replace(/^/gm, '    ') + '\n' : ''}${rechargement ? '    <script type="module" src="@@/rechargement.js"></script>\n' : ''}  </head>
  <body>
    <a class="bib-lien-evitement" href="#contenu">Aller au contenu</a>
    <udem-urgence></udem-urgence>
    <div class="mise-en-page">
      <aside class="barre surface-foncee">
        <a class="marque" href="@@/index.html" aria-label="Harmonium, accueil">${marque}</a>
        <p class="marque-sous-titre">Système de design des sites des Bibliothèques UdeM</p>
        <details class="nav-mobile" open>
          <summary>Menu</summary>
          <div class="filtre">
            <div class="bib-champ-liste bib-champ-liste--recherche">
              <label class="bib-champ-liste__etiquette" for="filtre-nav">Filtrer les pages</label>
              <div class="bib-champ-liste__boite surface-claire"><input id="filtre-nav" type="search" autocomplete="off" spellcheck="false" placeholder="Bouton, couleurs…" /></div>
            </div>
            <p class="filtre-etat bib-masque" role="status"></p>
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
          <p>Harmonium : système de design des sites des bibliothèques de l’UdeM.</p>
          <div class="bib-licence" prefix="cc: http://creativecommons.org/ns# dct: http://purl.org/dc/terms/">
            <span class="bib-licence__cc" aria-hidden="true"></span>
            <span class="bib-licence__cc bib-licence__cc--by" aria-hidden="true"></span>
            <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" rel="license">Sauf indications contraires, ce site est sous licence CC BY 4.0</a>
          </div>
        </footer>
      </div>
    </div>
    <script type="module" src="@@/site.js"></script>
${page.fin ? page.fin.replace(/^/gm, '    ') + '\n' : ''}  </body>
</html>
`
  return html.replaceAll('@@dist/', racine + dist).replaceAll('@@/', racine)
}
