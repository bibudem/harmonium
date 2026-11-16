// Construit dist/ : un fichier minifié et sans dépendance par composant (JavaScript), plus les
// feuilles de style (alertes, jetons de design).
// dist/ est versionné : jsDelivr sert les fichiers d'une étiquette git (ex. @1), il ne construit rien.
//
//   node scripts/build.mjs          construit dist/
//   node scripts/build.mjs --dev    reconstruit dist/ et le mini-site (site/ → demo/) à chaque
//                                   modification, et sert le dépôt sur http://127.0.0.1:8000/demo/
//                                   (les pages se rechargent seules)
//
// Format IIFE pour tous : un script classique fonctionne aussi bien avec <script> qu'avec
// <script type="module">. Le clavardage lit ses réglages sur sa propre balise
// (document.currentScript ; en module, il la retrouve par son adresse).
import { copyFileSync, mkdirSync, readdirSync, watch, writeFileSync } from 'node:fs'
import { build, context } from 'esbuild'
import { execFile } from 'node:child_process'

const options = {
  entryPoints: {
    'bib-clavardage.min': 'src/clavardage/bib-clavardage.ts',
    'bib-avis.min': 'src/avis/bib-avis.ts',
    'bib-consentement.min': 'src/consentement/bib-consentement.ts',
    // src/composants/*.ts : scripts facultatifs d'un composant (bib-<nom>.min.js)
    ...Object.fromEntries(readdirSync('src/composants').filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts')).map((f) => [`bib-${f.replace(/\.ts$/, '')}.min`, `src/composants/${f}`])),
    'udem-urgence.min': 'src/urgence/udem-urgence.ts',
    'bib-retroaction-usager.min': 'src/retroaction/bib-retroaction-usager.ts',
  },
  outdir: 'dist',
  bundle: true,
  format: 'iife',
  target: 'es2022',
  minify: true,
  loader: { '.css': 'text' },
  legalComments: 'none',
  logLevel: 'info',
}

// Feuilles de style seules (le chargeur « text » ci-dessus ne s'applique pas ici)
// src/composants/*.css : une feuille par composant (bib-<nom>.min.css), plus bib-composants.min.css
// qui les réunit toutes, alertes comprises (généré dans src/composants/tout.css, non versionné)
const composants = readdirSync('src/composants').filter((f) => f.endsWith('.css') && f !== 'tout.css').sort()
writeFileSync('src/composants/tout.css', ["@import '../alertes/alertes.css';", ...composants.map((f) => `@import './${f}';`)].join('\n') + '\n')
// src/composants/*.svg : images des composants, copiées dans dist/ (bib-<nom>.svg)
mkdirSync('dist', { recursive: true })
for (const f of readdirSync('src/composants').filter((f) => f.endsWith('.svg'))) copyFileSync(`src/composants/${f}`, `dist/bib-${f}`)
// Logos : mêmes fichiers pour le paquet, le CDN et le mini-site.
const dossiersMarques = ['src/marque', 'src/marque-sites']
function copierMarques() {
  for (const dossier of dossiersMarques)
    for (const f of readdirSync(dossier).filter((f) => f.endsWith('.svg'))) copyFileSync(`${dossier}/${f}`, `dist/${f}`)
}
copierMarques()
const feuilles = {
  entryPoints: {
    'bib-alertes.min': 'src/alertes/alertes.css',
    'bib-jetons.min': 'src/jetons/jetons.css',
    'bib-composants.min': 'src/composants/tout.css',
    ...Object.fromEntries(composants.map((f) => [`bib-${f.replace(/\.css$/, '')}.min`, `src/composants/${f}`])),
  },
  outdir: 'dist',
  bundle: true,
  minify: true,
  target: ['chrome100', 'firefox100', 'safari15'],
  legalComments: 'none',
  logLevel: 'info',
}

if (process.argv.includes('--dev')) {
  const ctx = await context(options)
  await ctx.watch()
  await (await context(feuilles)).watch()
  // Mini-site : régénéré quand site/ ou les jetons changent
  // Dans un processus neuf (le gabarit, le plan et les fondations sont relus à chaque fois),
  // une seule construction à la fois : une modification pendant une construction en relance
  // une à la fin
  let enCours = false
  let enAttente = false
  const regenerer = () => {
    if (enCours) return void (enAttente = true)
    enCours = true
    execFile(process.execPath, ['scripts/site.mjs'], (erreur, sortie, erreurs) => {
      if (erreur) console.error(erreurs || erreur.message)
      else console.log('  ' + sortie.trim())
      enCours = false
      if (enAttente) {
        enAttente = false
        regenerer()
      }
    })
  }
  regenerer()
  let attente
  const planifier = () => {
    clearTimeout(attente)
    attente = setTimeout(regenerer, 100)
  }
  watch('site', { recursive: true }, planifier)
  watch('src/jetons', { recursive: true }, planifier)
  for (const dossier of dossiersMarques) watch(dossier, { recursive: true }, () => {
    copierMarques()
    planifier()
  })
  // Sur cette machine seulement : servedir est tout le dépôt (.git compris)
  const { port } = await ctx.serve({ servedir: '.', host: '127.0.0.1', port: 8000 })
  console.log(`\n  Mini-site de documentation : http://127.0.0.1:${port}/demo/\n`)
} else {
  await Promise.all([build(options), build(feuilles)])
}
