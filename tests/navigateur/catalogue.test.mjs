/* Audit de toutes les fiches réellement publiées, exemples et scripts inclus. */
import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { chromium } from 'playwright-core'
import { construireSite } from '../../scripts/site.mjs'
import { pagesAPlat } from '../../site/navigation.mjs'
let navigateur
const racine = resolve('_site')
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
before(async () => {
  await construireSite({ publication: true })
  navigateur = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
})
after(() => navigateur?.close())

test('toutes les pages : noms, rôles, contrastes et structure WCAG A/AA', async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } })
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== 'http://localhost:9999') return route.abort()
    const fichier = resolve(racine, '.' + decodeURIComponent(url.pathname))
    if (!fichier.startsWith(racine + sep)) return route.fulfill({ status: 404, body: '' })
    try { return route.fulfill({ body: await readFile(fichier), contentType: types[extname(fichier)] ?? 'application/octet-stream' }) }
    catch { return route.fulfill({ status: 404, body: '' }) }
  })
  const erreurs = []
  page.on('pageerror', (erreur) => erreurs.push(erreur.message))
  for (const { chemin } of pagesAPlat()) {
    await page.goto('http://localhost:9999/' + chemin, { waitUntil: 'load' })
    const liens = await page.evaluate(() => [...document.querySelectorAll('.page a[href]')]
      .filter((a) => !a.closest('.demo-cadre'))
      .map((a) => ({ adresse: a.href, texte: a.textContent })))
    for (const { adresse, texte } of liens) {
      const url = new URL(adresse)
      if (url.origin !== 'http://localhost:9999' || !url.pathname.endsWith('.html')) continue
      const cible = await readFile(resolve(racine, '.' + url.pathname), 'utf8')
      if (url.hash) assert.ok(cible.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${chemin} : ancre absente pour ${texte}`)
    }
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
    const violations = await page.evaluate(async () => {
      const resultats = await window.axe.run({ include: [['main']] }, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })
      return resultats.violations.map(({ id, nodes }) => ({ id, elements: nodes.map((n) => n.target) }))
    })
    assert.deepEqual(violations, [], chemin)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => new Promise((resoudre) => requestAnimationFrame(() => requestAnimationFrame(resoudre))))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${chemin} déborde sur mobile`)
    await page.setViewportSize({ width: 1440, height: 1000 })
  }
  assert.deepEqual(erreurs, [])
  await page.close()
})
