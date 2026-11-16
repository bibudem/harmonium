// Construit le mini-site de documentation à partir de site/ :
//
//   node scripts/site.mjs                 → demo/ (local : dist/ à côté, rechargement automatique)
//   node scripts/site.mjs --publication   → _site/ (GitHub Pages : dist/ copié dedans)
//
// Contenu : site/pages/**/*.md ; forme : site/gabarit.mjs, site/vues.mjs et site/assets/.
// Exemples : site/exemples/ ; valeurs calculées : site/donnees/fondations.mjs.
// demo/ et _site/ sont produits : ne pas les modifier à la main.
import { cp, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import { pagesAPlat } from '../site/navigation.mjs'
import { rendre } from '../site/gabarit.mjs'
import { donneesCatalogue } from '../site/donnees/catalogue.mjs'
import { donneesFondations } from '../site/donnees/fondations.mjs'
import { donneesIntegration } from '../site/integration.mjs'
import { lirePage } from '../site/markdown.mjs'

const RACINE = new URL('..', import.meta.url).pathname

async function* fichiers(dossier) {
  for (const e of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, e.name)
    if (e.isDirectory()) yield* fichiers(chemin)
    else yield chemin
  }
}

export async function construireSite({ publication = false } = {}) {
  // Construit à côté, puis remplace d'un coup : le site servi n'est jamais à moitié écrit
  const cible = join(RACINE, publication ? '_site' : 'demo')
  const sortie = `${cible}.construction-${process.pid}`
  await rm(sortie, { recursive: true, force: true, maxRetries: 5 })
  await mkdir(sortie, { recursive: true })

  const donnees = { ...await donneesFondations(), ...await donneesCatalogue(), ...donneesIntegration() }
  const liste = pagesAPlat()
  const erreurs = []
  for (const { chemin } of liste) {
    let page
    try {
      page = await lirePage(join(RACINE, 'site/pages', chemin.replace(/\.html$/, '.md')), donnees)
    } catch (erreur) {
      erreurs.push(`${chemin} : ${erreur.message}`)
      continue
    }
    const html = rendre({ chemin, ...page }, { rechargement: !publication, dist: publication ? 'dist/' : '../dist/' })
    if (html.includes('@@')) erreurs.push(`${chemin} : marqueur @@ non remplacé`)
    await mkdir(dirname(join(sortie, chemin)), { recursive: true })
    await writeFile(join(sortie, chemin), html)
  }
  // Fragments qui ne figurent pas dans le plan
  const connus = new Set(liste.map((p) => p.chemin))
  for await (const f of fichiers(join(RACINE, 'site/pages'))) {
    const chemin = relative(join(RACINE, 'site/pages'), f)
    if (f.endsWith('.md') && !connus.has(chemin.replace(/\.md$/, '.html'))) erreurs.push(`${chemin} : absent de site/navigation.mjs`)
  }
  if (erreurs.length) {
    await rm(sortie, { recursive: true, force: true })
    throw new Error('Mini-site :\n  ' + erreurs.join('\n  '))
  }

  // Fichiers communs et polices
  // Conserver les anciennes adresses après regroupement des fiches.
  await writeFile(join(sortie, 'composants/typographie.html'), `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0;url=../fondations/typographie.html#composant">
<link rel="canonical" href="../fondations/typographie.html"><title>Typographie</title></head>
<body><p><a href="../fondations/typographie.html#composant">Consulter la page Typographie.</a></p></body></html>`)
  for (const nom of await readdir(join(RACINE, 'site/assets'))) {
    if (publication && nom === 'rechargement.js') continue
    await cp(join(RACINE, 'site/assets', nom), join(sortie, nom))
  }
  for await (const fichier of fichiers(join(RACINE, 'site/exemples'))) {
    if (!/\.(css|js)$/.test(fichier)) continue
    const chemin = join('exemples', relative(join(RACINE, 'site/exemples'), fichier))
    const prefixe = relative(dirname(chemin), '.').replaceAll('\\', '/') + '/'
    const texte = (await readFile(fichier, 'utf8'))
      .replaceAll('@@dist/', prefixe + (publication ? 'dist/' : '../dist/'))
      .replaceAll('@@/', prefixe)
    await mkdir(dirname(join(sortie, chemin)), { recursive: true })
    await writeFile(join(sortie, chemin), texte)
  }
  await cp(join(RACINE, 'site/polices'), join(sortie, 'polices'), { recursive: true })

  if (publication) {
    await mkdir(join(sortie, 'dist'))
    for (const nom of await readdir(join(RACINE, 'dist'))) {
      if (/\.(js|css|svg)$/.test(nom)) await cp(join(RACINE, 'dist', nom), join(sortie, 'dist', nom))
    }
    await writeFile(join(sortie, '.nojekyll'), '')
  } else {
    // Lu par rechargement.js : la page se recharge quand le site est reconstruit
    await writeFile(join(sortie, 'version.txt'), String(Date.now()))
  }
  // Échange : l'ancien site est mis de côté (renommer ne lui demande rien), le nouveau prend
  // sa place, puis l'ancien est effacé (macOS refuse parfois d'effacer un dossier en cours de
  // lecture : nouvelles tentatives)
  const ancien = `${cible}.ancien-${process.pid}`
  await rename(cible, ancien).catch(() => {})
  await rename(sortie, cible)
  await rm(ancien, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }).catch(() => {})
  return { sortie: cible, pages: liste.length }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { sortie, pages } = await construireSite({ publication: process.argv.includes('--publication') })
  console.log(`Mini-site : ${pages} pages dans ${relative(RACINE, sortie)}/`)
}
