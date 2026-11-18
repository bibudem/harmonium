/*
 * Vignettes du catalogue : capture le premier aperçu de chaque fiche de composant dans Chrome
 * et l'enregistre dans site/assets/vignettes/<nom>.jpg (cadre de 480 × 300 px capturé en densité 2, affiché à environ 260 px de large).
 *
 *   npm run pages && npm run vignettes
 *
 * Clé « vignette: N » dans une fiche : capturer son N-ième exemple (quand le premier est vide) ;
 * « vignette: place » : capturer le premier exemple là où il est (en-tête, pied de page : pleine largeur).
 * À relancer quand l'apparence d'un composant change. Les vignettes sont versionnées : la
 * construction du site n'a pas besoin de Chrome.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import matter from 'gray-matter'
import { NAVIGATION, pagesAPlat } from '../site/navigation.mjs'

const RACINE = new URL('../', import.meta.url).pathname
const SITE = join(RACINE, '_site')
const SORTIE = join(RACINE, 'site/assets/vignettes')
const ORIGINE = 'http://localhost:9997'
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'text/javascript', svg: 'image/svg+xml', jpg: 'image/jpeg', webp: 'image/webp', png: 'image/png', woff2: 'font/woff2' }

const composants = pagesAPlat(NAVIGATION.find((g) => g.titre === 'Composants').pages)
  .map((p) => p.chemin).filter((c) => c !== 'composants/index.html')
  // npm run vignettes -- entete pied-de-page : seulement ces fiches
  .filter((c) => process.argv.length < 3 || process.argv.slice(2).includes(c.split('/').pop().replace('.html', '')))

await mkdir(SORTIE, { recursive: true })
const navigateur = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
const ctx = await navigateur.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await ctx.route('**/*', async (route) => {
  const u = new URL(route.request().url())
  if (u.origin !== ORIGINE) return route.continue() // services réels (urgence, avis) : l'aperçu montre leur vrai rendu
  const p = decodeURIComponent(u.pathname.slice(1)) || 'index.html'
  try { return route.fulfill({ body: await readFile(join(SITE, p)), contentType: TYPES[p.split('.').pop()] }) }
  catch { return route.fulfill({ status: 404, body: '' }) }
})
const absentes = []
for (const chemin of composants) {
  const page = await ctx.newPage()
  await page.goto(`${ORIGINE}/${chemin}`, { waitUntil: 'load' })
  // Exemple capturé : le premier, ou celui que la fiche désigne (« vignette: 2 » : quand le premier est vide)
  const { data } = matter(await readFile(join(RACINE, 'site/pages', chemin.replace(/\.html$/, '.md')), 'utf8'))
  const surPlace = data.vignette === 'place'
  const trouve = surPlace ? await page.evaluate(() => {
    // En bureau, l'aperçu pleine largeur est dans .apercu-bureau ; sinon .contenu
    const cible = [...document.querySelectorAll('.demo-cadre > .apercu-bureau, .demo-cadre > .contenu')].find((e) => e.getClientRects().length && e.offsetHeight)
    if (cible) cible.id = 'vignette'
    return Boolean(cible)
  }) : await page.evaluate((rang) => {
    const contenu = document.querySelectorAll('.demo-cadre > .contenu')[rang - 1]
    if (!contenu) return false
    const boite = document.createElement('div')
    boite.id = 'vignette'
    boite.style.cssText = 'position:fixed;inset:0 auto auto 0;inline-size:480px;block-size:300px;z-index:2147483647;display:flex;align-items:safe center;justify-content:safe center;padding:20px;box-sizing:border-box;overflow:hidden;background:var(--couleur-surface)'
    contenu.style.inlineSize = '100%'
    boite.append(contenu)
    document.body.append(boite)
    return true
  }, Number(data.vignette ?? 1))
  if (trouve) {
    await page.waitForTimeout(1500)
    const nom = chemin.split('/').pop().replace('.html', '')
    try {
      await writeFile(join(SORTIE, `${nom}.jpg`), await page.locator('#vignette').screenshot({ type: 'jpeg', quality: 72, timeout: 5000 }))
    } catch {
      absentes.push(chemin)
    }
  } else absentes.push(chemin)
  await page.close()
}
await navigateur.close()
console.log(`Vignettes : ${composants.length - absentes.length} dans site/assets/vignettes/` + (absentes.length ? ` ; sans aperçu : ${absentes.join(', ')}` : ''))
